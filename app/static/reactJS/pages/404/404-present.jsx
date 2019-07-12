import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
} from 'reactstrap';

import styles from './styles/404styles.module';
import errorImg from '../../../images/error/404error.png';


const Error404 = () => {
    return (
        <div className={styles.containerWrapper}>
        <Container className={styles.containerStyles}>
            <Row className='align-items-center mb-5'>
                <Col xs={12} md={12} lg={2}>
                    <img src={errorImg} className={styles.img} />
                </Col>
                <Col xs={12} md={12} lg={10}>
                    <h3 styles={styles.errorTitle}><strong style={{color: 'maroon'}}>Oops!</strong> The page cannot be found!</h3>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={12} lg={12}>
                    <p>Sorry for the inconvenience! Please send a message to our team regarding this.</p>
                    <p>Back to <NavLink to='/reactdev-home'>homepage</NavLink></p>
                    <br />
                    <br />
                    <p>Sincerely,</p>
                    <p>The smallWorld team</p>
                </Col>
            </Row>
        </Container>
        </div>
    );
};


export default Error404;