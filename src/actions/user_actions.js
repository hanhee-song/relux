import * as UserApiUtil from '../util/user_api_util';

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_USER = "RECEIVE_USER";

export const receiveCurrentUser = (user) => {
  return {
    type: RECEIVE_CURRENT_USER,
    user
  };
};

export const receiveUser = (user) => {
  return {
    type: RECEIVE_USER,
    user
  };
};

export const fetchUser = (id) => {
  return (dispatch) => {
    return UserApiUtil.fetchUser(id)
      .then(
        user => dispatch(receiveUser(user))
      );
  };
};
