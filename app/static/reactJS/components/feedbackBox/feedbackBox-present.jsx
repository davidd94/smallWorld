import React, { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';


// Add custom html element with text and styles and set alert color
// Alert color styles: primary, secondary, success, danger, warning, info, light, and dark

const FeedbackBox = (props) => {
    const [visible, setVisibility] = useState(false);
    useEffect(() => {
        setVisibility(props.isOpen);
    });

    const onDismiss = () => {
        setVisibility(false);
        if (props.handleCustomDismiss != false ) {
            // default sets custom dismiss to an empty string
            props.handleCustomDismiss();
        };
    };

    return (
        <Alert color={props.alertColor} isOpen={visible} toggle={onDismiss} style={{display: 'flex', justifyItems: 'center'}}>
            {props.children}
        </Alert>
    );
};

FeedbackBox.defaultProps = {
    isOpen : false,
    handleCustomDismiss: false,
}


export default FeedbackBox;