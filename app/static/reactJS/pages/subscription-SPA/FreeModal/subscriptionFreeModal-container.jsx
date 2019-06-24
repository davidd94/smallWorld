import React, { Component } from 'react';

import FreeModal from './subscriptionFreeModal-present';


class SubscriptionFreeModal extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        fetch('/subscription/modify', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
    };

    render() {
        return (
            <FreeModal onClick={this.handleClick} />
        );
    };
};


export default SubscriptionFreeModal;