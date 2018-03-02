import { combineReducers } from '../relux/relux';
import ChannelReducer from './channel_reducer';
import UserReducer from './user_reducer';

export default combineReducers({
  channels: ChannelReducer,
  users: UserReducer,
});
