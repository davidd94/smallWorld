import React from 'react';

import ProfileHeaderPresent from './header/profileheader-present';
import ProfileBodyContainer from './body/body-container';
import ProfileFooterPresent from './footer/footer-present';
import ChatlistContainer from '../../../components/chatlist/chatlist-container';


const ProfileIndex = () => {
    return (
        <>
            <div style={{width: '100vw', height: '100%', position: 'relative', marginBottom: '55px'}}>
                <ProfileHeaderPresent />
                <ProfileBodyContainer />
            </div>
            <ProfileFooterPresent />
            <ChatlistContainer />
        </>
    );
};


export default ProfileIndex;