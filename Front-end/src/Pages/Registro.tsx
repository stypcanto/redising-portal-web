import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Server/Api";
import LoadingSpinner from "../components/Modal/LoadingSpinner";

// Definición de tipos
interface FormData {
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  password: string;
  confirmPassword: string;
  rol: string;
}

type MessageType = "success" | "error" | "";

interface Message {
  text: string;
  type: MessageType;
}

const Registro: React.FC = () => {
  // Estados con tipado explícito
  const [formData, setFormData] = useState<FormData>({
    dni: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    password: "",
    confirmPassword: "",
    rol: "Usuario",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<Message>({ text: "", type: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validación especial para DNI
    if (name === "dni") {
      if (value.length > 8) return;
      if (value && !/^\d+$/.test(value)) return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validación de DNI (8 dígitos numéricos)
    if (!formData.dni.trim()) {
      newErrors.dni = "DNI es requerido";
      isValid = false;
    } else if (formData.dni.length !== 8) {
      newErrors.dni = "DNI debe tener exactamente 8 dígitos";
      isValid = false;
    } else if (!/^\d+$/.test(formData.dni)) {
      newErrors.dni = "DNI debe contener solo números";
      isValid = false;
    }

    // Validación de campos obligatorios
    const requiredFields: Array<keyof FormData> = [
      "nombres", 
      "apellido_paterno", 
      "correo", 
      "password", 
      "confirmPassword"
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = "Este campo es requerido";
        isValid = false;
      }
    });

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      newErrors.correo = "Correo electrónico inválido";
      isValid = false;
    }

    // Validación de contraseña
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;

    }

    // Validación de coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Manejo del envío del formulario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Eliminamos confirmPassword ya que no se envía al backend
      const { confirmPassword, ...dataToSend } = formData;
      
      const data = await registerUser(dataToSend);
      
      if (data.success) {
        setMessage({ 
          text: "¡Registro exitoso! Serás redirigido al login", 
          type: "success" 
        });
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setMessage({ 
          text: data.message || "Error al registrar el usuario", 
          type: "error" 
        });
      }
    } catch (err) {
      setMessage({ 
        text: "Error en el servidor. Por favor intente nuevamente.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Estilos reutilizables
  const inputStyle = (hasError: boolean): string => 
    `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
      hasError 
        ? "border-red-500 focus:ring-red-200" 
        : "border-gray-300 focus:ring-blue-200"
    }`;

  const labelStyle = "block mb-1 font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center bg-[url('/images/fondo-portal-web-cenate-2025.png')]">
      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}
      
      <div className={`w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden ${loading ? "opacity-50" : ""}`}>
        {/* Encabezado */}
        <div className="p-6 text-white bg-[#2e63a6]">
          <h1 className="text-2xl font-bold md:text-3xl">Registro CENATE</h1>
          <p className="text-blue-100">Complete el formulario para crear su cuenta</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Mensaje de estado */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === "error" 
                ? "bg-red-100 text-red-700" 
                : "bg-green-100 text-green-700"
            }`}>
              {message.text}
            </div>
          )}

          {/* Formulario de dos columnas */}
          <form onSubmit={handleRegister} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {/* DNI */}
              <div>
                <label htmlFor="dni" className={labelStyle}>
                  DNI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  placeholder="Ingrese su DNI (8 dígitos)"
                  value={formData.dni}
                  onChange={handleChange}
                  className={inputStyle(!!errors.dni)}
                  maxLength={8}
                  disabled={loading}
                />
                {errors.dni && <p className="mt-1 text-sm text-red-500">{errors.dni}</p>}
              </div>

              {/* Nombres */}
              <div>
                <label htmlFor="nombres" className={labelStyle}>
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  placeholder="Ingrese sus nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className={inputStyle(!!errors.nombres)}
                  disabled={loading}
                />
                {errors.nombres && <p className="mt-1 text-sm text-red-500">{errors.nombres}</p>}
              </div>

              {/* Apellido Paterno */}
              <div>
                <label htmlFor="apellido_paterno" className={labelStyle}>
                  Apellido Paterno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="apellido_paterno"
                  name="apellido_paterno"
                  placeholder="Ingrese su apellido paterno"
                  value={formData.apellido_paterno}
                  onChange={handleChange}
                  className={inputStyle(!!errors.apellido_paterno)}
                  disabled={loading}
                />
                {errors.apellido_paterno && (
                  <p className="mt-1 text-sm text-red-500">{errors.apellido_paterno}</p>
                )}
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              {/* Apellido Materno */}
              <div>
                <label htmlFor="apellido_materno" className={labelStyle}>
                  Apellido Materno
                </label>
                <input
                  type="text"
                  id="apellido_materno"
                  name="apellido_materno"
                  placeholder="Ingrese su apellido materno"
                  value={formData.apellido_materno}
                  onChange={handleChange}
                  className={inputStyle(false)}
                  disabled={loading}
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label htmlFor="correo" className={labelStyle}>
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="ejemplo@dominio.com"
                  value={formData.correo}
                  onChange={handleChange}
                  className={inputStyle(!!errors.correo)}
                  disabled={loading}
                />
                {errors.correo && <p className="mt-1 text-sm text-red-500">{errors.correo}</p>}
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className={labelStyle}>
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputStyle(!!errors.password)}
                  disabled={loading}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className={labelStyle}>
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Repita su contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputStyle(!!errors.confirmPassword)}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Botón de Submit */}
            <div className="pt-4 md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 bg-[#2e63a6] text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
                }`}
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </button>
            </div>
          </form>

          {/* Enlace a Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => !loading && navigate("/login")}
                disabled={loading}
                className={`text-[#2e63a6] font-semibold hover:underline ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Inicia sesión
              </button>
            </p>
          </div>

          {/* Nota sobre campos obligatorios */}
          <div className="mt-4 text-sm text-gray-500">
            <p>Los campos marcados con <span className="text-red-500">*</span> son obligatorios</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;