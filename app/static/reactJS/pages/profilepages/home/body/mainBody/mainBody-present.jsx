import React from 'react';

import ProfileBodyInfoPresent from './profile/profileBody-present';
import ProfileBodyFeedPresent from './projectfeed/projectfeedBody-present';
import ProfileBodyProjectsPresent from './projects/projectsBody-present';


const MainBodyStyles = {
    container: {
        border: '1px solid #dddddd',
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 1px 1px rgba(0,0,0,.05)',
        opacity: 0,
        visibility: 'hidden',
        transition: '400ms all ease',
        position: 'absolute',
        top: 0,
        width: '100%',
        marginBottom: '1rem',
    },
    active: {
        border: '1px solid #dddddd',
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 1px 1px rgba(0,0,0,.05)',
        opacity: 1,
        visibility: 'visible',
        transition: '400ms all ease',
        position: 'absolute',
        top: 0,
        width: '100%',
        marginBottom: '1rem',
    },
};


const MainBodyPresent = (props) => {
    return (
        <>
            <ProfileBodyFeedPresent bodyView={props.bodyView} bodyStyles={MainBodyStyles} />
            <ProfileBodyInfoPresent bodyView={props.bodyView} bodyStyles={MainBodyStyles} />
            <ProfileBodyProjectsPresent bodyView={props.bodyView} bodyStyles={MainBodyStyles} />
        </>
    );
};


export default MainBodyPresent;