import React, { Component } from "react";


const p1 = {
    width: '100%',
    margin: 0,
    textAlign: 'center',
    color: 'black',
    fontSize: '1em'
}

const inputWrapper = {
    width: '100%',
    margin: '0',
    textAlign: 'center'
}

const bodyInput = {
    width: '100%',
    margin: 0,
    textAlign: 'center'
}

export class ModalBody extends Component {
    render() {
        const bodyType = this.props.bodyType;

        if (bodyType == 'acct-del') {
            return (
                <div className="modal-body-wrapper">
                    <p style={p1}>Please enter ( <strong style={{ color: 'rgb(255, 45, 45)' }}>I understand the terms and wish to delete my account</strong> ) to confirm your account deletion.</p>
                    <br />
                    <p style={p1}><strong style={{ color: 'darkred' }}>WARNING: </strong>Account deletion is PERMANENT!</p>
                    <div style={inputWrapper}>
                        <input style={bodyInput} className="modal-ack-input" onKeyUp={this.props.onKeyUp} type="text" maxLength="150" placeholder="Insert your acknowledgement here" />
                    </div>
                </div>
            )
        } else if (bodyType == 'proj-del') {
            const projectTitle = this.props.projectTitle;

            return (
                <div className="modal-body-wrapper" style={defaultWrapper}>
                    <p style={p1}>Please enter ( <strong style={{ color: 'rgb(255, 45, 45)' }}>I understand the terms and wish to delete my account</strong> ) to confirm your account deletion.</p>
                    <br />
                    <p style={p1}><strong style={{ color: 'darkred' }}>WARNING: </strong>Account deletion is PERMANENT!</p>
                    <div style={inputWrapper}>
                        <input style={bodyInput} className="modal-ack-input" type="text" maxLength="150" placeholder="Insert your acknowledgement here" />
                    </div>
                </div>
            )
        } else if (bodyType == 'picture') {
            const bodyImage = this.props.bodyImage;

            return (
                <div className="modal-body-wrapper" style={defaultWrapper}>
                    <img src={bodyImage} />
                </div>
            )
        } else if (bodyType == 'list') {
            return (
                <div className="modal-body-wrapper" style={defaultWrapper}>
                    
                </div>
            )
        } else if (bodyType == 'custom') {
            var toggleBtns = this.props.customElems;
            return (
                <div className="modal-body-wrapper">
                    {toggleBtns}
                </div>
            )
        }
    }
}