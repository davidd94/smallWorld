import React from 'react';


const ProfileBodyInfoPresent = (props) => {
    return (
        <div style={props.bodyView === 'profile' ? props.bodyStyles.active : props.bodyStyles.container} className={props.bodyView === 'profile' ? 'wow fadeInRight' : ''}>
            <p>First name..</p>
            <p>last name...</p>
            <p>etc...</p>
        </div>
    );
};


export default ProfileBodyInfoPresent;