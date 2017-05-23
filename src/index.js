/*eslint-disable import/default */

// Polyfill
import 'babel-polyfill';

// Style
import './style.scss';

// Libraries
import 'bootstrap/dist/css/bootstrap.css';

// Import React & JS
import React from 'react';
import { render } from 'react-dom';
import App from './containers/app.js';
// Import Redux
//
//

render(
  <App />,
  document.getElementById("app")
);
