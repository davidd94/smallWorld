import React, { Component } from "react";
import BlockedUserTable from "./BlockedUser-present.jsx";


class BlockedUserContainer extends Component {
    constructor(props) {
        super(props);


    };

    createUserRow(username, avatar) {
        var userRow = document.createElement('tr');
        userRow.className = 'userrow';
        userRow.id = 'userrow-' + username;

        var userData = document.createElement('td');

        var userName = document.createElement('td');
        userName.textContent = username;

        var userBtnWrap = document.createElement('td');
        userBtnWrap.className = "text-right";

        var userAvatar = document.createElement('img');
        userAvatar.src = avatar;
        userAvatar.style = "width: 4.5em; height: 4.5em; border-radius: 50%;"

        var userLink = document.createElement('a');
        userLink.href = "/profile/" + username;
        userLink.target="_blank";

        var userViewBtn = document.createElement('button');
        userViewBtn.className = "button tiny";
        userViewBtn.textContent = "View User";

        var userUnblockBtn = document.createElement('button');
        userUnblockBtn.className = "button alert tiny";
        userUnblockBtn.textContent = "Unblock";
        userUnblockBtn.style = "margin-left: 1em;"
        userUnblockBtn.dataset.user = username;
        userUnblockBtn.addEventListener('click', (e) => {
            fetch('/fetch_api/unblock/' + username, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then(function (response) {
                response.json().then(function (data) {
                    var removeRow = document.getElementById('userrow-' + username);
                    removeRow.remove();
                })
            });
        });

        userData.appendChild(userAvatar);

        userName;

        userLink.appendChild(userViewBtn);

        userBtnWrap.appendChild(userLink);
        userBtnWrap.appendChild(userUnblockBtn);

        userRow.appendChild(userData);
        userRow.appendChild(userName);
        userRow.appendChild(userBtnWrap);

        return userRow;
    }

    componentDidMount() {
        const that = this;
        fetch('/fetch_api/blocked_users', {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                var i;
                var blockedUserList = document.getElementById('blockeduser-list');
                for (i=0; i < data.length; i++) {
                    var newUserRow = that.createUserRow(data[i].username, data[i].avatar);

                    blockedUserList.appendChild(newUserRow);
                }
            });
        });
    }

    render() {
        return (
            <BlockedUserTable />
        )
    };
};


export default BlockedUserContainer