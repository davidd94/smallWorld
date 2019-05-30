import React, { Component } from 'react';
import { Modal } from '../factory/container-modal.jsx';


export class AcctDelModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csrf_token: 'none'
        };

        this.handleDeleting = this.handleDeleting.bind(this);
    }

    handleDeleting() { 
        const csrf_token = this.state.csrf_token;

        fetch('/delete_acct', {
            method: "POST",
            credentials: "include",
            mode: "cors",
            body: JSON.stringify({'confirmation': true}),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": csrf_token
            },
        })
        .then(function (response) {
            response.json().then(function (msg) {
                window.location.replace('/');
            })
        });
    }

    componentDidMount() {
        const that = this;
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
                })
            });
        });
    }

    render() {
        return (
            <Modal title="Account Deletion" 
                    bodyType="acct-del" 
                    btnConfirm="Delete" 
                    onClick={this.handleDeleting} />
        )
    }
}