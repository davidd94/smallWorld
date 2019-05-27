import React, { Component } from "react";
import { HuluBox } from "./hulu-present.jsx";



export class HuluContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: 'none',
            lastName: 'none',
            userName: 'none',
            email: 'none'
        }

        this.handleClick = this.handleClick.bind(this);
    };

    handleClick(e) {
        var TabIcons = document.getElementsByClassName('settings-nav')[0].children;
        var i;

        // RESETS ALL ICONS TO BE DESELECTED
        for (i=0; i < TabIcons.length; i++) {
            TabIcons[i].children[0].setAttribute('style', 'color: #ffffff; transform: scale(1.0);');
        }
        e.currentTarget.children[0].setAttribute('style', 'color: #3fb6a8; transform: scale(1.3);');

        // RESETS ALL TABS TO BE HIDDEN
        var RightBox = document.getElementsByClassName('rightbox')[0].children;
        for (i=0; i < RightBox.length; i++) {
            RightBox[i].setAttribute('style', 'opacity: 0; z-index: -1;');
        }
        
        var currentIconID = e.currentTarget.id;
        if (currentIconID == 'profile') {
            document.getElementsByClassName('profile')[0].setAttribute('style', 'opacity: 1; z-index: 500;');
        } else if (currentIconID == 'payment') {
            document.getElementsByClassName('payment-wrapper')[0].setAttribute('style', 'opacity: 1; z-index: 500;');
        } else if (currentIconID == 'subscription') {
            document.getElementsByClassName('subscription-wrapper')[0].setAttribute('style', 'opacity: 1; z-index: 500;');
        } else if (currentIconID == 'privacy') {
            document.getElementsByClassName('privacy')[0].setAttribute('style', 'opacity: 1; z-index: 500;');
        } else if (currentIconID == 'settings') {
            document.getElementsByClassName('settings')[0].setAttribute('style', 'opacity: 1; z-index: 500;');
        }
    };

    componentDidMount() {
        const that = this;

        fetch('/fetch_api/privacy_info', {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(function (response) {
            response.json().then(function (data) {
                that.setState({
                    firstName: data.firstname,
                    lastName: data.lastname,
                    userName: data.username,
                    email: data.email
                });
            });
        });
    };

    render() {
        return (
            <HuluBox onClick={this.handleClick}
                    username={this.state.userName}
                    firstname={this.state.firstName}
                    lastname={this.state.lastName}
                    email={this.state.email} />
        )
    }
}