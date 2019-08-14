import React, { useState } from 'react';
import ProfileNavPresent from './profileNav-present';


const ProfileNavContainer = (props) => {
    const [hoverTab, setHoverTab] = useState(false);
    
    const handleNavHover = (tab) => {
        setHoverTab(tab);
    };

    return <ProfileNavPresent  handleActiveTab={props.handleActiveTab}
                                activeTab={props.activeTab}
                                handleNavHover={handleNavHover}
                                hoverTab={hoverTab}
                                 />
};


export default ProfileNavContainer;