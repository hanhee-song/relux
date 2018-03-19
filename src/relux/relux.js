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
    this.changeListeners = new Set();
    this._setUpMiddleware();
    this.dispatch({ type: "RELUX/INIT" });
  }
  
  getState() {
    return deepCopy(this.state);
    // return this.state;
  }
  
  dispatch(action) {
    if (typeof action !== "object") {
      throw `Dispatch expected an object, received: ${action}`;
    }
    const newState = deepCopy(this.reducers);
    this._mapReducersToState(action, newState, this.state);
    this.state = newState;
    
    // this._activateChangeListeners();
    return action;
  }
  
  addChangeListener(cbk) {
    window.aoeu = cbk;
    this.changeListeners.add(cbk);
  }
  
  removeChangeListener(cbk) {
    this.changeListeners.delete(cbk);
  }
  
  getProps(mapState, mapDispatch, ownProps) {
    let mappedProps;
    mappedProps = Object.assign(
      mapState(this.getState(), ownProps),
      mapDispatch(this.dispatch.bind(this), ownProps)
    );
    return Object.assign({}, deepCopy(ownProps), deepCopy(mappedProps));
  }
  
  _activateChangeListeners() {
    this.changeListeners.forEach((cbk) => {
      cbk();
    });
  }
  
  _mapReducersToState(act, reducers, state) {
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
        this._mapReducersToState(act, val, stateSlice);
      }
    });
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

export const thunk = (dispatch) => {
  function newDispatch(action) {
    if (typeof action === "function") {
      return action(dispatch);
    } else {
      return dispatch(action);
    }
  }
  return newDispatch;
};


// RELUX-LOGGER ========================================

const actionGroupStyle = 'color: grey';
const prevStateStyle = 'color: grey; font-weight: 700';
const actionStyle = 'color: #47b0ed; font-weight: 700';
const nextStateStyle = 'color: #2ca032; font-weight: 700';
const errorStyle = 'color: red; font-weight: 700';

export const logger = (dispatch, store) => {
  function newDispatch(action) {
    const startTime = new Date();
    const oldState = store.getState(); // getState is a deep copy
    let error;
    try {
      dispatch(action);
    } catch (e) {
      error = e;
    }
    const endTime = new Date();
    console.group("%caction", actionGroupStyle, action.type, `@${getTimeFromDate(endTime)} (in ${endTime - startTime} ms)`);
    console.log("%cprev state: ", prevStateStyle, oldState);
    console.log("%caction:     ", actionStyle, action);
    if (error) {
      console.log("%cerror:      ", errorStyle, error);
      console.groupEnd();
      throw error;
    } else {
      console.log("%cnext state: ", nextStateStyle, store.getState());
      console.groupEnd();
    }
  }
  return newDispatch;
};


// REACT-RELUX =========================================

import React from 'react';

export const connect = (mapState, mapDispatch) => ReactComponent => ownProps => {
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
  
  debugger;
  return createWrapper(ReactComponent, mapState, mapDispatch, ownProps);
};

function createWrapper(ReactComponent, mapState, mapDispatch, ownProps) {
  class StoreConnection extends React.Component {
    constructor(props) {
      super(props);
      console.log(ReactComponent.name);
      debugger;
      this.state = $store.getProps(mapState, mapDispatch, this.props);
      this.handleStoresChanged = this.handleStoresChanged.bind(this);
    }
    
    componentDidMount() {
      $store.addChangeListener(this.handleStoresChanged);
    }
    
    componentWillUnmount() {
      $store.removeChangeListener(this.handleStoresChanged);
    }
    
    handleStoresChanged() {
      this.setState($store.getProps(mapState, mapDispatch, this.props));
    }
    
    render () {
      return <ReactComponent {...this.state} />;
    }
  }
  return React.createElement(StoreConnection, ownProps);
}

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
