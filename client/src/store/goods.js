import { createSlice } from "@reduxjs/toolkit";
/* import _ from "lodash"; */
import goodsService from "../services/goodsService";

// Даный файл пока выполняет роль костыля для майнпаги, т.к там надо сортировать, а раз у меня такой бэк и без стейта,
// то делаю этот стор, а в будущем исправлю бэк, и этот файл будет тут главным
const goodsSlice = createSlice({
    name: "goods",
    initialState: { entities: null, isLoading: true, lastFetch: null },
    reducers: {
        goodsRequested: (state) => {
            state.isLoading = true;
        },
        goodsReceived: (state, action) => {
            state.entities = action.payload;
            state.lastFetch = Date.now(); // Задаем в стор время получения сущности
            state.isLoading = false;
        },
        goodsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

// Из слайса деструктуризацией забираем редюсер и экшены
const { reducer: goodsReducer, actions } = goodsSlice;
const { goodsRequested, goodsReceived, goodsRequestFailed } = actions;

// Проверка устаревания данных - прошло ли 10 минут с их получения:
// В данном проекте отключил.
/* const isOutdated = (date) => {
    if (Date.now() > date * 1000 * 60 * 10) {
        return true;
    } else {
        return false;
    }
}; */

// Функция проверки свежести данных (товаров) и в случае их устаревания - их перезагрузка с сервера
export const loadGoods = () => async (dispatch, getState) => {
    // СТАРЫЙ КОД. ПРИ ПОСТОЯННЫХ ЗАПРОСАХ НА СЕРВЕР В НЁМ НЕ ВИЖУ СМЫСЛА. ПЛЮС ДЛЯ НАВЛИНКА НА МАЙНПАГУ НУЖНЕН ЛОАД
    // В случае истечения 10 минут, при вызове данной функции, происходит перезагрузка сущностей.
    // Но если данные свежие, ничего не происходит
    /*  const { lastFetch } = getState().goods;

    if (isOutdated(lastFetch)) {
        dispatch(goodsRequested());
        try {
            const content = await goodsService.get();

            dispatch(goodsReceived(content));
        } catch (error) {
            dispatch(goodsRequestFailed(error.message));
        }
    } */
    dispatch(goodsRequested());
    try {
        const content = await goodsService.get();
        dispatch(goodsReceived(content));
    } catch (error) {
        dispatch(goodsRequestFailed(error.message));
    }
};

// Функция загрузки конкретного товара
export const loadGoodsById = (gid) => async (dispatch) => {
    dispatch(goodsRequested()); // лайвхак. ВОПРОС!!! ПОЧЕМУ С ЭТОЙ ХЕРОБОРОЙ БЕСКОНЕЧНЫЙ ЛУП?
    try {
        const content = await goodsService.getById(gid);
        dispatch(goodsReceived(content));
    } catch (error) {
        dispatch(goodsRequestFailed(error.message));
    }
};

// Сортировка для продуктовой страницы
export const sortGoods = (name, goods) => async (dispatch) => {
    dispatch(goodsRequested());
    try {
        /* const newGoods = await goodsService.sort(name); */
        const newGoods = await goodsService.filter(name, goods);
        // Сортировка на клиенте
        /* const sortedOnClientGoods = _.orderBy(
            goods,
            ["price"],
            [name === "expensive" ? "desc" : name === "cheaper" ? "asc" : null]
        ); */
        dispatch(goodsReceived(newGoods));
    } catch (error) {
        console.log("Ошибка сортировки: ", error);
        dispatch(goodsRequestFailed());
    }
};

// Фильтрация для майнпаги и товарных паг с добавлением параметра сортировки, ибо данная функция в эффекте
export const filterGoods = (name, sort) => async (dispatch) => {
    dispatch(goodsRequested()); // БЫЛ БЕСКОНЕЧНЫЙ ЛУП, ПОСЛЕ ОПТИМИЗАЦИИ СТОРА ПРОПАЛ. ВИДИМО ВИНОЙ БЫЛ АППЛОДЕР
    try {
        // Фильтрация на клиенте
        /* const filteredGoods = _.filter(goods, (i) => i.type === name); */
        const filteredGoods = await goodsService.filter(name, sort);
        /* console.log(777, filteredGoods); */ // +++
        dispatch(goodsReceived(filteredGoods)); // запись в стор отфильтрованных сервером данных
    } catch (error) {
        console.log(
            "Ошибка при отправке запроса на фильтрацию товаров: ",
            error
        );
        dispatch(goodsRequestFailed());
    }
};

// ИЗМЕНЕНИЕ ТОВАРА, ТОЛЬКО ДЛЯ ПРОДАВЦА
export const changeGoods = (data) => async (dispatch) => {
    /* с GoodsEdit передаю { gid: "...", data: {...} } !!! А UID ОТКУДА-ТО БЕРЁТСЯ УЖЕ НА СЕРВЕРЕ */
    /* console.log("data", data); */
    try {
        const changedGoods = await goodsService.change(data);
        console.log("changedGoods", changedGoods); // +++
        dispatch(goodsReceived(changedGoods)); // запись в стор отфильтрованных сервером данных
    } catch (error) {
        console.log("Ошибка при отправке запроса на изменение товара: ", error);
        dispatch(goodsRequestFailed());
    }
};

// СОЗДАНИЕ ТОВАРА, ТОЛЬКО ДЛЯ ПРОДАВЦА
export const createGoods =
    ({ data, navigate }) =>
    async (dispatch) => {
        /* с GoodsCreate передаю
    { name: "dddddddddddddddddddd", desc: "dddddddddddddddddddd", img_url: (1) […],
    ingredients: "dddddddddddddddddddd", weight: 221, price: 221, type: "pizzas" } */
        try {
            /* console.log(111); */
            const newGoods = await goodsService.create(data);
            /* console.log(222); */
            dispatch(goodsReceived(newGoods)); // запись в стор нового товара
            // Редирект на страницу созданного товара
            const gid = newGoods._id;
            const goodsPath = newGoods.type.slice(0, -1);
            console.log("!!!", gid, goodsPath);
            navigate(`/${goodsPath}/${gid}`);
        } catch (error) {
            console.log(
                "Ошибка при отправке запроса на изменение товара: ",
                error
            );
            dispatch(goodsRequestFailed());
        }
    };

// УДАЛЕНИЕ ТОВАРОВ, ТОЛЬКО ДЛЯ ПРОДАВЦА
export const deleteGoods = (data) => async (dispatch) => {
    /* с Administration передаю { isLoggedInUser: "652042eb8e3c74e80b4f890e", idsForDelete: (2) [id,id...] } */
    try {
        const goodsAfterDelete = await goodsService.delete(data);
        console.log("goodsAfterDelete", goodsAfterDelete); // +++
        dispatch(goodsReceived(goodsAfterDelete)); // запись в стор отфильтрованных сервером данных
    } catch (error) {
        console.log("Ошибка фильтрации: ", error);
        dispatch(goodsRequestFailed());
    }
};

// Селекторы товаров
// Может быть баг, если создать новую сущность всех товаров, а юзера не обновить.
// Тогда id товаров в его корзине устареют и корзина будет невалидной
export const getGoods = () => (state) => state.goods.entities;
// Этот селектор пока выполняет роль эмитации смысловой нагрузки, по сути на клиенте он не нужен
export const getGoodsLoadingStatus = () => (state) => state.goods.isLoading;

// Функция для поиска товара по id для GoodsPage
export const getGoodsById = (id) => (state) => {
    let arr = [];
    if (state.goods.entities) {
        arr = state.goods.entities.find((g) => g._id === id);
    }

    return arr;
};

export default goodsReducer;
