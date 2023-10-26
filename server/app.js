import express from "express";
import mongoose from "mongoose";
import config from "config";
import chalk from "chalk";
import initDatabase from "./startUp/initDatabase.js";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();

// MongoDB connection login and pass
/* podpalmoi Uj7k5W1iT2skmnch */

// Мидлверы
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Роуты, все будут по префиксу /api (в адресе) - это базовый урл на порту
app.use("/api", routes);

// Порт
const PORT = config.get("port") ?? 8080;

/* if (process.env.NODE_ENV === "production") {
  console.log(chalk.red("Production"));
} else {
  console.log(chalk.red("Development"));
} */

// Условный запуск сервера, если подгружены БД
const start = async () => {
  try {
    mongoose.connection.once("open", () => {
      initDatabase();
    });
    await mongoose.connect(config.get("mongoUri"));
    // Прослушка порта
    app.listen(PORT, () =>
      console.log(chalk.blue("Server has been started on port:", PORT))
    );
  } catch (e) {
    console.log("Ошибка при запуске сервера.");
    process.exit(1);
  }
};
start();
