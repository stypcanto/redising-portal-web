import React, { useState, useEffect } from "react";

const EditUsuarioModal = ({ isOpen, onClose, userData, onSave }) => {
  const [editedData, setEditedData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Listas desplegables
  const profesiones = [
    "Ingenieria",
    "Administración",
    "Derecho",
    "Administración en Salud",
    "Comunicador",
    "Tec. Informática",
    "Medicina",
    "Odontología",
    "Medicina Veterinaria",
    "Enfermería",
    "Técnico en Enfermería",
    "Terapia Física y Rehabilitación",
    "Terapia Ocupacional",
    "Terapia del Lenguaje",
    "Nutrición y Dietética",
    "Psicología",
    "Tecnología Médica en Terapia Física y Rehabilitación",
    "Tecnología Médica en Radiología",
    "Tecnología Médica en Optometría",
    "Tecnología Médica en Audiología",
    "Tecnología Médica en Laboratorio Clínico y Anatomía Patológica",
    "Obstetricia",
    "Otro (Especificar)"
  ];

  const tiposContrato = ["CAS", "728", "Locador"];
  const roles = ["Superadmin", "Admin", "Usuario"];

  // Especialidades por profesión
  const especialidades = {
    Medicina: [
      "Medicina Interna", "Cardiología", "Neumología", "Gastroenterología",
      "Endocrinología", "Neurología", "Reumatología", "Infectología",
      "Nefrología", "Hematología", "Geriatría", "Medicina Física y Rehabilitación",
      "Cirugía General", "Cirugía Cardiovascular", "Cirugía de Cabeza y Cuello",
      "Cirugía Plástica y Reconstructiva", "Cirugía Pediátrica", "Neurocirugía",
      "Traumatología y Ortopedia", "Urología", "Cirugía Oncológica",
      "Ginecología y Obstetricia", "Pediatría", "Neonatología", "Medicina Fetal",
      "Anestesiología", "Medicina Intensiva", "Medicina de Emergencias y Desastres",
      "Psiquiatría", "Psiquiatría Infantil y del Adolescente", "Radiología",
      "Patología Clínica", "Medicina Nuclear", "Anatomía Patológica",
      "Medicina Familiar y Comunitaria", "Medicina Ocupacional y Medio Ambiente",
      "Salud Pública", "Epidemiología"
    ],
    Enfermería: [
      "Enfermería Médico-Quirúrgica", "Enfermería en Cuidados Intensivos",
      "Enfermería en Urgencias y Emergencias", "Enfermería en Salud Materna y Neonatal",
      "Enfermería Pediátrica", "Enfermería Familiar y Comunitaria",
      "Enfermería en Salud Pública", "Enfermería en Epidemiología",
      "Gestión en Enfermería", "Docencia en Enfermería",
      "Enfermería en Medicina Física y Rehabilitación",
      "Enfermería en Salud Ocupacional"
    ],
    Ingenieria: [
      "Ingeniería Industrial", "Ingeniería Eléctrica", "Ingeniería Electrónica",
      "Ingeniería de Telecomunicaciones", "Ingeniería Biomédica", "Ingeniería de Sistemas",
      "Ingeniería de Software", "Ingeniería Informática", "Ingeniería de Ciberseguridad",
      "Ingeniería en Ciencia de Datos", "Ingeniería en Inteligencia Artificial", 
      "Ingeniería Empresarial"
    ],
    Otro: []
  };

  // Inicializar los datos editados cuando cambia userData
  useEffect(() => {
    if (userData) {
      setEditedData({ ...userData });
      setErrors({});
    }
  }, [userData]);

  const handleChange = (field, value) => {
    // Validar teléfono si es el campo
    if (field === 'telefono') {
      // Solo permitir números y máximo 9 dígitos
      if (value && (!/^\d*$/.test(value) || value.length > 9)) {
        return;
      }
    }

    const newData = { ...editedData, [field]: value };
    setEditedData(newData);
    
    // Resetear error si se modifica el campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Si cambia la profesión, resetear especialidad si no corresponde
    if (field === 'profesion') {
      if (value !== 'Medicina' && value !== 'Enfermería' && value !== 'Ingenieria') {
        newData.especialidad = '';
      }
      setEditedData(newData);
    }

    // Validar especialidad si es "Otro"
    if (field === 'especialidad' && editedData.profesion === 'Otro (Especificar)') {
      validateFields();
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!editedData.dni) newErrors.dni = "DNI es requerido";
    if (!editedData.nombres) newErrors.nombres = "Nombres son requeridos";
    if (!editedData.rol) newErrors.rol = "Rol es requerido";
    
    // Validar teléfono
    if (editedData.telefono && editedData.telefono.length !== 9) {
      newErrors.telefono = "El teléfono debe tener 9 dígitos";
    }
    
    // Validar especialidad si profesión es "Otro"
    if (editedData.profesion === 'Otro (Especificar)' && !editedData.especialidad) {
      newErrors.especialidad = "Debe especificar la especialidad";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSaving(true);

    try {
      const dataToSend = {
        ...editedData,
        fecha_nacimiento: editedData.fecha_nacimiento || null
      };

      const response = await fetch(`http://localhost:5001/personal/${editedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      
      if (data.success) {
        setNotification({ 
          show: true, 
          message: 'Usuario actualizado correctamente', 
          type: 'success' 
        });
        setTimeout(() => {
          onSave(data.user);
          onClose();
        }, 1500);
      } else {
        setNotification({ 
          show: true, 
          message: data.message || "Error al actualizar usuario", 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({ 
        show: true, 
        message: "Error al conectar con el servidor", 
        type: 'error' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Campos excluidos de la edición
  const excludedFields = ['id', 'fecha_registro', 'estado'];

  // Formatear nombres de campos
  const formatFieldName = (field) => {
    const fieldNames = {
      dni: 'DNI',
      nombres: 'Nombres Completos',
      apellido_paterno: 'Apellido Paterno',
      apellido_materno: 'Apellido Materno',
      fecha_nacimiento: 'Fecha de Nacimiento',
      sexo: 'Género',
      correo: 'Correo Electrónico',
      telefono: 'Teléfono',
      domicilio: 'Dirección',
      profesion: 'Profesión',
      especialidad: 'Especialidad',
      colegiatura: 'N° Colegiatura',
      tipo_contrato: 'Tipo de Contrato',
      rol: 'Rol en el Sistema'
    };

    return fieldNames[field] || field.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  // Función para obtener las especialidades según profesión
  const getEspecialidades = () => {
    if (editedData.profesion === 'Medicina') return especialidades.Medicina;
    if (editedData.profesion === 'Enfermería') return especialidades.Enfermeria;
    if (editedData.profesion === 'Ingenieria') return especialidades.Ingenieria;
    return [];
  };

  // Agrupación de campos
  const fieldGroups = [
    {
      title: 'Información Personal',
      icon: '👤',
      fields: ['nombres', 'apellido_paterno', 'apellido_materno', 'dni', 'sexo', 'fecha_nacimiento']
    },
    {
      title: 'Datos de Contacto',
      icon: '📱',
      fields: ['correo', 'telefono', 'domicilio']
    },
    {
      title: 'Información Profesional',
      icon: '💼',
      fields: ['profesion', 'especialidad', 'colegiatura', 'tipo_contrato']
    },
    {
      title: 'Datos del Sistema',
      icon: '🔐',
      fields: ['rol']
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-[1001]`}>
          {notification.message}
        </div>
      )}
      
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-xl">
          {/* Encabezado */}
          <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Editar Usuario</h2>
                <p className="text-blue-100">Modifique los campos necesarios</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white rounded-full hover:bg-blue-700"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {fieldGroups.map((group) => {
              const fieldsToShow = group.fields.filter(
                field => editedData[field] !== undefined && !excludedFields.includes(field)
              );

              if (fieldsToShow.length === 0) return null;

              return (
                <div key={group.title} className="mb-8 last:mb-0">
                  <div className="flex items-center mb-4">
                    <span className="mr-3 text-2xl">{group.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fieldsToShow.map((field) => (
                      <div key={field} className="p-4 rounded-lg bg-gray-50">
                        <label className="block mb-1 text-sm font-medium text-gray-500">
                          {formatFieldName(field)}
                        </label>
                        
                        {field === 'dni' || field === 'rol' ? (
                          <input
                            type="text"
                            value={editedData[field] || ''}
                            readOnly
                            className="w-full p-2 text-gray-800 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed"
                          />
                        ) : field === 'telefono' ? (
                          <>
                            <input
                              type="text"
                              value={editedData[field] || ''}
                              onChange={(e) => handleChange(field, e.target.value)}
                              className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={9}
                            />
                            {errors.telefono && (
                              <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                            )}
                          </>
                        ) : field === 'sexo' ? (
                          <select
                            value={editedData[field] || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Seleccionar</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                          </select>
                        ) : field === 'fecha_nacimiento' ? (
                          <input
                            type="date"
                            value={editedData[field] || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : field === 'profesion' ? (
                          <select
                            value={editedData[field] || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Seleccionar profesión</option>
                            {profesiones.map(profesion => (
                              <option key={profesion} value={profesion}>{profesion}</option>
                            ))}
                          </select>
                        ) : field === 'especialidad' ? (
                          editedData.profesion === 'Otro (Especificar)' ? (
                            <>
                              <input
                                type="text"
                                value={editedData[field] || ''}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Especifique la especialidad"
                              />
                              {errors.especialidad && (
                                <p className="mt-1 text-sm text-red-600">{errors.especialidad}</p>
                              )}
                            </>
                          ) : (
                            <select
                              value={editedData[field] || ''}
                              onChange={(e) => handleChange(field, e.target.value)}
                              disabled={!['Medicina', 'Enfermería', 'Ingenieria'].includes(editedData.profesion)}
                              className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              <option value="">Seleccionar especialidad</option>
                              {getEspecialidades().map(especialidad => (
                                <option key={especialidad} value={especialidad}>{especialidad}</option>
                              ))}
                            </select>
                          )
                        ) : field === 'tipo_contrato' ? (
                          <select
                            value={editedData[field] || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Seleccionar tipo</option>
                            {tiposContrato.map(tipo => (
                              <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={editedData[field] || ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                        
                        {errors[field] && field !== 'telefono' && field !== 'especialidad' && (
                          <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie de página */}
          <div className="flex justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUsuarioModal;