import React from 'react';
import {Carousel,
        CarouselItem,
        CarouselIndicators,
        CarouselControl,
} from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import styles from './styles/carouselStyles.module';


const CarouselBox = (props) => {

    const slides = props.items.map((item) => {
        let SlideFooter = (props) => {
            if (props.type == 'About Me') {
                return (
                    <div className={styles.carouselFooter}>
                        <a href="#" className={([styles.iconButton, styles.twitter]).join(' ')}><i className={([styles.iconTwitter, 'fab fa-twitter']).join(' ')} /><span></span></a>
                        <a href="#" className={([styles.iconButton, styles.facebook]).join(' ')}><i className={([styles.iconFacebook, 'fab fa-facebook-f']).join(' ')}/><span></span></a>
                        <a href="#" className={([styles.iconButton, styles.googlePlus]).join(' ')}><i className={([styles.iconGooglePlus, 'fab fa-google-plus-g']).join(' ')} /><span></span></a>
                        <a href="#" className={([styles.iconButton, styles.youtube]).join(' ')}><i className={([styles.iconYoutube, 'fab fa-youtube-square']).join(' ')} /><span></span></a>
                        <a href="#" className={([styles.iconButton, styles.pinterest]).join(' ')}><i className={([styles.iconPinterest, 'fab fa-pinterest']).join(' ')} /><span></span></a>
                    </div>
                );
            } else if (props.type == 'The Path to Programming') {
                return (
                    <div className={styles.carouselFooter}>
                        <a href="https://github.com/davidd94/smallWorld" target="_blank" className={([styles.iconButton, styles.github]).join(' ')}><i className={([styles.iconGithub, 'fab fa-github']).join(' ')} /><span></span></a>
                    </div>
                );
            } else if (props.type == 'Other Projects') {
                return (
                    <div className={styles.carouselFooter}>
                        <a href="https://investmenTracker.info" target="_blank" className={([styles.iconButton, styles.invest]).join(' ')}><i className={([styles.iconInvest, 'fas fa-chart-line']).join(' ')} /><span></span></a>
                        <a href="http://dogoodies.shop" target="_blank" className={([styles.iconButton, styles.dog]).join(' ')}><i className={([styles.iconDog, 'fas fa-paw']).join(' ')} /><span></span></a>
                    </div>
                );
            } else {
                return <></>
            };
        };
        return (
            <CarouselItem
                onExiting={props.onExiting}
                onExited={props.onExited}
                key={item.src}
                className={styles.carouselItems}>
                <h2 className={styles.carouselTitle}>{item.caption}</h2>
                <div className={styles.bodyText}>
                    <PerfectScrollbar>
                    <p>{item.altText}</p>
                    <p>{item.altText2}</p>
                    <p>{item.altText3}</p>
                    </PerfectScrollbar>
                </div>
                <SlideFooter type={item.caption} className={styles.carouselFooter} />
                <img src={item.src} alt={item.altText} className={styles.carouselImg} />
            </CarouselItem>
        );
    });

    return (
        <div className={styles.carouselWrapper}>
            <Carousel
            interval={false}
            activeIndex={props.index}
            next={props.next}
            previous={props.previous}
            className={styles.carousel}>
                <CarouselIndicators items={props.items} activeIndex={props.index} onClickHandler={props.goToIndex} />
                {slides}
                <CarouselControl direction="prev" directionText="Previous" onClickHandler={props.previous} className={styles.carouselHandle} />
                <CarouselControl direction="next" directionText="Next" onClickHandler={props.next} className={styles.carouselHandle} />
            </Carousel>
        </div>
    );
};


export default CarouselBox;