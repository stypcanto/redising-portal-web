import React, { useState, useEffect } from "react";
import axios from "axios";

// Definir la URL base de la API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const EditUsuarioModal = ({ isOpen, onClose, userData, onSave }) => {
  const [editedData, setEditedData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Listas desplegables organizadas como constantes fuera del componente
  const PROFESIONES = [
    "Ingenieria", "Administración", "Derecho", "Administración en Salud",
    "Comunicador", "Tec. Informática", "Medicina", "Odontología",
    "Medicina Veterinaria", "Enfermería", "Técnico en Enfermería",
    "Terapia Física y Rehabilitación", "Terapia Ocupacional", "Terapia del Lenguaje",
    "Nutrición y Dietética", "Psicología", "Tecnología Médica en Terapia Física y Rehabilitación",
    "Tecnología Médica en Radiología", "Tecnología Médica en Optometría",
    "Tecnología Médica en Audiología", "Tecnología Médica en Laboratorio Clínico y Anatomía Patológica",
    "Obstetricia", "Otro (Especificar)"
  ];

  const TIPOS_CONTRATO = ["CAS", "728", "Locador"];
  const ROLES = ["Superadmin", "Admin", "Usuario"];

  // Especialidades por profesión como objeto constante
  const ESPECIALIDADES = {
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

  // Campos agrupados para mejor organización
  const FIELD_GROUPS = [
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

  // Campos excluidos de la edición
  const EXCLUDED_FIELDS = ['id', 'fecha_registro', 'estado'];

  // Mapeo de nombres de campos para mostrar
  const FIELD_NAMES = {
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

  // Inicializar los datos editados cuando cambia userData
  useEffect(() => {
    if (userData) {
      setEditedData({ ...userData });
      setErrors({});
    }
  }, [userData]);

  // Manejar cambios en los campos del formulario
  const handleChange = (field, value) => {
    // Validar teléfono si es el campo
    if (field === 'telefono') {
      if (value && (!/^\d*$/.test(value) || value.length > 9)) {
        return;
      }
    }

    const newData = { ...editedData, [field]: value };
    
    // Resetear error si se modifica el campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Si cambia la profesión, resetear especialidad si no corresponde
    if (field === 'profesion') {
      if (value !== 'Medicina' && value !== 'Enfermería' && value !== 'Ingenieria') {
        newData.especialidad = '';
      }
    }

    setEditedData(newData);
  };

  // Validar campos del formulario
  const validateFields = () => {
    const newErrors = {};
    
    // Validaciones básicas
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

  // Función para guardar los cambios
  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSaving(true);
    
    try {
      // Preparar los datos para enviar
      const dataToSend = {
        dni: editedData.dni,
        nombres: editedData.nombres,
        apellido_paterno: editedData.apellido_paterno,
        apellido_materno: editedData.apellido_materno,
        fecha_nacimiento: editedData.fecha_nacimiento || null,
        sexo: editedData.sexo || null,
        correo: editedData.correo,
        telefono: editedData.telefono || null,
        domicilio: editedData.domicilio || null,
        profesion: editedData.profesion || null,
        especialidad: editedData.especialidad || null,
        colegiatura: editedData.colegiatura || null,
        tipo_contrato: editedData.tipo_contrato || null,
        rol: editedData.rol
      };

      if (!editedData.id) {
        throw new Error("ID de usuario no válido");
      }

      // Usar axios para la solicitud PUT
      const response = await axios.put(`${API_URL}/personal/${editedData.id}`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setNotification({ 
          show: true, 
          message: 'Usuario actualizado correctamente', 
          type: 'success' 
        });
        setTimeout(() => {
          onSave(response.data.user || response.data.data);
          onClose();
        }, 1500);
      } else {
        throw new Error(response.data.message || "Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      let errorMessage = error.message || "Error al conectar con el servidor";
      
      if (error.response) {
        // Manejar errores de respuesta HTTP
        if (error.response.status === 404) {
          errorMessage = "Usuario no encontrado. Por favor, recarga la lista de usuarios.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      setNotification({ 
        show: true, 
        message: errorMessage, 
        type: 'error' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Función para obtener las especialidades según profesión
  const getEspecialidades = () => {
    if (editedData.profesion === 'Medicina') return ESPECIALIDADES.Medicina;
    if (editedData.profesion === 'Enfermería') return ESPECIALIDADES.Enfermería;
    if (editedData.profesion === 'Ingenieria') return ESPECIALIDADES.Ingenieria;
    return [];
  };

  // Formatear nombres de campos para mostrar
  const formatFieldName = (field) => {
    return FIELD_NAMES[field] || field.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Notificación */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-[1001]`}>
          {notification.message}
        </div>
      )}
      
      {/* Modal */}
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
            {FIELD_GROUPS.map((group) => {
              const fieldsToShow = group.fields.filter(
                field => editedData[field] !== undefined && !EXCLUDED_FIELDS.includes(field)
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
                        
                        {/* Renderizado condicional de cada tipo de campo */}
                        {renderFieldInput(field)}
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

  // Función para renderizar el input adecuado según el tipo de campo
  function renderFieldInput(field) {
    const commonProps = {
      value: editedData[field] || '',
      onChange: (e) => handleChange(field, e.target.value),
      className: "w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    };

    switch (field) {
      case 'dni':
      case 'rol':
        return (
          <input
            type="text"
            {...commonProps}
            readOnly
            className={`${commonProps.className} bg-gray-200 cursor-not-allowed`}
          />
        );

      case 'telefono':
        return (
          <>
            <input
              type="text"
              {...commonProps}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={9}
            />
            {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
          </>
        );

      case 'sexo':
        return (
          <select {...commonProps}>
            <option value="">Seleccionar</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        );

      case 'fecha_nacimiento':
        return <input type="date" {...commonProps} />;

      case 'profesion':
        return (
          <select {...commonProps}>
            <option value="">Seleccionar profesión</option>
            {PROFESIONES.map(profesion => (
              <option key={profesion} value={profesion}>{profesion}</option>
            ))}
          </select>
        );

      case 'especialidad':
        if (editedData.profesion === 'Otro (Especificar)') {
          return (
            <>
              <input
                type="text"
                {...commonProps}
                placeholder="Especifique la especialidad"
              />
              {errors.especialidad && <p className="mt-1 text-sm text-red-600">{errors.especialidad}</p>}
            </>
          );
        } else {
          return (
            <select
              {...commonProps}
              disabled={!['Medicina', 'Enfermería', 'Ingenieria'].includes(editedData.profesion)}
              className={`${commonProps.className} ${!['Medicina', 'Enfermería', 'Ingenieria'].includes(editedData.profesion) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Seleccionar especialidad</option>
              {getEspecialidades().map(especialidad => (
                <option key={especialidad} value={especialidad}>{especialidad}</option>
              ))}
            </select>
          );
        }

      case 'tipo_contrato':
        return (
          <select {...commonProps}>
            <option value="">Seleccionar tipo</option>
            {TIPOS_CONTRATO.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  }
};

export default EditUsuarioModal;