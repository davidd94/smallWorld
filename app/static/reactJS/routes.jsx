import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import QueryUserInfo from './components/_queryinfo/navbarUserinfo';
import BaseTemplate from './pages/_base_template/base-container';
import HomepageLanding from './pages/home/homepage-index';
import AboutMe from './pages/aboutme/aboutme-index';
import Explore from './pages/explore/explore-index';
import BlogContainer from './pages/blog/blog-container';
import NewBlogContainer from './pages/blog_new/new_blog-container';
import Subscriptions from './pages/subscription-SPA/subscription-index';
import UserLoginPage from './pages/login/login-index';
import SearchResults from './pages/searchresults/search-index';
import PrivacyIndex from './pages/userprivacy - SPA/privacy-index';
import Error404 from './pages/404/404-present';


const Routes = () => {
    return (
        <QueryUserInfo type='limited'>
            <Router>
                <Switch>
                    <Route exact path='/reactdev-home' component={() => <BaseTemplate><HomepageLanding /></BaseTemplate>} />
                    <Route path='/reactdev-aboutme' component={() => <BaseTemplate><AboutMe /></BaseTemplate>} />
                    <Route path='/reactdev-explore' component={() => <BaseTemplate><Explore /></BaseTemplate>} />
                    <Route exact path='/reactdev-blog' component={() => <BaseTemplate><BlogContainer /></BaseTemplate>} />
                    <Route exact path='/reactdev-blog/new' component={() => <BaseTemplate><NewBlogContainer /></BaseTemplate>} />
                    <Route path='/reactdev-subscriptions' component={() => <BaseTemplate><Subscriptions /></BaseTemplate>} />
                    <Route path='/reactdev-login' component={() => <BaseTemplate><UserLoginPage /></BaseTemplate>} />
                    <Route exact path={['/reactdev-search', '/reactdev-search/:searchinput']} component={(props) => <BaseTemplate disableSearch={true}><SearchResults {...props} /></BaseTemplate>} />
                    <Route path='/reactdev-acctsettings' component={() => <BaseTemplate><PrivacyIndex /></BaseTemplate>} />
                    <Route path='*' component={() => <BaseTemplate><Error404 /></BaseTemplate>} />
                </Switch>
            </Router>
        </QueryUserInfo>
    );
};


export default Routes;