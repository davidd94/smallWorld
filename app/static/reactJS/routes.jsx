import React from 'react';
import { Route } from 'react-router-dom';

import BaseTemplate2 from './pages/_base_template2/base-present2';
import HomeAnonymous from './pages/home/home-index';
import NavBar from './pages/_base_template/navbar/navbar-present';

import HomepageLanding from './pages/home2/homepage-index';

export default (
    <BaseTemplate2>
        <Route path='/testingtemp' exact component={ HomepageLanding } />
        <Route path='/meep' component={HomeAnonymous} />
    </BaseTemplate2>
)