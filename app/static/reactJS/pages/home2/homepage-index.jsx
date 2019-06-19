import React, { Fragment } from 'react';

import IntroCarouselContainer from './1-intro-carousel/intro-carousel-container';
import ContactSection from './3-contactus/contactus-present';


const HomepageLanding = () => {
    return (
        <Fragment>
            <IntroCarouselContainer />
            <ContactSection />
        </Fragment>
    );
};


export default HomepageLanding;