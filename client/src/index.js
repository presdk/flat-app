import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import store from './redux/store';
import PageRouter from './Routes';
import Header from './Components/header';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Header />
      <PageRouter />
    </Router>
  </Provider>,
  document.getElementById('root')
);
