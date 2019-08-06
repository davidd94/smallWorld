import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import QueryUserInfo from '../../components/_queryinfo/navbarUserinfo';
import BaseTemplate from '../_base_template/base-container';
import ProfileIndex from './home/index';
import ProfileError404 from './404/404-present';

import LoadingDisplay from '../loadingAnimations';


const ProfileRoutes = () => {
    return (
        <QueryUserInfo type='limited'>
            <Suspense fallback={LoadingDisplay('spin', '#408ee0')}>
                <Router>
                    <Switch>
                        <Route exact path='/reactdev-profile' component={() => <BaseTemplate><ProfileIndex /></BaseTemplate>} />
                        <Route path='*' component={() => <BaseTemplate><ProfileError404 /></BaseTemplate>} />
                    </Switch>
                </Router>
            </Suspense>
        </QueryUserInfo>
    );
};


export default ProfileRoutes;