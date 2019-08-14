import React, { useState } from 'react';

import ChatlistMsgPresent from './chatlistMsg-present';


const ChatlistMsgContainer = (props) => {
    const [chatboxMinimized, setChatboxMinimized] = useState(false);

    const handleChatboxMinimize = () => {
        setChatboxMinimized(!chatboxMinimized);
    };

    return <ChatlistMsgPresent handleChatbox={props.handleChatbox}
                                chatbox={props.chatbox}
                                handleChatboxMinimize={handleChatboxMinimize}
                                chatboxMinimized={chatboxMinimized} />
};


export default ChatlistMsgContainer;