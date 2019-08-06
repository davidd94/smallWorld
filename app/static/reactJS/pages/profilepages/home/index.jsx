import React from 'react';
import ProfileHeaderPresent from './header/profileheader-present';
import ProfileBodyContainer from './body/body-container';
import ProfileFooterPresent from './footer/footer-present';


const ProfileIndex = () => {
    return (
        <>
            <div style={{width: '100vw', height: '100%'}}>
                <ProfileHeaderPresent />
                <ProfileBodyContainer />
            </div>
            <ProfileFooterPresent />
        </>
    );
};


export default ProfileIndex;