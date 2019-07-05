import React, { useState, useContext } from 'react';
import Switch from 'react-switch';

import { PrivacyContext } from '../../../components/_context/UserContext';
import ReactModal from '../../../components/reactstrapModal/reactstrapModal-container';


const EmailModal = (props) => {
    let data = useContext(PrivacyContext);
    
    const [msgNote, setMsg] = useState(data.UserInfo[0].msgNote);
    const [commentNote, setComment] = useState(data.UserInfo[0].commentNote);
    const [replyNote, setReply] = useState(data.UserInfo[0].replyNote);

    const handleMsgNote = () => {
        setMsg(!msgNote);
    };

    const handleCommentNote = (e) => {
        setComment(!commentNote);
    };

    const handleReplyNote = (e) => {
        setReply(!replyNote);
    };

    const handleSave = () => { 
        const token = localStorage.getItem('token');

        var emailSettings = {
            'msg': msgNote,
            'comment': commentNote,
            'reply': replyNote
        };
        
        console.log(emailSettings);
        fetch('/api/email_notifications', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(emailSettings),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            },
        })
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                if (data == 'Unable to save email notification settings') {
                    alert(data);
                };
            });
        });
    }

    const CustomModalBody = () => {
        return (
            <ul style={{listStyle: 'none', textAlign: 'left'}}>
                <li style={{marginBottom: '1rem', display: 'flex', alignSelf: 'center'}}><Switch onChange={handleMsgNote} checked={msgNote} id="normal-switch" height={22} width={44} /><span style={{marginLeft: '2rem'}}>Send email for all private messages</span></li>
                <li style={{marginBottom: '1rem', display: 'flex', alignSelf: 'center'}}><Switch onChange={handleCommentNote} checked={commentNote} id="normal-switch" height={22} width={44} /><span style={{marginLeft: '2rem'}}>Send email for all project comments</span></li>
                <li style={{marginBottom: '1rem', display: 'flex', alignSelf: 'center'}}><Switch onChange={handleReplyNote} checked={replyNote} id="normal-switch" height={22} width={44} /><span style={{marginLeft: '2rem'}}>Send email for all project replies</span></li>
            </ul>
        );
    };

    return (
        <ReactModal 
            btnColor="primary"
            handleSave={handleSave}
                btnStyles={props.btnStyles}
                buttonLabel="Manage"
                modalClassName="none"
                modalTitleText="Email Notifications" 
                modalBodyText={CustomModalBody()}
                modalConfirm="Save"
                modalCancel="Cancel">
        </ReactModal>
    )
}


export default EmailModal;