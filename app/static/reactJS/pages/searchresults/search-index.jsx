import React from 'react';
import {Container, Row, Col
} from 'reactstrap';

import ResultsCardContainer from './resultsCard/resultsCard-container';
import styles from './_styles/searchStyles.module';


const SearchResults = (props) => {
    return (
        <div className={styles.searchContainer}>
            <Container style={{width: '100%', height: '100%', padding: '5rem 0'}}>
                <Row className="justify-content-center" style={{height: '100%'}}>
                    <Col md={12} lg={8} offset={{ lg:4 }}>
                        <ResultsCardContainer searchInput={props.match.params.searchinput} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default SearchResults;