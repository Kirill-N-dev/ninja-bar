// У любого товара будет цена
// Любой товар будет равен мок данным.

import path from "path";
import Goods from "./models/Goods.js";
import fs from "fs/promises";
import { __dirname } from "../root.js";
import Comment from "./models/Comment.js";
import User from "./models/User.js";

// _________________________________________________
// У Минина этого нет, потому что старый рикваир поддерживает импорт JSON
const readGoods = await fs.readFile(path.join(__dirname, "/mock/goods.json"), {
  encoding: "utf-8",
});
const readUser = await fs.readFile(path.join(__dirname, "/mock/users.json"), {
  encoding: "utf-8",
});
const readComment = await fs.readFile(
  path.join(__dirname, "/mock/comments.json"),
  {
    encoding: "utf-8",
  }
);

const goodsMock = JSON.parse(readGoods);
const usersMock = JSON.parse(readUser);
const commentsMock = JSON.parse(readComment);

// _________________________________________________

// У Минина по другому
const initDatabase = async () => {
  const goods = await Goods.find();
  const users = await User.find();
  const comments = await Comment.find();

  //
  /*  console.log(pizzas, pizzasMock, 11111); */
  // ПОКА ЧТО ПРИ ПЕРЕЗАПУСКЕ СЕРВЕРА КОЛЛЕКЦИИ БУДУТ СБРАСЫВАТЬСЯ ДО МОКОВ, ЭТО ДЕВ МОД, ПОТОМ ЗАКОММЕНТИТЬ

  /* if (goods.length !== goodsMock.length) {
    await createInitialEntity(Goods, goodsMock);
  } */
  /* if (users.length !== usersMock.length) {
    await createInitialEntity(User, usersMock);
  }
  if (comments.length !== commentsMock.length) {
    await createInitialEntity(Comment, commentsMock);
  } */
};

const createInitialEntity = async (Model, data) => {
  // очистка коллекци, чтобы не дублировать данные
  await Model.collection.drop();

  return Promise.all(
    data.map(async (item) => {
      try {
        delete item.id;
        const newItem = new Model(item);
        // метод, заносящий локальную БД в МонгоДБ
        await newItem.save();
        return newItem;
      } catch (e) {
        return e;
      }
    })
  );
};

export default initDatabase;
