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

/* check("email", "Некорректный эмэил").isEmail(),
  check("password", "Пароль не должен быть пустым").exists(), */

authRoutes.post("/signUp", [
  check("password", "Пароль не должен быть пустым").exists(),
  async (req, res) => {
    console.log(1);
    try {
      console.log(2);
      const errors = validationResult(req);
      console.log(3);
      if (!errors.isEmpty()) {
        console.log("ошибочки");
        return res.status(400).json({
          error: { message: "Invalid data", code: 400, errors: errors.array() },
        });
      }
      console.log(4);

      const { password, phone } = req.body;
      console.log(5);
      /* console.log(req.body); */
      // ПОИСК КОЛЛЕКЦИИ ПО МОДЕЛИ И КЛЮЧУ? МЕТОД МАНГУСТА
      const existingUser = await User.findOne({ phone: phone }); // короче - ({email})
      console.log(6);
      if (existingUser) {
        return res
          .status(400)
          .json({ error: { message: "PHONE_EXISTS", code: 400 } });
      }
      console.log(7);

      // А ТУТ ВОТКНУ ПРОВЕРКУ - Моя проверка на селлера. Если он уже есть, то регистрироваться нельзя
      if (req.body.isSeller) {
        const theSeller = await User.findOne({ isSeller: true });
        if (theSeller) {
          console.log(98765, req);
          return res.status(401).json({ message: "Hacking attempt!" });
        }
      }
      console.log(8);
      // отосланный пароль с клиента хешируется и криптуется
      const hashedPassword = await bcrypt.hash(password, 12);

      console.log(9);
      // !!!!!!!!!! СОЗДАНИЕ ЮЗЕРА !!!!!!!!!!!
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        /* isSeller: false, */ // для регистрации продавца поменять на true
      });
      console.log(10);

      // Создаём токены при успешно созданной коллекции юзера
      // newUser._id создаёт монга, и это из респонса
      const tokens = generate({ _id: newUser._id });
      console.log(11);

      // С токенСервиса: добавление рефрештокена или его перезапись в коллекции Token (с наличием там userId)
      await save(newUser._id, tokens.refreshToken);
      console.log(12);
      // .status(201) - "что-то создано"
      res.status(201).send({ ...tokens, userId: newUser._id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "На сервере произошла ошибка, зайдите позже 111" });
    }
  },
]);
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++
// Ниже - немного другой вид валидации и частичная копипаста верхнего кода
// убрал чек эмэила, делаю без него check("email", "Некорректный эмэил").isEmail(),
authRoutes.post("/signInWithPassword", [
  check("password", "Пароль не должен быть пустым").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: { message: "Invalid data", code: 400, errors: errors.array() },
        });
      }

      const { phone, password } = req.body;

      const existingUser = await User.findOne({ phone });
      if (!existingUser) {
        return res
          .status(400)
          .json({ error: { message: "PHONE_NOT_FOUND", code: 400 } });
        // для предотвращения редиректа надо будет добавить проверку на res.error
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      // const isPasswordEqual = await bcrypt.compare(
      const isPasswordEqual = await bcrypt.compare(
        // Был баг, не проверялся пароль! Потому что убрал подчёркнутый await - а он нужен!!!
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
        .json({ message: "На сервере произошла ошибка, зайдите позже 222" });
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
// Логика для обновляемого токена
// Плохо понял, но кажись этот запрос автоматически генерируется при любом запросе из-за настроек интерсептора
// И сервак проверяет токен на валидность по времени и наличию
authRoutes.post("/token", async (req, res) => {
  try {
    /*     console.log("!1"); */
    const { refresh_token: refreshToken } = req.body;
    /*     console.log(
      "!2",
      req.body.refresh_token,
      req.body.refreshToken,
      refreshToken
    ); */
    // Валидация токена с ключом из конфига
    const data = validateRefresh(refreshToken);
    /*     console.log("!3"); */
    const dbToken = await findToken(refreshToken);
    /*     console.log("!4"); */
    if (isTokenInvalid(data, dbToken)) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    /*  console.log("!5"); */
    // Если токены найдены и валидны, обновляем их все
    const tokens = generate({ _id: data._id });
    save(data._id, tokens.refreshToken);
    /*     console.log("!6"); */
    return res.status(200).send({ ...tokens, userId: data._id });
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже 333" });
  }
});

export default authRoutes;
