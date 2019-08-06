import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { ProjectContext } from '../_context/ProjectContext';
import LoadingDisplay from '../../pages/loadingAnimations';


const QueryProjectInfo = (props) => {
    const GET_PROJECT_INFO = gql`
    {
        PopularProjects { 
            username
            title
            description
            likes
            aquariums
            saltwater
            freshwater
            terrariums
            enclosedtropical
            opentropical
            carnivorous
            desert
            reptiles
            vivariumpaludarium
            plantsonly
        } TrendingProjects {
            username
            title
            description
            likes
            aquariums
            saltwater
            freshwater
            terrariums
            enclosedtropical
            opentropical
            carnivorous
            desert
            reptiles
            vivariumpaludarium
            plantsonly
        } NewProjects {
            username
            title
            description
            likes
            aquariums
            saltwater
            freshwater
            terrariums
            enclosedtropical
            opentropical
            carnivorous
            desert
            reptiles
            vivariumpaludarium
            plantsonly
        }
    }
    `

    /* NOTE: Added "no-cache" so every time a user renders privacy page, it refreshes with the latest changes. 
    I am able to implement re-Querying ONLY IF the cached data is mutated instead of re-Querying every time 
    with or without changes. Will be working on this in the future */
    return (
        <Query query={GET_PROJECT_INFO} fetchPolicy="no-cache">
            {({ loading, error, data }) => {
                if (loading) return LoadingDisplay('spin', '#408ee0');
                if (error) return <Redirect to='/reactdev-home' />;
                if (data) {
                    // updating localstorage with new token if within grace period. Otherwise, relogin required
                    if (data.UserTokenRefresh != (undefined || null)) {
                        localStorage.setItem('token', data.UserTokenRefresh[0].token);
                    };
                    return (
                        <ProjectContext.Provider value={data} key='1'>
                            {props.children}
                        </ProjectContext.Provider>
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


export default QueryProjectInfo;