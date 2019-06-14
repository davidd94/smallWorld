import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'

import routes from './routes';

const routing = (
    <Router>
        {routes}
    </Router>
)

ReactDOM.render(
    routing, document.getElementById('smallworld-container')
);