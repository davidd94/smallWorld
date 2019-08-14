import React from 'react';

import styles from './_styles/followersNavStyles.module';


const FollowersNavPresent = () => {
    return (
        <div className={styles.followersNav}>
            <div className={styles.followersNavHeading}>
                <h3>Friends</h3>
            </div>
            <div className={([styles.followersNavBody, 'text-center']).join(' ')}>
                <ul className={styles.followersList}>
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


export default FollowersNavPresent;