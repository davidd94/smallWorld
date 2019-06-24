import React from 'react';

import { Modal } from '../../../components/popupModal/container-modal';


const FreeModal = (props) => {
    return (
        <div id="modalSubFree" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <Modal title="Free Subscription"
                        bodyType="custom"
                        btnConfirm="Confirm"
                        customElems="Are you sure you want to downgrade to Free subscription? If you confirm, your current subscription will be active until expired."
                        onClick={props.onClick} />
        </div>
    );
};


export default FreeModal;