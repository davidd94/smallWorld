import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
    Form,
} from 'reactstrap';


function FormTest() {
    return (
        <Form>
            <Link to='/testingreact'>To navbar!</Link>
        </Form>
    )
}


export default FormTest;