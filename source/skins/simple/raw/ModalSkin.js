import React from 'react';
import ReactModal from 'react-modal';
import { themr } from 'react-css-themr';
import { MODAL } from '../identifiers';

export default themr(MODAL)((props) => (
  <ReactModal
    contentLabel={props.contentLabel}
    isOpen={props.isOpen}
    onRequestClose={props.onClose}
    shouldCloseOnOverlayClick={props.triggerCloseOnOverlayClick}
    className={props.theme.modal}
    overlayClassName={props.theme.overlay}
  >
    {props.children}
  </ReactModal>
));
