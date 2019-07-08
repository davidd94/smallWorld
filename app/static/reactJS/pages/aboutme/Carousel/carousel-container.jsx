import React, { useEffect } from 'react';

import CarouselBox from './carousel-present';
import WOW from 'wow.js';


const Carousel = () => {
    console.log('rendering....');
    useEffect(() => {
        const wow = new WOW();
        wow.init();
    });

    return <CarouselBox />
};


export default Carousel;