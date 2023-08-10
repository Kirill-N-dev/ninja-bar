export function createStore(reducer, initialState) {
  // 1
  let state = initialState;
  // Для хранения слушателей из урока по обсерверу
  let listeners = [];

  function getState() {
    return state;
  }

  // 2
  function dispatch(action) {
    state = reducer(state, action);
    // Вызов листенеров:
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  // Функци добавления новых слушателей, обсервер паттерн
  const subscribe = (listener) => {
    listeners.push(listener);
  };

  return { getState, dispatch, subscribe }; // экспорт
}
