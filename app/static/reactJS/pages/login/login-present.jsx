import React from 'react';
import {Container, Row, Col,
        Card, CardBody, CardTitle,
        Form, FormGroup, Input, Button,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import styles from './styles/login.module';


const LoginBox = (props) => {
    return (
        <div className={styles.containerWrapper}>
            <Container>
                <Row className='justify-content-center'>
                    <Col xs={12} md={12} lg={5} offset={{ lg: 7 }} className={props.shake}>
                    <Card className={styles.cardStyles}>
                        <CardBody>
                            <CardTitle className={styles.signUpTitle}>Sign In</CardTitle>
                            <NavLink to='/reactdev-register'><Button className={styles.signUpBtn}>Sign Up</Button></NavLink>
                            <p style={{fontSize: '1rem', color: 'red', textAlign: 'center'}}>{props.errorMsg}</p>
                            <hr />
                            <Form>
                                <FormGroup>
                                    <div className='input-group'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text'><i className='fa fa-user' /></span>
                                    </div>
                                    <Input onChange={props.handleUser} type='text' placeholder='User name' style={{borderColor: props.error}} />
                                    </div>
                                </FormGroup>
                                <FormGroup className='mb-5'>
                                    <div className='input-group'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text'><i className='fa fa-lock' /></span>
                                    </div>
                                    <Input onChange={props.handlePassword} type='password' placeholder='*******' style={{borderColor: props.error}}/>
                                    </div>
                                </FormGroup>
                                <FormGroup style={{textAlign: 'center', marginBottom: '2rem'}}>
                                    <Button onClick={props.handleSubmit} color='primary'>Login</Button>
                                </FormGroup>
                                <FormGroup style={{textAlign: 'center'}}>
                                    <NavLink to='/reactdev-forgotpw' style={{color: '#007bff'}}>Forgot password?</NavLink>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default LoginBox;