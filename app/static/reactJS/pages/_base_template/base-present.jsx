import React, { Fragment } from 'react';

import NavBar from './navbar/navbar-present';


const BaseTemplate = React.forwardRef((props, ref) => {
    return (
        <Fragment>
            <header>
                <NavBar ref={ref} scrollState={props.scrollState}
                                    scrollSleep={props.scrollSleep}
                                    scrollAwake={props.scrollAwake} />
            </header>
            <div onScroll={props.onScroll} style={{height: '100vh'}}>
                {props.routers}
            </div>
        </Fragment>
    );
});


export default BaseTemplate;