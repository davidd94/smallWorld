import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { setContext } from "apollo-link-context";
import { createHttpLink } from 'apollo-link-http';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../stylesheets/perfect-scrollbar.css';
import '../dist/styles/main.css';


// graphQL implementation
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
});

const graphLink = createHttpLink({
    uri: '/api/graphql'
});
const client = new ApolloClient({
    link: authLink.concat(graphLink),
    cache: new InMemoryCache(),
});


const routing = (
    <ApolloProvider client={client}>
        <Router>
            <Routes />
        </Router>
    </ApolloProvider>
);

ReactDOM.render(
    routing, document.getElementById('smallworld-container')
);