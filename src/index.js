import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reducer from "./redux/combineReducers"
import { createStore } from 'redux';
import { Provider } from "react-redux"
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
let store = createStore(reducer)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);