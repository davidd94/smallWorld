import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
    Navbar,
} from 'reactstrap';


function NavBar() {
    return (
        <Navbar color='#78C2AD' xs={12}>
            <Link to='/meep'>To meep</Link>
        </Navbar>
    )
}


export default NavBar;