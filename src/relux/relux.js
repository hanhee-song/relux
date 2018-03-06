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

// =================================

// ONE GLOBAL VARIABLE TO RULE THEM ALL
let $store;

// RELUX ==================================

// createStore ==========
export const createStore = (reducer, state, middleware) => {
  if ($store) {
    throw "createStore has already been invoked, cannot be invoked more than once.";
  }
  $store = new Store(reducer, state, middleware);
  return $store;
};

// applyMiddleware =========
// v1.0. It basically returns its args as an array.
export const applyMiddleware = (...args) => args;

// combineReducers ============
// v1.0. Don't ask. It basically returns its input.
export const combineReducers = reducers => {
  const verifyReducers = reducer => {
    Object.keys(reducer).forEach(key => {
      const val = reducer[key];
      if (typeof val === "object" && Object.keys(val).length !== 0 && val.constructor === Object) {
        verifyReducers(val);
      } else {
        if (typeof val === "undefined") {
          throw `combineReducers received 'undefined' as the reducer for ${key}. Did you forget to import or export somewhere?`;
        } else if (typeof val !== "function") {
          throw `combineReducers received an invalid input for a reducer:
          ${key}: ${JSON.stringify(val)}. Did you forget to export something?`;
        }
      }
    });
  };
  verifyReducers(reducers);
  return reducers;
};


// STORE ==============================================

class Store {
  constructor(reducer, state = {}, middleware = []) {
    this.state = state;
    this.reducers = reducer;
    this.middleware = middleware; // array
    this._setUpMiddleware();
    this.dispatch({ type: "RELUX/INIT" });
  }
  
  getState() {
    return deepCopy(this.state);
  }
  
  dispatch(action) {
    if (typeof action !== "object") {
      throw `Dispatch expected an object, received: ${action}`;
    }
    const newState = deepCopy(this.reducers);
    const mapReducersToState = (act, reducers, state) => {
      Object.keys(reducers).forEach(key => {
        const val = reducers[key];
        let stateSlice;
          try {
            stateSlice = state[key];
          } catch (e) {
            stateSlice = undefined;
          }
        if (typeof val === "function") {
          reducers[key] = val(stateSlice, act);
        } else if (typeof val === "object") {
          mapReducersToState(act, val, stateSlice);
        }
      });
    };
    mapReducersToState(action, newState, this.state);
    this.state = newState;
  }
  
  _setUpMiddleware() {
    if (typeof this.middleware === "function") {
      throw `Relux expected an array of middleware, got: function ${this.middleware.name}. Did you forget to invoke applyMiddleware?`;
    } else if (this.middleware.constructor !== Array) {
      throw `Relux found an invalid array of middleware: ${this.middleware}. Did you forget to invoke applyMiddleware?`;
    }
    this.middleware.forEach(middleware => {
      this.dispatch = middleware(this.dispatch.bind(this), this);
    });
  }
}


// RELUX-THUNK ======================================

// For all thunks, we have to pass in the dispatch rather than using
// store's dispatch. Otherwise, we get bad recursion

export const thunk = (dispatch, store) => {
  function newDispatch(action) {
    if (typeof action === "function") {
      action(dispatch);
    } else {
      dispatch(action);
    }
  }
  return newDispatch;
};


// RELUX-LOGGER ========================================

const actionGroupStyle = 'color: grey';
const prevStateStyle = 'color: grey; font-weight: 700';
const actionStyle = 'color: #47b0ed; font-weight: 700';
const nextStateStyle = 'color: #2ca032; font-weight: 700';

export const logger = (dispatch, store) => {
  function newDispatch(action) {
    const startTime = new Date();
    const oldState = store.getState(); // getState is a deep copy
    dispatch(action);
    const endTime = new Date();
    console.group("%caction", actionGroupStyle, action.type, `@${getTimeFromDate(endTime)} (in ${endTime - startTime} ms)`);
    console.log("%cprev state: ", prevStateStyle, oldState);
    console.log("%caction:     ", actionStyle, action);
    console.log("%cnext state: ", nextStateStyle, store.getState());
    console.groupEnd();
  }
  return newDispatch;
};


// REACT-RELUX =========================================

import React from 'react';

export const connect = (mapState, mapDispatch) => ReactComponent => ownProps => {
  let mappedProps;
  
  if (typeof ReactComponent !== "function") {
    throw `The function returned by connect expected a Component, got: ${typeof ReactComponent} ${ReactComponent}`;
  }
  
  if (typeof mapState !== "function" && mapState !== null) {
    throw `connect expected mapState to be a function or null, got ${mapState}. If you want to pass nothing in, please use "null".`;
  }
  if (typeof mapDispatch !== "function" && mapDispatch !== null) {
    throw `connect expected mapDispatch to be a function or null, got ${mapDispatch}. If you want to pass nothing in, please use "null".`;
  }
  
  // This is to prevent any errors related to mapState or mapDispatch
  // being set to null
  mapState = mapState === null ? () => new Object() : mapState;
  mapDispatch = mapDispatch === null ? () => new Object() : mapDispatch;
  
  try {
    mappedProps = Object.assign(
      mapState($store.getState(), ownProps),
      mapDispatch($store.dispatch.bind($store), ownProps)
    );
  } catch (e) {
    if (e.toString() === "TypeError: Cannot read property 'getState' of undefined") {
      throw "- Store does not exist. You probably forgot to create it.";
    } else {
      console.log(e);
    }
  }
  
  const finalProps = Object.assign({}, ownProps, mappedProps);
  return <ReactComponent {...finalProps} />;
};

// UTIL =============================================

function deepCopy(o) {
  let output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = (typeof v === "object") ? deepCopy(v) : v;
  }
  return output;
}

function getTimeFromDate(date) {
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  let milliseconds = date.getMilliseconds().toString();
  while (milliseconds.length < 3) {
    milliseconds = 0 + milliseconds;
  }
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}
