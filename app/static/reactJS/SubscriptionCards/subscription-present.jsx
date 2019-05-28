import React, { Component } from 'react';
import styled from 'styled-components';

import SubscriptionPayModal from './subscriptionPayModal-container.jsx';
import { Modal } from '../popupModal/factory/container-modal.jsx';


const PriceBtn = styled.button`
    font-size: 80%;
    border-radius: 5rem;
    letter-spacing: .1rem;
    font-weight: bold;
    padding: 1rem;
    opacity: 0.7;
    transition: all 0.2s;
    cursor: pointer;
`

const PricingSection = styled.section`
    width: 100%;
    height: 93vh;
    padding: 2em;
    position: relative;
    z-index: 15;
    background-image: url('/static/homepage-background2.jpg');
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
            <div>
            <PricingSection className="pricing py-5">
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
                            <PriceBtn className="btn btn-block btn-primary text-uppercase" id="sub-free-modal" data-toggle="modal" data-target="#modalSubFree">FREE</PriceBtn>
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
                            <SubscriptionPayModal amount="499" type="Plus"/>
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
                            <SubscriptionPayModal amount="999" type="Pro"/>
                        </div>
                        </PricingCards>
                    </div>
                    </div>
                </div>
            </PricingSection>
            <div id="modalSubFree" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <Modal title="Free Subscription"
                            bodyType="custom"
                            btnConfirm="Confirm"
                            customElems="Are you sure you want to downgrade to Free subscription? If you confirm, your current subscription will be active until expired."
                            onClick={this.props.onClick} />
            </div>
            </div>
        );
    }
}

export default SubscriptionBox;