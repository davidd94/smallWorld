import React, { Component } from 'react';

import SubscriptionBox from './subscription-present';


class SubscriptionContainer extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        fetch('/api/subscription_modify', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            response.json().then((msg) => {
                if (msg == 'Subscription changes saved!') {
                    alert(msg);
                    window.location.href = '/reactdev-home';
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