import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import styles from './styles/reCaptchaStyles.module';


// MAKE SURE TO USE "handleRecaptchaToken" prop name for parent components

const RecaptchaV2 = (props) => {
    const handleVerification = (value) => {
        props.handleRecaptchaToken(value);
    };

    return <ReCAPTCHA sitekey="6LeXGa0UAAAAAAjJeDYYWkxN8XG_r9iOplBrByeA"
                        onChange={handleVerification}
                        className={styles.recaptchaContainer} />
};


export default RecaptchaV2;