import axios, { AxiosError, AxiosResponse } from "axios";

const API_URL =
  (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL ??
  "http://localhost:5001";

if (!API_URL) {
  throw new Error("❌ [CONFIG ERROR] La variable de entorno VITE_API_URL no está definida");
}

// ==================== INTERFACES Y TIPOS ====================
interface User {
  id?: number;
  dni: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo?: string;
  rol: string;
  [key: string]: any;
}

interface ApiResponse<T = any> {
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

// ==================== CONFIGURACIÓN AXIOS ====================
const api = axios.create({
  baseURL: API_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para añadir token a las solicitudes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', { refreshToken });
        
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return api(originalRequest);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("🔐 [AUTH ERROR] Token inválido o expirado");
      // Opcional: Aquí podrías implementar lógica para refrescar el token
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirigir a login
    }
    return Promise.reject(error);
  }
);

// ==================== FUNCIONES DE MANEJO DE ERRORES ====================
const handleAxiosError = (error: unknown): ApiResponse => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const errorData = error.response?.data as ApiError;
    const errorMessage = errorData?.message || error.message || "Error desconocido en la API";

    console.error(`❌ [API ERROR ${status}] ${errorMessage}`);
    if (error.response?.data) console.error("Detalles:", error.response.data);

    return { 
      success: false, 
      message: errorMessage,
      status: status,
      errors: errorData?.errors
    };
  }

  if (error instanceof Error) {
    console.error("❌ [CLIENT ERROR]", error.message);
    return { 
      success: false, 
      message: error.message 
    };
  }

  console.error("❌ [UNKNOWN ERROR]", error);
  return { 
    success: false, 
    message: "Error desconocido" 
  };
};

// ==================== FUNCIONES PRINCIPALES ====================
export const getRequest = async <T = any>(
  url: string, 
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    console.log(`📡 GET ${url}`);
    const response = await api.get<ApiResponse<T>>(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const postRequest = async <T = any>(
  url: string, 
  data: object,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    console.log(`📤 POST ${url}`, data);
    const response = await api.post<ApiResponse<T>>(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const putRequest = async <T = any>(
  url: string, 
  data: Record<string, unknown>, 
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    console.log(`🔄 PUT ${url}`, data);
    console.log('Current token:', localStorage.getItem('token')); // ← Agrega esto
    
    const response = await api.put<ApiResponse<T>>(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const deleteRequest = async <T = any>(
  url: string,
  token: string
): Promise<ApiResponse<T>> => {
  try {
    console.log(`🗑️ DELETE ${url}`);
    const response = await api.delete<ApiResponse<T>>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error en DELETE request:", error);
    return handleAxiosError(error);
  }
};

// ==================== FUNCIONES ESPECÍFICAS ====================
export const registerUser = async (
  userData: RegisterUserData
): Promise<ApiResponse<User>> => {
  try {
    console.log("👤 Registrando nuevo usuario:", userData);
    const response = await postRequest<User>("/auth/register", userData);
    
    if (response.success && response.token) {
      localStorage.setItem("token", response.token);
      console.log("🔑 Token de registro guardado");
    }
    
    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const loginUser = async (
  dni: string, 
  password: string
): Promise<ApiResponse<User>> => {
  try {
    console.log("🔐 Intentando inicio de sesión para DNI:", dni);
    const response = await postRequest<User>("/auth/login", { dni, password });
    
    if (response.success && response.token) {
      localStorage.setItem("token", response.token);
      console.log("✅ Inicio de sesión exitoso. Token guardado");
    }
    
    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const getProfile = async (): Promise<ApiResponse<User>> => {
  try {
    console.log("👤 Obteniendo perfil de usuario");
    return await getRequest<User>("/user/portaladmin");
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const createUser = async (
  userData: NewUserData
): Promise<ApiResponse<User>> => {
  try {
    console.log("➕ Creando nuevo usuario:", userData);
    const response = await postRequest<User>("/personal", {
      ...userData,
      password: "12345678", // Contraseña por defecto
      debe_cambiar_password: true
    });
    
    console.log("📝 Respuesta de creación de usuario:", response);
    return response;
  } catch (error) {
    console.error("❌ Error en creación de usuario:", error);
    return handleAxiosError(error);
  }
};

// ==================== FUNCIONES ADICIONALES ====================
export const validateToken = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    // Aquí podrías implementar una verificación más completa del token
    return true;
  } catch (error) {
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
  console.log("👋 Sesión cerrada. Token removido");
};