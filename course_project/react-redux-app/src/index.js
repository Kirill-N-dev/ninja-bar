import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import * as actions from "./store/actions";
import { initiateStore } from "./store/store";
/* import { compose, pipe } from "lodash/fp"; */

// Reducer
const store = initiateStore();

// Метод для экшен 1
const completeTask = (taskId) => {
  store.dispatch(actions.taskCompleted(taskId));
};

// Метод для экшен 2
const changeTitle = (taskId) => {
  store.dispatch(actions.titleChanged(taskId));
};

// Домашка, метод для экшен 3
const deleteTask = (taskId) => {
  store.dispatch(actions.taskDeleted(taskId));
};

const App = (params) => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    store.subscribe(() => setState(store.getState()));
  }, []);
  console.log(state);
  return (
    <>
      <ul>
        {state.map((el) => (
          <li key={el.id}>
            <button onClick={() => completeTask(el.id)}>
              Изменить completed
            </button>
            <button onClick={() => changeTitle(el.id)}>Change title</button>
            <button
              onClick={() => {
                /* console.log(el.id, 111); */ // данные id из стейта
                deleteTask(el.id);
              }}
            >
              Удалить состояние
            </button>
            <p>{el.title}</p>
            <p>{`Completed: ${el.completed}`}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
