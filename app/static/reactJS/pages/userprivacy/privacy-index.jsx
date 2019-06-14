import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { AcctDelModal } from "./AcctDelModal/acctDel-container";
import EmailNotificationModal from "./EmailModal/emailnotification-container";
import BlockedUserContainer from './BlockedUserTable/BlockedUser-container';
import HuluContainer from "./huluSettingsBox/hulu-container";


const client = new ApolloClient({
    uri: 'https://smallworld.live/api/graphql'
});


const GET_USER_INFO = gql`
    { UserInfo { 
        username
        firstname
        lastname
        email
        msgNote
        commentNote
        replyNote 
        } UsersBlocked {
            username
            picture
        }
    }
`

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

const PrivacyQL = () => (
    <Query query={GET_USER_INFO}>
        {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;
            
            return (
                <PrivacyIndex username={data.UserInfo[0].username}
                            firstname={data.UserInfo[0].firstname}
                            lastname={data.UserInfo[0].lastname}
                            email={data.UserInfo[0].email}
                            msgNote={data.UserInfo[0].msgNote}
                            commentNote={data.UserInfo[0].commentNote}
                            replyNote={data.UserInfo[0].replyNote}
                            blockedUsers={data.UsersBlocked} />
            )
        }}
    </Query>
)

class PrivacyIndex extends Component {
    render() {
        return (
            <div className="privacy-index-wrapper">
                <GridContainer className="container">
                    <GridRow id="privacy-row" className="row">
                        <HuluContainer username={this.props.username}
                                        firstname={this.props.firstname}
                                        lastname={this.props.lastname}
                                        email={this.props.email} />
                        
                        <div className="col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 mb-5">
                        </div>

                        <BlockedUserContainer blockedUsers={this.props.blockedUsers} />
                    </GridRow>
                </GridContainer>

                {/* NOTIFICATION EMAIL POPUP MODAL */}
                <div id="modalDel" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <AcctDelModal />
                </div>

                {/* DELETE ACCOUNT POPUP MODAL */}
                <div id="modalNote" className="modal del-modal fade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <EmailNotificationModal msgNote={this.props.msgNote}
                                    commentNote={this.props.commentNote}
                                    replyNote={this.props.replyNote} />
                </div>
            </div>
        )
    }
}



ReactDOM.render(<ApolloProvider client={client}>
                    <PrivacyQL />
                </ApolloProvider>,
                document.getElementById('privacy-container'));