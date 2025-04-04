import { 
  postRequest, 
  putRequest,
  deleteRequest,
  getRequest,
  ApiResponse,
  storeAuthTokens,
  clearAuthTokens,
 
} from "./Api";

interface User {
  dni: string;
  nombres: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo: string;
  telefono?: string;
  fecha_nacimiento?: string;
  sexo?: string;
  domicilio?: string;
  profesion?: string;
  especialidad?: string;
  tipo_contrato?: string;
  rol: string;            // <- Obligatorio
  password: string;       // <- Obligatorio
  debe_cambiar_password?: boolean;
  colegiatura?: string;
  [key: string]: any;
}

interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ==================== AUTENTICACIÓN ====================
export const loginUser = async (dni: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await postRequest<LoginResponse>("/auth/login", { 
      dni: dni.trim(), 
      password: password.trim() 
    });

    if (response.success && response.data?.token) {
      storeAuthTokens({ 
        token: response.data.token,
        refreshToken: response.data.refreshToken 
      });
    }

    return response;
  } catch (error) {
    console.error("Error en loginUser:", error);
    return {
      success: false,
      message: "Error de conexión al iniciar sesión",
      error: "network_error"
    };
  }
};

export const registerUser = async (userData: User): Promise<ApiResponse<User>> => {
  // Limpieza básica de datos
  const cleanedData = {
    ...userData,
    dni: userData.dni.trim(),
    correo: userData.correo.trim().toLowerCase(),
    nombres: userData.nombres.trim(),
    apellido_paterno: userData.apellido_paterno?.trim(),
    apellido_materno: userData.apellido_materno?.trim()
  };

  return postRequest<User>("/auth/register", cleanedData);
};

export const logoutUser = (): void => {
  clearAuthTokens();
};

// Elimina la función refreshToken completamente o reemplázala con:
export const refreshToken = async (): Promise<ApiResponse<{ token: string }>> => {
  // Implementación alternativa si no tienes refreshAuthToken
  return postRequest<{ token: string }>("/auth/refresh", {
    refreshToken: localStorage.getItem('refreshToken')
  });
};


// ==================== GESTIÓN DE USUARIOS ====================
export const createUser = async (userData: User): Promise<ApiResponse<User>> => {
  try {
    // Validación básica antes de enviar
    if (!userData.dni || userData.dni.length !== 8) {
      return {
        success: false,
        message: "El DNI debe tener 8 dígitos",
        error: "validation_error"
      };
    }

    const response = await postRequest<User>("/personal", {
      ...userData,
      password: userData.password || "12345678", // Contraseña por defecto
      debe_cambiar_password: true
    });

    if (response.success) {
      console.log("Usuario creado con ID:", response.data?.dni);
    }

    return response;
  } catch (error) {
    console.error("Error en createUser:", error);
    return {
      success: false,
      message: "Error al crear usuario",
      error: "create_error"
    };
  }
};

export const getUser = async (dni: string): Promise<ApiResponse<User>> => {
  return getRequest<User>(`/personal/${dni}`);
};

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
): Promise<ApiResponse<PaginatedResponse<User>>> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });

  return getRequest<PaginatedResponse<User>>(`/personal?${queryParams}`);
};

export const updateUser = async (
  dni: string,
  updateData: Partial<User>
): Promise<ApiResponse<User>> => {
  return putRequest<User>(`/personal/${dni}`, updateData);
};

export const updateUserRole = async (
  dni: string,
  role: string
): Promise<ApiResponse<User>> => {
  // Validación de roles permitidos
  const validRoles = ["Superadmin", "Admin", "Usuario"];
  if (!validRoles.includes(role)) {
    return {
      success: false,
      message: "Rol no válido",
      error: "validation_error"
    };
  }

  return putRequest<User>(`/personal/${dni}/role`, { rol: role });
};

export const deleteUser = async (dni: string): Promise<ApiResponse<void>> => {
  return deleteRequest<void>(`/personal/${dni}`);
};

// ==================== FUNCIONES ESPECÍFICAS ====================
export const resetPassword = async (
  dni: string,
  newPassword: string
): Promise<ApiResponse<void>> => {
  return postRequest<void>(`/personal/${dni}/reset-password`, { 
    newPassword 
  });
};

export const requestPasswordReset = async (
  email: string
): Promise<ApiResponse<void>> => {
  return postRequest<void>("/auth/request-password-reset", { email });
};

export const verifyAccount = async (
  token: string
): Promise<ApiResponse<User>> => {
  return postRequest<User>("/auth/verify-account", { token });
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  updateUserRole,
  deleteUser,
  resetPassword,
  requestPasswordReset,
  verifyAccount
};