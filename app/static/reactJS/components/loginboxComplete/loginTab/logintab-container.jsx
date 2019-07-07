import React, { useState, useEffect } from 'react';
import WOW from 'wow.js';

import LoginTabBox from './logintab-present';


const LoginTab = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorColor, setErrorColor] = useState('');
    const [innerErrorMsg, setInnerError] = useState('');

    useEffect(() => {
        const wow = new WOW();
        wow.init();
    });

    const handleUser = (e) => {
        setUsername(e.target.value);
        props.handleShake(false);
    };

    const handlePassword = (e) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
        setPassword(e.target.value);
        props.handleShake(false);
    };

    const handleSubmit = () => {
        let data = {
            'username': username,
            'password': password
        };

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then((response) => {
            response.json().then((authResponse) => {
                if (authResponse == 'Invalid Username and Password combination!') {
                    setErrorColor('red');
                    props.handleShake(true);

                    if (props.enableInnerErrorMsg == true) {
                        setInnerError(authResponse);
                    };
                    if (props.handleCustomError != false) {
                        // automatically uses server response as the error message
                        props.handleCustomError(authResponse);
                    };

                    return false
                } else if (authResponse == 'Reached maximum login attempts. Please reset your password.') {
                    setErrorColor('red');
                    props.handleShake(true);

                    if (props.enableInnerErrorMsg == true) {
                        setInnerError(authResponse);
                    };
                    if (props.handleCustomError != false) {
                        // automatically uses server response as the error message
                        props.handleCustomError(authResponse);
                    };

                    return false
                };
                localStorage.setItem('token', authResponse['token']);
                window.location.href = '/reactdev-home';
            });
        });
    };

    return (
        <LoginTabBox handleSubmit={handleSubmit}
                    handleUser={handleUser}
                    handlePassword={handlePassword}
                            errorColor={errorColor}
                            innerErrorMsg={innerErrorMsg} />
    );
};


export default LoginTab;