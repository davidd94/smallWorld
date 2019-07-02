import React from 'react';

import NavBarSection from './navbar-present';


const NavBar = (props) => {

    const handleLogOut = () => {
        localStorage.clear();
        window.location.href = '/reactdev-home';
    };

    return <NavBarSection handleLogOut={handleLogOut}
                            scrollState={props.scrollState}
                            scrollSleep={props.scrollSleep}
                            scrollAwake={props.scrollAwake} />
};


export default NavBar;