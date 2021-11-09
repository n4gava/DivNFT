import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import 'react-notifications-component/dist/theme.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);