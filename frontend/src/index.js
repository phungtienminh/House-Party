import App from './components/App.js';
import React from 'react';
import { render } from 'react-dom';

const appDiv = document.getElementById('app');
render(<App name='Vit' />, appDiv);