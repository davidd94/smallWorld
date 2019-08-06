import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { PrivacyContext } from '../_context/UserContext';
import LoadingDisplay from '../../pages/loadingAnimations';


const QueryUserPrivacyInfo = (props) => {
    const GET_USER_INFO = gql`
    {
        UserInfo { 
            username
            firstname
            lastname
            email
            picture
            msgNote
            commentNote
            replyNote
            token
        } UsersBlocked {
            username
            picture
        }
    }
    `

    /* NOTE: Added "no-cache" so every time a user renders privacy page, it refreshes with the latest changes. 
    I am able to implement re-Querying ONLY IF the cached data is mutated instead of re-Querying every time 
    with or without changes. Will be working on this in the future */
    return (
        <Query query={GET_USER_INFO} fetchPolicy="no-cache">
            {({ loading, error, data }) => {
                if (loading) return LoadingDisplay('spin', '#408ee0');
                // second security layer to redirect users if not logged in
                if (error) return <Redirect to='/reactdev-login' />;
                if (data) {
                    // updating localstorage with new token if within grace period. Otherwise, relogin required
                    localStorage.setItem('token', data.UserInfo[0].token);
                    return (
                        <PrivacyContext.Provider value={data} key='1'>
                            {props.children}
                        </PrivacyContext.Provider>
                    );
                } else {
                    return (
                        <Fragment>
                            {props.children}
                        </Fragment>
                    );
                }
            }}
        </Query>
    );
};


export default QueryUserPrivacyInfo;