const initialState = {};

const ChannelReducer = (state = initialState, action) => {
  Object.freeze(state);
  switch (action.type) {
    default:
      return state;
  }
};

export default ChannelReducer;
