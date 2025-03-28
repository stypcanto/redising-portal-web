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

interface AuthTokens {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: User;
  data?: T;
  status?: number;
  errors?: Record<string, string[]>;
  error?: string | any;
}

interface ApiError {
  message?: string;
  status?: number;
  errors?: Record<string, string[]>;
  shouldLogout?: boolean;
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
  timeout: 10000,
});

declare module 'axios' {
  interface AxiosRequestConfig {
    _isRetry?: boolean;
    _skipAuth?: boolean;
  }
}

// ==================== MANEJO DE TOKENS ====================
const storeAuthTokens = (tokens: AuthTokens): void => {
  if (tokens.token) {
    localStorage.setItem("authToken", tokens.token);
    api.defaults.headers.common.Authorization = `Bearer ${tokens.token}`;
  }
  if (tokens.refreshToken) {
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  delete api.defaults.headers.common.Authorization;
};

export const validateToken = (): boolean => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const initializeAuth = (): void => {
  const token = localStorage.getItem("authToken");
  if (token && validateToken()) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    clearAuthTokens();
  }
};

// Inicializar al cargar el módulo
initializeAuth();

// ==================== INTERCEPTORES ====================
api.interceptors.request.use(config => {
  if (!config._skipAuth) {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      
      try {
        const newToken = await handleTokenRefresh();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?sessionExpired=true';
        }
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.data?.shouldLogout) {
      clearAuthTokens();
      window.location.href = "/login?sessionExpired=true";
    }
    
    return Promise.reject(error);
  }
);

// ==================== FUNCIONES DE API ====================
async function handleTokenRefresh(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await api.post<ApiResponse<AuthTokens>>(
      '/auth/refresh', 
      { refreshToken },
      { _skipAuth: true }
    );

    if (!response.data.token) {
      throw new Error("Invalid token in response");
    }

    storeAuthTokens({
      token: response.data.token,
      refreshToken: response.data.refreshToken
    });

    return response.data.token;
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
}

const handleAxiosError = (error: unknown): ApiResponse => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const errorData = error.response?.data as ApiError;
    const errorMessage = errorData?.message || error.message || "Error desconocido";

    console.error(`❌ [API ERROR ${status}] ${errorMessage}`);
    if (error.response?.data) console.error("Detalles:", error.response.data);

    return { 
      success: false, 
      message: errorMessage,
      status,
      errors: errorData?.errors
    };
  }

  if (error instanceof Error) {
    console.error("❌ [CLIENT ERROR]", error.message);
    return { success: false, message: error.message };
  }

  console.error("❌ [UNKNOWN ERROR]", error);
  return { success: false, message: "Error desconocido" };
};

// ==================== FUNCIONES PRINCIPALES ====================
export const getRequest = async <T = any>(
  url: string, 
  token?: string
): Promise<ApiResponse<T>> => {
  try {
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
    const response = await api.put<ApiResponse<T>>(url, data, {
      headers: { Authorization: `Bearer ${token || localStorage.getItem("authToken") || ""}` },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const deleteRequest = async <T = any>(
  url: string,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.delete<ApiResponse<T>>(url, {
      headers: { Authorization: `Bearer ${token || localStorage.getItem("authToken") || ""}` },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

// ==================== FUNCIONES DE AUTENTICACIÓN ====================
export const loginUser = async (dni: string, password: string) => {
  try {
    console.log("Preparando solicitud de login...");
    
    // Limpiar espacios en credenciales
    const cleanDni = dni.trim();
    const cleanPassword = password.trim();
    
    const response = await api.post("/auth/login", {
      dni: cleanDni,
      password: cleanPassword
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
    
  } catch (error: any) {
    console.error("Error en loginUser:", {
      message: error.message,
      response: error.response?.data,
      request: {
        dni: dni,
        password: '***' // No registrar contraseñas reales
      }
    });
    
    if (error.response) {
      // Error del servidor (400, 500, etc.)
      throw {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || "Error en el servidor",
        error: error.response.data?.error
      };
    } else {
      // Error de conexión
      throw {
        success: false,
        message: "Error de conexión con el servidor",
        error: error.message
      };
    }
  }
};

export const registerUser = async (
  userData: RegisterUserData
): Promise<ApiResponse<User>> => {
  try {
    const response = await postRequest<User>("/auth/register", userData);
    
    if (response.success && response.token) {
      storeAuthTokens({
        token: response.token,
        refreshToken: response.refreshToken
      });
    }
    
    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const logout = (): void => {
  clearAuthTokens();
};

// ==================== FUNCIONES ESPECÍFICAS ====================
export const getProfile = async (): Promise<ApiResponse<User>> => {
  try {
    return await getRequest<User>("/user/portaladmin");
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const createUser = async (
  userData: NewUserData
): Promise<ApiResponse<User>> => {
  try {
    const response = await postRequest<User>("/personal", {
      ...userData,
      password: "12345678",
      debe_cambiar_password: true
    });
    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};