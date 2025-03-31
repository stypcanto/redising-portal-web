import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ==================== CONFIGURACIÓN INICIAL ====================
const API_URL =
  (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL ??
  "http://localhost:5001";

if (!API_URL) {
  throw new Error("❌ [CONFIG ERROR] VITE_API_URL no está definida");
}

// ==================== INTERFACES Y TIPOS ====================
export interface User {
  id?: number;
  dni: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo?: string;
  rol?: string;
  [key: string]: any;
}

interface AuthTokens {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: User;
  data?: T;
  status?: number;
  errors?: Record<string, string[]>;
  error?: string;
  shouldLogout?: boolean;
}

interface ApiError {
  error: string;
  message?: string;
  status?: number;
  errors?: Record<string, string[]>;
  shouldLogout?: boolean;
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
export const storeAuthTokens = (tokens: AuthTokens): void => {
  if (tokens.token) {
    localStorage.setItem("authToken", tokens.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${tokens.token}`;
  }
  if (tokens.refreshToken) {
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  delete api.defaults.headers.common['Authorization'];
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

const initializeAuth = (): void => {
  const token = localStorage.getItem("authToken");
  if (token && validateToken()) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    clearAuthTokens();
  }
};

initializeAuth();

// ==================== FUNCIONES AUXILIARES ====================
const createErrorResponse = (
  status: number,
  message: string,
  shouldLogout = false
): ApiResponse => ({
  success: false,
  status,
  message,
  shouldLogout
});

const handleAxiosError = (error: unknown): ApiResponse => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const errorData = error.response?.data as ApiError;
    
    return {
      success: false,
      message: errorData?.message || error.message,
      status,
      errors: errorData?.errors,
      shouldLogout: errorData?.shouldLogout,
      error: errorData?.error
    };
  }

  return {
    success: false,
    message: error instanceof Error ? error.message : "Error desconocido"
  };
};

const getAuthHeaders = (token?: string): AxiosRequestConfig => ({
  headers: {
    Authorization: `Bearer ${token || localStorage.getItem("authToken") || ""}`
  }
});

// ==================== INTERCEPTORES ====================
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config._skipAuth) {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _isRetry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      
      try {
        const newToken = await handleTokenRefresh();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        return Promise.reject(createErrorResponse(401, "Sesión expirada", true));
      }
    }
    
    return Promise.reject(handleAxiosError(error));
  }
);

// ==================== FUNCIONES DE API ====================
async function handleTokenRefresh(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No hay token de refresco disponible");

  const response = await api.post<ApiResponse<AuthTokens>>(
    '/auth/refresh', 
    { refreshToken },
    { _skipAuth: true }
  );

  if (!response.data.success || !response.data.token) {
    throw new Error(response.data.message || "Error al refrescar token");
  }

  storeAuthTokens({
    token: response.data.token,
    refreshToken: response.data.refreshToken
  });

  return response.data.token;
}

export const getRequest = async <T = any>(
  url: string, 
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get<ApiResponse<T>>(url, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const postRequest = async <T = any>(
  url: string, 
  data: object,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(url, data, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const putRequest = async <T = any>(
  url: string, 
  data: object,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.put<ApiResponse<T>>(url, data, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteRequest = async <T = any>(
  url: string,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.delete<ApiResponse<T>>(url, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

// ==================== FUNCIONES DE AUTENTICACIÓN ====================
export const loginUser = async (
  dni: string, 
  password: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>(
      "/auth/login", 
      { dni, password },
      { _skipAuth: true }
    );

    if (response.data.success && response.data.token) {
      storeAuthTokens({
        token: response.data.token,
        refreshToken: response.data.refreshToken
      });
      
      if (response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
      }
    }

    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const logout = (): void => {
  clearAuthTokens();
};

// ==================== FUNCIONES ESPECÍFICAS ====================
export const getProfile = async (): Promise<ApiResponse<User>> => {
  return getRequest<User>("/user/portaladmin");
};

export const updateUserRole = async (
  userId: number,
  newRole: string,
  token?: string
): Promise<ApiResponse<User>> => {
  return putRequest<User>(
    "/admin/update-role",
    { userId, newRole },
    token
  );
};