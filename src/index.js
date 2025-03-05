import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from "react-redux"
import store from "./Store"

const rootEl = document.getElementById('root');


ReactDOM.render(<Provider store={store}>
                  <App />
                </Provider>, rootEl
              );

//ReactDOM.render(<App />, document.getElementById('root')); 
