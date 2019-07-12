import React from 'react';
import {
    Row, Col,
    FormGroup, InputGroup, Input, Button
} from 'reactstrap';

import styles from './styles/AcctResetTabStyles.module';
import RecaptchaV2 from '../../reCaptcha/reCaptcha-index';


const AcctResetTabBox = (props) => {

    const AcctResetHeader = (props) => {
        if (props.serverError) {
            return (
                <p style={{color: (props.serverError === 'A new password link will be sent to your email.' ? 'green' : 'red')}}>{props.serverError}</p>
            );
        } else {
            return (
                <p>Reset Account Password Request</p>
            );
        };
    };

    return (
        <InputGroup className={styles.acctResetContainer}>
            <Row className={styles.acctResetHeader}>
                <Col md={12} lg={10} offset={{ lg: 2 }}>
                    <AcctResetHeader serverError={props.serverError} />
                </Col>
            </Row>
            <Row style={{width: '100%', marginTop: '1rem', marginBottom: '1rem', justifyContent: 'center'}}>
                <Col md={12} lg={8} offset={{ lg: 4 }}>
                    <FormGroup>
                        <Input placeholder='Email'
                                name="email"
                                value={props.email}
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: (props.emailError == 'ok' || props.emailError == '' ? '' : 'red'), textAlign: 'center'}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={12} className="my-3">
                    <RecaptchaV2 handleRecaptchaToken={props.handleRecaptchaToken} />
                </Col>
            </Row>
            <Row style={{width: '100%', marginTop: '2rem', marginBottom: '2rem', justifyContent: 'center'}}>
                <Col md={12} lg={12} className='text-center'>
                    <Button onClick={props.handleSubmit} color="primary">Submit</Button>
                </Col>
            </Row>
        </InputGroup>
    );
};


export default AcctResetTabBox;