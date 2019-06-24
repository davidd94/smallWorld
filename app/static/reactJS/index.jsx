import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, browserHistory } from 'react-router-dom';
import Routes from './routes';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../stylesheets/perfect-scrollbar.css';
import '../dist/styles/main.css';


const routing = (
    <Router history={browserHistory}>
        <Routes />
    </Router>
);

ReactDOM.render(
    routing, document.getElementById('smallworld-container')
);