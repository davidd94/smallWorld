import React, { useState, useEffect, useRef } from 'react';
import socket from '../../socketio';

import ChatlistMsgPresent from './chatlistMsg-present';


const tokenRenewal = async () => {
    // initialize async request to retrieve new token
   return await fetch('/api/reauth_token', {
       method: 'POST',
       credentials: 'include',
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({'old_token': oldToken})
   })
   .then(serverResponse => {
       serverResponse.json()
       .then((refreshResponse) => {
           if (refreshResponse != 'Failed to reauth. Please log in again.') {
               localStorage.setItem('token', refreshResponse);
           } else {
               localStorage.removeItem('token');
           };
       });
   });
};


const ChatlistMsgContainer = (props) => {
    const [chatboxMinimized, setChatboxMinimized] = useState(false);
    const [chatHistory, setChatHistory] = useState(false);
    const [messageOut, setMessageOut] = useState(false);
    const [messageIn, setMessageIn] = useState(false);

    const msgRef = useRef();
    const chatHistoryRef = useRef();
    const refs = {
        ref1: msgRef,
        ref2: chatHistoryRef
    };
    
    useEffect(() => {
        console.log('attempting to opening chatroom for....' + props.chatbox);
        if (props.chatbox !== false) {
            setChatHistory('Loading...');
            socket.emit('join', {'username': props.chatbox});
            socket.on('join', (responses) => {
                setChatHistory(responses);
            });
        };
        
        return () => {
            if (props.chatbox !== false) {
                console.log('attempting to close chatroom for .....' + props.chatbox);
                socket.emit('leave', {'username': props.chatbox});

                setChatHistory(false);
                setMessageIn(false);
                socket.removeListener('join');
                socket.removeListener('leave');
            };
        };
    }, [props.chatbox]);
    
    useEffect(() => {
        socket.on('message', (response) => {
            if (response !== 'Failed to send message...') {
                setMessageIn(response);
            };
        });

        return () => {
            socket.removeListener('message');
        }
    }, []);
    
    const handleChatboxMinimize = () => {
        setChatboxMinimized(!chatboxMinimized);
    };

    const handleMsg = (e) => {
        setMessageOut(e.target.value);
    };

    const scrollToBottom = () => {
        console.log(chatHistoryRef.current._container.scrollTop, chatHistoryRef.current._container.scrollHeight);
        chatHistoryRef.current._container.scrollTop = parseInt(chatHistoryRef.current._container.scrollHeight) + 200;
        console.log(chatHistoryRef.current._container.scrollTop, chatHistoryRef.current._container.scrollHeight);
    };

    const sendMsg = (e) => {
        if (e.which === 13 && props.chatbox !== false && messageOut !== '') {
            let emitData = {'username': props.chatbox, 'message': messageOut};
            socket.emit('message', emitData);
            msgRef.current.value = '';
        };
    };

    return <ChatlistMsgPresent handleChatbox={props.handleChatbox}
                                chatbox={props.chatbox}
                                handleChatboxMinimize={handleChatboxMinimize}
                                chatboxMinimized={chatboxMinimized}
                                ref={refs}
                                scrollToBottom={scrollToBottom}
                                    chatHistory={chatHistory}
                                    messageOut={messageOut}
                                    messageIn={messageIn}
                                    handleMsg={handleMsg}
                                    sendMsg={sendMsg} />
};


export default ChatlistMsgContainer;