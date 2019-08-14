import React, { useState, useContext, useEffect } from 'react';

import ChatlistPresent from './chatlist-present';
import ChatlistMinimized from './chatlistMini-present';
import ChatlistMsgContainer from './chatlistMsg-container';

import socket from '../../socketio';


const ChatlistContainer = () => {
    const [mode, setMode] = useState('online');
    const [minimized, setMinimized] = useState(false);
    const [chatbox, setChatbox] = useState(false);

    //const chatlistData = useContext(UserChatlistContext);
    
    useEffect(() => {
        let chatStatus;
        socket.on('connect', data => {console.log(data); chatStatus = data;});
        
        if (chatStatus === 'online') {
            setMode('online');
        } else if (chatStatus === 'offline') {
            setMode('offline');
            setMinimized(true);
        } else if (chatStatus === 'invisible') {
            setMode('invisible');
        } else {
            setMode('anonymous');
            setMinimized(true);
        };
    }, []);

    const handleMode = (type) => {
        setMode(type);
    };
    
    const handleMinimize = () => {
        setMinimized(!minimized);
    };

    const handleChatbox = (username) => {
        setChatbox(username);
    };

    return (
        <>
            <ChatlistPresent handleMode={handleMode}
                                mode={mode}
                                minimized={minimized}
                                handleMinimize={handleMinimize}
                                handleChatbox={handleChatbox}
                                chatbox={chatbox} />
            <ChatlistMinimized handleMode={handleMode}
                                mode={mode}
                                minimized={minimized}
                                handleMinimize={handleMinimize} />
            <ChatlistMsgContainer handleChatbox={handleChatbox}
                                chatbox={chatbox} />
        </>
    );
};


export default ChatlistContainer;