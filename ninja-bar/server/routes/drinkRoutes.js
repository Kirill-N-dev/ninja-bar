// копипаста с индекса
import express from "express";
import Drink from "../startUp/models/Drink.js";

const drinkRoutes = express.Router({ mergeParams: true });

drinkRoutes.get("/", async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.status(200).json({ list: drinks });
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

export default drinkRoutes;
