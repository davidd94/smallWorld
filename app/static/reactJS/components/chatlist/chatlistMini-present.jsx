import React from 'react';

import styles from './_styles/chatlistStyles.module';


const ChatlistMinimized = (props) => {
    return (
        <div onClick={props.handleMinimize} className={styles.chatlistMinimizedContainer} style={props.minimized ? {display: 'block'} : {display: 'none'}}>
            <div className={styles.onlineWrapper} style={props.mode === 'online' ? {display: 'block'} : {display: 'none'}}>
                <span className={styles.minimizedOnlineIcon} style={{background: 'rgb(66, 183, 42)', borderRadius: '50%', height: '10px', width: '10px', display: 'block', position: 'absolute', top: '50%', left: '8%', transform: 'translate(-50%, -50%)'}}></span>
                <span className={styles.minimizedOnlineText}>Online</span>
            </div>
            <div className={styles.offlineWrapper} style={props.mode === 'offline' ? {display: 'block'} : {display: 'none'}}>
                <img className={styles.minimizedOfflineIcon} style={{background: 'rgb(179, 179, 179)', borderRadius: '50%', display: 'block', position: 'absolute', height: '10px', width: '10px', top: '50%', left: '8%', transform: 'translate(-50%, -50%)'}} />
                <span className={styles.minimizedOfflineText}>Offline</span>
            </div>
            <div className={styles.invisibleWrapper} style={props.mode === 'invisible' ? {display: 'block'} : {display: 'none'}}>
                <i className='fas fa-ghost' style={{display: 'block', color: 'rgb(75, 75, 75)', height: '1rem', width: '1rem', position: 'absolute', top: '50%', left: '8%', transform: 'translate(-50%, -50%)'}} />
                <span className={styles.minimizedInvisibleText}>Invisible Mode</span>
            </div>
            <div className={styles.anonymousWrapper} style={props.mode === 'anonymous' ? {display: 'block'} : {display: 'none'}}>
                <i className='fas fa-user-slash' style={{display: 'block', color: 'rgb(75, 75, 75)', height: '1rem', width: '1rem', position: 'absolute', top: '50%', left: '8%', transform: 'translate(-50%, -50%)'}} />
                <span className={styles.minimizedAnonymousText}>Not Logged In</span>
            </div>
        </div>
    );
};


export default ChatlistMinimized;