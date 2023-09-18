/*
Создано для спокойного импорта корня приложения, куда надо.
Иначе была проблема, что в app.js был импорт с initDatabase.js,
в который импортируется корень приложения из app.js. В итоге корень получается ещё не инициализированным.
*/

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename); // /server
