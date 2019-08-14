import React from 'react';

import styles from './_styles/projectsNavStyles.module';


const ProjectsNavPresent = () => {
    return (
        <div className={styles.projectsNav}>
            <div className={styles.projectsNavHeading}>
                <h3>Projects</h3>
            </div>
            <div className={([styles.projectsNavBody, 'text-center']).join(' ')}>
                <ul className={styles.projectsList}>
                    <li><abbr title='TESTING ABRR'><a href='#'><img src='https://www.bootdey.com/template_demo/clean-note/img/Friends/guy-2.jpg'/></a></abbr></li>
                    <li><abbr title='TESTING ABRR'><a href='#'><img src='https://www.bootdey.com/template_demo/clean-note/img/Friends/guy-2.jpg'/></a></abbr></li>
                    <li><abbr title='TESTING ABRR'><a href='#'><img src='https://www.bootdey.com/template_demo/clean-note/img/Friends/guy-2.jpg'/></a></abbr></li>
                    <li><abbr title='TESTING ABRR'><a href='#'><img src='https://www.bootdey.com/template_demo/clean-note/img/Friends/guy-2.jpg'/></a></abbr></li>
                    <li><abbr title='TESTING ABRR'><a href='#'><img src='https://www.bootdey.com/template_demo/clean-note/img/Friends/guy-2.jpg'/></a></abbr></li>
                    <li><abbr title='TESTING ABRR'><a href='#'><img src='https://www.bootdey.com/template_demo/clean-note/img/Friends/guy-2.jpg'/></a></abbr></li>
                </ul>
            </div>
        </div>
    );
};


export default ProjectsNavPresent;