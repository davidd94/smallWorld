import React, { useContext } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import {
    Container,
    Navbar, NavLink, NavbarToggler, Collapse, Nav, NavItem,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    InputGroup, Input
} from 'reactstrap';

import styles from './styles/navbar.module';
import { UserContext } from '../../../components/_context/UserContext';


const NavBarSection = React.forwardRef((props, ref) => {
    const UserInfo = useContext(UserContext);
    
    var navbarStyle = '';
    var navbarSleep = '';
    var navbarAwake = '';
    var navbarSearchIconStyle;
    var navbarSearchBoxStyle;
    
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

    if (props.search) {
        navbarSearchIconStyle = (["fas fa-search", 'wow fadeOutRight', styles.navSearchIconHidden]).join(' ');
        navbarSearchBoxStyle = styles.navSearchBox;
    } else {
        navbarSearchIconStyle = (["fas fa-search", styles.navSearchIcon]).join(' ');
        navbarSearchBoxStyle = styles.navSearchBoxHidden;
    };

    const RenderLoginBtn = () => {
        if (UserInfo && localStorage.getItem('token')) {
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
            <Container className={styles.container}>
                <NavLink href='#' className={styles.navbarBrand} >small<span className={styles.navbrandSpan}>World</span></NavLink>
                <NavbarToggler onClick={props.onToggle} className={styles.navbarToggler} />

                <Collapse isOpen={props.open} navbar className='justify-content-start'>
                    <Nav className={[styles.navbarNav, 'float-xs-right'].join(' ')} navbar>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-home" activeClassName="active" activeClassName={styles.activeItem}><span className={styles.navlinkSpan}>Home</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-aboutme"><span className={styles.navlinkSpan}>About</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-explore"><span className={styles.navlinkSpan}>Explore</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-blog"><span className={styles.navlinkSpan}>Blog</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-subscriptions"><span className={styles.navlinkSpan}>Subscriptions</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <RouterLink className={styles.navLink} to="/reactdev-twitterAPI"><span className={styles.navlinkSpan}>TwitterAPI</span></RouterLink>
                        </NavItem>
                        <NavItem>
                            <a className={styles.navLink} href="/"><span className={styles.navlinkSpan} style={{fontWeight: 600, color: 'red'}}>Flask(jinja2)</span></a>
                        </NavItem>
                    </Nav>
                </Collapse>
                <Collapse isOpen={props.open} navbar className={styles.navSearchWrapper}>
                    <Nav navbar className={styles.navbarNav}>
                        <RenderLoginBtn />
                    </Nav>
                    <Nav navbar className={styles.navbarNav} style={props.disableSearch ? {display: 'none'} : {}}>
                        <InputGroup className={navbarSearchBoxStyle}>
                            <Input innerRef={ref} onBlur={() => {props.searchToggle(false)}} onKeyUp={props.handleSearch} onChange={props.handleSearchInput} />
                        </InputGroup>
                        <i onClick={() => {props.searchToggle(true)}} className={navbarSearchIconStyle} />
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
});


export default NavBarSection;