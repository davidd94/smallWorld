import React from 'react';

import CarouselBox from './carousel-present';
// THIS IS THE DEFAULT CONTAINER COMP. USE A NEW ONE FOR CUSTOM IMAGES

const carouselImages = [
  {
    src: '../../../../static/images/homepage-aquarium-zen.jpg',
    altText: '',
    caption: 'Find peace within your creativity',
    header: ''
  },
  {
    src: '../../../../static/images/homepage-terrarium-desert.jpg',
    caption: ''
  },
  {
    src: '../../../../static/images/homepage-terrarium-waterfall.jpg',
    caption: ''
  }
];

const Carousel = () => {
    return <CarouselBox images={carouselImages} />
};


export default Carousel;