import React, { useState } from 'react';
import {
    Container, Row, Col,
} from 'reactstrap';

import ProfileNavContainer from './profileNav/profileNav-container';
import FollowersNavPresent from './followersNav/followersNav-present';
import ProjectsNavPresent from './projectsNav/projectsNav-present';
import MainBodyContainer from './mainBody/mainBody-container';


const ProfileBodyContainer = () => {
    const [activeTab, setActiveTab] = useState('projectfeed');

    const handleActiveTab = (tab) => {
        setActiveTab(tab);
    };


    return (
        <Container>
            <Col md={10} offset={{ md: 2 }}>
                <Row className='text-center'>
                    <Col lg={4}>
                        <ProfileNavContainer handleActiveTab={handleActiveTab}
                                    activeTab={activeTab} />
                        <FollowersNavPresent />
                        <ProjectsNavPresent />
                    </Col>
                    <Col lg={8} style={{marginTop: '30px'}}>
                        <MainBodyContainer activeTab={activeTab} />
                    </Col>
                </Row>
            </Col>
        </Container>
    );
};


export default ProfileBodyContainer;