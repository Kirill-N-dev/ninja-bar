import { validateAccess } from "../services/tokenService.js";

export const middlewareForAuth = (req, res, next) => {
  // next - продолжать выполнение дальнейшего кода
  // Cмысл сего мидлвейра - изменить (и обновить) токены в моменте методов с middleWareForAuth
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // Получаем такую строчку: Bearer ffn323t54g59gven233ci3cj3j0f30fj
    // Потому ищем сам токен (авторизации):
    /* console.log(req); */
    const token = req.headers.authorization.split(" ")[1];
    // Authorization в оригинале, как в hhtpService, но даёт баг! Макс говорит это Express
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Валидация токена
    const data = validateAccess(token);
    /* console.log(111, data, 222); */ // { _id: '650cb4a635c00c2e2f26541d', iat: 1695331666, exp: 1695335266 }
    // Защита от неавторизованного патча
    if (!data) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // А теперь модифицируем req и res:
    req.user = data;
    /*     console.log(data); */
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
