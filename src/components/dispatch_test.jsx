import React from 'react';

class DispatchTest extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(e) {
    this.props.receiveCurrentUser({ name: Math.random() });
  }
  
  render () {
    return (
      <div onClick={this.handleClick}>Click to test</div>
    );
  }
}

export default DispatchTest;
