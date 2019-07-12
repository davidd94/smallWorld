import React, { useState } from 'react';

import RegistrationFormBox from './registration-present';


const RegistrationFormContainer = (props) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [serverError, setServerError] = useState('');

    const [recaptchaToken, setRecaptchaToken] = useState('');
    
    const handleInputs = (e) => {
        let inputType = e.target.name;
        props.handleShake('');
        
        if (inputType === 'firstname') {
            setFirstname(e.target.value);
            if (e.target.value.length == 0) {
                setFirstNameError('First name is required');
                setServerError('First name is required');
            } else {
                setFirstNameError('ok');
                setServerError('');
            };
        } else if (inputType === 'lastname') {
            setLastname(e.target.value);
            if (e.target.value.length == 0) {
                setLastNameError('Last name is required');
                setServerError('Last name is required');
            } else {
                setLastNameError('ok');
                setServerError('');
            };
        } else if (inputType === 'username') {
            setUsername(e.target.value);
            if (e.target.value.length < 5) {
                setUserNameError('Username must be a minimum of 5 characters');
                setServerError('Username must be a minimum of 5 characters');
            } else {
                setUserNameError('ok');
                setServerError('');
            };
        } else if (inputType === 'email') {
            setEmail(e.target.value);
            if (!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value))) {
                setEmailError('A valid email is required');
                setServerError('A valid email is required');
            } else {
                setEmailError('ok');
                setServerError('');
            };
        } else if (inputType === 'password') {
            setPassword(e.target.value);
            if (e.target.value.length < 5 || e.target.value !== repassword) {
                setPasswordError('Password must be a minimum of 5 characters and must match');
                setServerError('Password must be a minimum of 5 characters and must match');
            } else {
                setPasswordError('ok');
                setServerError('');
            };
        } else if (inputType === 'repassword') {
            setRepassword(e.target.value);
            if (e.target.value !== password) {
                setRepasswordError('Your passwords do not match');
                setServerError('Your passwords do not match');
            } else {
                setRepasswordError('ok');
                setPasswordError('ok');
                setServerError('');
            };
        };
    };

    const handleSubmit = () => {
        if (firstNameError === 'ok' && lastNameError === 'ok' &&
            userNameError === 'ok' && emailError === 'ok' &&
            passwordError === 'ok' && repasswordError === 'ok' &&
            recaptchaToken !== '') {
                let data = {
                    'firstname': firstname,
                    'lastname': lastname,
                    'username': username,
                    'email': email,
                    'password': password,
                    'repassword': repassword,
                    'recaptcha': recaptchaToken
                };

                fetch('/api/register', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then((res) => {
                    res.json().then((response) => {
                        if (response === 'New account created !') {
                            setServerError(response);
                            
                            // resetting states to inital values
                            setFirstname('');
                            setLastname('');
                            setUsername('');
                            setEmail('');
                            setPassword('');
                            setRepassword('');

                            setFirstNameError('');
                            setLastNameError('');
                            setUserNameError('');
                            setEmailError('');
                            setPasswordError('');
                            setRepasswordError('');
                        } else {
                            setServerError(response);
                            if (response === 'That user name has already been taken.') {
                                setUserNameError('User name taken');
                            } else {
                                setUserNameError('ok');
                            };
                            if (response === 'Maximum of 50 characters is allowed for your email address.') {
                                setEmailError('Invalid Email');
                            } else {
                                setEmailError('ok');
                            };
                            if (response === 'Password must be 5-30 characters.') {
                                setPasswordError('Invalid password');
                            } else {
                                setPasswordError('ok');
                            };
                            props.handleShake(true);
                        }
                    });
                });
            } else {
                props.handleShake(true);
            };
    };

    const handleRecaptchaToken = (token) => {
        setRecaptchaToken(token);
    };

    return <RegistrationFormBox handleInputs={handleInputs}
                                handleSubmit={handleSubmit}
                                    firstname={firstname}
                                    lastname={lastname}
                                    username={username}
                                    email={email}
                                    password={password}
                                    repassword={repassword}
                                        firstNameError={firstNameError}
                                        lastNameError={lastNameError}
                                        userNameError={userNameError}
                                        emailError={emailError}
                                        passwordError={passwordError}
                                        repasswordError={repasswordError}
                                        serverError={serverError}
                                            handleRecaptchaToken={handleRecaptchaToken} />
};


export default RegistrationFormContainer;