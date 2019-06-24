import React, { useState, useEffect } from 'react';

import BaseTemplate from './base-present';


const BaseTemplateContainer = (props) => {
    let currentViewSize = window.innerHeight;
    
    const [scroll, setScroll] = useState(false);
    const [sleep, setSleep] = useState(false);
    const [awake, setAwake] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', ScrollView);
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

    return <BaseTemplate onScroll={ScrollView}
                        routers={props.children}
                        scrollState={scroll}
                        scrollSleep={sleep}
                        scrollAwake={awake} />
};


export default BaseTemplateContainer;