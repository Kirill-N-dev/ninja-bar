// копипаста с индекса
import express from "express";
import Sauce from "../startUp/models/Sauce.js";

const sauceRoutes = express.Router({ mergeParams: true });

sauceRoutes.get("/", async (req, res) => {
  try {
    const sauces = await Sauce.find();
    res.status(200).json({ list: sauces });
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

export default sauceRoutes;
