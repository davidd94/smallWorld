import React, { Component } from 'react';

import SubscriptionBox from './subscription-present';


class SubscriptionContainer extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        fetch('/subscription/modify', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            response.json().then((msg) => {
                if (msg == 'Subscription changes saved!') {
                    window.location = '/subscriptions'
                }
            })
        })
    }

    render() {
        return (
            <SubscriptionBox onClick={this.handleClick} />
        );
    }
};


export default SubscriptionContainer;