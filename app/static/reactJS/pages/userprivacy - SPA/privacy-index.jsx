import React from "react";
import { Redirect } from 'react-router-dom';
import styled from "styled-components";

import QueryUserPrivacyInfo from '../../components/_queryuserinfo/privacyUserinfo';
import BlockedUserContainer from './BlockedUserTable/BlockedUser-container';
import HuluContainer from "./huluSettingsBox/hulu-container";


const GridContainer = styled.div`
    width: 100%;
    height: 100%;
    max-width: 100vw;
    margin: 0;
    padding: 3rem 0 1rem 0;
`

const GridRow = styled.div`
    width: 100%;
    max-width: 100vw;
`


const PrivacyIndex = () => {

    // if token isn't available, redirect to login page. this prevents unnecessary server request.
    if (!localStorage.getItem('token')) {
        return <Redirect to='/reactdev-login' />;
    };

    return (
        <QueryUserPrivacyInfo type='all with blocked'>
            <div className="privacy-index-wrapper">
                <GridContainer className="container">
                    <GridRow id="privacy-row" className="row">
                        <HuluContainer />
                        
                        <div className="col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 mb-5">
                        </div>

                        <BlockedUserContainer />
                    </GridRow>
                </GridContainer>
            </div>
        </QueryUserPrivacyInfo>
    );
};


export default PrivacyIndex;