import { combineReducers, configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users";
import goodsReducer from "./goods";
/* import qualitiesReducer from "./qualities";
import professionsReducer from "./professions";
import usersReducer from "./users";
import commentsReducer from "./comments"; */

// Создаю стор по шпоре с фаст компани.
// Пишу все сущности для хранения, которые запрошу сервисом хттп-гет в их файлах.
// Юзеров ПОКА не пишу, в фаст компани не было
const rootReducers = combineReducers({
    users: usersReducer,
    goods: goodsReducer
});

// middleWare не добавляю
export function createStore() {
    return configureStore({ reducer: rootReducers });
}
