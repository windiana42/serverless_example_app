import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// setup multi-language support
import './i18n';

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

