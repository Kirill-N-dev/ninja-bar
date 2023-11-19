import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import App from "./app/App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "./store/createStore";
import "./utils/themeChecker";

// ПРИМЕНИЛ USECONTEXT, НО НЕ УВЕРЕН, ЧТО В ДАННОМ СЛУЧАЕ ЭТО ЛУЧШЕ ДОМА,
//  ТАК КАК КУЧА ПИСАНИНЫ, А В ДОМЕ ВСЕГО ПАРУ СТРОК - И ДОСТУП ОТКУДА УГОДНО

// Создание стора (УСТАРЕЛО)
const store = createStore();

// Провайдер редакса и новый роутер
const root = ReactDOM.createRoot(document.getElementById("root"));

// получил ссылку на корень реакта. Туда буду апскроллить при пагинации.
/* console.log("root", root._internalRoot.containerInfo); */
const theRoot = root._internalRoot.containerInfo;

// Делаю провайдер. И все эти муки ради доступа к руту при пагинации. Имхо просто найти в GoodsList домом и всё.
const RootContext = React.createContext();

// Экспортирую функцию для доступа к здешней переменной рута
export const useRoot = () => {
    return useContext(RootContext);
};

root.render(
    <RootContext.Provider value={{ theRoot }}>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </RootContext.Provider>
);
