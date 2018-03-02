const initialState = {};

const SessionReducer = (state = initialState, action) => {
  Object.freeze(state);
  switch (action.type) {
    default:
      return state;
  }
};

export default SessionReducer;
