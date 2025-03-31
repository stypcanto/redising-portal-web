import { 
    postRequest, 
    ApiResponse,
    storeAuthTokens,
    clearAuthTokens 
  } from "./Api";
  
  interface User {
    dni: string;
    nombres?: string;
    apellido_paterno?: string;
    password: string;
    [key: string]: any;
  }
  
  // ==================== AUTENTICACIÓN ====================
  export const loginUser = async (dni: string, password: string): Promise<ApiResponse<User>> => {
    const response = await postRequest<User>("/auth/login", { dni, password });
    if (response.success && response.token) {
      storeAuthTokens({ token: response.token });
    }
    return response;
  };
  
  export const registerUser = async (userData: User): Promise<ApiResponse<User>> => {
    return postRequest<User>("/auth/register", userData);
  };
  
  export const logoutUser = (): void => {
    clearAuthTokens();
  };
  
  // ==================== GESTIÓN DE USUARIOS ====================
  export const createUser = async (userData: User): Promise<ApiResponse<User>> => {
    return postRequest<User>("/admin/users", userData);
  };
  
  export const updateUserRole = async (userId: number, role: string): Promise<ApiResponse> => {
    return postRequest("/admin/update-role", { userId, role });
  };