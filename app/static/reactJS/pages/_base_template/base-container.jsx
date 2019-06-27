import React, { Fragment, useState, useEffect, Children } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import NavBar from './navbar/navbar-present';


const BaseTemplate = (props) => {
    let currentViewSize = window.innerHeight;
    
    const [scroll, setScroll] = useState(false);
    const [sleep, setSleep] = useState(false);
    const [awake, setAwake] = useState(false);
    
    // base template features
    useEffect(() => {
        window.addEventListener('scroll', ScrollView);
    });

    const ScrollView = () => {
        if (window.scrollY > (currentViewSize / 4)) {
            setScroll(true);
        } else {
            setScroll(false);
        };
        if (window.scrollY > (currentViewSize / 2)) {
            setSleep(true);
        } else {
            setSleep(false);
        };
        if (window.scrollY > (currentViewSize * 2 / 3)) {
            setAwake(true);
        } else {
            setAwake(false);
        };
    };


    const GET_USER_INFO = gql`
    {
        UserLimitedInfo { 
            username
            firstname
        }
    }
    `


    return (
        <Query query={GET_USER_INFO}>
            {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error !</p>;
                if (data.UserLimitedInfo != null) {
                    console.log(data.UserLimitedInfo);
                    return data.UserLimitedInfo.map((info) => {
                        // manually inserting props to each child components
                        const childWithProp = Children.map(props.children, (child) => {
                            return React.cloneElement(child, {userinfo: info});
                        });
                        return (
                            <Fragment>
                                <header>
                                    <NavBar scrollState={scroll}
                                            scrollSleep={sleep}
                                            scrollAwake={awake}
                                            userinfo={info} />
                                </header>
                                <div onScroll={ScrollView} style={{height: '100vh'}}>
                                    {childWithProp}
                                </div>
                            </Fragment>
                        );
                    });
                } else {
                    return (
                        <Fragment>
                            <header>
                                <NavBar scrollState={scroll}
                                        scrollSleep={sleep}
                                        scrollAwake={awake} />
                            </header>
                            <div onScroll={ScrollView} style={{height: '100vh'}}>
                                {props.children}
                            </div>
                        </Fragment>
                    );
                }
            }}
        </Query>
    );
};


export default BaseTemplate;