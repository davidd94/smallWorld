import React, { Component } from 'react';

import { Modal } from '../factory/container-modal.jsx';


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
            }
        })
    }

    render() {
        return (
            <Modal title="Free Subscription"
                    bodyType="custom"
                    btnConfirm="Confirm"
                    customElems="Are you sure you want to downgrade to Free subscription? If you confirm, your current subscription will be active until expired."
                    onClick={this.handleClick} />
        );
    }
}

export default SubscriptionFreeModal;