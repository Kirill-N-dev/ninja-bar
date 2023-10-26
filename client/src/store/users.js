import { createAction, createSlice } from "@reduxjs/toolkit";
import userService from "../services/userService";
import authService from "../services/authService";
import { localStorageService } from "../services/localStorageService";

// В начальный момент карентюзер уже может быть в системе
const initialState = localStorageService.getAccessToken()
    ? {
          entities: null,
          isLoading: true,
          error: null,
          isLoggedIn: true,
          dataLoaded: false,
          auth: { userId: localStorageService.getUserByFirebaseId() }
      }
    : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      };

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
        usersRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        authRequestSuccess: (state, action) => {
            state.auth = action.payload;
            state.isLoggedIn = true;
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload;
        },
        userCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            /* state.entities = null; */ // удалять не надо))
            state.isLoggedIn = false;
            state.auth = null;
            /* state.dataLoaded = false; */ // удалять не надо))
        },
        userUpdated: (state, action) => {
            // Закомментил. Поиск индекса, если юзеров много. Теперь у меня он всегда 1.
            /* const theIndex = state.entities.findIndex(
                (item) => item._id === action.payload._id
            );
            state.entities[theIndex] = action.payload;
            state.isLoading = false;
            state.dataLoaded = true; */
            state.entities = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
        userUpdateFailed: (state, action) => {
            state.error = action.payload;
        },
        authRequested: (state) => {
            state.error = null;
        }
    }
});

// Из слайса деструктуризацией забираем редюсер
const { reducer: usersReducer, actions } = usersSlice; // 2 сущности (ключа) данного метода
/* console.log(actions, 222); */
const {
    usersRequested,
    usersReceived,
    usersRequestFailed,
    authRequestSuccess,
    authRequestFailed,
    userLoggedOut,
    userUpdated,
    userUpdateFailed
} = actions; // забрали экшены

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++ ВЫШЕ ВСЁ ОК, А НИЖЕ ФУНКЦИИ И СЕЛЕКТОРЫ
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Меняю данную функцию. Буду по auth id в юзерах получать с сервера данного юзера, а не всех.
// Иначе буду отсылать ошибку. Теоретически можно сделать кучу запросов на каждое поле юзера, но имхо
// это плохо. Пока делаю так.
export const loadAuthorizedUser = (id) => async (dispatch, getState) => {
    dispatch(usersRequested()); // лоадер
    try {
        const content = await userService.get(id); // передаю id для поиска. На серваке делаю квери
        /* console.log(666, content); */
        dispatch(usersReceived(content)); // при успехе диспатчу юзера
    } catch (error) {
        dispatch(
            usersRequestFailed("Ошибка получения юзера по id: ", error.message)
        );
    }
};

// Селектор юзеров
export const getUsersList = () => (state) => state.users.entities;

// Селектор каррентЮзера (ДОПИЛИТЬ, НЕИЗВЕСТНО ОТУДА ИДЁТ ТУТ USERID - В ОРИГИНАЛЕ ЭТО PARAMS)
export const getUserById = (userId) => (state) => {
    if (state.users.entities) {
        const result = state.users.entities.find((u) => u._id === userId);
        return result;
    }
};

// Перенос авторизации в юзеры, чтобы избежать каких-то проблем
// Кажись делаем экшон (как понял, просто видимые сообщения для редакса)
const authRequested = createAction("users/authRequested");

// МЕТОД РЕГИСТРАЦИИ
// Перенос авторизации в юзеры, чтобы избежать каких-то проблем
export const signUp = (payload, location, navigate) => async (dispatch) => {
    dispatch(authRequested());
    try {
        console.log("Попытка регистрации...");
        const data = await authService.register(payload);
        console.log("Регистрация прошла успешно!");

        localStorageService.setTokens(data); // !!! СТАРОЕ, НО РАБОТАЛО, ПИШУ ТОКЕНЫ
        dispatch(authRequestSuccess({ userId: data.userId }));
        /*  dispatch(createUser(d)); */ // по сути вызов dispatch(userCreated(d));
        // ВЫШЕ МИНИН ГОВОРИТ ЭТО ДЕЛАЕТ СЕРВАК И ЭТО НЕ НАДО, ТАК МОЖЕТ И CREATEUSER УДАЛИТЬ?

        // Перенесённое мною
        /* dispatch(loadAuthorizedUser({ userId: data.userId })); */ // запрошу по полученному id тело юзера и обновлю стор
        /*  const { location, navigate } = payload; */

        // В момент редиректа надо перезагрузить юзеров, чтобы в системе был ныне зареганный. Потому диспатчу:
        dispatch(loadAuthorizedUser(data.userId));

        let redirect;
        if (location.state) {
            redirect = location.state.from;
        } else {
            redirect = "/";
        }
        navigate(redirect);
    } catch (error) {
        console.log("error - ", error.message);
        dispatch(authRequestFailed(error.message));
    }
};

// Метод логина, переезд на редакс
export const logIn = (payload, location, navigate) => async (dispatch) => {
    /* console.log("payload", payload); */ //  { phone: "12345", password: "QWERT1234533", stayOn: true }
    const { phone, password } = payload;
    dispatch(authRequested()); // кажись просто сообщение для редакса, а иной раз отправляют редюсер
    try {
        // С сервака приходят токены и id юзера
        const data = await authService.logIn({ phone, password });
        dispatch(authRequestSuccess({ userId: data.userId }));
        localStorageService.setTokens(data); // обновление токенов
        // Токены и id занёс в ЛС, id и в стор. НО!!! Надо получить тело юзера в стор для навбара.
        dispatch(loadAuthorizedUser(data.userId));
        // Нижнее перенёс с LoginForm, т.к там не было await запроса
        let redirect;
        if (location.state) {
            redirect = location.state.from;
        } else {
            redirect = "/";
        }
        navigate(redirect);
    } catch (error) {
        console.log("error from logIn f-n", error);
        const { code, message } = error.response.data.error; // error - пришедший здоровый {} с ошибками
        if (code === 400) {
            /* const errorMsg = generateAuthError(message); */ // не помню, откуда это! Вроде и не писал такого
            dispatch(authRequestFailed(message)); // сменил с errorMsg
        } else dispatch(authRequestFailed(message)); // сменил с error.message
    }
};

// Метод логаута, перенос функционала из logOut.jsx из useAuth.jsx
export const logOut = () => (dispatch) => {
    localStorageService.removeAuthData();
    dispatch(userLoggedOut());
};

// Домашка, апдейт юзера, переезд на редакс (избавление от UseAuth)
// МЕТОД ДЛЯ ПЕРВИЧНОГО ДОБАВЛЕНИЯ ТОВАРА В КОРЗИНУ И ДЛЯ ИЗМЕНЕНИЯ ЧИСЛА ТОВАРОВ В САМОЙ КОРЗИНЕ
export const addToCart = (payload) => async (dispatch) => {
    /* console.log("DATA??? ", payload); */
    /*          с goodsList передаю
    {isLoggedInUser, startingCartItems}
                получаю
   { isLoggedInUser: "652042eb8e3c74e80b4f890e", startingCartItems: { id: id, pcs: 1 } }
             */

    /* const newData = data; */ // можно изменить data для обработки сервером по его логике, но мне не надо
    try {
        const content = await userService.update(payload);
        console.log("!!! server gave ", content);
        dispatch(userUpdated(content));
    } catch (error) {
        dispatch(userUpdateFailed(error.message));
    }
};

// Домашка, апдейт юзера, переезд на редакс (избавление от UseAuth)
// ДАННЫЙ МЕТОД ИСПОЛЬЗУЮ ТОЛЬКО ДЛЯ ОБНОВЛЕНИЯ ДАННЫХ ЮЗЕРА
export const updateUser = (payload, location, navigate) => async (dispatch) => {
    console.log("DATA!!! ", payload);
    /*          с goodsCard передаю
    {isLoggedInUser, data}
                получаю
   { isLoggedInUser: "652042eb8e3c74e80b4f890e", data: { name: "PASS - QWERT", surname: "PASS - QWERT12345", ... }
             */

    /* const newData = data; */ // можно изменить data для обработки сервером по его логике, но мне не надо
    try {
        const content = await userService.change(payload);
        dispatch(userUpdated(content));
        /* console.log("После updateUser пришло с сервера:", content); */

        // Логика редиректа
        let redirect;
        if (location.state) {
            redirect = location.state.from;
        } else {
            redirect = "/";
        }
        navigate(redirect);
    } catch (error) {
        dispatch(userUpdateFailed(error.message));
    }
};

// Удаление выбранных товаров с корзины
// необходимо передать [id,id...]
export const deleteSelectedCartItems = (data) => async (dispatch) => {
    /* console.log("DATA!!! ", data); */
    /* с Cart передаю { isLoggedInUser: "652042eb8e3c74e80b4f890e", idsForDelete: (2) [id,id...] } */

    /* const newData = data; */ // можно изменить data для обработки сервером по его логике, но мне не надо
    try {
        const content = await userService.delete(data);
        // был {content}, я убрал
        /* console.log(333, content); */ // content - весь юзер с почищенной корзиной
        dispatch(userUpdated(content));
    } catch (error) {
        dispatch(userUpdateFailed(error.message));
    }
};

// Геттер/селектор из стора
export const getIsLoggedIn = () => (state) => {
    /*  console.log(state.isLoggedIn); */
    return state.users.isLoggedIn;
};
export const getDataStatus = () => (state) => {
    return state.users.dataLoaded;
};
export const getCurrentUserId = () => (state) => {
    // Добавил проверку, были баги
    return state?.users?.auth?.userId;
};
export const getUsersLoadingStatus = () => (state) => {
    return state.users.isLoading;
};
export const getCurrentUserData = () => (state) => {
    // Добавил проверку наличия авторизации, иначе при очистке стора была ошибка
    // Добавил проверку длины ентитис, т.к при null шёл else
    // !!! ТЕПЕРЬ СЕРВЕР ШЛЁТ АВТОРИЗОВАННОГО ЮЗЕРА - {}.
    if (!state.users.entities || !state.users.auth) {
        return false;
    } else {
        return state.users.entities;
    }
};
export const getAuthErrors = () => (state) => {
    return state.users.error;
};

export default usersReducer;
