import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import store from './redux/store';
import PageRouter from './Routes';
import Header from './Components/header';
import styled from "styled-components";

const GlobalStyle = styled.div`
  * {
    font-family: 'Roboto', sans-serif
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <GlobalStyle>
        <Header />
        <PageRouter />
      </GlobalStyle>
    </Router>
  </Provider>,
  document.getElementById('root')
);
