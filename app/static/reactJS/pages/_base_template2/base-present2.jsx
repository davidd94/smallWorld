import React, { Fragment } from 'react';

import NavBar from './navbar/navbar-present';


function BaseTemplate2(props) {
    return (
        <Fragment>
            <header>
                <NavBar />
            </header>
            <div>
                {props.children}
            </div>
        </Fragment>
    );
};


export default BaseTemplate2;