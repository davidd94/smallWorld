import React, { useState } from 'react';

import ModalBox from './reactstrapModal-present';


const ReactModal = (props) => {

    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    return <ModalBox toggle={toggle}
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
                            />
};


export default ReactModal;