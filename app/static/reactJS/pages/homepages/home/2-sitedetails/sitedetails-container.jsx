import React from 'react';

import DetailBox from './sitedetails-present';



const DetailSection = () => {

    let PrivateMsg = React.createRef();
    let Notification = React.createRef();
    let Chat = React.createRef();
    let Projects = React.createRef();
    let Social = React.createRef();
    let PrivateLabel = React.createRef();
    let NotifLabel = React.createRef();
    let ChatLabel = React.createRef();
    let ProjectsLabel = React.createRef();
    let SocialLabel = React.createRef();

    let refs = {
        ref1: PrivateMsg,
        ref2: Notification,
        ref3: Chat,
        ref4: Projects,
        ref5: Social,
        ref6: PrivateLabel,
        ref7: NotifLabel,
        ref8: ChatLabel,
        ref9: ProjectsLabel,
        ref10: SocialLabel
    };

    const handleClick = (e) => {
        e.target.textContent == 'Private Messages' ? (PrivateMsg.current.style.visibility = 'visible',
                                                     PrivateMsg.current.style.opacity = 1,
                                                     PrivateMsg.current.style.display = 'block',
                                                     PrivateLabel.current.style.color = 'rgba(255, 218, 137, 1)',
                                                     PrivateLabel.current.style.fontWeight = 600) : (PrivateMsg.current.style.visibility = 'hidden',
                                                                                                    PrivateMsg.current.style.opacity = 0,
                                                                                                    PrivateMsg.current.style.display = 'none',
                                                                                                    PrivateLabel.current.style.color = '',
                                                                                                    PrivateLabel.current.style.fontWeight = '');
        e.target.textContent == 'Notification System' ? (Notification.current.style.visibility = 'visible',
                                                        Notification.current.style.opacity = 1,
                                                        Notification.current.style.display = 'block',
                                                        NotifLabel.current.style.color = 'rgba(255, 218, 137, 1)',
                                                        NotifLabel.current.style.fontWeight = 600) : (Notification.current.style.visibility = 'hidden',
                                                                                                    Notification.current.style.opacity = 0,
                                                                                                    Notification.current.style.display = 'none',
                                                                                                    NotifLabel.current.style.color = '',
                                                                                                    NotifLabel.current.style.fontWeight = '');
        e.target.textContent == 'Live Chat System' ? (Chat.current.style.visibility= 'visible',
                                                    Chat.current.style.opacity = 1,
                                                    Chat.current.style.display = 'block',
                                                    ChatLabel.current.style.color = 'rgba(255, 218, 137, 1)',
                                                    ChatLabel.current.style.fontWeight = 600) : (Chat.current.style.visibility = 'hidden',
                                                                                            Chat.current.style.opacity = 0,
                                                                                            Chat.current.style.display = 'none',
                                                                                            ChatLabel.current.style.color = '',
                                                                                            ChatLabel.current.style.fontWeight = '');
        e.target.textContent == 'Detailed Projects' ? (Projects.current.style.visibility = 'visible',
                                                        Projects.current.style.opacity = 1,
                                                        Projects.current.style.display = 'block',
                                                        ProjectsLabel.current.style.color = 'rgba(255, 218, 137, 1)',
                                                        ProjectsLabel.current.style.fontWeight = 600) : (Projects.current.style.visibility = 'hidden',
                                                                                                    Projects.current.style.opacity = 0,
                                                                                                    Projects.current.style.display = 'none',
                                                                                                    ProjectsLabel.current.style.color = '',
                                                                                                    ProjectsLabel.current.style.fontWeight = '');
        e.target.textContent == 'Social System' ? (Social.current.style.visibility = 'visible',
                                                    Social.current.style.opacity = 1,
                                                    Social.current.style.display = 'block',
                                                    SocialLabel.current.style.color = 'rgba(255, 218, 137, 1)',
                                                    SocialLabel.current.style.fontWeight = 600) : (Social.current.style.visibility = 'hidden',
                                                                                                Social.current.style.opacity = 0,
                                                                                                Social.current.style.display = 'none',
                                                                                                SocialLabel.current.style.color = '',
                                                                                                SocialLabel.current.style.fontWeight = '');
    };

    const handleClose = () => {
        PrivateMsg.current.style.display = 'none';
        Notification.current.style.display = 'none';
        Chat.current.style.display = 'none';
        Projects.current.style.display = 'none';
        Social.current.style.display = 'none';

        PrivateLabel.current.style.color = '';
        PrivateLabel.current.style.fontWeight = '';
        NotifLabel.current.style.color = '';
        NotifLabel.current.style.fontWeight = '';
        ChatLabel.current.style.color = '';
        ChatLabel.current.style.fontWeight = '';
        ProjectsLabel.current.style.color = '';
        ProjectsLabel.current.style.fontWeight = '';
        SocialLabel.current.style.color = '',
        SocialLabel.current.style.fontWeight = ''
    };


    return (
        <DetailBox onClick={handleClick} onClose={handleClose} ref={refs} />
    );
};


export default DetailSection;