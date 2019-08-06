import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Container, Row, Col,
    Nav, NavItem
} from 'reactstrap';

import styles from './styles/bodyStyles.module';


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
                        <div className={styles.profileNav}>
                            <div className={styles.panel}>
                                <Nav pills={true} vertical={true} className={styles.navList}>
                                    <li onClick={() => props.handleActiveTab('profile')} style={props.activeTab === 'profile' ? ActiveTab : {}}><a><i className="fa fa-user"/>Profile</a></li>
                                    <li onClick={() => props.handleActiveTab('about')} style={props.activeTab === 'about' ? ActiveTab : {}}><a><i className="fa fa-info-circle"/>About</a></li>
                                    <li onClick={() => props.handleActiveTab('projects')} style={props.activeTab === 'projects' ? ActiveTab : {}}><a><i className="fas fa-tasks"/>Projects</a></li>
                                    <li onClick={() => props.handleActiveTab('followers')} style={props.activeTab === 'followers' ? ActiveTab : {}}><a><i className="fa fa-users"/>Followers</a></li>
                                    <li onClick={() => props.handleActiveTab('message')} style={props.activeTab === 'message' ? ActiveTab : {}}><a><i className="fas fa-envelope"/>Message</a></li>
                                </Nav>
                            </div>
                        </div>
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