import React from 'react';
import { Nav } from 'reactstrap';

import styles from './_styles/profileNavStyles.module';


const ActiveTab = {
    background: '#f8f7f5',
    borderLeft: '5px solid #3ca2e0'
};

const ProfileNavPresent = (props) => {
    return (
        <div className={styles.profileNav}>
            <div className={styles.panel}>
                <Nav pills={true} vertical={true} className={styles.navList}>
                    <li onClick={() => props.handleActiveTab('projectfeed')} onMouseEnter={() => props.handleNavHover('projectfeed')} onMouseLeave={() => props.handleNavHover(false)} style={(props.activeTab === 'projectfeed' || props.hoverTab === 'projectfeed') ? ActiveTab : {}}><a><i className="fa fa-info-circle"/>Latest Updates</a></li>
                    <li onClick={() => props.handleActiveTab('profile')} onMouseEnter={() => props.handleNavHover('profile')} onMouseLeave={() => props.handleNavHover(false)} style={(props.activeTab === 'profile' || props.hoverTab === 'profile') ? ActiveTab : {}}><a><i className="fa fa-user"/>Profile</a></li>
                    <li onClick={() => props.handleActiveTab('projects')} onMouseEnter={() => props.handleNavHover('projects')} onMouseLeave={() => props.handleNavHover(false)} style={(props.activeTab === 'projects' || props.hoverTab === 'projects') ? ActiveTab : {}}><a><i className="fas fa-tasks"/>Projects</a></li>
                    <li onClick={() => props.handleActiveTab('followers')} onMouseEnter={() => props.handleNavHover('followers')} onMouseLeave={() => props.handleNavHover(false)} style={(props.activeTab === 'followers' || props.hoverTab === 'followers') ? ActiveTab : {}}><a><i className="fa fa-users"/>Followers</a></li>
                    <li onClick={() => props.handleActiveTab('message')} onMouseEnter={() => props.handleNavHover('message')} onMouseLeave={() => props.handleNavHover(false)} style={(props.activeTab === 'message' || props.hoverTab === 'message')? ActiveTab : {}}><a><i className="fas fa-envelope"/>Message</a></li>
                </Nav>
            </div>
        </div>
    );
};


export default ProfileNavPresent;