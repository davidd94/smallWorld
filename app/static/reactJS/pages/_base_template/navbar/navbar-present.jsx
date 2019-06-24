import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    Container,
    NavLink,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
} from 'reactstrap';

import styles from './styles/navbar.module';


const NavBar = (props) => {
    const [open, setOpen] = useState(false);

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

    return (
        <Navbar expand='lg' dark className={[styles.ftcoNavbarLight, navbarStyle, navbarSleep, navbarAwake].join(' ')}>
            <Container className={styles.container} >
                <NavLink href='#' className={styles.navbarBrand} >small<span className={styles.navbrandSpan}>World</span></NavLink>
                <NavbarToggler onClick={onToggle} className={styles.navbarToggler} />

                <Collapse isOpen={open} navbar className='justify-content-end'>
                    <Nav className={[styles.navbarNav, 'float-xs-right'].join(' ')} navbar>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-home" activeClassName="active" activeClassName={styles.activeItem}><span className={styles.navlinkSpan}>Home</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#"><span className={styles.navlinkSpan}>Explore</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#"><span className={styles.navlinkSpan}>About</span></RouterLink>
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
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-login"><span className={styles.navLinkLogin}>Login</span></RouterLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
};


export default NavBar;