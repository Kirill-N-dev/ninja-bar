import httpService from "./httpService";
/* import { localStorageService } from "./localStorageService"; */

const userEndpoint = "/user/";

// Вроде кастомный хук
// В методе update автор в домашке брал id из локалсториджа
// Также говорит, что можно и методом post, но тогда недостающие при передаче данные сотрутся и их надо будет отсылать тоже
const userService = {
    get: async (id) => {
        const { data } = await httpService.get(userEndpoint + id);
        return data;
    },
    /*  create: async (payload) => {
        // ВРОДЕ БЫ В ТЕКУЩЕМ ПРОЕКТЕ НЕ ИСПОЛЬЗУЕТСЯ, ПРОБИТЬ !!!!
        // тут был put, но у меня на бэке пост
        // и было userEndpoint + payload._id, payload !!!!!!!!!!!!!!!!!!!!!!!
        const { data } = await httpService.put(
            userEndpoint + payload.userId,
            payload
        );
        console.log("userService-return-data: ", data);
        return data;
    },
    getCurrentUser: async () => {
        // ВРОДЕ БЫ В ТЕКУЩЕМ ПРОЕКТЕ НЕ ИСПОЛЬЗУЕТСЯ, ПРОБИТЬ !!!! - ТЕКУЩЕГО ЮЗЕРА БЕРУ СО СТОРА USERS-AUTH
        const { data } = await httpService.get(
            userEndpoint + localStorageService.getUserByFirebaseId() // на самом деле будет работать и с сервером
        );
        return data;
    }, */
    update: async (payload) => {
        // !!! НА СЕРВЕРЕ НАДО СДЕЛАТЬ ЛОГИКУ, ЧТОБЫ НЕ ПЛОДИТЬ ОДИНАКОВЫЕ ID ТОВАРОВ И СУММИРОВАТЬ PCS
        // Был патч, не применялся на клиенте, но раз я тестировал пут для добавления в корзину, то...:
        /* console.log("payload до отправки, userService-update: ", payload);
        console.log(
            userEndpoint + payload.isLoggedInUser, // была ошибка: ТУТ НАДО ID КАРРЕНТЮЗЕРА, А НЕ ТОВАРА
            payload.startingCartItems
        ); */
        // { isLoggedInUser: "652042eb8e3c74e80b4f890e", startingCartItems: { id: id, pcs: 1 } }

        const { data } = await httpService.put(
            userEndpoint + payload.isLoggedInUser, // была ошибка: НАДО ID КАРРЕНТЮЗЕРА, А НЕ ТОВАРА
            payload.newItemForCart
        );
        /* console.log("data from put from server: ", data); */
        return data;
    },
    change: async (payload) => {
        // Изменение данных юзера

        const { data } = await httpService.patch(
            userEndpoint + payload.isLoggedInUser,
            payload
        );
        /* console.log("payload req UPDATE: ", payload);
        console.log("data res UPDATE: ", data); */
        return data;
    },
    delete: async (payload) => {
        // !!! НА СЕРВЕРЕ НАДО СДЕЛАТЬ ЛОГИКУ, ЧТОБЫ УБРАТЬ ИЗ CART ПЕРЕДАННЫЕ [ID,ID...]
        /* console.log("payload ", payload); */
        // Отправка: { isLoggedInUser: "652042eb8e3c74e80b4f890e", idsForDelete: (1) […] }

        // ПИШУ ПОКА ПОСТ, ПОТОМУ ЧТО В ДЕЛЕТЕ НЕТ ТЕЛА ЗАПРОСА, А У МЕНЯ НЕТ ВРЕМЕНИ ГУГЛИТЬ, Я СПЕШУ, ПОКА ХОТЬ ТАК
        // А писать разные логики в 1 и том же методе не стал, это сложно, а я пока даже функционал не сделал
        const { data } = await httpService.post(
            userEndpoint + payload.isLoggedInUser, // была была ошибка: НАДО ID КАРРЕНТЮЗЕРА, А НЕ ТОВАРА
            payload.idsForDelete
        );
        /* console.log("data from delete from server: ", data); */ // пришёл весь юзер, но со старой корзиной. БЭК!
        return data;
    }
};

export default userService;
