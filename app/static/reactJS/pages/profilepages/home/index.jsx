import React, { useEffect } from 'react';
import { ChatlistSSE } from '../../../sse';

import ProfileHeaderPresent from './header/profileheader-present';
import ProfileBodyContainer from './body/body-container';
import ProfileFooterPresent from './footer/footer-present';
import ChatlistIndex from '../../../components/chatlist/chatlist-index';
import QueryUserlist from '../../../components/_queryinfo/userChatlist';


const ProfileIndex = () => {
    
    useEffect(() => {
        return () => {
            // CLOSES SSE CONNECTION AUTOMATICALLY WHEN USERS CLOSES BROWSER OR GOES TO ANOTHER PAGE
            let events = ChatlistSSE;
            console.log(events.readyState);
            const gg = 5;
            let me = gg;
            if (events) {
                console.log('auto closing SSE....');
                events.close();
            };
        };
    }, []);

    return (
        <QueryUserlist>
            <div style={{width: '100vw', height: '100%', position: 'relative', marginBottom: '55px'}}>
                <ProfileHeaderPresent />
                <ProfileBodyContainer />
            </div>
            <ProfileFooterPresent />
            <ChatlistIndex />
        </QueryUserlist>
    );
};


export default ProfileIndex;