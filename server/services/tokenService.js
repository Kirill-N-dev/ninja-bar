import jwt from "jsonwebtoken";
import config from "config";
import Token from "../startUp/models/Token.js";

// Метод генерации (и обновления) токенов
// должен вернуть acessToken, refreshToken и expiresIn
export const generate = (payload) => {
  //
  // Генерация ассесс токена через библиотеки jsonwebtoken и config
  // Экспаир принято делать на 1ч
  const accessToken = jwt.sign(payload, config.get("accessSecret"), {
    expiresIn: "1h",
  });
  // Рефрештокен копипаста, но иной ключ для хорошего тона и без экспаира
  const refreshToken = jwt.sign(payload, config.get("refreshSecret"));
  // 3600==1h
  return { accessToken, refreshToken, expiresIn: 3600 };
};

// Ф-ия сохранения токена для конкретного юзера
export const save = async (userId, refreshToken) => {
  // Поиск в БД токенов конкретного юзера через модель (как понял)
  const data = await Token.findOne({ user: userId });
  // Если запись была, то обновляем найденный рефреш токен
  if (data) {
    data.refreshToken = refreshToken;
    return data.save();
  }
  // Создаём запись в БД и возвращаем токен
  const token = Token.create({ user: userId, refreshToken });
  return token;
};

export const validateRefresh = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, config.get("refreshSecret"));
  } catch (e) {
    return null;
  }
};

export const findToken = async (refreshToken) => {
  try {
    return await Token.findOne({ refreshToken });
  } catch (e) {
    return null;
  }
};

export const isTokenInvalid = (data, dbToken) => {
  return !data || !dbToken || data._id !== dbToken?.user?.toString();
};
