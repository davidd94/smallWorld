import React, { useState } from 'react';

import RegistrationFormBox from './registration-present';


const RegistrationFormContainer = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');

    const [error, setError] = useState([]);
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    console.log('rendering register container..');
    const handleInputs = (e) => {
        let inputType = e.target.name;
        
        if (inputType === 'firstname') {
            setFirstname(e.target.value);
        } else if (inputType === 'lastname') {
            setLastname(e.target.value);
        } else if (inputType === 'username') {
            setUsername(e.target.value);
        } else if (inputType === 'email') {
            setEmail(e.target.value);
        } else if (inputType === 'password') {
            setPassword(e.target.value);
        } else if (inputType === 'repassword') {
            setRepassword(e.target.value);
        };
    };

    const handleSubmit = () => {
        console.log(error);
        console.log(firstname);
        console.log(firstname.length);
        console.log(firstNameError);
        if (firstname.length == 0) {
            setFirstNameError('red');
            setError(error.push('First name is required'));
        } else {
            setFirstNameError('');
        };
        if (lastname.length == 0) {
            setLastNameError('red');
            setError(error.push('Last name is required'));
        } else {
            setLastNameError('');
        };
        if (username.length < 5) {
            setUserNameError('red');
            setError(error.push('Username must be a minimum of 5 characters'));
        } else {
            setUserNameError('');
        };
        if (!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))) {
            setEmailError('red');
            setError(error.push('A valid email is required'));
        } else {
            setEmailError('');
        };
        if (password.length < 5) {
            setPasswordError('red');
            setError(error.push('Password must be a minimum of 5 characters'));
        } else {
            setPasswordError('');
        };
        if (repassword !== password) {
            setRepasswordError('red');
            setError(error.push('Your passwords do not match'));
        } else {
            setRepasswordError('');
        };

        if (firstNameError == '' && lastNameError == '' &&
            userNameError == '' && emailError == '' &&
            passwordError == '' && repasswordError == '') {
                let data = {
                    'firstname': firstname,
                    'lastname': lastname,
                    'username': username,
                    'email': email,
                    'password': password,
                    'repassword': repassword
                };
                console.log(data);

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
                        console.log(response);
                    });
                });
            };
    };

    return <RegistrationFormBox handleInputs={handleInputs}
                                handleSubmit={handleSubmit}
                                    firstNameError={firstNameError}
                                    lastNameError={lastNameError}
                                    userNameError={userNameError}
                                    emailError={emailError}
                                    passwordError={passwordError}
                                    repasswordError={repasswordError} />
};


export default RegistrationFormContainer;