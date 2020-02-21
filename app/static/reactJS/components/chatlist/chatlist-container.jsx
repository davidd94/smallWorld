import React, { useState, useEffect, useContext } from 'react';
import { ChatlistSSE } from '../../sse';

import ChatlistPresent from './chatlist-present';
import { UserChatlistContext } from '../_context/UserContext';
import socket from '../../socketio';


const ChatlistContainer = (props) => {
    const [chatlist, setChatlist] = useState(false);
    const [SSE, setSSE] = useState(false);
    
    const UserStatus = useContext(UserChatlistContext);

    var events;
    
    useEffect(() => {
        let UserInitialStatus = (UserStatus === false ? false : UserStatus.UserLimitedInfo[0].online);
        
        if (UserInitialStatus) {
            props.handleModeInit(UserInitialStatus);
        } else {
            props.handleMinimize();
        };
    }, []);

    useEffect(() => {
        if (props.mode === 'online' || props.mode === 'invisible') {
            events = (SSE ? SSE : ChatlistSSE);
            if (events.readyState === 2) {
                console.log('auto reconnecting SSE....');
                const newToken = localStorage.getItem('token');
                var newEvent = new EventSource('/api/chat/list_retrieval/' + (newToken), {max_retry_time: 8000});
                setSSE(newEvent);
            };

            // DATA RECEIVED
            events.onmessage = (response) => {
                if (response.data) {
                    setChatlist(JSON.parse(response.data));
                };
            };
        } else {
            console.log('failed to connect to websocket...');
            // CLOSES SSE CONNECTION VIA USERS GOING OFFLINE MANUALLY
            if (events) {
                console.log('manually closing SSE....');
                events.close();
            };
        };

        return () => {
            if (SSE && props.mode === 'offline') {
                SSE.close();
                setSSE(false);
            };
        };
    });

    const handleFav = (username) => {
        console.log('favoriting...');
        socket.emit('favorite', username);
    };

    const handleUnfav = (username) => {
        console.log('unfavoriting...');
        socket.emit('unfavorite', username);
    };

    return <ChatlistPresent handleMode={props.handleMode}
                            mode={props.mode}
                            minimized={props.minimized}
                            handleMinimize={props.handleMinimize}
                            handleChatbox={props.handleChatbox}
                            chatbox={props.chatbox}
                            chatlist={chatlist}
                            handleFav={handleFav}
                            handleUnfav={handleUnfav} />
};


export default ChatlistContainer;