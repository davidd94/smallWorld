import React from 'react';

import styles from './styles/copyLinkStyles.module';


const CopyLinkPresent = (props) => {
    return (
        <li className={(["mx-2", styles.linkText]).join(' ')}><span onClick={props.handleCopyLink} style={{cursor: 'pointer'}}><i className="fas fa-link mx-2" style={props.copyLink ? {color: '#3396ff'} : {}} />{props.linkText}</span>
            <div className={styles.linkCopiedBox} style={props.copyLink ? {display: 'inline-flex', opacity: 1, visibility: 'visible'} : {}}>
                <p className={styles.linkCopiedText}><i className="fa fa-check" style={{color: 'green'}} /> Copied Link</p>
            </div>
        </li>
    );
};


export default CopyLinkPresent;