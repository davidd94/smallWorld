import React, { useState, useContext } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import {
    Container,
    Navbar, NavLink, NavbarToggler, Collapse, Nav, NavItem,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import styles from './styles/navbar.module';
import { UserContext } from '../../../components/_context/UserContext';


const NavBarSection = (props) => {
    
    const UserInfo = useContext(UserContext);
    const [open, setOpen] = useState(false);
    console.log(UserInfo);
    const onToggle = () => {
        setOpen(!open);
    };

    var navbarStyle = '';
    var navbarSleep = '';
    var navbarAwake = '';
    
    if (props.scrollState == true) {
        navbarStyle = styles.scrolled;
        navbarSleep = '';
    } 
    if (props.scrollSleep == true) {
        navbarStyle = styles.scrolled;
        navbarSleep = styles.sleep;
        navbarAwake = '';
    } 
    if (props.scrollAwake == true) {
        navbarStyle = styles.scrolled;
        navbarSleep = styles.sleep;
        navbarAwake = styles.awake;
    };
    
    const RenderLoginBtn = () => {
        if (UserInfo) {
            return (
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret className={styles.navLinkLoggedin}>{UserInfo.username}</DropdownToggle>
                    <DropdownMenu right={false}>
                        <DropdownItem tag={RouterLink} to='/reactdev-edituser'>Edit</DropdownItem>
                        <DropdownItem tag={RouterLink} to='/reactdev-acctsettings'>Account Settings</DropdownItem>
                        <DropdownItem tag={RouterLink} to='/reactdev-inbox'>Inbox</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={props.handleLogOut}>Logout</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            );
        } else {
            return <RouterLink className={styles.navLink} to="/reactdev-login"><span className={styles.navLinkLogin}>Login</span></RouterLink>
        };
    };
    
    return (
        <Navbar expand='lg' dark className={[styles.ftcoNavbarLight, navbarStyle, navbarSleep, navbarAwake].join(' ')}>
            <Container className={styles.container} >
                <NavLink href='#' className={styles.navbarBrand} >small<span className={styles.navbrandSpan}>World</span></NavLink>
                <NavbarToggler onClick={onToggle} className={styles.navbarToggler} />

                <Collapse isOpen={open} navbar className='justify-content-start'>
                    <Nav className={[styles.navbarNav, 'float-xs-right'].join(' ')} navbar>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-home" activeClassName="active" activeClassName={styles.activeItem}><span className={styles.navlinkSpan}>Home</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#"><span className={styles.navlinkSpan}>Explore</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-acctsettings"><span className={styles.navlinkSpan}>About</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-404"><span className={styles.navlinkSpan}>Blog</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/BOGUS"><span className={styles.navlinkSpan}>Contact</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-subscriptions"><span className={styles.navlinkSpan}>Subscriptions</span></RouterLink>
                        </NavItem>
                    </Nav>
                </Collapse>
                <Collapse isOpen={open} navbar className='justify-content-end'>
                    <Nav navbar className={styles.navbarNav}>
                        <RenderLoginBtn />
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
};


export default NavBarSection;