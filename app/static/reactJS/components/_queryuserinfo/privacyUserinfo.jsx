import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { PrivacyContext } from '../_context/UserContext';


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

    return (
        <Query query={GET_USER_INFO}>
            {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
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