import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import QueryUserInfo from '../../components/_queryinfo/navbarUserinfo';
import BaseTemplate from '../_base_template/base-container';
import ProfileIndex from './home/index';
import ProfileError404 from './404/404-present';

import {
    DynamicHomepageLanding, DynamicAboutme, DynamicExplore, DynamicBlog,
    DynamicBlogSingle, DynamicSubscription, DynamicUserLogin, DynamicPrivacy,
    DynamicSearch, DynamicTwitterAPI
} from './dynamicImports';

import LoadingDisplay from '../loadingAnimations';


const ProfileRoutes = () => {
    return (
        <QueryUserInfo type='limited'>
            <Suspense fallback={LoadingDisplay('spin', '#408ee0')}>
                <Router>
                    <Switch>
                        <Route exact path='/reactdev-profile' component={() => <BaseTemplate><ProfileIndex /></BaseTemplate>} />
                        
                        <Route exact path='/reactdev-home' component={() => <BaseTemplate><DynamicHomepageLanding /></BaseTemplate>} />
                        <Route path='/reactdev-aboutme' component={() => <BaseTemplate><DynamicAboutme /></BaseTemplate>} />
                        <Route path='/reactdev-explore' component={() => <BaseTemplate><DynamicExplore /></BaseTemplate>} />
                        <Route exact path='/reactdev-blog' component={() => <BaseTemplate><DynamicBlog /></BaseTemplate>} />
                        <Route exact path='/reactdev-blog/:id' component={(props) => <BaseTemplate><DynamicBlogSingle {...props} /></BaseTemplate>} />
                        <Route exact path='/reactdev-newblog/' component={() => <BaseTemplate><DynamicBlogSingle /></BaseTemplate>} />
                        <Route path='/reactdev-subscriptions' component={() => <BaseTemplate><DynamicSubscription /></BaseTemplate>} />
                        <Route path='/reactdev-login' component={() => <BaseTemplate><DynamicUserLogin /></BaseTemplate>} />
                        <Route exact path={['/reactdev-search', '/reactdev-search/:searchinput']} component={(props) => <BaseTemplate disableSearch={true}><DynamicSearch {...props} /></BaseTemplate>} />
                        <Route path='/reactdev-acctsettings' component={() => <BaseTemplate><DynamicPrivacy /></BaseTemplate>} />
                        <Route path='/reactdev-twitterAPI' component={() => <BaseTemplate><DynamicTwitterAPI /></BaseTemplate>}  />

                        <Route path='*' component={() => <BaseTemplate><ProfileError404 /></BaseTemplate>} />
                    </Switch>
                </Router>
            </Suspense>
        </QueryUserInfo>
    );
};


export default ProfileRoutes;