import React from 'react';

class DispatchTest extends React.Component {
  constructor(props) {
    super(props);
    this.handleReceiveCurrentUser = this.handleReceiveCurrentUser.bind(this);
    this.handleReceiveUser = this.handleReceiveUser.bind(this);
    this.handleFetchUser = this.handleFetchUser.bind(this);
  }
  
  handleReceiveCurrentUser(e) {
    const user = {
      id: Math.floor(Math.random() * 100),
      name: Math.random()
    };
    this.props.receiveCurrentUser(user);
  }
  
  handleReceiveUser(e) {
    const user = {
      id: Math.floor(Math.random() * 100),
      name: Math.random()
    };
    this.props.receiveUser(user);
  }
  
  handleFetchUser(e) {
    this.props.fetchUser(23);
  }
  
  render () {
    return (
      <div>
        <div onClick={this.handleReceiveCurrentUser}>receiveCurrentUser</div>
        <div onClick={this.handleReceiveUser}>receiveUser</div>
        <div onClick={this.handleFetchUser}>fetchUser</div>
      </div>
    );
  }
}

export default DispatchTest;
