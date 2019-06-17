import React, { Fragment } from 'react';

import styles from './base-specific.module.scss';
import NavBar from './navbar/navbar-present';


function BaseTemplate(props) {
    return (
        <Fragment>
            <header>
                <NavBar />
            </header>
            <div className={styles.baseContainer} >
                {props.children}
            </div>
        </Fragment>
    );
};


export default BaseTemplate;