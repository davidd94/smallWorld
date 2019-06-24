import React, { Component } from 'react';
import { Button } from 'reactstrap';


class SubscriptionPayModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stripeLoading: true,
            csrf_token: 'none',
            stripe_key: 'none',
            user_existing_sub: 'free',
            sub_style: {color: 'white'},
            sub_text: 'SUBSCRIBE',
            sub_btn: false,
        };

        // onStripeUpdate must be bound or else clicking on button will produce error.
        this.onStripeUpdate = this.onStripeUpdate.bind(this);
        // binding loadStripe as a best practice, not doing so does not seem to cause error.
        this.loadStripe = this.loadStripe.bind(this);
    };

    loadStripe(onload) {
        if(! window.StripeCheckout) {
            const script = document.createElement('script');
            script.onload = function () {
                onload();
            };
            script.src = 'https://checkout.stripe.com/checkout.js';
            document.body.appendChild(script);
        } else {
            onload();
        }
    }

    setSubscription() {
        if (this.props.type == this.state.user_existing_sub) {
            this.setState({
                sub_style: {opacity: 0.7, backgroundColor: '#0062E6'},
                sub_text: 'SUBSCRIBED',
                sub_btn: true,
            });
        } else {
            this.setState({
                sub_style: {color: 'white'},
                sub_text: 'SUBSCRIBE',
                sub_btn: false,
            });
        }
    };

    componentDidMount() {
        var that = this;
        fetch('/subscription/preload', {
            method: 'GET',
            header: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            response.json().then(function (data) {
                that.setState({
                    csrf_token: data.csrf_token,
                    stripe_key: data.stripe_key,
                    user_existing_sub: data.user_sub,
                });
            });
        })
        .then(() => {
            this.loadStripe(() => {
                var stripeKey = this.state.stripe_key;
                this.stripeHandler = window.StripeCheckout.configure({
                    key: stripeKey,
                    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                    locale: 'auto',
                    token: (token) => {
                        this.setState({ loading: true });
                        // use fetch or some other AJAX library here if you dont want to use axios
                        fetch('/subscription/pay', {
                            method: 'POST',
                            credentials: "include",
                            mode: "cors",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'X-CSRFToken': this.state.csrf_token
                            },
                            body: JSON.stringify({
                                'stripeEmail': 'testing1230@gg.com',
                                'amount': this.props.amount,
                                'subtype': this.props.type,
                                'stripeToken': token.id
                            }),
                        })
                        .then(function (response) {
                            response.json().then(function (msg) {
                                if (msg == 'You have successfully subscribed!') {
                                    window.location = '/subscription/thankyou'
                                } else if (msg == 'There was an error processing payment... please contact the sales department') {
                                    alert(msg);
                                }
                            });
                        });
                    }
                });

                this.setSubscription();
    
                this.setState({
                    stripeLoading: false,
                    // loading needs to be explicitly set false so component will render in 'loaded' state.
                    loading: false,
                });
            });
        })
    }

    componentWillUnmount() {
        if(this.stripeHandler) {
            this.stripeHandler.close();
        };
    };

    onStripeUpdate(e) {
        this.stripeHandler.open({
            name: this.props.type,
            description: 'Subscription',
            panelLabel: 'Subscribe for ' + (this.props.amount == '499' ? "$4.99" : "$9.99"),
            allowRememberMe: false,
        });
        e.preventDefault();
    };

    render() {
        const { stripeLoading, loading } = this.state;
        return (
            <div>
                {(loading || stripeLoading)
                    ? <Button color='primary' style={this.props.btnStyles}>processing..</Button>
                    : <Button
                            onClick={this.onStripeUpdate}
                            color='primary'
                            style={this.props.btnStyles}
                            disabled={this.state.sub_btn}>{this.state.sub_text}</Button>
                }
            </div>
        );
    };
};


export default SubscriptionPayModal;