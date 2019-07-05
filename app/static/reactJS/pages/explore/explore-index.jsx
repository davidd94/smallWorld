import React from 'react';
import {Container, Row,
} from 'reactstrap';

import ResultsCards from './resultsCard/resultsCard-present';
import QueryProjectInfo from '../../components/_queryuserinfo/projectInfo';
import BGImage from '../../../images/homepage-background.jpg';


const ExploreContainerStyle = {
    width: '100%',
    height: '100vh',
    background: `url(${BGImage})`,
    backgroundSize: 'cover'
}

const Explore = () => {
    return (
        <div style={ExploreContainerStyle}>
            <QueryProjectInfo>
                <Container style={{width: '100%', height: '100%', padding: '5rem 0'}}>
                    <Row style={{height: '100%'}}>
                        <ResultsCards />
                    </Row>
                </Container>
            </QueryProjectInfo>
        </div>
    );
};


export default Explore;