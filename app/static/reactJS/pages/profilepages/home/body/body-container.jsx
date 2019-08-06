import React, { useState } from 'react';

import ProfileBodyPresent from './body-present';


const ProfileBodyContainer = () => {
    const [activeTab, setActiveTab] = useState(false);

    const handleActiveTab = (tab) => {
        console.log(tab);
        setActiveTab(tab);
    };

    return <ProfileBodyPresent activeTab={activeTab}
                                handleActiveTab={handleActiveTab} />
};


export default ProfileBodyContainer;