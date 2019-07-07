import React from 'react';
import {Card, CardBody, CardTitle,
        Form, FormGroup, Input, Button,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import styles from './styles/login2.module';


const LoginBox2 = (props) => {
    return (
        <Card className={styles.cardStyles}>
            <CardBody>
                <CardTitle className={styles.signUpTitle}>Sign In</CardTitle>
                <NavLink to='/reactdev-login'><Button className={styles.signUpBtn}>Sign Up</Button></NavLink>
                <p style={{fontSize: '1rem', color: 'red', textAlign: 'center'}}>{props.errorMsg}</p>
                <hr />
                <Form>
                    <FormGroup>
                        <div className='input-group'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text'><i className='fa fa-user' /></span>
                        </div>
                        <Input autoFocus onKeyUp={props.handleUser} type='text' placeholder='User name' style={{borderColor: props.error}} />
                        </div>
                    </FormGroup>
                    <FormGroup className='mb-5'>
                        <div className='input-group'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text'><i className='fa fa-lock' /></span>
                        </div>
                        <Input onKeyUp={props.handlePassword} type='password' placeholder='*******' style={{borderColor: props.error}}/>
                        </div>
                    </FormGroup>
                    <FormGroup style={{textAlign: 'center', marginBottom: '2rem'}}>
                        <Button onClick={props.handleSubmit} color='primary'>Login</Button>
                    </FormGroup>
                    <FormGroup style={{textAlign: 'center'}}>
                        <NavLink to='/reactdev-login' style={{color: '#007bff'}}>Forgot password?</NavLink>
                    </FormGroup>
                </Form>
            </CardBody>
        </Card>
    );
};


export default LoginBox2;