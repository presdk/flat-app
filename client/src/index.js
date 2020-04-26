import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import PageRouter from './Routes';

ReactDOM.render(
  <div>
    <Router>
      <PageRouter />
    </Router>
  </div>,
  document.getElementById('root')
);
