import axios, { AxiosError } from "axios";

// 📌 Configuración de la URL base de la API desde variables de entorno
const API_URL = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL ?? "http://localhost:5001";



if (!API_URL) {
  throw new Error("❌ Error: La variable de entorno VITE_API_URL no está definida.");
}

// 📌 Interfaces
interface User {
  id?: number;
  dni: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  data?: T;
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

// 📌 Función genérica para peticiones PUT (actualización)
const putRequest = async <T>(url: string, data: Record<string, unknown>, token?: string): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// 📌 Función genérica para peticiones DELETE
const deleteRequest = async <T>(url: string, token?: string): Promise<T> => {
  try {
    const response = await api.delete<T>(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// 📌 Autenticación y perfil
export const registerUser = async (dni: string, password: string): Promise<ApiResponse> => 
  await postRequest<ApiResponse>("/auth/register", { dni, password });

export const loginUser = async (dni: string, password: string): Promise<ApiResponse> => 
  await postRequest<ApiResponse>("/auth/login", { dni, password });

export const getProfile = async (token: string): Promise<ApiResponse> => 
  await getRequest<ApiResponse>("/user/portaladmin", token);

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
