import React, { lazy } from 'react';


const DynamicHomepageLanding = lazy(() => import(/* webpackChunkName: "dynamichomepagelanding" */ '../homepages/home/homepage-index'));
const DynamicAboutme = lazy(() => import(/* webpackChunkName: "dynamicaboutme" */ '../homepages/aboutme/aboutme-index'));
const DynamicExplore = lazy(() => import(/* webpackChunkName: "dynamicexplore" */ '../homepages/explore/explore-index'));
const DynamicBlog = lazy(() => import(/* webpackChunkName: "dynamicblog" */ '../homepages/blog/blog-container'));
const DynamicBlogSingle = lazy(() => import(/* webpackChunkName: "dynamicblogsingle" */ '../homepages/blog_single/blogSingle-container'));
const DynamicBlogNew = lazy(() => import(/* webpackChunkName: "dynamicblognew" */ '../homepages/blog_new/new_blog-container'));
const DynamicSubscription = lazy(() => import(/* webpackChunkName: "dynamicsubscription" */ '../homepages/subscription/subscription-index'));
const DynamicUserLogin = lazy(() => import(/* webpackChunkName: "dynamicuserlogin" */ '../homepages/login/login-index'));
const DynamicSearch = lazy(() => import(/* webpackChunkName: "dynamicsearch" */ '../homepages/searchresults/search-index'));
const DynamicPrivacy = lazy(() => import(/* webpackChunkName: "dynamicprivacy" */ '../homepages/userprivacy/privacy-index'));
const DynamicTwitterAPI = lazy(() => import(/* webpackChunkName: "dynamictwitter" */ '../homepages/twitter/twitterapi'));


export {
    DynamicHomepageLanding, DynamicAboutme, DynamicExplore, DynamicBlog,
    DynamicBlogSingle, DynamicBlogNew, DynamicSubscription, DynamicUserLogin,
    DynamicSearch, DynamicPrivacy, DynamicTwitterAPI
};