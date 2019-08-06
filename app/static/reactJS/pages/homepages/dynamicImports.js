import React, { lazy } from 'react';



const DynamicPrivacy = lazy(() => import(/* webpackChunkName: "privacy" */ './userprivacy/privacy-index'));
const DynamicUserLogin = lazy(() => import(/* webpackChunkName: "userlogin" */ './login/login-index'));


export { DynamicPrivacy, DynamicUserLogin };