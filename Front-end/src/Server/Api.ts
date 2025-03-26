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
  status?: number;
  errors?: Record<string, string[]>;
}

interface ApiError {
  message?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interfaces para tipos de datos
interface NewUserData {
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono?: string;
  fecha_nacimiento?: string;
  sexo?: string;
  domicilio?: string;
  profesion?: string;
  especialidad?: string;
  tipo_contrato?: string;
  rol: string;
}

interface RegisterUserData {
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  password: string;
  rol?: string;
}

// Función para manejar errores de Axios
const handleAxiosError = (error: unknown): ApiResponse => {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data as ApiError;
    const status = error.response?.status ?? 500;
    const errorMessage = errorData?.message || error.message || "Error desconocido";

    console.error(`❌ [API ERROR] ${status}: ${errorMessage}`);

    return { 
      success: false, 
      message: errorMessage,
      status: status,
      errors: errorData?.errors
    };
  }

  if (error instanceof Error) {
    return { 
      success: false, 
      message: error.message 
    };
  }

  return { 
    success: false, 
    message: "Error desconocido" 
  };
};

// Función para solicitudes GET
export const getRequest = async <T>(url: string, token?: string): Promise<T> => {
  try {
    const response = await api.get<T>(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// Función para solicitudes POST
export const postRequest = async <T>(
  url: string, 
  data: object,
  token?: string
): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// Función para solicitudes PUT
export const putRequest = async <T>(
  url: string, 
  data: Record<string, unknown>, 
  token?: string
): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// Función para solicitudes DELETE
export const deleteRequest = async <T = any>(
  endpoint: string,
  token: string
): Promise<T> => {
  try {
    const response = await axios.delete<T>(`${API_URL}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// Registro de usuario
export const registerUser = async (userData: RegisterUserData): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>("/auth/register", userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      return {
        success: false,
        message: errorData?.message || error.message || "Error en el registro",
        errors: errorData?.errors
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: false,
      message: "Error de conexión con el servidor"
    };
  }
};

// Inicio de sesión
export const loginUser = async (dni: string, password: string): Promise<ApiResponse> => {
  try {
    console.log("🔹 Intentando login con:", dni, password);
    const response = await postRequest<ApiResponse>("/auth/login", { dni, password });
    
    if (response.success && response.token) {
      localStorage.setItem("token", response.token);
      console.log("✅ Token guardado en localStorage.");
      return response;
    }
    
    return {
      success: false,
      message: response.message || "Credenciales incorrectas"
    };
  } catch (error) {
    return handleAxiosError(error);
  }
};

// Obtener perfil del usuario
export const getProfile = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ No hay token en localStorage");
    return { success: false, message: "No hay token disponible" };
  }

  return await getRequest<ApiResponse>("/user/portaladmin", token);
};

// Crear un usuario nuevo
export const createUser = async (userData: NewUserData): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.error("❌ No hay token de autenticación");
    return { success: false, message: "No autorizado" };
  }

  try {
    console.log("📤 Enviando datos de usuario:", userData);
    const response = await api.post<ApiResponse>("/personal", {
      ...userData,
      password: "12345678", // Contraseña por defecto
      debe_cambiar_password: true
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("📥 Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      return {
        success: false,
        message: errorData?.message || error.message || "Error al crear usuario",
        errors: errorData?.errors
      };
    }
    return { success: false, message: "Error desconocido al crear usuario" };
  }
};