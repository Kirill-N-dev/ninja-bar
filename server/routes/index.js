// тут все роуты БЭ (новое)
// РОУТЫ ПОКА НЕ ИМПОРТИРОВАЛ МИНИН
import express from "express";
import authRoutes from "./authRoutes.js";
import commentRoutes from "./commentRoutes.js";
import userRoutes from "./userRoutes.js";
import goodsRoutes from "./goodsRoutes.js";

const router = express.Router({ mergeParams: true });

// api/auth ...
router.use("/auth", authRoutes);
router.use("/comment", commentRoutes);
router.use("/goods", goodsRoutes);
router.use("/user", userRoutes);

export default router;

// видео на 6:44 и создавать файлы
