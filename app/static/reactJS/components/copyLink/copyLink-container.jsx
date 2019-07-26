import React, { useState } from 'react';

import CopyLinkPresent from './copyLink-present';


const CopyLinkContainer = (props) => {
    const [copyLink, setCopyLink] = useState(false);

    const handleCopyLink = () => {
        setCopyLink(true);

        setTimeout(() => {
            setCopyLink(false);
        }, 3000);
    };

    return (
        <CopyLinkPresent linkText={props.linkText}
                        handleCopyLink={handleCopyLink}
                        copyLink={copyLink} />
    );
};

CopyLinkContainer.defaultProps = {
    linkText: 'Share It'
};

export default CopyLinkContainer;