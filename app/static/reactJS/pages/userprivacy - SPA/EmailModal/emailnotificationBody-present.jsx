import React, { Component } from "react";
import Toggle from 'react-bootstrap-toggle';


export class CustomProps extends Component {
    render() {
        return (
            <ul className="emailnote-list">
                <li><input type="checkbox" className="email-msg-note-btn" data-toggle="toggle" data-onstyle="success" defaultChecked={this.props.msgNote} /><span>Send email for all private messages</span></li>
                <li><input type="checkbox" className="email-comment-note-btn" data-toggle="toggle" data-onstyle="success" defaultChecked={this.props.commentNote} /><span>Send email for all project comments</span></li>
                <li><input type="checkbox" className="email-reply-note-btn" data-toggle="toggle" data-onstyle="success" defaultChecked={this.props.replyNote} /><span>Send email for all project replies</span></li>
            </ul>
        )
    }
}