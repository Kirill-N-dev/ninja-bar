import axios from "axios";
import configFile from "../app/config.json";
import { toast } from "react-toastify";
import { localStorageService } from "./localStorageService";
import authService from "./authService";

const http = axios.create({ baseURL: configFile.apiEndpoint });

// Обработка запроса на сервер (УСТАНОВКА ТОКЕНОВ ДЛЯ MIDDLEWAREFORAUTH) (НЕ БЫЛО, 1ЫЙ УРОК, ТЕСТ)
// В req.headers.authorization должна быть строка "bearer самТокен"
http.interceptors.request.use(
    // Функция успеха
    async function (config) {
        // TEST START (Firebase я убрал)
        /* console.log("start config:", config); */
        const expiresDate = localStorageService.getTokenExpiresDate();
        const refreshToken = localStorageService.getRefreshToken();

        if (refreshToken && expiresDate < Date.now()) {
            const data = await authService.refresh();
            localStorageService.setTokens({
                refreshToken: data.refreshToken,
                accessToken: data.accessToken,
                expiresIn: data.expiresIn,
                userId: data.userId
            }); // МОЖНО ПИСАТЬ {data}, ЭТО АНАЛОГ ВЫЗВАННОГО МНОЙ МЕТОДА В SIGNUP - БУДЕТ В КАЖДОМ ЗАПРОСЕ
        }

        const accessToken = localStorageService.getAccessToken();

        // Тут правка после ФБ (auth: accessToken,  config.params)
        // Нашёл, что если указать headers, то ключ будет внутри [Symbol(kHeaders)] - и без ошибок, но
        // данного хедера не видно в запросе браузера! Видимо защита.
        /* console.log(accessToken); */
        if (accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`
            };
        }
        // TEST END

        // Возврат конфига (выше его можно изменять, например, это требует firebase - будут слаться токены итд)
        /* console.log("httpService-req-config: ", config); */ // ТОКЕНЫ СТАВИТЬ В config.headers

        /* ПО КЛЮЧУ data - отправляемое с клиента:
        {"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTFkZTNhNGRkMjg2MDNiMTFiNzFmYzMiLCJpYXQiOjE2OTY0NTc2MzYsImV4cCI6MTY5NjQ2MTIzNn0.s6jLVYW-wSyMnGpKhaMSHh6YfladV-5ljLI3lifomT8",
        "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTFkZTNhNGRkMjg2MDNiMTFiNzFmYzMiLCJpYXQiOjE2OTY0NTc2MzZ9.itWXMRq95YVz4fXQ9kD49E49cwCMvKULzYiRG9hKzhE",
        "expiresIn":3600,"userId":"651de3a4dd28603b11b71fc3"} */

        /* '{"id":"651197cd58b290672d46f94d","pcs":1}' */ // или иная форма отправки. Но возврат должен быть всего config, там токены итд

        return config; // был конфиг (видимо он и нужен, это ж типа миддлвеира)
    },
    // Функция ошибки
    function (error) {
        return Promise.reject(error);
    }
);

// Обработка ответа сервера
http.interceptors.response.use(
    (res) => {
        /* console.log(data.data, "всё ок", 678); */
        // Тут можно обработать ответ, как требует firebase
        /* res.data = { content: res.data }; */ // это было у Минина, а оставлю как есть: res.data - нужный []
        /* res.data = { content: res.data }; */
        /* console.log("httpService-response: ", res); */
        console.log("httpService-RES: ", res);
        return res; // !!!!! НЕПОНЯТНО ЗАЧЕМ ОН ИЗМЕНИЛ КЛЮЧ DATA (ТЕПЕРЬ НЕ ТРОГАТЬ, ИНАЧЕ ВСЁ ПОКРАШИТСЯ)
    },
    (error) => {
        console.log("ошибка с интерсептора");

        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedErrors) {
            /* console.log(error); */
            toast.error("Unexpected errors222");
        }

        return Promise.reject(error);
    }
);

const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
};

export default httpService;
