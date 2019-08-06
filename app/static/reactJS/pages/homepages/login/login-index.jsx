import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';

import BGImg from '../../../../images/homepage-background.jpg'
import FeedbackAlert from './FeedbackAlert/FeedbackAlert-present';
import UserLoginTabsSection from './UserLoginTabs/UserLoginTabs-present';
import styles from './_styles/loginpageStyles.module';


const LoginContainer = {
    backgroundImage: `url(${BGImg})`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center'
}


const UserLoginPage = () => {
    const [customError, setCustomError] = useState('none');
    const handleCustomError = (error) => {
        setCustomError(error);
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            return <Redirect to='/reactdev-home' />;
        };
    });

    return (
        <div style={LoginContainer} className={styles.loginContainerWrapper}>
            <Container>
                <Row className='justify-content-center'>
                    <Col md={12} lg={5} offset={{ lg: 7 }}>
                        <FeedbackAlert customError={customError}
                                    handleCustomError={handleCustomError} />
                    </Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col md={12} lg={6} offset={{ lg: 6}}>
                        <UserLoginTabsSection handleCustomError={handleCustomError}
                                                enableInnerErrorMsg={false} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default UserLoginPage;