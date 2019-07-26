import React, { useState } from 'react';

import ModalBox from './reactstrapModal-present';


const ReactModal = (props) => {

    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    return <ModalBox toggle={toggle}
                    modal={modal}
                    handleSave={props.handleSave}
                            linkEnabled={props.linkEnabled}
                            linkText={props.linkText}
                            btnColor={props.btnColor}
                            btnStyles={props.btnStyles}
                            buttonLabel={props.buttonLabel}
                            modalClassName={props.modalClassName}
                            modalTitleText={props.modalTitleText}
                            modalBodyText={props.modalBodyText}
                            modalConfirm={props.modalConfirm}
                            modalBtnStyles={props.modalBtnStyles}
                            modalCancel={props.modalCancel}
                            />
};


export default ReactModal;