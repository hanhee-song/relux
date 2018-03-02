import { createStore } from '../relux/relux';
import UserReducer from '../reducers/user_reducer';

export default (preloadedState = {}) => {
  return createStore(
    UserReducer,
    preloadedState
  );
};
