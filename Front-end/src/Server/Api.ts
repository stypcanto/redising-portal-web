import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:5001';

// Tipado para la respuesta esperada del servidor
interface ApiResponse {
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  message?: string;
  success?: boolean;  // Añado un campo de éxito para la respuesta de registro
}

// Función para registrar un usuario
export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:5001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};


// Función para iniciar sesión
export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'No se pudo iniciar sesión.');
  }
};

// Función para obtener el perfil (requiere token en los headers)
export const getProfile = async (token: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_URL}/portaladmin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error, 'No se pudo obtener el perfil.');
  }
};

// Función para manejar errores de Axios
const handleAxiosError = (error: unknown, defaultMessage: string): ApiResponse => {
  if (axios.isAxiosError(error)) {
    console.error('Error de Axios:', error.response?.data || error.message);
    return { message: error.response?.data?.message || defaultMessage };
  } else {
    console.error('Error inesperado:', error);
    return { message: defaultMessage };
  }
};
