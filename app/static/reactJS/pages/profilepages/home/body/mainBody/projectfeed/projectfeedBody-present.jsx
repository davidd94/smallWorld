import React from 'react';


const ProfileBodyFeedPresent = (props) => {
    return (
        <div style={props.bodyView === 'projectfeed' ? props.bodyStyles.active : props.bodyStyles.container} className={props.bodyView === 'projectfeed' ? 'wow fadeInRight' : ''}>
            <p>Follower's Project update #1</p>
            <p>Follower's Project update #2</p>
            <p>etc...</p>
        </div>
    );
};


export default ProfileBodyFeedPresent;