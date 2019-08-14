import React from 'react';
import { Tooltip } from 'reactstrap';


const TooltipPresent = (props) => {
    return (
        <>
            <i className="far fa-question-circle" id={"Tooltip" + props.idTag} />
            <Tooltip placement={props.direction} isOpen={props.tooltipOpen} toggle={props.handleHover} target={"Tooltip" + props.idTag}>
                {props.text}
            </Tooltip>
        </>
    );
};


TooltipPresent.defaultProps = {
    text: 'N/A',
    direction: 'right'
}


export default TooltipPresent;