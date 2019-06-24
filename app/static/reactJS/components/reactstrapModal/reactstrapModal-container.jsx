import React, { useState } from 'react';

import ModalBox from './reactstrapModal-present';


const ReactFreeModal = (props) => {

    const [modal, setModal] = useState(false);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    const toggleNested = () => {
        setNestedModal(!nestedModal);
        setCloseAll(false);
    };

    const toggleAll = () => {
        setNestedModal(!nestedModal);
        setCloseAll(true);
    };

    const confirmFree = () => {
        toggleAll();

        fetch('/subscription/modify', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
    };

    return <ModalBox toggle={toggle}
                    toggleNested={toggleNested}
                    toggleAll={toggleAll}
                    modal={modal}
                    nestedModal={nestedModal}
                    closeAll={closeAll}
                    confirmFree={confirmFree}
                            btnColor={props.btnColor}
                            btnStyles={props.btnStyles}
                            buttonLabel={props.buttonLabel}
                            modalClassName={props.modalClassName}
                            modalTitleText={props.modalTitleText}
                            modalBodyText={props.modalBodyText}
                            modalConfirm={props.modalConfirm}
                            modalCancel={props.modalCancel}
                                    nestedModalTitle={props.nestedModalTitle}
                                    nestedModalBody={props.nestedModalBody}
                                    nestedModalConfirm={props.nestedModalConfirm}
                                    nestedModalCancel={props.nestedModalCancel} />
};


export default ReactFreeModal;