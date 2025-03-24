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
    rol: "Usuario",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.nombres || !formData.apellido_paterno || !formData.dni) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (formData.dni.length !== 8 || isNaN(formData.dni)) {
      alert("El DNI debe tener 8 dígitos numéricos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      alert("Por favor, introduce un correo válido.");
      return;
    }

    handleAddUser(formData);
    handleClose();
  };

  const fields = [
    { label: "Nombres", name: "nombres", type: "text" },
    { label: "Apellido Paterno", name: "apellido_paterno", type: "text" },
    { label: "Apellido Materno", name: "apellido_materno", type: "text" },
    { label: "DNI", name: "dni", type: "text" },
    { label: "Correo", name: "correo", type: "email" },
    { label: "Teléfono", name: "telefono", type: "text" },
    { label: "Fecha de Nacimiento", name: "fecha_nacimiento", type: "date" },
    { label: "Sexo", name: "sexo", type: "text" },
    { label: "Domicilio", name: "domicilio", type: "text" },
    { label: "Profesión", name: "profesion", type: "text" },
    { label: "Especialidad", name: "especialidad", type: "text" },
    { label: "Tipo de Contrato", name: "tipo_contrato", type: "text" },
  ];

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg">
        <h2 className="mb-6 text-2xl font-semibold text-center">Agregar Usuario</h2>

        {/* Grid de 3 columnas en pantallas grandes, 1 columna en pantallas pequeñas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields.map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-1 font-medium text-gray-700">{label}:</label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex justify-end mt-6 space-x-4">
          <button className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600" onClick={handleClose}>
            Cancelar
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700" onClick={handleSubmit}>
            Agregar Usuario
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUsuarioModal;
