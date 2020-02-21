import React, { useContext } from 'react';
import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    InputGroup, Input,
} from 'reactstrap';

import styles from './_styles/chatlistStyles.module';
import ExpandIcon from '../../../images/dots-expand.png';
import TooltipContainer from '../tooltip/tooltip-container';
import { UserChatlistContext } from '../_context/UserContext';


const ChatlistPresent = (props) => {
    const chatlistDataInit = useContext(UserChatlistContext);

    let chatlistData = props.chatlist;

    let favUsers;
    let unfavUsers;

    if (chatlistDataInit) {
        favUsers = chatlistDataInit.UserChatlistFav;
        unfavUsers = chatlistDataInit.UserChatlist;
    };
    
    const FavUserInfo = () => {
        if (chatlistData.length > 0) {
            return chatlistData.map((user, index) => {
                if (user.favorite === true) {
                    return (
                        <li key={`key: ${index}`}>
                            <span style={{width: '2rem', margin: '0 1rem'}}><i className="fas fa-star" onClick={() => props.handleFav(user.username)} /></span>
                            <div onClick={() => {props.handleChatbox(user.username)}} style={{display: 'inline-block'}}>
                                <img className={styles.chatlistAvatar} src={user.picture} />
                                <span style={{width: '2rem', margin: '0 0.75rem', fontSize: '0.85rem'}}>{user.username}</span>
                                <i style={{width: '2rem'}} className={(["far fa-comment", styles.chatlistBubble]).join(' ')} />
                                <span className={styles.chatlistIcon} style={user.status === 'offline' ? {background: 'lightgrey'} : {}} />
                            </div>
                        </li>
                    );
                } else {
                    return <></>
                };
            });
        } else if (favUsers) {
            return favUsers.map((user, index) => {
                return (
                    <li key={`key: ${index}`}>
                        <span style={{width: '2rem', margin: '0 1rem'}}><i className="fas fa-star" onClick={() => props.handleUnfav(user.username)} /></span>
                        <div onClick={() => {props.handleChatbox(user.username)}} style={{display: 'inline-block'}}>
                            <img className={styles.chatlistAvatar} src={user.picture} />
                            <span style={{width: '2rem', margin: '0 0.75rem', fontSize: '0.85rem'}}>{user.username}</span>
                            <i style={{width: '2rem'}} className={(["far fa-comment", styles.chatlistBubble]).join(' ')} />
                            <span className={styles.chatlistIcon} style={user.online === 'offline' ? {background: 'lightgrey'} : {}} />
                        </div>
                    </li>
                );
            });
        } else {
            return <></>
        };
    };

    const UnfavUserInfo = () => {
        if (chatlistData.length > 0) {
            return chatlistData.map((user, index) => {
                if (user.favorite === false) {
                    return (
                        <li key={`key: ${index}`}>
                            <span style={{width: '2rem', margin: '0 1rem'}}><i className="far fa-star" onClick={() => props.handleUnfav(user.username)} /></span>
                            <div onClick={() => {props.handleChatbox(user.username)}} style={{display: 'inline-block'}}>
                                <img className={styles.chatlistAvatar} src={user.picture} />
                                <span style={{width: '2rem', margin: '0 0.75rem', fontSize: '0.85rem'}}>{user.username}</span>
                                <i style={{width: '2rem'}} className={(["far fa-comment", styles.chatlistBubble]).join(' ')} />
                                <span className={styles.chatlistIcon} style={user.status === 'offline' ? {background: 'lightgrey'} : {}} />
                            </div>
                        </li>
                    );
                } else {
                    return <></>
                };
            });
        } else if (unfavUsers) {
            return unfavUsers.map((user, index) => {
                return (
                    <li key={`key: ${index}`}>
                        <span style={{width: '2rem', margin: '0 1rem'}}><i className="far fa-star" onClick={() => props.handleFav(user.username)} /></span>
                        <div onClick={() => {props.handleChatbox(user.username)}} style={{display: 'inline-block'}}>
                            <img className={styles.chatlistAvatar} src={user.picture} />
                            <span style={{width: '2rem', margin: '0 0.75rem', fontSize: '0.85rem'}}>{user.username}</span>
                            <i style={{width: '2rem'}} className={(["far fa-comment", styles.chatlistBubble]).join(' ')} />
                            <span className={styles.chatlistIcon} style={user.online === 'offline' ? {background: 'lightgrey'} : {}} />
                        </div>
                    </li>
                );
            });
        } else {
            return  <></>
        };
    };
    
    return (
        <div className={styles.chatlistContainer} style={props.minimized ? {display: 'none'} : {}}>
            <div className={styles.userList}>
                <div className={styles.title}>
                    <h3 className={styles.titleText} style={props.mode === 'invisible' ? {fontStyle: 'italic', color: 'lightgrey'} : {}}><i className='fas fa-ghost' style={props.mode === 'invisible' ? {} : {display: 'none'}} />{props.mode === 'invisible' ? 'Invisible' : 'Users'}</h3>
                    <i className={(["far fa-question-circle", styles.chatlistQuest]).join(' ')} />
                </div>
                <div style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, right: 0, zIndex: 500}}>
                    <TooltipContainer idTag="chatlist" direction="left" text="Chat list users are automatically added if both users are following each other or removed if one or the other unfollows. Otherwise if one or the other is only following, both users will not appear in their respective list." />
                </div>
                <UncontrolledDropdown className={styles.chatlistMenu}>
                    <DropdownToggle className={styles.expandIconBox}>
                        <img src={ExpandIcon} />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => {props.handleMinimize()}}>Minimize</DropdownItem>
                        <DropdownItem onClick={() => props.handleMode('offline')} style={props.mode === 'offline' || props.mode === 'anonymous' ? {display: 'none'} : {}}>Go offline</DropdownItem>
                        <DropdownItem onClick={() => props.handleMode('online')} style={props.mode === 'online' || props.mode === 'anonymous' ? {display: 'none'} : {}}>Go online</DropdownItem>
                        <DropdownItem onClick={() => props.handleMode('invisible')} style={props.mode === 'invisible' || props.mode === 'anonymous' ? {display: 'none'} : {position: 'relative', zIndex: 50}}>Go invisible
                            <div style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '3px', right: '12px', zIndex: 500}}>
                                <TooltipContainer idTag="invisible" direction="left" text="While in Invisible Mode, you may see others online while others cannot see you online. All chat features will still be available. If you are experiencing any issues or bugs, please let the me know :)" />
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                <div className={styles.chatlistDivider}></div>
                <InputGroup className={styles.searchBox}>
                    <Input placeholder='Find user..' />
                </InputGroup>
                <div className={styles.chatlistDivider}></div>
                <span style={props.mode === 'offline' || props.mode === 'anonymous' ? {display: 'none'} : {}}>
                    <ul className={styles.chatlist}>
                        <li style={{width: '100%', textAlign: 'center', margin: 0, padding: 0, cursor: 'none'}}>Favorites</li>
                        <FavUserInfo />
                    </ul>
                    <ul className={styles.chatlist}>
                        <li style={{width: '100%', textAlign: 'center', margin: 0, padding: 0, cursor: 'none'}}>Other Followers</li>
                        <UnfavUserInfo />
                    </ul>
                </span>
                <div className={styles.offlineText} style={props.mode === 'offline' ? {} : {display: 'none'}}>
                    <p>You are offline</p>
                </div>
                <div className={styles.anonymousText} style={props.mode === 'anonymous' ? {} : {display: 'none'}}>
                    <p>You must be logged in</p>
                </div>
            </div>
        </div>
    );
};


export default ChatlistPresent;