import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import configureStore from './store/store';

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById('root');
  const store = configureStore();
  ReactDOM.render(<App />, root);
});
