import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser } from '/src/Server/userApi.ts';
import LoadingSpinner from "../Modal/LoadingSpinner";


const AddUsuarioModal = ({ showModal, handleClose, onUserCreated }) => {
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
  const sexos = ["Masculino", "Femenino", "Otro"];
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

  // Estado del formulario
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
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para crear usuario
  const handleAddUser = async (userData) => {
    try {
      const response = await createUser({
        dni: userData.dni,
        nombres: userData.nombres,
        apellido_paterno: userData.apellido_paterno,
        apellido_materno: userData.apellido_materno,
        correo: userData.correo,
        telefono: userData.telefono,
        fecha_nacimiento: userData.fecha_nacimiento,
        sexo: userData.sexo,
        domicilio: userData.domicilio,
        profesion: userData.profesion,
        especialidad: userData.especialidad,
        tipo_contrato: userData.tipo_contrato,
        rol: userData.rol,
        password: "12345678",
        debe_cambiar_password: true
      });

      console.log("Respuesta de la API:", response); // Para depuración

      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.success) {
        toast.success("Usuario creado exitosamente. Contraseña temporal: 12345678");
        return response.data;
      } else {
              // Mostrar el mensaje de error del servidor si existe
      throw new Error(response.message || response.error || "Error al crear usuario");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'telefono') {
      if (value && (!/^\d*$/.test(value) || value.length > 9)) {
        return;
      }
    }

    if (field === 'dni') {
      if (value && (!/^\d*$/.test(value) || value.length > 8)) {
        return;
      }
    }

    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'profesion') {
      if (value !== 'Medicina' && value !== 'Enfermería' && value !== 'Ingenieria') {
        newData.especialidad = '';
      }
      setFormData(newData);
    }

    if (field === 'especialidad' && formData.profesion === 'Otro (Especificar)') {
      validateFields();
    }
  };

  const validateFields = () => {
    const newErrors = {};
    const requiredFields = [
      "nombres", 
      "apellido_paterno", 
      "apellido_materno", 
      "dni", 
      "correo", 
      "rol"
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    if (formData.dni && formData.dni.length !== 8) {
      newErrors.dni = "El DNI debe tener 8 dígitos";
    }

    if (formData.telefono && formData.telefono.length !== 9) {
      newErrors.telefono = "El teléfono debe tener 9 dígitos";
    }

    if (formData.correo && !/^\S+@\S+\.\S+$/.test(formData.correo)) {
      newErrors.correo = "Correo electrónico inválido";
    }

    if (formData.profesion === 'Otro (Especificar)' && !formData.especialidad) {
      newErrors.especialidad = "Debe especificar la especialidad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      toast.error("Por favor complete todos los campos requeridos correctamente");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        ...formData,
        password: "12345678",
        debe_cambiar_password: true
      };

      const createdUser = await handleAddUser(userData);
    
      // Llama a onUserCreated con el nuevo usuario
      onUserCreated(createdUser);
      
      // Cierra el modal
      handleClose();
      
      // Opcional: Forzar recarga de datos después de un breve retraso
      setTimeout(() => {
        if (typeof onUserCreated === 'function') {
          onUserCreated(); // Sin parámetros para indicar que debe refrescar
        }
      }, 1000);
      
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      toast.error(error.message || "Error al crear usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEspecialidades = () => {
    if (formData.profesion === 'Medicina') return especialidades.Medicina;
    if (formData.profesion === 'Enfermería') return especialidades.Enfermeria;
    if (formData.profesion === 'Ingenieria') return especialidades.Ingenieria;
    return [];
  };

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
      fields: ['profesion', 'especialidad', 'tipo_contrato']
    },
    {
      title: 'Datos del Sistema',
      icon: '🔐',
      fields: ['rol']
    }
  ];

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-xl">
        {/* Encabezado */}
        <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Agregar Nuevo Usuario</h2>
              <p className="text-blue-100">Complete los campos requeridos</p>
            </div>
            <button
              onClick={handleClose}
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
          {fieldGroups.map((group) => (
            <div key={group.title} className="mb-8 last:mb-0">
              <div className="flex items-center mb-4">
                <span className="mr-3 text-2xl">{group.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.fields.map((field) => (
                  <div key={field} className="p-4 rounded-lg bg-gray-50">
                    <label className="block mb-1 text-sm font-medium text-gray-500">
                      {formatFieldName(field)}
                      {["nombres", "apellido_paterno", "apellido_materno", "dni", "correo", "rol"].includes(field) && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </label>
                    
                    {field === 'telefono' ? (
                      <>
                        <input
                          type="text"
                          value={formData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={9}
                        />
                        {errors.telefono && (
                          <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                        )}
                      </>
                    ) : field === 'dni' ? (
                      <>
                        <input
                          type="text"
                          value={formData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={8}
                        />
                        {errors.dni && (
                          <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
                        )}
                      </>
                    ) : field === 'sexo' ? (
                      <select
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar</option>
                        {sexos.map(sexo => (
                          <option key={sexo} value={sexo}>{sexo}</option>
                        ))}
                      </select>
                    ) : field === 'fecha_nacimiento' ? (
                      <input
                      type="date"
                      value={formData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    ) : field === 'profesion' ? (
                      <select
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar profesión</option>
                        {profesiones.map(profesion => (
                          <option key={profesion} value={profesion}>{profesion}</option>
                        ))}
                      </select>
                    ) : field === 'especialidad' ? (
                      formData.profesion === 'Otro (Especificar)' ? (
                        <>
                          <input
                            type="text"
                            value={formData[field] || ''}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Especifique la especialidad"
                          />
                          {errors.especialidad && (
                            <p className="mt-1 text-sm text-red-600">{errors.especialidad}</p>
                          )}
                        </>
                      ) : (
                        <select
                          value={formData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          disabled={!['Medicina', 'Enfermería', 'Ingenieria'].includes(formData.profesion)}
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
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar tipo</option>
                        {tiposContrato.map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    ) : field === 'rol' ? (
                      <select
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        {roles.map(rol => (
                          <option key={rol} value={rol}>{rol}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field === 'correo' ? 'email' : 'text'}
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full p-2 text-gray-800 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                    
                    {errors[field] && field !== 'telefono' && field !== 'dni' && field !== 'especialidad' && (
                      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pie de página */}
        <div className="flex justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
  <button
    onClick={handleClose}
    disabled={isSubmitting}
    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
  >
    Cancelar
  </button>
  <button
    onClick={handleSubmit}
    disabled={isSubmitting}
    className={`relative px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {isSubmitting ? (
      <span className="flex items-center justify-center">
        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Guardando...
      </span>
    ) : (
      'Guardar Usuario'
    )}
  </button>
</div>
      </div>
    </div>
  );
};

export default AddUsuarioModal;