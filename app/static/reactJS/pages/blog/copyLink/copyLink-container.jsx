import React, { useState, useEffect } from 'react';

import CopyLinkPresent from './copyLink-present';


const CopyLinkContainer = (props) => {
    const [copyLink, setCopyLink] = useState(false);
    const [timeoutID, setTimeoutID] = useState('');

    useEffect(() => {
        return () => {
            clearTimeout(timeoutID);
        };
    }, [timeoutID]);

    const handleCopyLink = () => {
        let urlData = {'title': props.urlTitle, 'destination': props.urlDestination};
        setCopyLink(true);

        fetch('/api/urlshortener', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(urlData)
        })
        .then(res => {
            res.json().then(response => {
                console.log(response);
            });
        });

        let timeout = setTimeout(() => {
            setCopyLink(false);
        }, 3000);
        
        setTimeoutID(timeout);
    };

    return (
        <CopyLinkPresent linkText={props.linkText}
                        handleCopyLink={handleCopyLink}
                        copyLink={copyLink} />
    );
};

CopyLinkContainer.defaultProps = {
    linkText: 'Share It',
    urlTitle: 'No Title',
    urlDestination: null
};

export default CopyLinkContainer;