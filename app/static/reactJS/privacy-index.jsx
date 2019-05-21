import React, { Component } from "react";
import ReactDOM from "react-dom";
import { AcctDelModal } from "./popupModal/privacy/acctDel-container.jsx";
import { EmailNotificationModal } from './popupModal/privacy/emailnotification-container.jsx';


class PrivacyIndex extends Component {
    render() {
        return (
            <div className="privacy-index-wrapper">
                {/* NOTIFICATION EMAIL POPUP MODAL */}
                <div id="modalDel" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <AcctDelModal />
                </div>

                {/* DELETE ACCOUNT POPUP MODAL */}
                <div id="modalNote" className="modal del-modal fade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <EmailNotificationModal />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<PrivacyIndex />, document.getElementById('privacy-modal-container'));