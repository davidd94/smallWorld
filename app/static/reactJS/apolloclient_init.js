import { ApolloClient, InMemoryCache, ApolloLink, Observable } from 'apollo-boost';
import { setContext } from "apollo-link-context";
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';



// graphQL implementation with Apollo Client
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    // checking graphQL errors
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            switch (err.message) {
                case 'User session expired! Please relog in.':
                    return new Observable(observer => {
                        // Refresh token through async request
                        const refreshToken = async () => {
                            let oldToken = localStorage.getItem('token');
                            // initialize async request to retrieve new token
                            await fetch('/api/reauth_token', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({'old_token': oldToken})
                            })
                            .then(serverResponse => {
                                serverResponse.json()
                                .then((refreshResponse) => {
                                    if (refreshResponse != 'Failed to reauth. Please log in again.') {
                                        localStorage.setItem('token', refreshResponse);
                                        operation.setContext(({ headers = {} }) => ({
                                            headers: {
                                                // Re-add old headers
                                                ...headers,
                                                // Switch out old access token for new one
                                                authorization: `Bearer ${refreshResponse}` || null,
                                            } 
                                        }))
                                    } else {
                                        localStorage.removeItem('token');
                                    }
                                })
                                .then(() => {
                                    const subscriber = {
                                    next: observer.next.bind(observer),
                                    error: observer.error.bind(observer),
                                    complete: observer.complete.bind(observer)
                                    }
                
                                    // Retry last failed request
                                    forward(operation).subscribe(subscriber)
                                })
                                .catch(error => {
                                    // No refresh or client token available, we force user to login
                                    observer.error(error)
                                })
                            })
                        };

                        refreshToken();
                    })
            };
        };
    };

    // checking for network errors
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    };
});

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
});

const graphLink = createHttpLink({
    uri: '/api/graphql',
    credentials: 'include'
});


const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, graphLink]),
    cache: new InMemoryCache()
});


export default client;