import * as actionTypes from "./actionTypes";

export function taskCompleted(id) {
  return {
    type: actionTypes.taskUpdated,
    payload: { id, completed: true },
  };
}

export function titleChanged(id) {
  return {
    type: actionTypes.taskUpdated,
    payload: { id, title: `New title for ${id}` },
  };
}

// Домашка, экшен для удаления (стейт теперь меняется)
export function taskDeleted(id) {
  return {
    type: actionTypes.taskDeleted,
    payload: { id },
  };
}
