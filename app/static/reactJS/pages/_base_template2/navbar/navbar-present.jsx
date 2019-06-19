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


const NavBar = () => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    return (
        <Navbar expand='lg' dark className={styles.ftcoNavbarLight} >
            <Container className={styles.container} >
                <NavLink href='#' className={styles.navbarBrand} >small<span className={styles.navbrandSpan}>World</span></NavLink>
                <NavbarToggler onClick={toggle} className={styles.navbarToggler} />

                <Collapse isOpen={open} navbar>
                    <Nav className={[styles.navbarNav, 'ml-auto'].join(' ')} navbar>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#" activeClassName="active" activeClassName={styles.activeItem}><span className={styles.navlinkSpan}>Home</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#"><span className={styles.navlinkSpan}>Explore</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#"><span className={styles.navlinkSpan}>About</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#"><span className={styles.navlinkSpan}>Blog</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#"><span className={styles.navlinkSpan}>Contact</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="#"><span className={styles.navlinkSpan}>Subscriptions</span></RouterLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
};


export default NavBar;