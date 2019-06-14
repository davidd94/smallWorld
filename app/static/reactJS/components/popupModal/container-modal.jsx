import React from "react";
import styled from 'styled-components';
import { ModalTitle } from "./present-title.jsx";
import { ModalBody } from "./present-body.jsx";
import { deviceMQ } from '../../mediaQuery.js';


const ModalContentMQ = styled.div`
Device = Most of the Smartphones Sm, Med, L Mobiles Screen = B/w 320px to 425px
@media ${deviceMQ.mobileS} and (orientation: portrait) {
    width: 95vw;
}

@media ${deviceMQ.mobileS} and (orientation: landscape) {
    width: 95vw;
}

// Device = Low Resolution Tablets and XL Mobiles Screen = B/w 481px to 767px
@media ${deviceMQ.mobileL} and (orientation: portrait) {
    width: 95vw;
}

@media ${deviceMQ.mobileL} and (orientation: landscape) {
    width: 95vw;
}

// Device = Tablets, Ipads Screen = B/w 768px to 1024px
@media ${deviceMQ.tablet} and (orientation: portrait) {
    width: 95vw;
}

@media ${deviceMQ.tablet} and (orientation: landscape) {
    width: 95vw;
}

// Device = Laptops Screen = B/w 1025px to 1440px
@media ${deviceMQ.laptop} {
    width: 50vw;
}

// Device = Desktops Screen = 1440px to higher resolution desktops
@media ${deviceMQ.laptopL} {
    width: 50vw;
}

`;

const btnWrapper = {
    width: '60%',
    margin: '0 auto'
}

export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false
        };

        this.buttonState = this.buttonState.bind(this);
        this.handleConfirmation = this.handleConfirmation.bind(this);
        this.handleClosing = this.handleClosing.bind(this);
    };

    buttonState(result) {
        this.setState({
            buttonDisabled: result
        });
    };

    // VERIFIES IF USER ENTERS THE CORRECT ACKNOWLEDGMENT
    handleConfirmation() {
        var modalInput = document.getElementsByClassName('modal-ack-input')[0].value;
        var terms;
        if (this.props.bodyType == 'acct-del') {
            terms = "I understand the terms and wish to delete my account";
        } else if (this.props.bodyType == 'proj-del') {
            terms = 'temp string';
        }

        if (modalInput == terms) {
            this.buttonState(false);
        } else if (modalInput != terms) {
            this.buttonState(true);
        }
    };

    // ERASES INPUT UPON CLOSING MODAL
    handleClosing() {
        if (this.props.bodyType == 'acct-del' || this.props.bodyType == 'proj-del') {
            document.getElementsByClassName('modal-ack-input')[0].value = '';
            document.getElementsByClassName('modal-confirm-btn')[0].setAttribute('disabled', 'disabled');
        }
    };

    componentDidMount() {
        if (this.props.bodyType == 'acct-del' || this.props.bodyType == 'proj-del') {
            this.buttonState(true);
        }
    }

    render() {
        const title1 = this.props.title;
        const body1 = this.props.bodyType;
        const btnName = this.props.btnConfirm;
        const BodyBackground = styled.div `
            width: 100%;
            height: 100%;
            background: ${() => body1 == 'acct-del' || body1 == 'proj-del' ? 'rgb(218, 218, 218)' : "none"}
        `;

        return (
            <div className="modal-dialog" role="document">
                <ModalContentMQ className="modal-content">
                    <div className="modal-header">
                        <ModalTitle title={title1} />
                    </div>
                    <BodyBackground className="modal-body">
                        <ModalBody bodyType={body1} 
                                    customElems={this.props.customElems}
                                    onKeyUp={this.handleConfirmation} />
                    </BodyBackground>
                    <div className="modal-footer">
                        <div className="modal-btn-wrapper" style={btnWrapper}><button type="button" className="btn btn-secondary modal-confirm-btn" onClick={this.props.onClick} disabled={this.state.buttonDisabled} data-dismiss="modal">{btnName}</button></div>
                        <button type="button" className="btn btn-primary modal-close-btn" onClick={this.handleClosing} data-dismiss="modal">Close</button>
                    </div>
                </ModalContentMQ>
            </div>
        )
    }
}


Modal.defaultProps = {bodyType: 'None'};