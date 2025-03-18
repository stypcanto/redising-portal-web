import axios, { AxiosError } from "axios";

// 📌 URL base de la API (usar variable de entorno)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

if (!API_URL) {
  throw new Error("❌ Error: La variable VITE_API_URL no está definida.");
}

// 📌 Interfaces
interface User {
  id?: number;
  dni: string;
}

interface ApiResponse {
  token?: string;
  user?: User;
  message?: string;
  success: boolean;
}

// 📌 Configuración global de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 📌 Función genérica para peticiones POST
const postRequest = async <T>(url: string, data: Record<string, unknown>): Promise<T> => {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// 📌 Función genérica para peticiones GET con token
const getRequest = async <T>(url: string, token: string): Promise<T> => {
  if (!token) {
    throw new Error("❌ Error: Token de autenticación no proporcionado.");
  }

  try {
    const response = await api.get<T>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// 📌 Autenticación
export const registerUser = async (dni: string, password: string): Promise<ApiResponse> =>
  postRequest<ApiResponse>("/register", { dni, password });

export const loginUser = async (dni: string, password: string): Promise<ApiResponse> =>
  postRequest<ApiResponse>("/login", { dni, password });

export const getProfile = async (token: string): Promise<ApiResponse> =>
  getRequest<ApiResponse>("/portaladmin", token);

// 📌 Manejo de errores
const handleAxiosError = (error: unknown): ApiResponse => {
  const err = error as AxiosError<{ message: string }>;
  const errorMessage = err.response?.data?.message || err.message || "Error desconocido";

  console.error("❌ Error de API:", errorMessage);

  return { success: false, message: errorMessage };
};
