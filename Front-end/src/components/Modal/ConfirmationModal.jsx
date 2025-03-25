// components/ConfirmationModal.jsx
import React from "react";

import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, onCancel, onConfirm, title, message }) => {
  return (
    <Modal show={isOpen} onHide={onCancel}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </Modal>
  );
};

// Definir PropTypes en vez de TypeScript
ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmationModal;
