import express from "express";
import mongoose from "mongoose";
import config from "config";
import chalk from "chalk";
import initDatabase from "./startUp/initDatabase.js";
import routes from "./routes/index.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

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

// Исправляю баг ЕС6, гуглил (надо сделать папку server - __dirname)
/*
The import.meta.url is used to get the URL of the file location,
which uses the file:// protocol. The fileURLToPath() function returns the absolute path without the protocol.
The path.dirname() method then remove the file name from the path so that you get the directory name.
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* if (process.env.NODE_ENV === "production") {
  console.log(chalk.red("Production"));
} else {
  console.log(chalk.red("Development"));
} */

// Деплой. Код работает только в продакшн моде. При обращении в корень добавляем мидлвеир
if (process.env.NODE_ENV === "production") {
  // Передаём путь к статической папке. СОЗДАЁМ В ПАПКЕ SERVER - ПАПКУ CLIENT И КОПИРУЕМ ТУДА НАЧИНКУ BUILD КЛИЕНТА.
  // Статической делаем созданную и выше наполненную папку
  // Обращение к api будет давать JSON
  app.use("/", express.static(path.join(__dirname, "client")));
  const indexPath = path.join(__dirname, "client", "index.html");
  app.get("*", (req, res) => res.sendFile(indexPath));

  // ТЕПЕРЬ НА 8080 ОКТРЫТ НАШ САЙТ!
  // ТЕПЕРЬ УДАЛЯЕМ ПАПКУ CLIENT И ИДЁМ ДАЛЬШЕ.
}

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
