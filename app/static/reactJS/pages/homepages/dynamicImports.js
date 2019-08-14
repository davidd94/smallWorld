import React, { lazy } from 'react';


// HOMEPAGE DYNAMIC IMPORTS
const DynamicPrivacy = lazy(() => import(/* webpackChunkName: "privacy" */ './userprivacy/privacy-index'));
const DynamicUserLogin = lazy(() => import(/* webpackChunkName: "userlogin" */ './login/login-index'));

// PROFILE DYNAMIC IMPORTS
const DynamicProfile = lazy(() => import(/* webpackChunkName: "profile" */ '../profilepages/home/index'));


export {
    DynamicPrivacy, DynamicUserLogin,
    DynamicProfile
};