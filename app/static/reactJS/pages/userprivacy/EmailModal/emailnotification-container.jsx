import React, { Component } from 'react';

import { Modal } from '../../../components/popupModal/container-modal';
import { CustomProps } from './emailnotificationBody-present';


class EmailNotificationModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csrf_token: 'none',
            msg: false,
            comment: false,
            reply: false
        }

        this.handleSave = this.handleSave.bind(this);
    }

    handleSave() { 
        const that = this;
        const csrfToken = this.state.csrf_token;
        var msgValue = document.getElementsByClassName('email-msg-note-btn')[0].checked;
        var commentValue = document.getElementsByClassName('email-comment-note-btn')[0].checked;
        var replyValue = document.getElementsByClassName('email-reply-note-btn')[0].checked;
        var emailSettings = {
            'msg': msgValue,
            'comment': commentValue,
            'reply': replyValue
        };
        
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



export default EmailNotificationModal;