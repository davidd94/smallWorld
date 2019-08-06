import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Button,
    UncontrolledCarousel
} from 'reactstrap';

import styles from './styles/intro-carousel.module';


const IntroStatement = () => {
    return (
        <div className={styles.introTextBox}>
            <span className={styles.introSubheading}>Welcome to smallWorld</span>
            <p className={styles.introText}><span><strong>Unlease</strong> your creativity to the <strong>world</strong></span></p>
            <p>A social network platform for users to share their terrarium designs with others. A one-stop website that includes everything you need to know about each unique setup.</p>

            <p><Button color="primary"><NavLink to="/reactdev-login">Sign up</NavLink></Button></p>
        </div>
    );
};

const ImageCarousel = (props) => {
    const images = [
        {
            src: 'static/images/bg_1.jpg',
            altText: '',
            caption: '',
            header: ''
        },
        {
            src: 'static/images/bg_2.jpg',
            altText: '',
            caption: '',
            header: ''
        },
        {
            src: 'static/images/bg_3.jpg',
            altText: '',
            caption: '',
            header: ''
        }
    ];

    return (
        <div className={styles.carouselWrapper} style={{height: props.windowHeight}}>
            <UncontrolledCarousel items={images}
                                controls={false}
                                indicators={false}
                                className={styles.introBackground}
                                style={{height: props.windowHeight}} />
        </div>
    )
};

const CarouselTextOverlay = () => {
    return (
        <div></div>
    );
};

const IntroCarousel = (props) => {
    return (
        <section style={{padding: 0, position: 'relative', zIndex: 1}}>
        <h3 className={styles.vr}>Welcome to smallWorld</h3>
            <ImageCarousel windowHeight={props.windowHeight} />
            <Container className={styles.introContainer} style={{height: props.windowHeight}}>
            <Row className={styles.introSlidertext} style={{height: props.windowHeight}} >
                <Col xs={12} lg={6} style={{height: props.windowHeight}} >
                    <div className={styles.homeSlider} style={{height: props.windowHeight}} >
                        <IntroStatement />
                    </div>
                </Col>
                <Col xs={12} lg={6}>
                    <CarouselTextOverlay />
                </Col>
            </Row>
            </Container>
        </section>
    );
};


export default IntroCarousel;