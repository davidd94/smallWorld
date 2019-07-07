import React from 'react';

import FeedbackBox from '../../../components/feedbackBox/feedbackBox-present';


const FeedbackAlert = (props) => {

    const ErrorMsg = (props) => {
        if (props.customError === 'Invalid Username and Password combination!') {
            return (
                <FeedbackBox alertColor='danger' isOpen={true} handleCustomDismiss={props.handleCustomError} >
                    <p style={{textAlign: 'center'}}>Invalid Username and Password login. Please try again.</p>
                </FeedbackBox>
            );
        } else if (props.customError === 'Reached maximum login attempts. Please reset your password.') {
            return (
                <FeedbackBox alertColor='danger' isOpen={true} handleCustomDismiss={props.handleCustomError} >
                    <p style={{textAlign: 'center'}}>You've reached your <strong>maximum</strong> log in attempts. Please reset your account password.</p>
                </FeedbackBox>
            );
        } else {
            return <FeedbackBox isOpen={false} handleError={props.handleError} />
        }
    };

    return <ErrorMsg customError={props.customError} handleCustomError={props.handleCustomError} />
};


export default FeedbackAlert;