import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './Components/header';
import PageRouter from './Routes';

ReactDOM.render(
  <div>
    <Router>
      <Header />
      <PageRouter />
    </Router>
  </div>,
  document.getElementById('root')
);
