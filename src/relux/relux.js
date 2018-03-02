// ONE GLOBAL VARIABLE TO RULE THEM ALL
let $store;

// RELUX ==================================
// createStore

export const createStore = (reducer, state, middleware) => {
  $store = new Store(reducer, state, middleware);
  return $store;
};

// applyMiddleware
// v1.0. It basically returns its args as an array.
export const applyMiddleware = (...args) => args;

// combineReducers
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
  constructor(reducer, state, middleware) {
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
    this.middleware.forEach(middleware => {
      this.dispatch = middleware(this.dispatch.bind(this), this);
    });
  }
}

// RELUX-THUNK ======================================
// thunk


// RELUX-LOGGER
// logger

export const logger = (dispatch, store) => {
  // We have to pass in the dispatch rather than using store's dispatch
  // otherwise, we get bad recursion
  function newDispatch(action) {
    console.log("Previous state: ", store.state);
    console.log("Action: ", action);
    dispatch(action);
    console.log("Next state: ", store.state);
  }
  return newDispatch;
};

// REACT-REDUX =========================================
import React from 'react';

export const connect = (mapState, mapDispatch) => {
  return ReactComponent => {
    return ownProps => {
      let mappedProps;
      
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
  };
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
