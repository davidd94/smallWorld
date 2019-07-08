import React, { useState } from 'react';

import AcctResetTabBox from './acctResetTab-present';


const AcctResetTabContainer = (props) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [serverError, setServerError] = useState('');

    const handleInputs = (e) => {
        let inputType = e.target.name;
        props.handleShake('');
        
        
        if (inputType === 'email') {
            setEmail(e.target.value);
            if (!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value))) {
                setEmailError('A valid email is required');
                setServerError('A valid email is required');
            } else {
                setEmailError('ok');
                setServerError('');
            };
        };
    };

    const handleSubmit = () => {
        if (emailError === 'ok') {
                let data = {
                    'email': email
                };

                fetch('/api/reset_user_password', {
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
                        if (response === 'A new password link will be sent to your email.') {
                            setServerError(response);
                            
                            // resetting states to inital values
                            setEmail('');
                            setEmailError('');
                        } else {
                            setServerError(response);
                            setEmailError('');
                            props.handleShake(true);
                        }
                    });
                });
            } else {
                props.handleShake(true);
            }
    };

    return <AcctResetTabBox handleInputs={handleInputs}
                            handleSubmit={handleSubmit}
                            email={email}
                            emailError={emailError}
                            serverError={serverError} />
};


export default AcctResetTabContainer;