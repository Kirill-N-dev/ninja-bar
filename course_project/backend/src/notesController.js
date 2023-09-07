/* const notes = []; */
const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");
/* console.log(notesPath); */

async function addNote(title) {
  // Получаем БД
  const notes = await getNotes();
  const note = {
    title,
    id: Date.now().toString(),
  };
  notes.push(note);

  // ЗАПИСЬ:
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.green("olololo"));
}

/* addNote("Test!"); */

async function getNotes() {
  /* return require("./db.json"); */
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

const printNotes = async () => {
  const notes = await getNotes();

  // Домашка, вывод id
  // Макс, вопрос, откуда в терминале берётся пробел? Ведь для браузера мы его добавляли сами.
  console.log(chalk.green("Here is the list of notes:"));
  notes.forEach((n) => console.log(chalk.blue(n.id, n.title)));
};

// Домашка, удаление записи, функция для комманды index.js
const deleteNote = async ({ id }) => {
  /* console.log(typeof id);  */ // походу хэндлер даёт на выходе не то, что я передал, а {}
  const notes = await getNotes();

  const newNotes = Array.isArray(notes)
    ? notes.filter((g) => +g.id !== +id)
    : "Datebase is empty";
  /* console.log(newNotes, typeof id); */
  await fs.writeFile(notesPath, JSON.stringify(newNotes));
};

module.exports = { addNote, printNotes, deleteNote };
