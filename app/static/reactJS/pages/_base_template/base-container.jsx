import React, { Fragment, useState, useEffect, Children } from 'react';

import NavBar from './navbar/navbar-container';


const BaseTemplate = (props) => {
    let currentViewSize = window.innerHeight;
    
    const [scroll, setScroll] = useState(false);
    const [sleep, setSleep] = useState(false);
    const [awake, setAwake] = useState(false);

    // base template features
    useEffect(() => {
        window.addEventListener('scroll', ScrollView);
        return () => window.removeEventListener('scroll', ScrollView);
    });

    const ScrollView = () => {
        if (window.scrollY > (currentViewSize / 4)) {
            setScroll(true);
        } else {
            setScroll(false);
        };
        if (window.scrollY > (currentViewSize / 2)) {
            setSleep(true);
        } else {
            setSleep(false);
        };
        if (window.scrollY > (currentViewSize * 2 / 3)) {
            setAwake(true);
        } else {
            setAwake(false);
        };
    };
    
    // manually inserting props to each child components
    const NestedChildWithProps = Children.map(props.children, (child, index) => {
        const key = child.key ? `key-${child.key}` : `index-${index}`;
        return React.cloneElement(child, {key: key});
    });

    return (
        <Fragment>
            <header>
                <NavBar scrollState={scroll}
                        scrollSleep={sleep}
                        scrollAwake={awake}
                        disableSearch={props.disableSearch} />
            </header>
            <div onScroll={ScrollView} style={{height: '100%', width: '100%', overflow: 'hidden', position: 'relative'}}>
                {NestedChildWithProps}
            </div>
        </Fragment>
    );
};


BaseTemplate.defaultProps = {
    disableSearch: false
};


export default BaseTemplate;