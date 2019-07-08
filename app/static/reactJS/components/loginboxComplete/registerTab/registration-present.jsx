import React from 'react';
import {
    Row, Col,
    FormGroup, InputGroup, Input, Button
} from 'reactstrap';

import styles from './styles/registrationStyles.module';


const RegistrationHeader = (props) => {
    if (props.serverError) {
        return <p style={{color: (props.serverError == 'New account created !' ? 'green' : 'red')}}>{props.serverError}</p>
    } else {
        return <p>Sign up to create your own smallWorld account for free !</p>
    };
};

const RegistrationFormBox = (props) => {
    return (
        <InputGroup className={styles.registerContainer}>
            <Row className={styles.registerHeader}>
                <Col md={12} lg={10} offset={{ lg: 2 }}>
                    <RegistrationHeader serverError={props.serverError} />
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={6}>
                    <FormGroup>
                        <Input placeholder='First Name'
                                name="firstname"
                                value={props.firstname}
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: (props.firstNameError == 'ok' || props.firstNameError == '' ? '' : 'red')}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={6}>
                    <FormGroup>
                        <Input placeholder='Last Name'
                                name="lastname"
                                value={props.lastname}
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: (props.lastNameError == 'ok' || props.lastNameError == '' ? '' : 'red')}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={12}>
                    <FormGroup>
                        <Input placeholder='User Name'
                                name="username"
                                value={props.username}
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: (props.userNameError == 'ok' || props.userNameError == '' ? '' : 'red')}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={12}>
                    <FormGroup>
                        <Input placeholder='Email'
                                name="email"
                                value={props.email}
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: (props.emailError == 'ok' || props.emailError == '' ? '' : 'red')}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={6}>
                    <FormGroup>
                        <Input placeholder='Password'
                                name="password"
                                value={props.password}
                                onChange={props.handleInputs}
                                type="password"
                                style={{borderColor: (props.passwordError == 'ok' || props.passwordError == '' ? '' : 'red')}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={6}>
                    <FormGroup>
                        <Input placeholder='Retype Password'
                                name="repassword"
                                value={props.repassword}
                                onChange={props.handleInputs}
                                type="password"
                                style={{borderColor: (props.repasswordError == 'ok' || props.repasswordError == '' ? '' : 'red')}} />
                    </FormGroup>
                </Col>
            </Row>
            <Row style={{width: '100%', marginTop: '2rem', marginBottom: '2rem'}}>
                <Col md={12} lg={12} className='text-center'>
                    <Button onClick={props.handleSubmit} color="primary">Submit</Button>
                </Col>
            </Row>
        </InputGroup>
    );
};


export default RegistrationFormBox;