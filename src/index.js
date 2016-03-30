import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore'; 
import AppContainer from './containers/AppContainer'; 

import './styles/styles.scss';

const store = configureStore();

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>, document.getElementById('app')
);
