import React, { Component } from "react";


const defaultTitle = {
    textAlign: 'center',
    width: '100%',
};

const defaultWrapper = {
    width: '100%',
    height: '100%'
}

const ModalCloseBtn = {
    position: 'absolute',
    top: '3%',
    right: '3%'
}

export class ModalTitle extends Component {
    render() {
        const title = this.props.title;

        return (
            <div className="modal-header-wrapper" style={defaultWrapper}>
                <h3 className="modal-title" style={defaultTitle}>{title}</h3>
                <button type="button" style={ModalCloseBtn} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        )
    }
}