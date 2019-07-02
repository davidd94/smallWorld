import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import WOW from 'wow.js';

import LoginBox from './login-present';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setMsg] = useState('');
    const [error, setError] = useState('none');
    const [shake, setShake] = useState('');

    useEffect(() => {
        const wow = new WOW();
        wow.init();
    });

    const handleUser = (e) => {
        setUsername(e.target.value);
        setShake('');
    };

    const handlePassword = (e) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
        setPassword(e.target.value);
        setShake('');
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
                    setError('red');
                    setMsg(authResponse);
                    setShake('wow shake');
                    return false
                } else if (authResponse == 'Reached maximum login attempts. Please reset your password.') {
                    setError('red');
                    setMsg(authResponse);
                    setShake('wow shake');
                    return false
                };
                localStorage.setItem('token', authResponse['token']);
                window.location.href = '/reactdev-home';
            });
        });
    };

    if (localStorage.getItem('token')) {
        return <Redirect to='/reactdev-home' />;
    };

    return (
        <LoginBox handleSubmit={handleSubmit}
                    handleUser={handleUser}
                    handlePassword={handlePassword}
                            errorMsg={errorMsg}
                            error={error}
                            shake={shake} />
    );
};


export default Login;