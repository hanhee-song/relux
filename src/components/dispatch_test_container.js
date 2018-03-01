import DispatchTest from './dispatch_test';
import { connect } from '../relux/relux';
import { receiveCurrentUser } from '../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    receiveCurrentUser: user => dispatch(receiveCurrentUser(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DispatchTest);
// export default DispatchTest;
