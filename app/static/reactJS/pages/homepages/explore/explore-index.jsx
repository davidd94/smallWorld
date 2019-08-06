import React from 'react';
import {Container, Row,
} from 'reactstrap';

import ResultsCards from './resultsCard/resultsCard-present';
import QueryProjectInfo from '../../../components/_queryinfo/projectInfo';
import styles from './resultsCard/styles/imp-resultsCardStyles.module';


const Explore = () => {
    return (
        <div className={styles.exploreContainer}>
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