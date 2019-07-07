import React, { useState, useEffect } from 'react';

import CarouselBox from './carousel-present';
import WOW from 'wow.js';
import BGBio from '../../../../images/aboutme-bio.jpg';
import BGProg from '../../../../images/aboutme-space.jpg';
import BGFuture from '../../../../images/aboutme-program.jpg';

const items = [
    {
        src: BGBio,
        altText: "Hello! First, I want to thank you for coming to my website. I am a passonionate self-taught full stack web developer. \
        My career has started off with a Bachelor of Science in Civil Engineer that focused on construction estimating and plan \
        developement for custom luxurious hillside homes. After working in the Construction/Civil Engineer field for two years, I've \
        come to realize that it was not the type of career I can and should pursue for the rest of my life. My passion was non-existent \
        which led me to soul search for a little bit. Programming was one of the few interesting options to test the waters. I first dabbled \
        in python and was immediately drawn to it... I started spending more hours each day learning.. and thus opened a new path in my life \
        into web development...",
        altText2: "Two months were spent learning Python, CSS/HTML, JavaScript (w/ jQuery), and SQL through Codecademy. Within the first few weeks \
        of learning python, I couldn't get enough of object oriented programming. Deciding to expand my knowledge a little more before starting my \
        first project, I've learned non-relational database (MongoDB) and python framework (Flask). All these combined formed a strong \
        foundation to start my first web devlopment project... my own personal stock portfolio called InvestmenTracker.",
        altText3: "",
        caption: 'About Me'
    },
    {
        src: BGProg,
        altText: 'My hobbies from childhood until today were to collect many varieties of carnivious and non-carnivorous plants, \
        reptiles, and fresh water fishes. Creative desert setups were made for my bearded dragon and leopard gecko. Unique and inspiring \
        terrariums for my carnivious plants. Nature overall seemed fascinating to me.',
        altText2: "My vision for this website is to allow anyone with an imaginative mind to easily display their beautiful setup online. \
        Sharing each other's awe-inspiring, creative and passionate work of art to the world is my goal. This social network website will provide users an \
        interactive and easily navigable interface that will contain all the necessary information to duplicate each other's projects \
        with minimal obstacles.",
        altText3: '',
        caption: 'The Path to Programming'
    },
    {
        src: BGFuture,
        altText: "Having great interest in investing, I thought it would be a great idea to create my \
        first project as my very own stock portfolio manager called InvestmenTracker. This whole website is made from \
        scratch meaning no bootstrap or any other code was used to create it. I believed this \
        would allow a deeper understanding of how each languages work. Although it is still incomplete, \
        I look forward to refactor my code by implenting new techniques I've learned from this \
        project. I've also learned how to host this project on my own Raspberry Pi server as you \
        will notice it is quite slow with certain task-heavy features (web scraping stock data).",
        altText2: "DoGoodies website is purely made using WordPress and imported plugins such as Elementor and WooCommerce. \
        A small time was spent learning how WordPress operated as it seems to be the most popular tool used \
        around the world to create basic websites. It definitely isn't my cup of tea as everything is pre-set \
        and imported thus very restricted on what I was able to do but still great to know about.",
        altText3: '',
        caption: 'Other Projects'
    }
]

const Carousel = () => {
    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState('');
    console.log('rendering....');
    useEffect(() => {
        const wow = new WOW();
        wow.init();
    });

    const onExiting = () => {
        setAnimate(true);
    };
    
    const onExited = () => {
        setAnimate(false);
    };
    
    const next = () => {
        if (animate) return;
        const nextIndex = index === items.length - 1 ? 0 : index + 1;
        setIndex(nextIndex);
    };
    
    const previous = () => {
        if (animate) return;
        const prevIndex = index === 0 ? items.length - 1 : index - 1;
        setIndex(prevIndex);
    };
    
    const goToIndex = (newIndex) => {
        if (animate) return;
        setIndex(newIndex);
    };

    return (
        <>
            <CarouselBox
                    items={items}
                    index={index}
                    onExiting={onExiting}
                    onExited={onExited}
                    next={next}
                    previous={previous}
                    goToIndex={goToIndex} />
        </>
    )
};


export default Carousel;