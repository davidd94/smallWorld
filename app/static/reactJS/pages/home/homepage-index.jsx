import React, { Fragment } from 'react';

import IntroCarouselContainer from './1-intro-carousel/intro-carousel-container';
import DetailSection from './2-sitedetails/sitedetails-container';
import AboutUs from './5-aboutus/aboutus-present';
import ContactSection from './8-contactus/contactus-present';
import FooterSection from './10-footer/footer-present';


const HomepageLanding = () => {
    return (
        <Fragment>
            <IntroCarouselContainer />
            <DetailSection />
            <AboutUs />
            <ContactSection />
            <FooterSection />
        </Fragment>
    );
};


export default HomepageLanding;