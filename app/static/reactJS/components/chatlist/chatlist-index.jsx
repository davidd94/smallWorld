import React, { useState, useEffect } from 'react';
import socket from '../../socketio';
import { ChatlistSSE } from '../../sse';

import ChatlistContainer from './chatlist-container';
import ChatlistMinimized from './chatlistMini-present';
import ChatlistMsgContainer from './chatlistMsg-container';


const ChatlistIndex = () => {
    const [mode, setMode] = useState('anonymous');
    const [minimized, setMinimized] = useState(false);
    const [chatbox, setChatbox] = useState(false);

    console.log('CHATINDEX REDNERING !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    useEffect(() => {
        socket.on('disconnect', (response) => {
            if (response === 'Please log in.') {
                setMode('anonymous');
            };
        });

        return () => {
            socket.removeListener('disconnect');
        };
    }, []);
    
    const handleMode = (type) => {
        if (type === 'online' || type === 'offline' || type === 'invisible') {
            socket.emit(type);
            // listening used for testing only
            //socket.on(type);
            setMode(type);
            if (type === 'offline') {
                let eventStatus = ChatlistSSE.readyState;
                if (eventStatus !== 2) {
                    console.log('manually closing SSE...');
                    ChatlistSSE.close();
                };
            } else if (type === 'online') {
                let eventStatus = ChatlistSSE.readyState;
                if (eventStatus === 2) {
                    console.log('manually opening SSE...');
                    let token = localStorage.getItem('token');
                    new EventSource('/api/chat/list_retrieval/' + (token));
                };
            };
        };
    };

    const handleModeInit = (type) => {
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
            <ChatlistContainer handleMode={handleMode}
                                handleModeInit={handleModeInit}
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


export default ChatlistIndex;