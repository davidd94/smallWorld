import React, { Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalBox = (props) => {
    return (
        <Fragment>
            <Button color={props.btnColor} style={props.btnStyles} onClick={props.toggle}>{props.buttonLabel}</Button>
            <Modal isOpen={props.modal} toggle={props.toggle} className={props.modalClassName}>
                <ModalHeader toggle={props.toggle} style={{fontWeight: 600, display: 'flex', justifyContent: 'center', justifySelf: 'center'}}>
                    <span style={{fontWeight: 600}}>{props.modalTitleText}</span>
                </ModalHeader>
                <ModalBody style={{padding: '2rem', textAlign: 'center'}}>
                    {props.modalBodyText}
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => {props.handleSave(); props.toggle()}} style={{marginRight: 'auto', ...props.modalBtnStyles}}>{props.modalConfirm}</Button>
                    <Button color="secondary" onClick={props.toggle}>{props.modalCancel}</Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};


ModalBox.defaultProps = {
    btnColor: "primary",
    modalConfirm: "Confirm",
    modalCancel: "Close",
};


export default ModalBox;