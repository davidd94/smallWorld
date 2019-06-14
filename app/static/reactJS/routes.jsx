import React from 'react';
import { Route } from 'react-router-dom';

import BaseTemplate from './components/base/base-present';
import FormTest from './components/navbar/contactme-present';
import NavBar from './components/navbar/navbar-present';


export default (
    <BaseTemplate>
        <Route path='/testingreact' exact component={NavBar} />
        <Route path='/meep' component={FormTest} />
    </BaseTemplate>
)