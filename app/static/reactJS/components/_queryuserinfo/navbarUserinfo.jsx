import React, { Fragment, Children } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { UserContext } from '../_context/UserContext';


const QueryUserInfo = (props) => {
    let GET_USER_INFO = null;

    if (props.type == 'all') {
        GET_USER_INFO = gql`
        {
            UserInfo { 
                username
                firstname
                lastname
                email
                bio
                picture
                msgNote
                commentNote
                replyNote
                token
            }
        }
        `
    } else if (props.type == 'limited') {
        GET_USER_INFO = gql`
        {
            UserLimitedInfo { 
                username
                firstname
                picture
                token
            }
        }
        `
    }

    return (
        <Query query={GET_USER_INFO}>
            {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (data) {
                    return data.UserLimitedInfo.map((info) => {
                        // manually inserting props to each child components
                        const childWithQuery = Children.map(props.children, (child, index) => {
                            const key = child.key ? `key-${child.key}` : `index-${index}`;
                            return React.cloneElement(child, {key: key, userinfo: info});
                        });
                        // updating localstorage with new token if within grace period. Otherwise, relogin required
                        localStorage.setItem('token', info['token'])
                        return (
                            <UserContext.Provider value={info} key='1'>
                                {childWithQuery}
                            </UserContext.Provider>
                        );
                    });
                } else {
                    // manually inserting props to each child components
                    const childWithoutQuery = Children.map(props.children, (child, index) => {
                        const key = child.key ? `key-${child.key}` : `index-${index}`;
                        return React.cloneElement(child, {key: key});
                    });
                    return (
                        <Fragment>
                            {childWithoutQuery}
                        </Fragment>
                    );
                }
            }}
        </Query>
    );
};


export default QueryUserInfo;