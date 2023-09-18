// У любого товара будет цена
// Любой товар будет равен мок данным.

import path from "path";
import Drink from "./models/Drink.js";
import Pizza from "./models/Pizza.js";
import Sauce from "./models/Sauce.js";
import chalk from "chalk";
import fs from "fs/promises";
import { __dirname } from "../root.js";
import Comment from "./models/Comment.js";
import User from "./models/User.js";

// _________________________________________________
// У Минина этого нет, потому что старый рикваир поддерживает импорт JSON
const readPizza = await fs.readFile(path.join(__dirname, "/mock/pizzas.json"), {
  encoding: "utf-8",
});
const readSauce = await fs.readFile(path.join(__dirname, "/mock/sauces.json"), {
  encoding: "utf-8",
});
const readDrink = await fs.readFile(path.join(__dirname, "/mock/drinks.json"), {
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

const pizzasMock = JSON.parse(readPizza);
const saucesMock = JSON.parse(readSauce);
const drinksMock = JSON.parse(readDrink);
const usersMock = JSON.parse(readUser);
const commentsMock = JSON.parse(readComment);
// _________________________________________________

// У Минина по другому
const initDatabase = async () => {
  const pizzas = await Pizza.find();
  const drinks = await Drink.find();
  const sauces = await Sauce.find();
  const users = await User.find();
  const comments = await Comment.find();
  //
  console.log(pizzas, pizzasMock, 11111);
  //
  if (pizzas.length !== pizzasMock.length) {
    await createInitialEntity(Pizza, pizzasMock);
  }
  if (drinks.length !== drinksMock.length) {
    await createInitialEntity(Drink, drinksMock);
  }
  if (sauces.length !== saucesMock.length) {
    await createInitialEntity(Sauce, saucesMock);
  }
  if (users.length !== usersMock.length) {
    await createInitialEntity(User, usersMock);
  }
  if (comments.length !== commentsMock.length) {
    await createInitialEntity(Comment, commentsMock);
  }
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
