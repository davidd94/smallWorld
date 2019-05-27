import ReactDOM from 'react-dom';
import SubscriptionContainer from './subscriptionCards/subscription-container.jsx';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';


const client = new ApolloClient({
    uri: 'https://smallworld.live/graphql'
});


ReactDOM.render(
    <ApolloProvider client={client}>
        <SubscriptionContainer />
    </ApolloProvider>,
    document.getElementById('subscription-card')
);












import React, { Component } from 'react';
import SubscriptionBox from './subscription-present.jsx';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';


const GET_USER = gql`
    query {
        users {
            firstname,
            email,
            username,
        }
    }
`

export const SubscriptionWrapper = ({ onUserSelected }) => (
    <Query query={GET_USER}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        console.log(data);
  
        return (
            <SubscriptionBox />
        );
      }}
    </Query>
);

class SubscriptionContainer extends Component {
    render() {
        return (
            <SubscriptionWrapper />
        )
    }
}


export default SubscriptionContainer;