import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { AllBlogsContext } from '../_context/BlogContext';


const QueryBlogInfo = (props) => {
    let GET_BLOG_INFO;
    let currentPage = (props.blogPage - 1) * 5;
    if (props.type == 'all') {
        GET_BLOG_INFO = gql`
        query GetAllBlogs($currentPage: Int) {
            BlogPosts(first: 5, skip: $currentPage) {
                id 
                username
                title
                body
                url
                timestamp
            } UserTokenRefresh {
                token
            }
        }
        `
    } else if (props.type == 'single') {
        GET_BLOG_INFO = gql`
        {
            BlogPosts {
                id 
                username
                title
                body
                url
                timestamp
            } UserTokenRefresh {
                token
            }
        }
        `
    } else {
        GET_BLOG_INFO = gql`
        {
            UserTokenRefresh {
                token
            }
        }
        `
    };

    /* NOTE: Added "no-cache" so every time a user renders the page, it refreshes with the latest changes. 
    I am able to implement re-Querying ONLY IF the cached data is mutated instead of re-Querying every time 
    with or without changes. Will be working on this in the future */
    return (
        <Query query={GET_BLOG_INFO} fetchPolicy="no-cache"
                variables={{ currentPage }}>
            {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (data) {
                    // updating localstorage with new token if within grace period.
                    localStorage.setItem('token', (data.UserTokenRefresh ? data.UserTokenRefresh[0].token : ''));
                    return (
                        <AllBlogsContext.Provider value={data} key='1'>
                            {props.children}
                        </AllBlogsContext.Provider>
                    );
                } else {
                    return (
                        <>
                            {props.children}
                        </>
                    );
                };
            }}
        </Query>
    );
};


QueryBlogInfo.defaultProps = {
    blogPage: 0
};


export default QueryBlogInfo;