import React, { useState, Fragment } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavLink as NavLinkStrap,
    NavItem,
    InputGroup,
    Input
} from 'reactstrap';

import { CustomNavItem } from './styles/navbar-common';
import styles from './styles/navbar-specific.module';


const NavBarItems = () => {
  return (
    <Fragment>
      <NavItem>
        <CustomNavItem to='/testingreact' activeClassName='selected' activeClassName={styles.activeItem}>Home</CustomNavItem>
      </NavItem>
      <NavItem>
        <CustomNavItem to='/meep' activeClassName={styles.activeItem}>Explore</CustomNavItem>
      </NavItem>
      <NavItem>
        <CustomNavItem to='/about' activeClassName={styles.activeItem}>About</CustomNavItem>
      </NavItem>
      <NavItem>
        <CustomNavItem to='/subscriptions' activeClassName={styles.activeItem}>Subscriptions</CustomNavItem>
      </NavItem>
    </Fragment>
  );
};


const NavBar = () => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    return (
      <Navbar className={styles.navbarContainer} expand="md">
        <NavbarBrand className={styles.navbarTitle} href="/">smallWorld</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={open} navbar>
          <Nav className="mr-auto" navbar>
            <NavBarItems />
          </Nav>
          <Nav navbar>
            <NavItem>
              <NavLinkStrap href='/login' className={styles.navbarLogin} >Login</NavLinkStrap>
            </NavItem>
            <NavItem>
              <InputGroup>
                <Input placeholder="Search projects" />
              </InputGroup>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
};


export default NavBar;