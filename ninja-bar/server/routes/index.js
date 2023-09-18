// тут все роуты БЭ (новое)
// РОУТЫ ПОКА НЕ ИМПОРТИРОВАЛ МИНИН
import express from "express";
import authRoutes from "./authRoutes.js";
import pizzaRoutes from "./pizzaRoutes.js";
import commentRoutes from "./commentRoutes.js";
import userRoutes from "./userRoutes.js";
import drinkRoutes from "./drinkRoutes.js";
import sauceRoutes from "./sauceRoutes.js";

const router = express.Router({ mergeParams: true });

// api/auth ...
router.use("/auth", authRoutes);
router.use("/comment", commentRoutes);
router.use("/pizza", pizzaRoutes);
router.use("/sauce", sauceRoutes);
router.use("/drink", drinkRoutes);
router.use("/user", userRoutes);

export default router;

// видео на 6:44 и создавать файлы
