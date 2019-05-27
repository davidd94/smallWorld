import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { HuluContainer } from "./huluSettingsBox/hulu-container.jsx";
import { AcctDelModal } from "./popupModal/privacy/acctDel-container.jsx";
import { EmailNotificationModal } from './popupModal/privacy/emailnotification-container.jsx';
import BlockedUserContainer from './BlockedUserTable/BlockedUser-container.jsx';


const GridContainer = styled.div`
    width: 100%;
    height: 100%;
    max-width: 100vw;
    margin: 0;
    padding: 0;
`

const GridRow = styled.div`
    width: 100%;
    max-width: 100vw;
`

class PrivacyIndex extends Component {
    render() {
        return (
            <div className="privacy-index-wrapper">
                <GridContainer className="container">
                    <GridRow id="privacy-row" className="row">
                        <HuluContainer />
                        
                        <div className="col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 mb-5">
                        </div>

                        <BlockedUserContainer />
                    </GridRow>
                </GridContainer>

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

ReactDOM.render(<PrivacyIndex />, document.getElementById('privacy-container'));