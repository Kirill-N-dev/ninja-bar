// копипаста с индекса
import express from "express";
import Comment from "../startUp/models/Comment.js";
import { middlewareForAuth } from "../middleWare/authMiddleWare.js";

const commentRoutes = express.Router({ mergeParams: true });

// КОД НИЖЕ НЕ ПРОВЕРЯЛСЯ ПОСТМАНОМ, МИНИН БУДЕТ СВЕРЯТЬ ПО ХОДУ ПЬЕССЫ

// api/comment
// НОВЫЙ СИНТАКСИС - МЕТОД ROUTE() - ОБРАБОТКИ МОЖНО ПИСАТЬ ПОСЛЕДОВАТЕЛЬНО
// Также с клиента будут приходить квери (опциональные) параметры - equalTo и orderBy -
// - обработка (сортировка) должна быть на сервере
commentRoutes
  .route("/")
  .get(async (req, res) => {
    try {
      const { orderBy, equalTo } = req.query;
      // НЕ ПОНЯЛ, КАК РАБОТАЕТ
      const list = await Comment.find({ [orderBy]: equalTo });
      res.send(list);
    } catch (e) {
      res
        .status(500)
        .json({ message: "На сервере произошла ошибка, зайдите позже" });
    }
  })
  .post(middlewareForAuth, async (req, res) => {
    try {
      const newComment = await Comment.create({
        ...req.body,
        userId: req.user._id,
      });
      res.status(201).send(newComment);
    } catch (e) {
      res
        .status(500)
        .json({ message: "На сервере произошла ошибка, зайдите позже" });
    }
  });

commentRoutes.delete("/:commentId", middlewareForAuth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const removedComment = await Comment.findById(commentId); // можно и через find, но там ({_id:commentId})

    // Проверка принадлежности комментария каррентюзеру
    if (removedComment.userId.toString() === req.user._id) {
      // Удаление модели:
      await removedComment.remove();
      res.send(null); // ничего не ждём на клиенте
    } else {
      // Ошибка авторизации
      res.status(401).json({ message: "Unauthorized" }); // МИНИН НЕ СТАВИТ РЕТЮРН
    }

    // ЗАКРЫЛ ЛИШНЕЕ, ПРОВЕРИТЬ УДАЛЕНИЕ!
    /* const newComment = await Comment.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).send(newComment); */
  } catch (e) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка, зайдите позже" });
  }
});

export default commentRoutes;
