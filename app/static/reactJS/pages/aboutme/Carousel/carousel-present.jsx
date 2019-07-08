import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import '../../../../node_modules/react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import BGBio from '../../../../images/aboutme-bio.jpg';
import BGProg from '../../../../images/aboutme-space.jpg';
import BGFuture from '../../../../images/aboutme-program.jpg';

import styles from './styles/carouselStyles.module';


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

const CarouselBox = (props) => {
    return (
        <div className={styles.carouselWrapper}>
        <Carousel>
            <div className={styles.carouselItems}>
                <img src={BGBio} className={styles.carouselImg} />
                <div className={styles.carouselItemWrapper}>
                    <h2 className={styles.carouselTitle}>{items[0].caption}</h2>
                    <div className={styles.bodyText}>
                        <PerfectScrollbar>
                        <p>{items[0].altText}</p>
                        <p>{items[0].altText2}</p>
                        <p>{items[0].altText3}</p>
                        </PerfectScrollbar>
                    </div>
                    <div className={styles.carouselFooter}>
                        <a href="#" className={([styles.iconButton, styles.twitter]).join(' ')}><i className={([styles.iconTwitter, 'fab fa-twitter']).join(' ')} /><span></span></a>
                        <a href="#" className={([styles.iconButton, styles.facebook]).join(' ')}><i className={([styles.iconFacebook, 'fab fa-facebook-f']).join(' ')}/><span></span></a>
                        <a href="#" className={([styles.iconButton, styles.googlePlus]).join(' ')}><i className={([styles.iconGooglePlus, 'fab fa-google-plus-g']).join(' ')} /><span></span></a>
                        <a href="#" className={([styles.iconButton, styles.youtube]).join(' ')}><i className={([styles.iconYoutube, 'fab fa-youtube-square']).join(' ')} /><span></span></a>
                        <a href="#" className={([styles.iconButton, styles.pinterest]).join(' ')}><i className={([styles.iconPinterest, 'fab fa-pinterest']).join(' ')} /><span></span></a>
                    </div>
                </div>
            </div>
            <div className={styles.carouselItems}>
                <img src={BGProg} className={styles.carouselImg} />
                <div className={styles.carouselItemWrapper}>
                    <h2 className={styles.carouselTitle}>{items[1].caption}</h2>
                    <div className={styles.bodyText}>
                        <p>{items[1].altText}</p>
                        <p>{items[1].altText2}</p>
                        <p>{items[1].altText3}</p>
                    </div>
                    <div className={styles.carouselFooter}>
                        <a href="https://github.com/davidd94/smallWorld" target="_blank" className={([styles.iconButton, styles.github]).join(' ')}><i className={([styles.iconGithub, 'fab fa-github']).join(' ')} /><span></span></a>
                    </div>
                </div>
            </div>
            <div className={styles.carouselItems}>
                <img src={BGFuture} className={styles.carouselImg} />
                <div className={styles.carouselItemWrapper}>
                    <h2 className={styles.carouselTitle}>{items[2].caption}</h2>
                    <div className={styles.bodyText}>
                        <p>{items[2].altText}</p>
                        <p>{items[2].altText2}</p>
                        <p>{items[2].altText3}</p>
                    </div>
                    <div className={styles.carouselFooter}>
                        <a href="https://investmenTracker.info" target="_blank" className={([styles.iconButton, styles.invest]).join(' ')}><i className={([styles.iconInvest, 'fas fa-chart-line']).join(' ')} /><span></span></a>
                        <a href="http://dogoodies.shop" target="_blank" className={([styles.iconButton, styles.dog]).join(' ')}><i className={([styles.iconDog, 'fas fa-paw']).join(' ')} /><span></span></a>
                    </div>
                </div>
            </div>
        </Carousel>
        </div>
    );
};


export default CarouselBox;