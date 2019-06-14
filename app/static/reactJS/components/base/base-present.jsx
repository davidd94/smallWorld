import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
    Navbar,
} from 'reactstrap';

import { ContainerStyles } from './styles/base-styles';
import NavBar from '../navbar/navbar-present';


function BaseTemplate(props) {
    return (
        <ContainerStyles>
            <Fragment>{props.children}</Fragment>
        </ContainerStyles>
    )
}


export default BaseTemplate;