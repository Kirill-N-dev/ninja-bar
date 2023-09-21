// копипаста с индекса
import express from "express";
import User from "../startUp/models/User.js";

const userRoutes = express.Router({ mergeParams: true });

userRoutes.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ list: users });
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

export default userRoutes;
