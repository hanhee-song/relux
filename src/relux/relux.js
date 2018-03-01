// RELUX ==================================
// createStore

export const createStore = (reducer, state, middleware) => {
  // I have no idea what I'm doing
};

// applyMiddleware

// combineReducers

export const combineReducers = (reducers) => {
  // reducers = {
  //   entities: entitiesReducer,
  //   session: SessionReducer,
  // }
};

// RELUX-THUNK ======================================
// thunk


// RELUX-LOGGER
// logger

// REACT-REDUX =========================================
import React from 'react';

export const connect = (mapState, mapDispatch) => {
  return ReactComponent => {
    return props => {
      let state; // TODO: let it take in STATE from STORE
      const mappedProps = Object.assign(
        mapState(state, props), // This can take in state and props
        mapDispatch(state, props)
      );
      // return new ReactComponent(Object.assign({}, props, mappedProps));
      const finalProps = Object.assign({}, props, mappedProps);
      return <ReactComponent {...finalProps} />;
    };
  };
};
