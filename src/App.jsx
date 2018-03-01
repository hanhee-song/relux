import React from 'react';
import DispatchTestContainer from './components/dispatch_test_container';

class App extends React.Component {
  render () {
    return (
      <div className="app">
        Your react is working
        <DispatchTestContainer />
      </div>
    );
  }
}

export default App;
