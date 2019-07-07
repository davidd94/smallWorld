import React from 'react';
import {Card, CardBody, CardTitle,
        Form, FormGroup, Input, Button,
} from 'reactstrap';

import styles from './styles/logintab.module';


const LoginTabBox = (props) => {
    return (
        <Card className={styles.cardStyles}>
            <CardBody>
                <CardTitle className={styles.signUpTitle}>Sign In</CardTitle>
                <p style={{fontSize: '1rem', color: 'red', textAlign: 'center'}}>{props.innerErrorMsg}</p>
                <hr />
                <Form>
                    <FormGroup>
                        <div className='input-group'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text'><i className='fa fa-user' /></span>
                        </div>
                        <Input autoFocus onKeyUp={props.handleUser} type='text' placeholder='User name' style={{borderColor: props.errorColor}} />
                        </div>
                    </FormGroup>
                    <FormGroup className='mb-5'>
                        <div className='input-group'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text'><i className='fa fa-lock' /></span>
                        </div>
                        <Input onKeyUp={props.handlePassword} type='password' placeholder='*******' style={{borderColor: props.errorColor}}/>
                        </div>
                    </FormGroup>
                    <FormGroup style={{textAlign: 'center', marginBottom: '2rem'}}>
                        <Button onClick={props.handleSubmit} color='primary'>Login</Button>
                    </FormGroup>
                </Form>
            </CardBody>
        </Card>
    );
};


export default LoginTabBox;