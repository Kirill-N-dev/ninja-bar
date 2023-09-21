// копипаста с индекса
import express from "express";
import Comment from "../startUp/models/Comment.js";

const commentRoutes = express.Router({ mergeParams: true });

commentRoutes.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json({ list: comments });
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

export default commentRoutes;
