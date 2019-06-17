import React from 'react';
import { Route } from 'react-router-dom';

import BaseTemplate from './pages/_base_template/base-present';
import HomeAnonymous from './pages/home/home-index';
import NavBar from './pages/_base_template/navbar/navbar-present';


export default (
    <BaseTemplate>
        <Route path='/testingreact' exact component={ HomeAnonymous } />
        <Route path='/meep' component={ NavBar } />
    </BaseTemplate>
)