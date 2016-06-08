import React from 'react';
import { render } from 'react-dom';
import GreetingBoxComponent from './containers/GreetingBoxComponent'; 

import './styles/styles.scss';

render(
    <GreetingBoxComponent />, document.getElementById('app')
);