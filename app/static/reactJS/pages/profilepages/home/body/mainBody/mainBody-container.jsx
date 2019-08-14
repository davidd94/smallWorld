import React, { useState, useEffect } from 'react';
import WOW from 'wow.js';

import MainBodyPresent from './mainBody-present';


const MainBodyContainer = (props) => {
    const [bodyView, setBodyView] = useState(props.activeTab);
    
    useEffect(() => {
        const wow = new WOW();
        wow.init();
    }, [bodyView]);

    useEffect(() => {
        if (bodyView !== props.activeTab) {     
            setBodyView(props.activeTab);
        };
    });


    return <MainBodyPresent bodyView={bodyView} />
};


export default MainBodyContainer;