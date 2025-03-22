import { useState } from "react";

const AddUsuarioModal = ({ showModal, handleClose, handleAddUser }) => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    dni: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    sexo: "",
    domicilio: "",
    profesion: "",
    especialidad: "",
    tipo_contrato: "",
    rol: "Usuario", // Rol por defecto
    password: "12345678", // Contraseña por defecto
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Llamar a la función que pasa como prop para agregar el usuario
    handleAddUser(formData);
    handleClose(); // Cerrar el modal después de agregar el usuario
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${showModal ? "block" : "hidden"}`}
    >
      <div className="p-6 bg-white rounded-lg w-96">
        <h2 className="mb-4 text-xl font-semibold">Agregar Usuario</h2>

        <div className="mb-4">
          <label htmlFor="nombres" className="block">Nombres:</label>
          <input
            type="text"
            id="nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="apellido_paterno" className="block">Apellido Paterno:</label>
          <input
            type="text"
            id="apellido_paterno"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="apellido_materno" className="block">Apellido Materno:</label>
          <input
            type="text"
            id="apellido_materno"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="dni" className="block">DNI:</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Otros campos como correo, teléfono, etc. */}
        {/* Aquí deberías incluir todos los demás campos necesarios, como correo, telefono, etc. */}

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-white bg-gray-500 rounded-md"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded-md"
            onClick={handleSubmit}
          >
            Agregar Usuario
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUsuarioModal;
