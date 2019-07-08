import React, { useState } from 'react';
import {TabContent, TabPane,
        Nav, NavItem, NavLink,
        Row, Col
} from 'reactstrap';

import LoginTab from './loginTab/logintab-container';
import RegistrationFormContainer from './registerTab/registration-container';
import AcctResetTabContainer from './acctResetTab/acctResetTab-container';
import styles from './_styles/userLoginTabsStyles.module';


const UserLoginTabs = (props) => {
    const [activeTab, setTab] = useState('1');
    const [shake, setShake] = useState('');

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setTab(tab);
            setShake('');
        };
    };

    const handleShake = (boolean) => {
        if (boolean) {
            setShake('wow shake');
        } else {
            setShake('');
        }
    };
    
    return (
        <div className={shake} style={{backgroundColor: 'white', width: '100%', height: '100%', borderRadius: '0.3rem'}}>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === '1' ? styles.customActive : ''}
              onClick={ () => {toggle('1')} }
            >
              Sign In
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '2' ? styles.customActive : ''}
              onClick={ () => {toggle('2')} }
            >
              Register
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '3' ? styles.customActive : ''}
              onClick={ () => {toggle('3')} }
            >
              Account Reset
            </NavLink>
          </NavItem>
        </Nav>


        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <LoginTab handleCustomError={props.handleCustomError}
                          handleShake={handleShake}
                          enableInnerErrorMsg={props.enableInnerErrorMsg} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <RegistrationFormContainer handleShake={handleShake} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <AcctResetTabContainer handleShake={handleShake} />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
};

// Allows OUTSIDE custom error msg, if prop is anything but false
// to disable inner error message by passing prop 'enableInnerErrorMsg' as false boolean
UserLoginTabs.defaultProps = {
    enableInnerErrorMsg : true,
    handleCustomError : false,
}


export default UserLoginTabs;