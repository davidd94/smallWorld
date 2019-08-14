import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import LoadingDisplay from '../../pages/loadingAnimations';
import { UserChatlistContext } from '../_context/UserContext';


const QueryUserlist = (props) => {
    const GET_USER_LIST = gql`
    {
        UserChatlist { 
            username
            picture
        } UserChatlistFav {
            username
            picture
        } UserTokenRefresh {
            token
        }
    }
    `

    return (
        <Query query={GET_USER_LIST} fetchPolicy="no-cache">
            {({ loading, error, data }) => {
                if (loading) return LoadingDisplay('spin', '#408ee0');
                // second security layer to redirect users if not logged in
                if (error) {
                    return (
                        <UserChatlistContext.Provider value={false} key='1'>
                            {props.children}
                        </UserChatlistContext.Provider>
                    );
                };
                if (data) {
                    localStorage.setItem('token', data.UserTokenRefresh[0].token);
                    return (
                        <UserChatlistContext.Provider value={data} key='1'>
                            {props.children}
                        </UserChatlistContext.Provider>
                    );
                } else {
                    return (
                        <UserChatlistContext.Provider value={false} key='1'>
                            {props.children}
                        </UserChatlistContext.Provider>
                    );
                }
            }}
        </Query>
    );
};


export default QueryUserlist;