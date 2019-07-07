import React from 'react';

import UserLoginTabs from '../../../components/loginboxComplete/userLoginTabs-index';


const UserLoginTabsSection = (props) => {
    return (
        <UserLoginTabs handleCustomError={props.handleCustomError}
                        enableInnerErrorMsg={props.enableInnerErrorMsg} />
    );
};


export default UserLoginTabsSection;