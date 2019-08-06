import React from 'react';
import ReactDOM from 'react-dom';
import ProfileRoutes from './routes';
import { ApolloProvider } from 'react-apollo';
import client from '../../apolloclient_init';

import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../../node_modules/react-perfect-scrollbar/dist/css/styles.css'
import '../../../dist/styles/reactProfile.css';


const routing = (
    <ApolloProvider client={client}>
        <ProfileRoutes />
    </ApolloProvider>
);

ReactDOM.render(
    routing, document.getElementById('smallworld-container')
);