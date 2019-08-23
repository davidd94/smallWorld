import React, { useState, useRef, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import NavBarSection from './navbar-present';
import socket from '../../../socketio';


const NavBar = (props) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [searchSubmit, setSearchSubmit] = useState(false);
    const [userStatus, setUserStatus] = useState(true);
    const searchRef = useRef();

    useEffect(() => {
        if (searchSubmit && searchVal !== '') {
            setSearchSubmit(false);
            setSearchVal('');
            props.history.push('/reactdev-search/' + searchVal);
            // return <Redirect to={'/reactdev-search/' + searchVal} />
        };

        if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
            setUserStatus(false);
        };
    });

    const onToggle = () => {
        setOpen(!open);
    };

    const searchToggle = (boolean) => {
        setSearch(boolean);
        searchRef.current.focus();
        if (boolean == false) {
            setSearchVal('');
            searchRef.current.value = '';
        };
    };

    const handleSearchInput = (e) => {
        setSearchVal(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.keyCode === 13 && searchVal !== '') {
            setSearch(false);
            setSearchSubmit(true);
        };
    };
    
    const handleLogOut = () => {
        localStorage.clear();
        socket.emit('logout');
        
        window.location.href = '/reactdev-home';
    };

    return <NavBarSection handleLogOut={handleLogOut}
                            onToggle={onToggle}
                            open={open}
                                ref={searchRef}
                                searchToggle={searchToggle}
                                search={search}
                                handleSearchInput={handleSearchInput}
                                handleSearch={handleSearch}
                                    scrollState={props.scrollState}
                                    scrollSleep={props.scrollSleep}
                                    scrollAwake={props.scrollAwake}
                                        disableSearch={props.disableSearch}
                                        userStatus={userStatus} />
};


export default withRouter(NavBar);