// Константы для токенов
const TOKEN_KEY = "jwt-token";
const REFRESH_KEY = "jwt-refresh-token";
const EXPIRES_KEY = "jwt-expires";
const USERID_KEY = "user-local-id";

export const setTokens = ({
    accessToken,
    expiresIn = 3600,
    refreshToken,
    userId
}) => {
    // Ниже перевод в милисекунды expiresIn
    const expiresDate = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(EXPIRES_KEY, expiresDate);
    localStorage.setItem(USERID_KEY, userId);
};

export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_KEY);
};

export const getTokenExpiresDate = () => {
    return localStorage.getItem(EXPIRES_KEY);
};

export const getUserByFirebaseId = () => {
    return localStorage.getItem(USERID_KEY);
};

export const removeAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERID_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EXPIRES_KEY);
};

export const localStorageService = {
    setTokens,
    getAccessToken,
    getRefreshToken,
    getTokenExpiresDate,
    getUserByFirebaseId,
    removeAuthData
};
