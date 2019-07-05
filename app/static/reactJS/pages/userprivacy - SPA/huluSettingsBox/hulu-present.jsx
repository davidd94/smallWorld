import React, { Component } from "react";
import styled from "styled-components";

import { PrivacyContext } from "../../../components/_context/UserContext";
import AcctDelModal from '../AcctDelModal/acctdelete-container';
import EmailModal from "../EmailModal/emailnotification-container";


const HuluContainer = styled.div`
    background: #ffffff;
    width: 100%;
    height: 82vh;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    :hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
`;

const Logo = styled.h1`
    float: right;
    margin-right: 12px;
    margin-top: 12px;
    font-family: "Nunito Sans", sans-serif;
    color: #3dbb3d;
    font-weight: 900;
    font-size: 1.5em;
    letter-spacing: 1px;
`;

const Leftbox = styled.div`
    float: left;
    top: -5%;
    left: 5%;
    position: absolute;
    width: 15%;
    height: 110%;
    background: #7ed386;
    box-shadow: 3px 3px 10px rgba(119, 119, 119, 0.5);
`;

const LeftA = styled.a`
    list-style: none;
    padding: 35px;
    color: #ffffff;
    font-size: 1.1em;
    display: block;
    transition: all 0.3s ease-in-out;
    
    :first-child {
        margin-top: 7px;
    }
`

const LeftI = styled.i`
    color: #ffffff;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
`

const Rightbox = styled.div`
    float: right;
    margin-right: 4em;
    width: 60%;
    height: 100%;
`

const TabStyles = styled.div`
    transition: opacity 1s ease-in;
    position: absolute;
    width: 70%;
    height: 70%;
    opacity: 0;
    z-index: -1;
`

const TabStyles2 = styled.div`
    transition: opacity 1s ease-in;
    position: absolute;
    width: 70%;
    pointer-events: none;
    -webkit-filter: blur(2px);
    -moz-filter: blur(2px);
    -o-filter: blur(2px);
    -ms-filter: blur(2px);
    filter: blur(2px);
`

const ConstructionLogo = styled.img`
    top: 50%;
    left: 35%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: auto;
    opacity: 1;
    position: absolute;
`

const TabTitle = styled.h1`
    font-family: "Montserrat", sans-serif;
    color: #7ed386;
    font-size: 1em;
    margin-top: 40px;
    margin-bottom: 35px;
`

const TabSubTitle = styled.h6`
    color: #777777;
    font-family: "Roboto", sans-serif;
    width: 80%;
    text-transform: uppercase;
    font-size: 0.5em;
    letter-spacing: 1px;
    margin-left: 2px;
`

const TabSubTitle2 = styled.p`
    border-width: 1px;
    border-style: solid;
    border-image: linear-gradient(to right, #3fb6a8, rgba(126, 211, 134, 0.5)) 1 0%;
    border-top: 0;
    width: 80%;
    font-family: "Montserrat", sans-serif;
    font-size: 0.7em;
    padding: 7px 0;
    color: #070707;
`

const HuluBtn = styled.button`
    float: right;
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    font-size: 10px;
    border: none;
    color: #3fb6a8;
    cursor: pointer;
    padding: 0;
    background-color: white;

    :focus, :active {
        text-decoration: none;
    }

    :hover {
        text-decoration: underline;
        font-weight: 900;
    }
`

const HuluBtn1 = {
    float: 'right',
    fontFamily: 'Roboto, sans-serif',
    textTransform: 'uppercase',
    fontSize: '10px',
    border: 'none',
    outline: 'none',
    color: '#3fb6a8',
    cursor: 'pointer',
    padding: 0,
    backgroundColor: 'white'
}

const GiftInput = styled.input`
    border: 1px solid #dddddd;
    font-family: "Roboto", sans-serif;
    padding: 2px;
    margin: 0;
`


class HuluBox extends Component {
    render() {
        let data = this.context;
        return (
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 my-5">
                <HuluContainer className="hulu-container">
                    <div id="logo">
                        <Logo className="logo"></Logo>
                    </div>
                    <Leftbox className="leftbox">
                        <nav className="settings-nav">
                            <LeftA id="profile" onClick={this.props.onClick}><LeftI className="fa fa-user" style={{color: '#3fb6a8', transform: 'scale(1.3)'}}></LeftI></LeftA>
                            <LeftA id="payment" onClick={this.props.onClick}><LeftI className="fa fa-credit-card"></LeftI></LeftA>
                            <LeftA id="subscription" onClick={this.props.onClick}><LeftI className="fa fa-tv"></LeftI></LeftA>
                            <LeftA id="privacy" onClick={this.props.onClick}><LeftI className="fa fa-tasks"></LeftI></LeftA>
                            <LeftA id="settings" onClick={this.props.onClick}><LeftI className="fa fa-cog"></LeftI></LeftA>
                        </nav>
                    </Leftbox>
                    <Rightbox className="rightbox">
                        <TabStyles className="profile" style={{opacity: 1, zIndex: 500}}>
                            <TabTitle>Personal Info</TabTitle>
                            <TabSubTitle className="personal-info-title username">User Name</TabSubTitle>
                                <TabSubTitle2 className="personal-info username-value">{data.UserInfo[0].username}</TabSubTitle2>
                            <TabSubTitle className="personal-info-title firstname">First Name</TabSubTitle>
                                <TabSubTitle2 className="personal-info firstname-value">{data.UserInfo[0].firstname}</TabSubTitle2>
                            <TabSubTitle className="personal-info-title lastname">Last Name</TabSubTitle>
                                <TabSubTitle2 className="personal-info lastname-value">{data.UserInfo[0].lastname}</TabSubTitle2>
                            <TabSubTitle className="personal-info-title email">Email</TabSubTitle>
                                <TabSubTitle2 className="personal-info email-value">{data.UserInfo[0].email} <a href="/edit_profile" style={{cursor: "pointer"}}><HuluBtn>Update</HuluBtn></a></TabSubTitle2>
                            <TabSubTitle className="personal-info-title password">Password </TabSubTitle>
                                <TabSubTitle2 className="personal-info password-value">••••••• <a href="/edit_profile" style={{cursor: "pointer"}}><HuluBtn>Change</HuluBtn></a></TabSubTitle2>
                        </TabStyles>
                        
                        <TabStyles className="payment-wrapper">
                            <ConstructionLogo className="payment-construction" src="static/images/comingsoon2.jpg" />
                            <TabStyles2 className="payment">
                                <TabTitle>Payment Info</TabTitle>
                                <TabSubTitle className="payment-info-title">Payment Method</TabSubTitle>
                                    <TabSubTitle2 className="payment-info">Mastercard •••• •••• •••• 0000 <HuluBtn>update</HuluBtn></TabSubTitle2>
                                <TabSubTitle className="payment-info-title">Billing Address</TabSubTitle>
                                    <TabSubTitle2 className="payment-info">1234 Example Ave | Seattle, WA <HuluBtn>change</HuluBtn></TabSubTitle2>
                                <TabSubTitle className="payment-info-title">Zipcode</TabSubTitle>
                                    <TabSubTitle2 className="payment-info">999000</TabSubTitle2>
                                <TabSubTitle className="payment-info-title">Billing History</TabSubTitle>
                                    <TabSubTitle2 className="payment-info">2018<HuluBtn>view</HuluBtn></TabSubTitle2>
                                <TabSubTitle2 className="payment-info-title">Redeem Gift Subscription </TabSubTitle2>
                                <TabSubTitle2 className="payment-info"><GiftInput type="text" className="gift-card-input" placeholder="Enter Gift Code"></GiftInput> <HuluBtn>Redeem</HuluBtn></TabSubTitle2>
                            </TabStyles2>
                        </TabStyles>

                        <TabStyles className="subscription-wrapper">
                            <ConstructionLogo className="subscription-construction" src="static/images/comingsoon2.jpg" />
                            <TabStyles2 className="subscription">
                                <TabTitle>Your Subscription</TabTitle>
                                <TabSubTitle className="subscription-info-title">Payment Date</TabSubTitle>
                                    <TabSubTitle2 className="subscription-info">05-15-2018 <HuluBtn>pay now</HuluBtn></TabSubTitle2>
                                <TabSubTitle className="subscription-info-title">Your Next Charge</TabSubTitle>
                                    <TabSubTitle2 className="subscription-info">$8.48<span> includes tax</span></TabSubTitle2>
                                <TabSubTitle className="subscription-info-title">Hulu Base Plan</TabSubTitle>
                                    <TabSubTitle2 className="subscription-info">Limited Commercials <HuluBtn>change plan</HuluBtn></TabSubTitle2>
                                <TabSubTitle className="subscription-info-title">Add-ons</TabSubTitle>
                                    <TabSubTitle2 className="subscription-info">None <HuluBtn>manage</HuluBtn></TabSubTitle2>
                                <TabSubTitle className="subscription-info-title">Monthly Recurring Total </TabSubTitle>
                                    <TabSubTitle2 className="subscription-info">$7.99/month</TabSubTitle2>
                            </TabStyles2>
                        </TabStyles>

                        <TabStyles className="privacy">
                            <TabTitle>Privacy Settings</TabTitle>
                            <TabSubTitle className="privacy-info-title" style={{marginTop: "25px"}}>Manage Email Notifications<EmailModal btnStyles={HuluBtn1} /></TabSubTitle>
                            <TabSubTitle2 className="privacy-info"></TabSubTitle2>
                            <TabSubTitle className="privacy-info-title" style={{marginTop: "25px"}}>View Terms of Use <HuluBtn>view</HuluBtn></TabSubTitle>
                            <TabSubTitle2 className="privacy-info"></TabSubTitle2>
                            <TabSubTitle className="privacy-info-title" style={{marginTop: "25px"}}>Protect Your Account <HuluBtn>protect</HuluBtn></TabSubTitle>
                            <TabSubTitle2 className="privacy-info"></TabSubTitle2>
                        </TabStyles>
                        <TabStyles className="settings">
                            <TabTitle>Account Settings</TabTitle>
                            <TabSubTitle className="settings-info-title" style={{marginTop: "25px"}}>Hold Your Subscription<HuluBtn>hold</HuluBtn></TabSubTitle>
                            <TabSubTitle2 className="settings-info"></TabSubTitle2>
                            <TabSubTitle className="settings-info-title" style={{marginTop: "25px"}}>Cancel Your Subscription <HuluBtn>cancel</HuluBtn></TabSubTitle>
                            <TabSubTitle2 className="settings-info"></TabSubTitle2>
                            <TabSubTitle className="settings-info-title" style={{marginTop: "25px"}}>Account Status 
                            <AcctDelModal btnStyles={HuluBtn1} />
                            </TabSubTitle>
                            <TabSubTitle2 className="settings-info"></TabSubTitle2>
                        </TabStyles>
                    </Rightbox>
                </HuluContainer>
            </div>
        )
    }
}

HuluBox.contextType = PrivacyContext;


export default HuluBox;