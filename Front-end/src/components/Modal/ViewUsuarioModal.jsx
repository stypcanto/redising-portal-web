import React from "react";

const ViewUsuarioModal = ({ isOpen, onClose, userData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Detalles del Usuario</h2>
        <p>Nombre: {userData?.name}</p>
        <p>Email: {userData?.email}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ViewUsuarioModal;