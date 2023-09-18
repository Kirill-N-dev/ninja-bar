// копипаста с индекса
import express from "express";
import Pizza from "../startUp/models/Pizza.js";

const pizzaRoutes = express.Router({ mergeParams: true });

pizzaRoutes.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).json({ list: pizzas });
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

export default pizzaRoutes;
