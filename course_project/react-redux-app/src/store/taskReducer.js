import { taskUpdated, taskDeleted } from "./actionTypes";

export function taskReducer(state = [], action) {
  switch (action.type) {
    case taskUpdated: {
      const newArr = [...state];
      const elementIndex = newArr.findIndex(
        (el) => el.id === action.payload.id
      );
      newArr[elementIndex] = { ...newArr[elementIndex], ...action.payload };
      return newArr;
    }
    // Домашка
    case taskDeleted: {
      /* console.log(state, 444); */ // первоначальный стейт [{},{}], но надо удалить по индексу
      const elementIndex = state.findIndex((el) => el.id === action.payload.id);

      const newArr = state.filter((el) => el.id !== action.payload.id);
      /* console.log(newArr, 555); */ // выводится обновлённый стейт
      return newArr;
    }

    default:
      return state;
  }
}
