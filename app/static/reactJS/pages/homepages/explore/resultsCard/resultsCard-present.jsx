import React, { useContext } from 'react';
import {Col,
} from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ResultsCardBox from '../../../../components/resultsCard/resultsCard-present';
import { ProjectContext } from '../../../../components/_context/ProjectContext';
import styles from './styles/imp-resultsCardStyles.module';


const CardStyleProps = {
    popular : { headerColor: '#85144b',
                headerText: 'Most Popular'},
    trending : { headerColor: '#2196F3',
                headerText: 'Trending Now'},
    newProj : { headerColor: '#E65100',
                headerText: 'Recently New'},
};

const ResultsCards = () => {
    let data = useContext(ProjectContext);

    const PopularProjects = (data.PopularProjects).map((project, index) => {
        const key = project.key ? `key-${project.key}` : `index-${index}`;
        return (
            <li key={key}>
                <div className={styles.projectTitleWrapper}>
                    <a className={styles.projectTitle}>{project.title}</a>
                    <span className={styles.projectLikes}>{project.likes} Likes</span>
                </div>
                <p className={styles.projectTags}>
                    <a href="#"> {project.aquariums == true ? 'Aquariums' : null} </a>
                    <a href="#"> {project.saltwater == true ? 'Saltwater' : null} </a>
                    <a href="#"> {project.freshwater == true ? 'Freshwater' : null} </a>
                    <a href="#"> {project.terrariums == true ? 'Terrariums' : null} </a>
                    <a href="#"> {project.enclosedtropical == true ? 'Enclosed Tropical' : null} </a>
                    <a href="#"> {project.opentropical == true ? 'Open Tropical' : null} </a>
                    <a href="#"> {project.carnivorous == true ? 'Carnivorous' : null} </a>
                    <a href="#"> {project.desert == true ? 'Desert' : null} </a>
                    <a href="#"> {project.reptiles == true ? 'Reptiles' : null} </a>
                    <a href="#"> {project.vivariumpaludarium == true ? 'Vivarum/Paludarium' : null} </a>
                    <a href="#"> {project.plantsonly == true ? 'Plants Only' : null} </a>
                </p>
            </li>
        );
    });

    const TrendingProjects = (data.TrendingProjects).map((project, index) => {
        const key = project.key ? `key-${project.key}` : `index-${index}`;
        return (
            <li key={key}>
                <div className={styles.projectTitleWrapper}>
                    <a className={styles.projectTitle}>{project.title}</a>
                    <span className={styles.projectLikes}>{project.likes} Likes</span>
                </div>
                <p className={styles.projectTags}>
                    <a href="#"> {project.aquariums == true ? 'Aquariums' : null}</a>
                    <a href="#"> {project.saltwater == true ? 'Saltwater' : null}</a>
                    <a href="#"> {project.freshwater == true ? 'Freshwater' : null}</a>
                    <a href="#"> {project.terrariums == true ? 'Terrariums' : null}</a>
                    <a href="#"> {project.enclosedtropical == true ? 'Enclosed Tropical' : null}</a>
                    <a href="#"> {project.opentropical == true ? 'Open Tropical' : null}</a>
                    <a href="#"> {project.carnivorous == true ? 'Carnivorous' : null}</a>
                    <a href="#"> {project.desert == true ? 'Desert' : null}</a>
                    <a href="#"> {project.reptiles == true ? 'Reptiles' : null}</a>
                    <a href="#"> {project.vivariumpaludarium == true ? 'Vivarum/Paludarium' : null}</a>
                    <a href="#"> {project.plantsonly == true ? 'Plants Only' : null}</a>
                </p>
            </li>
        );
    });

    const NewProjects = (data.NewProjects).map((project, index) => {
        const key = project.key ? `key-${project.key}` : `index-${index}`;
        return (
            <li key={key}>
                <div className={styles.projectTitleWrapper}>
                    <a className={styles.projectTitle}>{project.title}</a>
                    <span className={styles.projectLikes}>{project.likes} Likes</span>
                </div>
                <p className={styles.projectTags}>
                    <a href="#"> {project.aquariums == true ? 'Aquariums,' : null}</a>
                    <a href="#"> {project.saltwater == true ? 'Saltwater,' : null}</a>
                    <a href="#"> {project.freshwater == true ? 'Freshwater,' : null}</a>
                    <a href="#"> {project.terrariums == true ? 'Terrariums,' : null}</a>
                    <a href="#"> {project.enclosedtropical == true ? 'Enclosed Tropical,' : null}</a>
                    <a href="#"> {project.opentropical == true ? 'Open Tropical,' : null}</a>
                    <a href="#"> {project.carnivorous == true ? 'Carnivorous,' : null}</a>
                    <a href="#"> {project.desert == true ? 'Desert,' : null}</a>
                    <a href="#"> {project.reptiles == true ? 'Reptiles,' : null}</a>
                    <a href="#"> {project.vivariumpaludarium == true ? 'Vivarum/Paludarium,' : null}</a>
                    <a href="#"> {project.plantsonly == true ? 'Plants Only,' : null}</a>
                </p>
            </li>
        );
    });

    return (
        <>
            <Col xs={12} md={12} lg={4} className='my-1' style={{height: '100%'}}>
                <ResultsCardBox headerBGColor={CardStyleProps.popular.headerColor}
                                headerText={CardStyleProps.popular.headerText} >
                    <ul className={styles.cardUL}>
                    <PerfectScrollbar>
                        {PopularProjects}
                    </PerfectScrollbar>
                    </ul>
                </ResultsCardBox>
            </Col>
            <Col xs={12} md={12} lg={4} className='my-1' style={{height: '100%'}}>
                <ResultsCardBox headerBGColor={CardStyleProps.trending.headerColor}
                                headerText={CardStyleProps.trending.headerText}>
                    <ul className={styles.cardUL}>
                    <PerfectScrollbar>
                        {TrendingProjects}
                    </PerfectScrollbar>
                    </ul>
                </ResultsCardBox>
            </Col>
            <Col xs={12} md={12} lg={4} className='my-1' style={{height: '100%'}}>
                <ResultsCardBox headerBGColor={CardStyleProps.newProj.headerColor}
                                headerText={CardStyleProps.newProj.headerText}>
                    <ul className={styles.cardUL}>
                    <PerfectScrollbar>
                        {NewProjects}
                    </PerfectScrollbar>
                    </ul>
                </ResultsCardBox>
            </Col>
        </>
    );
};


export default ResultsCards;