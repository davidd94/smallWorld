import React, { useState } from 'react';
import { Input } from 'reactstrap';

import ReactModal from '../../../../components/reactstrapModal/reactstrapModal-container';


const AcctDelModal = (props) => {

    const [confirm, setConfirm] = useState('none');
    const [check, setCheck] = useState('none');
    const [xmark, setXmark] = useState('none');

    let modalBtnStyles = (confirm != 'none') ? { backgroundColor: 'red', pointerEvents: confirm } : { pointerEvents: confirm };

    const handleKeyInput = (e) => {
        if (e.target.value === 'I understand the terms and wish to delete my account permanently') {
            setConfirm('auto');
            setCheck('block');
            setXmark('none');
        } else {
            setConfirm('none');
            setXmark('block');
            setCheck('none');
        };
    };

    const handleSave = () => { 
        const token = localStorage.getItem('token');
        
        let confirmation = {'confirmation': 'Proceed to delete'};

        fetch('/api/delete_acct', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(confirmation),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            },
        })
        .then(function (response) {
            response.json().then(function (data) {
                if (data == 'Account successfully deleted!') {
                    window.location.href = '/reactdev-home';
                } else {
                    alert(data);
                };
            });
        });
    };

    const CustomModalBody = () => {
        const iconStyle = {
            position: 'absolute',
            left: '0.5rem',
            top: '50%',
            transform: 'translate(0, -50%)'
        }
        return (
            <>
                <p style={{textAlign: 'center'}}>Please enter ( <strong style={{color: 'red'}}>I understand the terms and wish to delete my account permanently</strong> ) to permanently delete your account.</p>
                <p style={{textAlign: 'center'}}><strong style={{color: 'red'}}>WARNING: </strong> THE ACCOUNT WILL BE UNRESTORABLE !</p>
                <label style={{textAlign: 'center', width: '100%', display: 'inline-block', position: 'relative'}}>
                    <i className="fas fa-check" style={{color: 'rgb(0,255,0)', display: check, ...iconStyle}} />
                    <i className="fas fa-times" style={{color: 'red', display: xmark, ...iconStyle}} />
                    <Input onKeyUp={handleKeyInput} placeholder="Enter confirmation here" className="text-center" style={{width: '100%', paddingLeft: '2.5rem'}} />
                </label>
            </>
        );
    };

    return (
        <ReactModal 
            btnColor="warning"
            handleSave={handleSave}
                btnStyles={props.btnStyles}
                buttonLabel="Deactivate"
                modalClassName="none"
                modalTitleText="Account Deletion" 
                modalBodyText={CustomModalBody()}
                modalConfirm="DELETE"
                modalBtnStyles={modalBtnStyles}
                modalCancel="Cancel">
        </ReactModal>
    )
}


export default AcctDelModal;