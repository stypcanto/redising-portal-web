import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Server/Api";

const Registro = () => {
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    password: "",
    confirmPassword: "", // Nuevo campo para reconfirmar la contraseña
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputStyle =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Verificar si todos los campos están completos
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setMessage({ text: "Por favor completa todos los campos.", type: "error" });
      return;
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (formData.password.length < 6) {
      setMessage({ text: "La contraseña debe tener al menos 6 caracteres.", type: "error" });
      return;
    }

    // Validar que la contraseña y la reconfirmación coincidan
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData; // No enviar confirmPassword al backend
      const data = await registerUser(dataToSend);
      setLoading(false);

      if (data.success) {
        setMessage({ text: "Usuario registrado con éxito. Redirigiendo...", type: "success" });
        setTimeout(() => navigate("/portaladmin"), 2000);
      } else {
        setMessage({ text: data.message || "Error al registrar el usuario.", type: "error" });
      }
    } catch (err) {
      setLoading(false);
      setMessage({ text: "Hubo un error al registrar el usuario.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center bg-[url('/images/fondo-portal-web-cenate-2025.png')]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold text-center text-blue-900">
          Registro CENATE
        </h1>

        {message.text && (
          <p className={`mb-4 text-center ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleRegister}>
          {[
            { name: "dni", label: "DNI" },
            { name: "nombres", label: "Nombres" },
            { name: "apellido_paterno", label: "Apellido Paterno" },
            { name: "apellido_materno", label: "Apellido Materno" },
            { name: "correo", label: "Correo" },
          ].map(({ name, label }) => (
            <div key={name} className="mb-4">
              <label className="block mb-1 font-semibold text-gray-700">{label}</label>
              <input
                type="text"
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          ))}

          {/* Campo Contraseña */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Campo Reconfirmar Contraseña */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Reconfirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Reconfirmar Contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#2e63a6] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#2e63a6] hover:scale-105 focus:outline-none focus:ring-2"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            ¿Ya tienes una cuenta?{" "}
            <strong
              className="text-[#2e63a6] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
