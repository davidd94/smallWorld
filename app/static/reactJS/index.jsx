import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import routes from './routes';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../stylesheets/perfect-scrollbar.css';
import '../dist/styles/main.css';


const routing = (
    <Router>
        {routes}
    </Router>
)

ReactDOM.render(
    routing, document.getElementById('smallworld-container')
);