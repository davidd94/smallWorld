import React from 'react';
import { Animated } from 'react-animated-css';

import styles from './_styles/chatlistStyles.module';


const ChatlistMsgPresent = (props) => {
    return (
        <div className={styles.chatlistMsgContainer} style={props.chatbox ? {display: 'block'} : {}}>
                <header className={styles.msgHeader}>
                    <i className={([styles.msgClose, 'fas fa-times']).join(' ')} onClick={() => props.handleChatbox(false)} />
                    <i className={([styles.msgMinimize, (props.chatboxMinimized ? 'fas fa-window-maximize' : 'far fa-window-minimize')]).join(' ')} onClick={props.handleChatboxMinimize} />
                    <h4 className={styles.msgTitle}>{props.chatbox}</h4>
                    <span className={styles.msgIcon}></span>
                </header>
                <Animated animationIn="slideInUp" animationOut="slideOutDown" isVisible={!props.chatboxMinimized} style={props.chatboxMinimized ? {display: 'none'} : {}} >
                    <div className={styles.chat}>
                        <div className={styles.chatHistory}>
                            Chat text goes here...
                        </div>

                        <p className={styles.chatFeedback}></p>
                        <div className={styles.chatInputWrapper}>
                            <input className={styles.chatInput} type="text" maxLength="200" placeholder="Type your message…" autoFocus />
                        </div>
                    </div>
                </Animated>
        </div>
    );
};


export default ChatlistMsgPresent;