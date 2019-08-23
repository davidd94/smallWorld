import React, { lazy } from 'react';


// HOMEPAGE DYNAMIC IMPORTS
const DynamicPrivacy = lazy(() => import(/* webpackChunkName: "dynamicprivacy" */ './userprivacy/privacy-index'));
const DynamicUserLogin = lazy(() => import(/* webpackChunkName: "dynamicuserlogin" */ './login/login-index'));

// PROFILE DYNAMIC IMPORTS
const DynamicProfile = lazy(() => import(/* webpackChunkName: "dynamicprofile" */ '../profilepages/home/index'));


export {
    DynamicPrivacy, DynamicUserLogin,
    DynamicProfile
};