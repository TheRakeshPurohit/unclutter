import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const urlParams = new URLSearchParams(document.location.search);
const domContainer = document.querySelector('#react-root');
ReactDOM.render(<App {...Object.fromEntries(urlParams)} />, domContainer);
