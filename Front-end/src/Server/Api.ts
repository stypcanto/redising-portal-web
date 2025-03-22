import axios, { AxiosError } from "axios";

const API_URL =
  (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL ??
  "http://localhost:5001";

if (!API_URL) {
  throw new Error("❌ Error: La variable de entorno VITE_API_URL no está definida.");
}

interface User {
  id?: number;
  dni: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo?: string;
  rol: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  data?: T;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 📌 Función para solicitudes POST
const postRequest = async <T>(url: string, data: Record<string, unknown>): Promise<T> => {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// 📌 Función para solicitudes GET
const getRequest = async <T>(url: string, token?: string): Promise<T> => {
  try {
    const response = await api.get<T>(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// 📌 Función PUT para actualizar roles u otros datos
const putRequest = async <T>(url: string, data: Record<string, unknown>): Promise<T> => {
  try {
    const token = localStorage.getItem("authToken"); // 🔹 Obtén el token desde localStorage
    const response = await api.put<T>(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};


// 📌 Autenticación y perfil
interface RegisterUserData extends Record<string, unknown> {
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  password: string;
}

// 📌 Registro de usuario
const registerUser = async (userData: RegisterUserData): Promise<ApiResponse> =>
  await postRequest<ApiResponse>("/auth/register", userData);

// 📌 Inicio de sesión con almacenamiento del token
const loginUser = async (dni: string, password: string): Promise<ApiResponse> => {
  console.log("🔹 Intentando login con:", dni, password);

  const response = await postRequest<ApiResponse>("/auth/login", { dni, password });

  console.log("📡 Respuesta del backend:", response);

  if (!response.success || !response.token) {
    console.error("❌ Error de autenticación: Credenciales incorrectas.");
  } else {
    localStorage.setItem("authToken", response.token);
    console.log("✅ Token guardado en localStorage.");
  }

  return response;
};

// 📌 Obtener perfil del usuario autenticado
const getProfile = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem("authToken, response.token");

  if (!token) {
    console.error("❌ No hay token en localStorage");
    return { success: false, message: "No hay token disponible" };
  }

  return await getRequest<ApiResponse>("/user/portaladmin", token);
};

// 📌 Manejo de errores mejorado
const handleAxiosError = (error: unknown): ApiResponse => {
  const err = error as AxiosError<{ message?: string }>;
  const status = err.response?.status ?? 500;

  let errorMessage = "Error desconocido";

  if (err.response?.data?.message) {
    errorMessage = err.response.data.message;
  } else if (err.message) {
    errorMessage = err.message;
  } else if (err.request) {
    errorMessage = "No se recibió respuesta del servidor.";
  }

  console.error(`❌ [API ERROR] ${status}: ${errorMessage}`);

  return { success: false, message: errorMessage };
};

// 📌 Exportaciones en una sola línea
export { getRequest, postRequest, putRequest, registerUser, loginUser, getProfile };
