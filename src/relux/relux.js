// ONE GLOBAL VARIABLE TO RULE THEM ALL
let $store;

// RELUX ==================================
// createStore

export const createStore = (reducer, state, middleware) => {
  $store = new Store(reducer, state, middleware);
  return $store;
};

// applyMiddleware

// combineReducers

export const combineReducers = (reducers) => {
  // reducers = {
  //   entities: entitiesReducer,
  //   session: SessionReducer,
  // }
};

// STORE ==============================================

class Store {
  constructor(reducer, state, middleware) {
    console.log(reducer);
    this.state = state;
  }
  
  getState() {
    return deepCopy(this.state);
  }
  
  dispatch(action) {
    console.log(action);
  }
}

// // Writing like this just to make sure there are no hoisting issues
// function dispatch(action) {
//   console.log(action);
// }

// RELUX-THUNK ======================================
// thunk


// RELUX-LOGGER
// logger

// REACT-REDUX =========================================
import React from 'react';

export const connect = (mapState, mapDispatch) => {
  return ReactComponent => {
    return ownProps => {
      let mappedProps;
      
      try {
        mappedProps = Object.assign(
          mapState($store.getState(), ownProps),
          mapDispatch($store.dispatch, ownProps)
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

// Possible error: if createStore is not invoked prior to attempting to connect,
// $store will be undefined.

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
