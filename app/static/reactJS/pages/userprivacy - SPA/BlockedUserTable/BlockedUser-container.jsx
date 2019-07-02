import React, { Component } from "react";

import BlockedUserTable from "./BlockedUser-present.jsx";


class BlockedUserContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blockedUsers: this.props.blockedUsers
        }
        
        this.handleBlock = this.handleBlock.bind(this);
    };

    handleBlock(e, index) {
        const that = this;
        var username = e.currentTarget.dataset.user;
        var url = new URL('https://smallworld.live/unblock/' + username);
        var params = {redirect: 'privacy-settings'};
        url.search = new URLSearchParams(params);
        fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                that.updateBlockedList(index);
            })
        });
    };

    updateBlockedList(index) {
        this.state.blockedUsers.splice(index, 1);

        // UPDATE STATE CHANGES FOR REACT TO DYNAMICALLY RENDER CHANGES
        this.setState({
            blockedUsers: this.state.blockedUsers
        })
    }

    render() {
        return (
            <BlockedUserTable blockedUsers={this.state.blockedUsers}
                                onClick={this.handleBlock} />
        )
    };
};


export default BlockedUserContainer