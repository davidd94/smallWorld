import React from 'react';
import { Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';

const headerStyle = {
    container: {
        width: '100%',
        height: '22rem',
        backgroundColor: '#3ca2e0',
        paddingTop: '5rem',
        overflow: 'hidden'
    },
    userImageBox: {
        color: '#337ab7',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
    userImage: {
        marginTop: '20px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        border: '10px solid rgba(255,255,255,0.3)',
        maxWidth: '100%',
        verticalAlign: 'middle',
        textAlign: 'center'
    },
    userName: {
        color: '#fff',
        textRendering: 'optimizelegibility',
        textShadow: '0 0 3px rgba(0,0,0,.8)',
        fontSize: '2.25rem',
        textAlign: 'center'
    },
    userBio: {
        color: '#fff',
        textRendering: 'optimizelegibility',
        textShadow: '0 0 3px rgba(0,0,0,.8)',
        textAlign: 'center',
        marginBottom: '0.8rem'
    }
}

const ProfileHeaderPresent = () => {
    return (
        <Row className='text-center'>
            <div style={headerStyle.container}>
                <NavLink style={headerStyle.userImageBox} to='/reactdev-profile'><img style={headerStyle.userImage} src="https://en.gravatar.com/userimage/147142567/42d4c6928e4f936f32cd89731c57c694.jpg?size=100"/></NavLink>
                <h1 style={headerStyle.userName}>User Name</h1>
                <p style={headerStyle.userBio}>User Bio here.....</p>
            </div>
        </Row>
    );
};


export default ProfileHeaderPresent;