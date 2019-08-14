import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import QueryUserInfo from '../../components/_queryinfo/navbarUserinfo';

import BaseTemplate from '../_base_template/base-container';
import HomepageLanding from './home/homepage-index';
import AboutMe from './aboutme/aboutme-index';
import Explore from './explore/explore-index';
import BlogContainer from './blog/blog-container';
import BlogSingleContainer from './blog_single/blogSingle-container';
import NewBlogContainer from './blog_new/new_blog-container';
import Subscriptions from './subscription/subscription-index';
import SearchResults from './searchresults/search-index';
import TwitterAPI from './twitter/twitterapi';
import Error404 from './404/404-present';

import { DynamicPrivacy, DynamicUserLogin, DynamicProfile } from './dynamicImports';

import LoadingDisplay from '../loadingAnimations';


const HomeRoutes = () => {
    return (
        <QueryUserInfo type='limited'>
            <Suspense fallback={LoadingDisplay('spin', '#408ee0')}>
                <Router>
                    <Switch>
                        <Route exact path='/reactdev-home' component={() => <BaseTemplate><HomepageLanding /></BaseTemplate>} />
                        <Route path='/reactdev-aboutme' component={() => <BaseTemplate><AboutMe /></BaseTemplate>} />
                        <Route path='/reactdev-explore' component={() => <BaseTemplate><Explore /></BaseTemplate>} />
                        <Route exact path='/reactdev-blog' component={() => <BaseTemplate><BlogContainer /></BaseTemplate>} />
                        <Route exact path='/reactdev-blog/:id' component={(props) => <BaseTemplate><BlogSingleContainer {...props} /></BaseTemplate>} />
                        <Route exact path='/reactdev-newblog/' component={() => <BaseTemplate><NewBlogContainer /></BaseTemplate>} />
                        <Route path='/reactdev-subscriptions' component={() => <BaseTemplate><Subscriptions /></BaseTemplate>} />
                        <Route path='/reactdev-login' component={() => <BaseTemplate><DynamicUserLogin /></BaseTemplate>} />
                        <Route exact path={['/reactdev-search', '/reactdev-search/:searchinput']} component={(props) => <BaseTemplate disableSearch={true}><SearchResults {...props} /></BaseTemplate>} />
                        <Route path='/reactdev-acctsettings' component={() => <BaseTemplate><DynamicPrivacy /></BaseTemplate>} />
                        <Route path='/reactdev-twitterAPI' component={() => <BaseTemplate><TwitterAPI /></BaseTemplate>}  />
                        
                        <Route path='/reactdev-profile' component={() => <BaseTemplate><DynamicProfile /></BaseTemplate>}  />
                        
                        <Route path='*' component={() => <BaseTemplate><Error404 /></BaseTemplate>} />
                    </Switch>
                </Router>
            </Suspense>
        </QueryUserInfo>
    );
};


export default HomeRoutes;