// копипаста с индекса
import express from "express";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import {
  findToken,
  generate,
  isTokenInvalid,
  save,
  validateRefresh,
} from "../services/tokenService.js";
import User from "../startUp/models/User.js";

const authRoutes = express.Router({ mergeParams: true });
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
/*
1. Get data from req
2. Check user's existing
3. to hash pwd
4. create user
5. generate tokens
*/
// api/auth/signUp ...
// Добавил миддлвеир - доппараметры в ф-ию (из express-validator) - валидация на сервере, но на ФЭ нужна тоже
authRoutes.post("/signUp", [
  check("email", "Некорректный эмэил").isEmail(),
  check("password", "Пароль должен состоять из 8 и более символов").isLength({
    min: 8,
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: { message: "Invalid data", code: 400, errors: errors.array() },
        });
      }
      const { email, password } = req.body;
      // ПОИСК КОЛЛЕКЦИИ ПО МОДЕЛИ И КЛЮЧУ? МЕТОД МАНГУСТА
      const existingUser = await User.findOne({ email: email }); // короче - ({email})
      if (existingUser)
        return res
          .status(400)
          .json({ error: { message: "EMAIL_EXISTS", code: 400 } });

      // отосланный пароль с клиента хешируется и криптуется
      const hashedPassword = await bcrypt.hash(password, 12);

      // Далее создаём юзера
      // Важна оячерёдность передачи полей
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
      });

      // Создаём токены
      const tokens = generate({ _id: newUser._id });

      // С токенСервиса:
      await save(newUser._id, tokens.refreshToken);

      // .status(201) - "что-то создано"
      res.status(201).send({ ...tokens, userId: newUser._id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "На сервере произошла ошибка, зайдите позже" });
    }
  },
]);
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
// Ниже - немного другой вид валидации и частичная копипаста верхнего кода
authRoutes.post("/signInWithPassword", [
  check("email", "Некорректный эмэил").normalizeEmail().isEmail(),
  check("password", "Пароль не должен быть пустым").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: { message: "Invalid data", code: 400, errors: errors.array() },
        });
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res
          .status(400)
          .json({ error: { message: "EMAIL_NOT_FOUND", code: 400 } });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const isPasswordEqual = await bcrypt.compare(
        password,
        existingUser.password
      );
      /* return res.status(500).json({ message: "ИЩУ ОШИБКУ" }); */
      if (!isPasswordEqual) {
        return res
          .status(400)
          .json({ error: { message: "INVALID PASSWORD", code: 400 } });
      }

      const tokens = generate({ _id: existingUser._id });

      await save(existingUser._id, tokens.refreshToken);

      res.status(200).send({ ...tokens, userId: existingUser._id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "На сервере произошла ошибка, зайдите позже" });
    }
  },
]);
/*
1. Validate
2. Find user
3. compare hashed pwds (hashed copies)
4. generate refresh & access tokens
5. return data
*/

//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
authRoutes.post("/token", async (req, res) => {
  try {
    const { refresh_token: refreshToken } = req.body;
    // Валидация токена с ключом из конфига
    const data = validateRefresh(refreshToken);

    const dbToken = await findToken(refreshToken);

    if (isTokenInvalid(data, dbToken)) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    // Если токены найдены и валидны, обновляем их все
    const tokens = generate({ _id: data._id });
    save(data._id, tokens.refreshToken);

    return res.status(200).send({ ...tokens, userId: data._id });
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});
// Логика для обновляемого токена

export default authRoutes;
