import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BaseTemplate from './pages/_base_template/base-container';
import HomepageLanding from './pages/home/homepage-index';
import Subscriptions from './pages/subscription-SPA/subscription-index';
import Login from './pages/login/login-container';
import Error404 from './pages/404/404-present';


const Routes = () => {
    return (
        <Switch>
            <Route exact path='/reactdev-home' component={() => <BaseTemplate><HomepageLanding /></BaseTemplate>} />
            <Route path='/reactdev-subscriptions' component={() => <BaseTemplate><Subscriptions /></BaseTemplate>} />
            <Route path='/reactdev-login' component={() => <BaseTemplate><Login /></BaseTemplate>} />
            <Route path='*' component={() => <BaseTemplate><Error404 /></BaseTemplate>}  />
        </Switch>
    );
};


export default Routes;