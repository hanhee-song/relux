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
// v1.0. Don't ask.
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
    // this.middleware = middleware;
  }
  
  getState() {
    return deepCopy(this.state);
  }
  
  dispatch(action) {
    debugger;
    console.log(action);
    
  }
}

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
