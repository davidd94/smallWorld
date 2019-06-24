import React from 'react';

import IntroCarousel from './intro-carousel-present';




const IntroCarouselContainer = () => {

    const heightSize = () => {
        return window.innerHeight;
    };

    return <IntroCarousel windowHeight={heightSize()} />
};


export default IntroCarouselContainer;