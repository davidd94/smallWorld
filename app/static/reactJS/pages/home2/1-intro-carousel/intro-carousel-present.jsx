import React from 'react';
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
            <h1><span><strong>Unlease</strong> your creativity to the <strong>world</strong></span></h1>
            <p>A social network platform for users to share their terrarium designs with others. A one-stop website that includes everything you need to know about the setup</p>

            <p><Button color="primary">Sign up</Button></p>
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

    return <UncontrolledCarousel items={images}
                                controls={false}
                                indicators={false}
                                className={styles.introBackground}
                                style={{height: props.windowHeight}} />
};

const CarouselTextOverlay = () => {
    return (
        <div></div>
    );
};

const IntroCarousel = (props) => {
    return (
        <section>
        <h3 className={styles.vr}>Welcome to smallWorld</h3>
            <ImageCarousel windowHeight={props.windowHeight} />
            <Container style={{height: props.windowHeight}}>
            <Row className={styles.introSlidertext} style={{height: props.windowHeight}} >
                <Col xs={6} style={{height: props.windowHeight}} >
                    <div className={styles.homeSlider} style={{height: props.windowHeight}} >
                        <IntroStatement />
                    </div>
                </Col>
                <Col xs={6}>
                    <CarouselTextOverlay />
                </Col>
            </Row>
            </Container>
        </section>
    );
};


export default IntroCarousel;