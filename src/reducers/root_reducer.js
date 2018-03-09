import { combineReducers } from '../relux/relux';
import ChannelReducer from './channel_reducer';
import UserReducer from './user_reducer';
import sessionReducer from './session_reducer';

export default combineReducers({
  entities: {
    channels: ChannelReducer,
    users: UserReducer,
  },
  session: sessionReducer
});
