import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';


const CarouselBox = (props) => {
    return (
        <UncontrolledCarousel items={props.images}
                                autoPlay={false}
                                interval={false} />
    );
};


export default CarouselBox;