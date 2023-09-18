// копипаста с индекса
import express from "express";
const authRoutes = express.Router({ mergeParams: true });

// api/auth/signUp ...
authRoutes.post("/signUp", async (req, res) => {});
authRoutes.post("/signInWithPasswordp", async (req, res) => {});
authRoutes.post("/token", async (req, res) => {});

export default authRoutes;
