import React from 'react';
import {Card,
        CardBody,
        CardHeader,
} from 'reactstrap';

import styles from './styles/resultsCardStyles.module';



const ResultsCardBox = (props) => {
    return (
        <Card className={styles.card} style={props.disableHover ? {transform: 'scale(1)', opacity: 1} : null}>
            <div className={styles.cardContent}>
                <div className={styles.cardHeader} style={{backgroundColor: props.headerBGColor}}>
                    <h2 className={styles.cardHeading}>{props.headerText}</h2>
                </div>
                <CardBody className={styles.cardBody}>
                    {props.children}
                </CardBody>
            </div>
        </Card>
    );
};


export default ResultsCardBox;