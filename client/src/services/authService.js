import axios from "axios";
import configFile from "../app/config.json";
import { localStorageService } from "./localStorageService";

// копипаста с httpService, но создаётся отдельный экземпляр для логина и регистрации
// Так посоветовал автор
export const httpAuth = axios.create({ baseURL: configFile.apiEndpoint });

const authEndpoint = "/auth/";

const authService = {
    register: async (payload) => {
        const { data } = await httpAuth.post(authEndpoint + `signUp`, {
            ...payload,
            returnSecureToken: true
        }); // БЫЛ payload, ТЕСТ + без returnSecureToken: true не работает
        /* console.log(333, data); */

        /* data при { data }:
        { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTFkZTNhNGRkMjg2MDNiMTFiNzFmYzMiLCJpYXQiOjE2OTY0NTc2MzYsImV4cCI6MTY5NjQ2MTIzNn0.s6jLVYW-wSyMnGpKhaMSHh6YfladV-5ljLI3lifomT8",
        expiresIn: 3600,
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTFkZTNhNGRkMjg2MDNiMTFiNzFmYzMiLCJpYXQiOjE2OTY0NTc2MzZ9.itWXMRq95YVz4fXQ9kD49E49cwCMvKULzYiRG9hKzhE",
        userId: "651de3a4dd28603b11b71fc3" } */
        return data;
    },
    logIn: async (payload) => {
        const { data } = await httpAuth.post(
            authEndpoint + `signInWithPassword`,
            { ...payload, returnSecureToken: true }
        ); // БЫЛ payload, ТЕСТ
        console.log("payload from login", payload);
        return data;
    },
    // ТЕСТ, СОЗДАЮ РЕФРЕШ НА ПРОЕКТЕ, НЕ БЫЛО (КОПИРУЮ С ФК)
    // У Владилена "token" и работает. Странно. Имхо баг! Он же не ждал часа...
    refresh: async () => {
        const { data } = await httpAuth.post(authEndpoint + "token", {
            grant_type: "refresh_token",
            refresh_token: localStorageService.getRefreshToken()
        });
        return data;
    }
};

export default authService;
