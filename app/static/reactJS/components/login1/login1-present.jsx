import React from 'react';
import {Form,
        FormGroup, 
        Input,
        Label,
        Button
} from 'reactstrap';

import styles from './styles/login1-specific.module';


const LoginForm = (props) => {
    return (
        <Form>
            <FormGroup>
                <Input type='hidden' name='csrf_token' value={props.csrfToken} />
            </FormGroup>
            <FormGroup >
                <Input type='text' placeholder='User Name' className={styles.loginInput} />
            </FormGroup>
            <FormGroup>
                <Input type='password' placeholder='Password' className={styles.loginInput} />
            </FormGroup>
            <FormGroup>
                <Label check >
                    <Input type='checkbox' />
                    Remember me
                </Label>
            </FormGroup>
            <Button onClick={props.onSubmit} >Log In</Button>
        </Form>
    );
};

const LoginBox1 = (props) => {
    return (
        <div className={styles.loginContainer} >
            <img src={props.profileimg} className={styles.loginProfileImage} />
            <p className={styles.loginProfileName}>{props.profilename}</p>
            <LoginForm csrfToken={props.csrfToken} onSubmit={props.onSubmit} />
        </div>
    );
};


export default LoginBox1;