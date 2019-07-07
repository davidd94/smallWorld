import React from 'react';
import {
    Row, Col,
    Form, FormGroup, InputGroup, Input, Button
} from 'reactstrap';

import styles from './styles/registrationStyles.module';


const RegistrationFormBox = (props) => {
    console.log('rendering registration present...');
    return (
        <InputGroup className={styles.registerContainer}>
            <Row className={styles.registerHeader}>
                <Col md={12} lg={10} offset={{ lg: 2 }}>
                    <p>Sign up to create your own smallWorld account for free!</p>
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={6}>
                    <FormGroup>
                        <Input placeholder='First Name'
                                name="firstname"
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: props.firstNameError}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={6}>
                    <FormGroup>
                        <Input placeholder='Last Name'
                                name="lastname"
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: props.lastNameError}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={12}>
                    <FormGroup>
                        <Input placeholder='User Name'
                                name="username"
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: props.userNameError}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={12}>
                    <FormGroup>
                        <Input placeholder='Email'
                                name="email"
                                onChange={props.handleInputs}
                                autoComplete="something-to-stop-autocomplete"
                                style={{borderColor: props.emailError}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={6}>
                    <FormGroup>
                        <Input placeholder='Password'
                                name="password"
                                onChange={props.handleInputs}
                                type="password"
                                style={{borderColor: props.passwordError}} />
                    </FormGroup>
                </Col>
                <Col md={12} lg={6}>
                    <FormGroup>
                        <Input placeholder='Retype Password'
                                name="repassword"
                                onChange={props.handleInputs}
                                type="password"
                                style={{borderColor: props.repasswordError}} />
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