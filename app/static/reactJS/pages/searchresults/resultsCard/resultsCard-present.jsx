import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ResultsCardBox from '../../../components/resultsCard/resultsCard-present';
import styles from './styles/search-resultsCardStyles.module';



const ResultsCard = React.forwardRef((props, ref) => {
    let SearchResultsList;
    let data = props.results;

    if (data !== 'no results' && data !== false) {
        SearchResultsList = () => {
            return (data).map((project, index) => {
                const key = project.key ? `key-${project.key}` : `index-${index}`;
                return (
                    <li key={key}>
                        <div className={styles.projectTitleWrapper}>
                            <a className={styles.projectTitle}>{project.title}</a>
                            <span className={styles.projectLikes}>{project.likes} Likes</span>
                        </div>
                        <p className={styles.projectTags}>
                            <a href="#"> {project.tags.aquariums == true ? 'Aquariums,' : null}</a>
                            <a href="#"> {project.tags.saltwater == true ? 'Saltwater,' : null}</a>
                            <a href="#"> {project.tags.freshwater == true ? 'Freshwater,' : null}</a>
                            <a href="#"> {project.tags.terrariums == true ? 'Terrariums,' : null}</a>
                            <a href="#"> {project.tags.enclosedtropical == true ? 'Enclosed Tropical,' : null}</a>
                            <a href="#"> {project.tags.opentropical == true ? 'Open Tropical,' : null}</a>
                            <a href="#"> {project.tags.carnivorous == true ? 'Carnivorous,' : null}</a>
                            <a href="#"> {project.tags.desert == true ? 'Desert,' : null}</a>
                            <a href="#"> {project.tags.reptiles == true ? 'Reptiles,' : null}</a>
                            <a href="#"> {project.tags.vivariumpaludarium == true ? 'Vivarum/Paludarium,' : null}</a>
                            <a href="#"> {project.tags.plantsonly == true ? 'Plants Only,' : null}</a>
                        </p>
                    </li>
                );
            })
        };
    } else {
        SearchResultsList = () => {
            return (
                <li style={{border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <p style={{textAlign: 'center', fontWeight: 600}}>No Results...</p>
                </li>
            );
        };
    };

    return (
        <ResultsCardBox headerBGColor={'maroon'} headerText={'Search Results'} disableHover={true}>
            <div className={styles.inputContainer}>
                <input ref={ref}
                        onKeyUp={props.handleKeyUp}
                        onChange={props.handleInput}
                        onBlur={props.handleBlur}
                        className={styles.searchInputX}
                        type="text"
                        placeholder="Search..." />
                <div className={styles.searchInputIcon}></div>
            </div>
            <ul className={styles.cardUL}>
                <SearchResultsList />
            </ul>
        </ResultsCardBox>
    );
});


export default ResultsCard;