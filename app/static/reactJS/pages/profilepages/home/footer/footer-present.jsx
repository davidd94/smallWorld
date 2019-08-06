import React from 'react';
import {
    Container
} from 'reactstrap';
import { NavLink } from 'react-router-dom';


const footerStyle = {
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        marginTop: '12px',
        fontSize: '0.8rem'
    }
}


const ProfileFooterPresent = () => {
    return (
        <Container fluid={true} className='text-center' style={footerStyle.footer}>
            <NavLink to='/reactdev-terms'> Terms of Use </NavLink> |
            <NavLink to='/reactdev-policy'> Privacy Policy </NavLink> |
            <NavLink to='/reactdev-contact'> Contact </NavLink> |
            <NavLink to='/reactdev-aboutme'> About </NavLink>
            <p>Copyright © Company - All rights reserved</p>
        </Container>
    );
};


export default ProfileFooterPresent;