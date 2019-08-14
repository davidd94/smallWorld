import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Container, Row, Col,
    Nav, NavItem
} from 'reactstrap';

import BodyNav from './profileNav/bodyNav-present';


const ActiveTab = {
    background: '#f8f7f5',
    borderLeft: '5px solid #3ca2e0'
};

const ProfileBodyPresent = (props) => {
    return (
        <Container>
            <Col md={8} offset={{ md: 4 }}>
                <Row className='text-center'>
                    <Col lg={4}>
                        <BodyNav />
                    </Col>
                    <Col lg={8}>
                        <div>center data</div>
                    </Col>
                </Row>
            </Col>
        </Container>
    );
};


export default ProfileBodyPresent;