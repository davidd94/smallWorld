import React from 'react';
import {Container,
        Row,
        Col,
} from 'reactstrap';

import HomepageCarousel from './carousel/carousel-present';
import HomeLogin1 from './login/home-login-present';
import styles from './styles/home-specific.module';


const HomeAnonymous = () => {
    return (
        <div className={styles.homepageContainerWrapper}>
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={6} className='mt-5' >
                        <HomepageCarousel />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6} className='mt-5' >
                        <HomeLogin1 />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default HomeAnonymous;