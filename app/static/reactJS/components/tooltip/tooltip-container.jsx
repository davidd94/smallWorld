import React, { useState } from 'react';

import TooltipPresent from './tooltip-present';


const TooltipContainer = (props) => {
    const [tooltipOpen, setOpen] = useState(false);

    const handleHover = () => {
        setOpen(!tooltipOpen);
    };

    return <TooltipPresent idTag={props.idTag}
                            text={props.text}
                            direction={props.direction}
                            tooltipOpen={tooltipOpen}
                            handleHover={handleHover} />
};


export default TooltipContainer;