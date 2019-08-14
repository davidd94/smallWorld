import React from 'react';


const ProfileBodyProjectsPresent = (props) => {
    return (
        <div style={props.bodyView === 'projects' ? props.bodyStyles.active : props.bodyStyles.container} className={props.bodyView === 'projects' ? 'wow fadeInRight' : ''}>
            <p>User's project #1</p>
            <p>User's project #2</p>
            <p>etc...</p>
        </div>
    );
};


export default ProfileBodyProjectsPresent;