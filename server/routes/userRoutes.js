// копипаста с индекса
import express from "express";
import User from "../startUp/models/User.js";
import { middlewareForAuth } from "../middleWare/authMiddleWare.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

const userRoutes = express.Router({ mergeParams: true });

// Изменение данных юзера
userRoutes.patch(
  "/:userId",
  middlewareForAuth,
  check("password", "Пароль не должен быть пустым").exists(),
  async (req, res) => {
    // Сюда тоже ставится защита middlewareForAuth
    // И для патча тоже надо оставлять authorization и bearer - token (look below)
    // Но тут такой функционал, что можно лишь изменять текущие поля, но не добавлять
    try {
      const { userId } = req.params; // как параметр
      /* console.log(userId); */
      // Изменять данные можно только если userId===currentUser.id
      /* console.log(333, req, 444); */ // куча параметров, через req.user есть доступ к данной БД
      // Потому ниже - проверка на авторизацию (по аутхТокену)
      // МОЁ: ПИШУ ПРОВЕРКУ НА СЕЛЛЕРА. ЕСЛИ ОН УЖЕ ЕСТЬ, И ОН НЕ ТЕКУЩИЙ ЮЗЕР, ТО ПОСТИТЬ ISSELLER: TRUE НЕЛЬЗЯ
      /* console.log(req.user, req); */ // В REQ.USER ТОЛЬКО _ID, ДРУГОЙ ИНФЫ НЕТ! ХОТЯ КЧА ЛИШНЕЙ

      // ЕСЛИ ПРОДАВЕЦ:
      if (req.body.isSeller) {
        const existingSeller = await User.findOne({ isSeller: true });
        // Если попытка придать isSeller = true, но попытка от обычного юзера, то попытка взлома!
        /* console.log(existingSeller._id.toString(), req.user._id); */ // !!! ID = existingSeller._id.toString()
        if (existingSeller && existingSeller._id.toString() !== req.user._id) {
          return res.status(401).json({ message: "Hacking attempt!" });
        } else {
          // Ниже копипаста с кода ниже
          if (userId === req.user._id) {
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
              new: true,
            });

            return res.status(200).send(updatedUser);
          }
        }
      }

      // ЕСЛИ ПОКУПАТЕЛЬ:
      // Проверка авторизации; req был изменён миддлвеиром
      if (userId === req.user._id) {
        /* console.log(req.user); */ // { _id: '652042eb8e3c74e80b4f890e', iat: 1697649572, exp: 1697653172 }

        // Делаю трим, который не получился на клиенте. Мутирую тело запроса перед сохранением коллекции
        // !!! ДАННЫЙ ФУНКЦИОНАЛ ДЛЯ ПРИМЕРА, ПОСКОЛЬКУ ВАЛИДАТОР ТЕЛЕФОНА НА КЛИЕНТЕ НЕ ПРОПУСКАЕТ ПРОБЕЛЫ
        Object.keys(req.body.data).map((i) => {
          if (i !== "phone" && i !== "license") {
            req.body.data[i] = req.body.data[i].trim();
          }
          if (i === "phone") {
            req.body.data[i] = Number(req.body.data[i].toString().trim());
          }
        });

        // Хеширую пароль, иначе с клиента потом не войти, т.к идёт сверка с захешированными данными
        const { password } = req.body.data;
        const hashedPassword = await bcrypt.hash(password, 12);

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { ...req.body.data, password: hashedPassword },
          {
            new: true,
          }
        ); // new: true - нужен для обновления только после выполнения асинхронной функции, иначе ошибки
        /* console.log(333, userId, req.body); */
        return res.status(200).send(updatedUser); // отправка на клиент
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (e) {
      res
        .status(500)
        .json({ message: "На сервере произошла ошибка, зайдите позже" });
    }
  }
);

// НИЖЕ РАБОЧАЯ ЛОГИКА ДОБАВЛЕНИЯ ТОВАРА В КОРЗИНУ. ТОВАР ДОБАВЛЯЕТСЯ КЛИКОМ НА КНОПКУ
// Формат: {    "email":"222@2.ru", "cart":[{"id":"65119bd4dc62126c7d940c4d","pcs":5}]} */
// При этом игнорируется всё, кроме cart
// УДАЛИЛ  middlewareForAuth, ДЛЯ ПРОВЕРКИ РЕГИ

userRoutes.put("/:userId", middlewareForAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    /* console.log(req.body, req.params, req.user, req.data); */
    // req.body - то, что я отправляю, { id: '651197cd58b290672d46f94d', pcs: 1 }
    // req.params: { userId: '652042eb8e3c74e80b4f890e' }
    // req.user, req.data - оба undefined
    if (userId) {
      // с миддлвеиром было if (userId === req.user._id)
      // без миддлвеира не имеет смысла, всегда тру
      /* console.log(111, req.body, req.body.cart); */
      const updatedUser = await User.findById(userId);
      // 1. Проверяю, является ли массивом cart (коллекцию можно случайно испортить на самой монге)
      if (Array.isArray(updatedUser.cart)) {
        // Ищу массив объектов одинаковых товаров по id
        // 2. Получаю данные в нормальном виде, убрав new ObjectId""
        const a = updatedUser.cart.map((g) => {
          return { id: g.id.toString(), pcs: g.pcs };
        });
        /* console.log(a); */ // [{id:..., pcs:...},{},...] +++
        // ТУТ БЫЛ БАГ НА НЕСКОЛЬКО ЧАСОВ. ТЕПЕРЬ ВЕДЬ НАДО ЗАМЕНИТЬ КОРЗИНУ У updatedUser НА ПРАВИЛЬНУЮ!
        // ИНАЧЕ НИЖЕ НЕ НАХОДИЛСЯ ИНДЕКС И БЫЛ -1, И КОД РАБОТАЛ ЛОЖНО:
        updatedUser.cart = a; // НЕ РАБОТАЕТ СУКА!!! Но ниже я вылечил по другому.
        /* console.log(updatedUser.cart, a); */
        // 3. Проверяю наличие товаров в корзине
        if (a.length) {
          // 4. Если товары есть, ищу нужный {} с уникальным id
          const b = a.find((g) => g.id === req.body.id);
          // 5. Если найден, то мутирую его
          if (b) {
            b.pcs = req.body.pcs;
            // 6. Удаляю старый товар с корзины и пушу туда новый
            const index = updatedUser.cart.findIndex(
              (g) => g.id.toString() === req.body.id // РЕШЕНИЕ МНОГОЧАСОВОГО БАГА
            );
            updatedUser.cart.splice(index, 1, b);
          } else {
            // 7. Если такого товара нет, но другие есть, то сразу пушу
            updatedUser.cart.push(req.body);
          }
        } else {
          // 8. А если товаров совсем нет, то мутирую сам ключ cart на всякий случай (его можно испортить с монги) и тоже сразу пушу
          updatedUser.cart = [];
          updatedUser.cart.push(req.body);
        }
      } else {
        console.error("Collection.cart is not a massive");
      }

      // 8. Сохраняю мутированную коллекцию
      updatedUser.save();
      return res.status(200).send(updatedUser);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

userRoutes.get("/:userId", async (req, res) => {
  // ТУТ БЫЛ middlewareForAuth, отключил для теста
  // middlewareForAuth выше это миддлвеир - отдельная функция, как понял, промежуточного исполнения
  // конкретно эта нужна для запрета GET запроса юзеров неавторизованным юзерам
  // В постмане для GET надо ставить галку в Authorization - Bearer token, и ввести ассестокен
  // Теперь авторизация работает, и данные запрашиваются
  // ПИЛЮ: в апплоадере на клиенте будет подгрузка авторизованного юзера по параметру выше. Или ошибка.
  const { userId } = req.params;
  try {
    const authorizedUser = await User.findById(userId);
    /* res.status(200).json({ list: users }); */
    res.status(200).send(authorizedUser); // status(200) это по умолчанию, можно не писать
  } catch (e) {
    res.status(500).json({
      message: "Ошибка на сервере, не удалось отпварить авторизованного юзера",
    });
  }
});

// Ниже без лишней болтовни, пишу сам, удаление товаров с корзины
// Кратко - принять user-cart-[id,id...]
userRoutes.post("/:userId", middlewareForAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId) {
      const updatedUser = await User.findById(userId);
      // 1. Проверяю, является ли массивом cart (коллекцию можно случайно испортить на самой монге)
      if (Array.isArray(updatedUser.cart)) {
        // Ищу массив объектов одинаковых товаров по id
        // 2. Получаю данные в нормальном виде, убрав new ObjectId""
        const a = updatedUser.cart.map((g) => {
          return { pcs: g.pcs, id: g.id.toString() }; // ПОЧЕМУ ...PCS, ДАЁТ ОШИБКУ??? ВОПРОС!
        });
        // [{id:..., pcs:...},{},...] +++
        // 3. Проверяю наличие товаров в корзине
        if (a.length) {
          // 4. Если товары есть, фильтрую, отсеивая по req.body.id
          const b = a.filter((g) => {
            // Ищу, есть ли текущий товар в списке на удаление
            const match = req.body.some((i) => i === g.id);
            if (!match) return g;
          });
          /* console.log(b); */
          // 5. Обновляю корзину

          updatedUser.cart = [...b];
        } else {
          // 7. А если товаров совсем нет, то шлю ошибку
          return res.status(401).json({ message: "The cart is empty" });
          /* updatedUser.cart = [];
          updatedUser.cart.push(req.body); */
        }
      } else {
        console.error("Collection.cart is not a massive");
      }

      // 8. Сохраняю мутированную коллекцию
      updatedUser.save();
      return res.status(200).send(updatedUser);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

export default userRoutes;
