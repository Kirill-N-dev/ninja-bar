// копипаста с пицаРоутес
import express from "express";
import { middlewareForAuth } from "../middleWare/authMiddleWare.js";
import Goods from "../startUp/models/Goods.js";
import User from "../startUp/models/User.js";

const goodsRoutes = express.Router({ mergeParams: true });

// Запрос всех, отсортированных или отфильтрованных товаров
goodsRoutes.get("/", async (req, res) => {
  // На клиенте сортировка и фильтрация на 1 методе. Он передаёт 2 квери параметра.

  // квери для сортировки (при undefined дестр. не пашет)
  const sortBy = req.query.params?.sortBy; // expensive, cheaper
  // !!! Если не задать параметр, то он на проверке будет строкой "undefined"
  const filterBy = req.query.params?.filterBy; // sauces, pizzas, drinks

  /*   console.log(sortBy, typeof sortBy, filterBy, typeof filterBy); */

  // Установка значений сортировки для мангуста:
  let variableForMongoose =
    sortBy === "expensive" ? -1 : sortBy === "cheaper" ? 1 : 0;

  // 1. ТОЛЬКО СОРТИРОВКА. ПО ВСЕМ ТОВАРАМ. С МАЙНПАГИ. (+++)

  if (
    (sortBy !== "undefined" && sortBy && !filterBy) ||
    filterBy === "undefined"
  ) {
    /*     console.log(111); */
    try {
      const goods = await Goods.find({
        price: {
          $exists: 1,
        },
      }).sort({ price: `${variableForMongoose}` });

      /* drinks.save(); */
      res.status(200).send(goods);
    } catch (e) {
      res
        .status(500)
        .json({ message: "Ошибка с сортировкой твоаров на сервере 111" });
    }
  }
  // 2. ТОЛЬКО ФИЛЬТРАЦИЯ (+++)
  else if (
    (filterBy && filterBy !== "undefined" && !sortBy) ||
    sortBy === "undefined"
  ) {
    /*     console.log(222); */
    try {
      const goods = await Goods.find({
        type: filterBy,
      });
      /* drinks.save(); */
      res.status(200).send(goods);
    } catch (e) {
      res
        .status(500)
        .json({ message: "Ошибка с сортировкой товаров на сервере 222" });
    }
  }
  // 3. СОРТИРОВКА ПО ОТФИЛЬТРОВАННЫМ ТОВАРАМ (+++)
  else if (
    filterBy &&
    filterBy !== "undefined" &&
    sortBy !== "undefined" &&
    sortBy
  ) {
    /*     console.log(333); */
    try {
      const goods = await Goods.find({
        price: {
          $exists: 1,
        },
        type: filterBy,
      }).sort({ price: `${variableForMongoose}` });
      /* drinks.save(); */
      res.status(200).send(goods);
    } catch (e) {
      res
        .status(500)
        .json({ message: "Ошибка с сортировкой твоаров на сервере 333" });
    }
  }
  // 4. НЕТ ПАРАМЕТРОВ, ШЛЁМ ВСЕ ТОВАРЫ (+++ работа с аплоадера)
  else {
    /*     console.log(444); */
    try {
      const goods = await Goods.find();
      res.status(200).send(goods);
    } catch (e) {
      res
        .status(500)
        .json({ message: "Ошибка с обработкой товаров на сервере 444" });
    }
  }
});

// Запрос конкретного товара
goodsRoutes.get("/:gid", async (req, res) => {
  const { gid } = req.params;
  try {
    const goods = await Goods.findById(gid);

    /* drinks.save(); */
    res.status(200).send(goods);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ошибка с получением конкретного товара на сервере" });
  }
});

// Для админпанели, добавление товаров, моё
goodsRoutes.post("/", middlewareForAuth, async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id);
    const isSeller = loggedInUser.isSeller;

    if (isSeller) {
      const newPizza = await Pizza.create({ ...req.body });
      res.status(201).send(newPizza);
    } else {
      return res.status(401).json({ message: "Permission denied" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

// Для админпанели, изменения данных, защищённые авторизацией
// ДЕЛАЛ САМ, РАБОТАЕТ
goodsRoutes.patch("/:gid", middlewareForAuth, async (req, res) => {
  /* console.log(req.body.data[img_url]); */ // так писать нельзя, баг
  try {
    // Если патчит продавец, то можно. Продавец лишь один, ибо сайт магазина.
    const loggedInUser = await User.findById(req.user._id);
    const isSeller = loggedInUser.isSeller;
    /* console.log(isLoggedIn, isSeller); */
    // искать req.user._id в полях
    // findOne({ user: userId });
    /* console.log(isSeller, typeof req.user._id); */ // null { _id: '65104b43717400be83373a84', iat: 1695566662, exp: 1695570262 } string
    if (isSeller) {
      const { gid } = req.params;

      // Делаю трим, который не получился на клиенте. Мутирую тело запроса перед сохранением коллекции
      // !!! ДАННЫЙ ФУНКЦИОНАЛ ДЛЯ ПРИМЕРА, ПОСКОЛЬКУ ВАЛИДАТОР ВЕСА И ЦЕНЫ НА КЛИЕНТЕ НЕ ПРОПУСКАЕТ ПРОБЕЛЫ
      Object.keys(req.body.data).map((i) => {
        /* console.log(req.body.data); */
        if (i === "name" || i === "desc" || i === "ingredients") {
          req.body.data[i] = req.body.data[i].trim();
        }
        if (i === "weight" || i === "price") {
          req.body.data[i] = Number(req.body.data[i].toString().trim());
        }
      });
      const updatedGoods = await Goods.findByIdAndUpdate(gid, req.body.data, {
        new: true,
      });
      /* console.log(req.pizza, req.user, req.pizzaId, req.userId); */ // req.user - id авторизованного юзера
      // остальное undefined
      /* console.log(req); */ // req.params.pizzaId - id пиццы
      res.status(200).send(updatedGoods);
    } else {
      return res.status(403).json({ message: "Permission denied" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "11111На сервере произошла ошибка, зайдите позже" });
  }
});

// Создание нового товара, защищённое проверкой на продавца
goodsRoutes.post("/create", middlewareForAuth, async (req, res) => {
  try {
    // А ТУТ ВОТКНУ ПРОВЕРКУ - ДОБАВЛЕНИЕ ТОВАРА ДОСТУПНО ЛИШЬ ПРОДАВЦУ
    if (!req.body.isSeller) {
      /* console.log(2); */
      // Создание товара
      const newGoods = await Goods.create({
        ...req.body,
      });
      /* console.log(3); */
      res.status(201).send(newGoods);
      /* console.log(4); */
    } else {
      /* console.log(5); */
      return res.status(401).json({ message: "Hacking attempt!" });
    }
    /* console.log(6); */
  } catch (e) {
    res
      .status(500)
      .json({ message: "При создании товара на сервере произошла ошибка" });
  }
});

// Ниже частично копипаста с комментРоутов, но изменение - принадлежность к isSeller в коллекции
// (удалять может лишь продавец)
goodsRoutes.delete("/:uid", middlewareForAuth, async (req, res) => {
  /* console.log("!!!", req.params, req.query); */
  const { uid } = req.params;
  const { idsForDelete } = req.query.params; // [ '65313e9c56eaf3f94e120501', '65313e9c56eaf3f94e1204fe' ]

  try {
    /*  console.log(uid, typeof uid); */
    const loggedInUser = await User.findById(uid);
    /*   console.log(22); */
    const isSeller = loggedInUser.isSeller;
    /*    console.log(33); */

    if (isSeller) {
      /*  console.log(44);
      console.log(999, uid, idsForDelete); */
      // Удаляю товары итерацией
      idsForDelete.map(async (i) => await Goods.findByIdAndDelete(i));
      // Возвращаю оставшиеся товары, т.к при взаимодействии юзера и сервера надо обновлять данные
      const newGoods = await Goods.find();
      res.status(200).send(newGoods);
    } else {
      /*   console.log(55); */
      return res.status(401).json({ message: "Hacking attempt!" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

export default goodsRoutes;
