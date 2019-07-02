import React, { useState } from 'react';

import ReactModal from '../../../components/reactstrapModal/reactstrapModal-container';


const EmailModal = () => {
    const [msgNote, setMsg] = useState('');
    const [commentNote, setComment] = useState('');
    const [replyNote, setReply] = useState('');

    const handleSave = (e) => { 
        const token = localStorage.getItem('token');
        
        setMsg(msgValue);
        setComment(commentValue);
        setReply(replyValue);
        
        fetch('/email_notifications', {
            method: "POST",
            credentials: "include",
            mode: "cors",
            body: JSON.stringify(emailSettings),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
        })
        .then(function (response) {
            response.json().then(function (data) {
                that.setState({
                    msg: data.msg,
                    comment: data.comment,
                    reply: data.reply
                });
                that.applyChanges()
            })
        });
    }

    applyChanges() {
        document.getElementsByClassName('email-msg-note-btn')[0].checked = this.state.msg;
        document.getElementsByClassName('email-comment-note-btn')[0].checked = this.state.comment;
        document.getElementsByClassName('email-reply-note-btn')[0].checked = this.state.reply;
    }

    componentDidMount() {
        const that = this;

        // OBTAINS CSRF TOKEN FOR EMAIL NOTE SUBMIT SAVE
        fetch('/api/csrf_token', {
            method: "GET",
            headers: new Headers({
                "content-type": "application/json"
            })
        })
        .then(function (response) {
            response.json().then(function (data) {
                that.setState({
                    csrf_token: data
                });
            });
        });
        
        // LOADS USER'S EMAIL NOTIFICATION SETTINGS
        this.setState({
            msg: this.props.msgNote,
            comment: this.props.commentNote,
            reply: this.props.replyNote
        })
    }

    render() {
        return (
            <Modal title="Email Notifications" 
                    bodyType="custom" 
                    customElems={<CustomProps msgNote={this.state.msg} 
                                                commentNote={this.state.comment}
                                                reply={this.state.reply} />}
                    btnConfirm="Save" 
                    onClick={this.handleSave} />
        )
    }
}