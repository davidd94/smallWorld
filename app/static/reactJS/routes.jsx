import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import BaseTemplateContainer from './pages/_base_template/base-container';
import HomepageLanding from './pages/home/homepage-index';
import Subscriptions from './pages/subscription-SPA/subscription-index';
import LoginBox from './pages/login/login-present';
import Error404 from './pages/404/404-present';


const Routes = () => {
    return (
        <BaseTemplateContainer>
            <Switch>
                <Route exact path='/reactdev-home' component={ HomepageLanding } />
                <Route path='/reactdev-subscriptions' component={Subscriptions} />
                <Route path='/reactdev-login' component={LoginBox} />
                <Route path='*' component={Error404} />
            </Switch>
        </BaseTemplateContainer>
    );
};


export default Routes;