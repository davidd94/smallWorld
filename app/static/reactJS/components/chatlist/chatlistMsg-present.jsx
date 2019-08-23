import React, { useState, useEffect, useContext } from 'react';
import { Animated } from 'react-animated-css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Moment from 'react-moment';
//import { Element, Events, Link as scrollContainer, animateScroll as scroll } from 'react-scroll';

import { UserContext } from '../_context/UserContext'
import styles from './_styles/chatlistStyles.module';


const ChatlistMsgPresent = React.forwardRef((props, ref) => {
    const { ref1, ref2 } = ref;
    const [recentMsgs, setRecentmsgs] = useState([]);
    const UserInfo = useContext(UserContext);
    var Username;
    if (UserInfo) {
        Username = UserInfo.username;
    };
    
    useEffect(() => {
        console.log('NEW CHAT MSGS COMING IN...');
        if (props.messageIn !== false) {
            setRecentmsgs(recentMsgs.concat([props.messageIn]));
        } else {
            setRecentmsgs([]);
        };
        
        props.scrollToBottom();
    }, [props.messageIn, props.chatHistory]);
    
    let ChatHistory = (props) => {
        if (props.chatHistory !== 'Loading...' && props.chatHistory !== false) {
            return (props.chatHistory).map((messageData, index) => {
                return (
                    <li key={`${messageData.username}-${index}`} className={styles.chatHistory}>
                        <p className={styles.msgTime}><Moment local interval={60000} calendar={true}>{messageData.timestamp}</Moment></p>
                        <p style={messageData.username === props.Username ? {textAlign: 'left'} : {textAlign: 'right'}}>{messageData.message}</p>
                    </li>
                );
            });
        } else if (props.chatHistory === 'Loading...') {
            return (
                <div style={{width: '100%', height: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
                    <p style={{textAlign: 'center', color: 'lightgrey', fontStyle: 'italic', opacity: 0.8, fontSize: '1.5rem'}}>{props.chatHistory}</p>
                </div>
            )
        } else {
            return <></>
        };
    };
    
    let NewChatMsgs = (props) => {
        let AllNewMsgs = props.recentMsgs;
        if (AllNewMsgs.length > 0) {
            return AllNewMsgs.map((messageData, index) => {
                return (
                    <li key={`${messageData.username}-${index}`} className={styles.chatNewMsg}>
                        <p className={styles.newMsgTime}><Moment local={true} interval={60000} calendar={true}>{messageData.timestamp}</Moment></p>
                        <p style={messageData.username === props.Username ? {textAlign: 'left'} : {textAlign: 'right'}}>{messageData.message}</p>
                    </li>
                );
            });
        };
        return <></>
    };

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
                        <div className={styles.chatLogs}>
                            <PerfectScrollbar ref={ref2}>
                                {props.chatHistory === false || props.chatHistory === 'Loading...' ? <></> : <><ChatHistory Username={Username} chatHistory={props.chatHistory} />
                                                                                                                <NewChatMsgs Username={Username} recentMsgs={recentMsgs} chatHistory={props.chatHistory} /></>}
                            </PerfectScrollbar>
                        </div>

                        <p className={styles.chatFeedback}></p>
                        <div className={styles.chatInputWrapper}>
                            <input ref={ref1} className={styles.chatInput} onChange={props.handleMsg} onKeyUp={props.sendMsg} type="text" maxLength="200" placeholder="Type your message…" autoFocus={true} />
                        </div>
                    </div>
                </Animated>
        </div>
    );
});


export default ChatlistMsgPresent;