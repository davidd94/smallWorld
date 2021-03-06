import React, { Component } from 'react';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';

import SubscriptionPayModal from '../PayModal/subscriptionPayModal-container';
import ReactModal2 from '../../../../components/reactstrapModal2/reactstrapModal-container';
import BGImg from '../../../../../images/homepage-background2.jpg';


const btnStyles = {
    color: 'white',
    borderRadius: '2rem',
    letterSpacing: '0.1rem',
    fontWeight: 600,
    padding: '0.5rem',
    width: '100%',
    opacity: 0.9
};

const PricingSection = styled.section`
    width: 100%;
    height: 100vh;
    padding: 5rem 2rem;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 15;
    overflow: hidden;
    background-image: url(${BGImg});
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
`

const PricingCards = styled.div`
    border: none;
    border-radius: 1rem;
    transition: all 0.2s;
    box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);

    :hover {
        margin-top: -.25rem;
        margin-bottom: .25rem;
        box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.3);
    }
`

const Hr = styled.hr`
    margin: 1.5rem 0;
`

const CardTitle = styled.h5`
    margin: 0.5rem 0;
    font-size: 0.9rem;
    letter-spacing: .1rem;
    font-weight: bold;
`

const CardPrice = styled.h6`
    font-size: 3rem;
    margin: 0;
`

const CardPricePeriod = styled.span`
    font-size: 0.8rem;
`

const CardPriceLI = styled.li`
    margin-bottom: 1rem;
`



class SubscriptionBox extends Component {
    render() {
        return (
            <PricingSection className="pricing">
                <PerfectScrollbar style={{width: '100%', padding: '3rem 0'}}>
                <div className="container">
                    <div className="row">
                    <div className="col-lg-4">
                        <PricingCards className="card mb-5 mb-lg-0">
                        <div className="card-body">
                            <CardTitle className="card-title text-muted text-uppercase text-center">Free</CardTitle>
                            <CardPrice className="card-price text-center">$0<CardPricePeriod className="period">/month</CardPricePeriod></CardPrice>
                            <Hr />
                            <ul className="fa-ul">
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Single User</CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>2GB Storage</CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Unlimited Public Projects</CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Community Access</CardPriceLI>
                                <CardPriceLI className="text-muted" style={{opacity: 0.7}}><span className="fa-li"><i className="fas fa-times"></i></span>Private Projects</CardPriceLI>
                                <CardPriceLI className="text-muted" style={{opacity: 0.7}}><span className="fa-li"><i className="fas fa-times"></i></span>Export PDF Features</CardPriceLI>
                            </ul>
                            <ReactModal2 btnColor='primary'
                                        btnStyles={{borderRadius: '2rem', letterSpacing: '0.1rem', fontWeight: 600, padding: '0.5rem', width: '100%', opacity: 0.9}}
                                        buttonLabel='FREE'
                                        modalTitleText='Free Subscription'
                                        modalBodyText='Are you sure you want to downgrade to Free subscription?'
                                        modalConfirm='Downgrade'
                                        modalCancel='Cancel'
                                                nestedModalTitle='Downgrade Confirmation'
                                                nestedModalBody='If you confirm, your current subscription will be active until expired.'
                                                nestedModalConfirm='Confirm'
                                                nestedModalCancel='Cancel' />
                        </div>
                        </PricingCards>
                    </div>

                    <div className="col-lg-4">
                        <PricingCards className="card mb-5 mb-lg-0">
                        <div className="card-body">
                            <CardTitle className="card-title text-muted text-uppercase text-center">Plus</CardTitle>
                            <CardPrice className="card-price text-center">$4.99<CardPricePeriod className="period">/month</CardPricePeriod></CardPrice>
                            <Hr />
                            <ul className="fa-ul">
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span><strong>5 Users</strong></CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span><strong>15GB Storage</strong></CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Unlimited Public Projects</CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Community Access</CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span><strong>15 Private Projects</strong></CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Export PDF Features</CardPriceLI>
                            </ul>
                            <SubscriptionPayModal btnStyles={btnStyles} amount="499" type="Plus"/>
                        </div>
                        </PricingCards>
                    </div>
                    <div className="col-lg-4">
                        <PricingCards className="card">
                        <div className="card-body">
                            <CardTitle className="card-title text-muted text-uppercase text-center">Pro</CardTitle>
                            <CardPrice className="card-price text-center">$9.99<CardPricePeriod className="period">/month</CardPricePeriod></CardPrice>
                            <Hr />
                            <ul className="fa-ul">
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span><strong>Unlimited Users</strong></CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span><strong>50GB Storage</strong></CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Unlimited Public Projects</CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Community Access</CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span><strong>Unlimited Private Projects</strong></CardPriceLI>
                                <CardPriceLI><span className="fa-li"><i className="fas fa-check"></i></span>Export PDF Features</CardPriceLI>
                            </ul>
                            <SubscriptionPayModal btnStyles={btnStyles} amount="999" type="Pro"/>
                        </div>
                        </PricingCards>
                    </div>
                    </div>
                </div>
                </PerfectScrollbar>
            </PricingSection>
        );
    };
};


export default SubscriptionBox;