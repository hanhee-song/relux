// =================================

// TODO: make a boilerplate reducer that takes in an object and
// maps them to certain internal actions, like:
// defaultReducer({
//   reducerName: nameOfReducer,
//   initialState: {},
//   type: (single/index), // think of it as session/currentUser (1) vs entities/users (many)
//   receiveOne: action,
//   receiveAll: action,
//   deleteOne: action,
//   clearAll: [action, action]
//   or maybe they should be [replace, assign, merge, delete, clear]
// });
// We should figure out how to make it extremely customizable,
// and maybe allow for integration with more advanced reducer actions
// outside of cookie-cutter merges and overwrites

// More advanced actions:
// Take in a object that looks like
// {
//   RECEIVE_SOMETHING: (oldState, action) => newState,
//   RECEIVE_ALL_SOMETHING: receiveAll // is this a better way to do it
// }
// where the callback is handed a deep copy of the oldState and action

export function defaultReducer(actions) {
  return (state, action) => {
    Object.freeze(state);
    const cbk = actions[action] || defaultCallback;
    return cbk(deepCopy(state), action);
  };
}

function defaultCallback(state, _) {
  return state;
}

function replace(state, action) {
  
}

// UTILS =====================

function deepCopy(o) {
  let output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = (typeof v === "object") ? deepCopy(v) : v;
  }
  return output;
}
