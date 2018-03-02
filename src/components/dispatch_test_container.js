import DispatchTest from './dispatch_test';
import { connect } from '../relux/relux';
import {
  receiveCurrentUser,
  receiveUser,
  fetchUser,
} from '../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    receiveCurrentUser: user => dispatch(receiveCurrentUser(user)),
    receiveUser: user => dispatch(receiveUser(user)),
    fetchUser: id => dispatch(fetchUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DispatchTest);
// export default DispatchTest;
