import { createStore } from '../relux/relux';
import { applyMiddleware, logger, thunk } from '../relux/relux';
import RootReducer from '../reducers/root_reducer';

export default (preloadedState = {}) => {
  return createStore(
    RootReducer,
    preloadedState,
    applyMiddleware(logger, thunk)
  );
};
