import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { ApolloProvider } from 'react-apollo';
import client from './apolloclient_init';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/react-perfect-scrollbar/dist/css/styles.css'
import '../dist/styles/main.css';


const routing = (
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
);

ReactDOM.render(
    routing, document.getElementById('smallworld-container')
);