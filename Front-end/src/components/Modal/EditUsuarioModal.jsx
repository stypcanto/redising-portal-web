// components/Modal/EditUsuarioModal.jsx
import React from "react";

const EditUsuarioModal = ({ isOpen, onClose, userData, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Editar Usuario</h2>
        <input type="text" defaultValue={userData?.name} />
        <button onClick={onSave}>Guardar</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default EditUsuarioModal;