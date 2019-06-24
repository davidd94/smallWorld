import React from 'react';
import {Container,
        Row,
        Col,
        Card,
        CardBody,
        CardTitle,
        Button
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import styles from './styles/login.module';


const LoginBox = () => {
    return (
        <Container>
            <Row className='justify-content-center'>
                <Card>
                    <CardBody>
                        <NavLink to='/reactdev-register'><Button color='primary'>Sign Up</Button></NavLink>
                        <CardTitle className='mb-4 mt-1'>Sign In</CardTitle>
                        <hr />
                        
                    </CardBody>
                </Card>
            </Row>
        </Container>
    );
};


export default LoginBox;