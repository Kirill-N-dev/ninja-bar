import { legacy_createStore as createStore } from "redux"; // !!! ЧТОБЫ ВСКОД НЕ РУГАЛСЯ
import { taskReducer } from "./taskReducer";
/* import { createStore } from "redux"; */

// Как понял, хранилище первичных стейтов
const initState = [
  { id: 1, title: "task 1", completed: false },
  { id: 2, title: "task 2", completed: false },
];

export function initiateStore() {
  return createStore(taskReducer, initState);
}
