import React from 'react';

class DispatchTest extends React.Component {
  constructor(props) {
    super(props);
    debugger;
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(e) {
    console.log("Click");
    this.props.receiveCurrentUser({ name: "meow" });
  }
  
  render () {
    return (
      <div onClick={this.handleClick}>Click to test</div>
    );
  }
}

export default DispatchTest;
