const yargs = require("yargs");
const { addNote, printNotes, deleteNote } = require("./notesController");

const pkg = require("../package.json");
yargs.version(pkg.version);

yargs.command({
  command: "add",
  describe: "Add new note to list",
  builder: {
    title: {
      type: "string",
      describe: "Note title",
      demandOption: true,
    },
  },
  handler({ title }) {
    addNote(title);
  },
});

yargs.command({
  command: "list",
  describe: "Print all notes",
  async handler() {
    const notes = await printNotes();
  },
});

// Домашка, римув по айди
yargs.command({
  command: "remove",
  describe: "Remove note by id",
  async handler(id) {
    const notes = await deleteNote(id);
  },
});

yargs.parse();
