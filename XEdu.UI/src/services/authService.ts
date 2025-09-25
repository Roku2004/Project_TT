import { API_ENDPOINTS } from '../constants/api';
import {
  JwtAuthenticationResponse,
  LoginRequest,
  SignUpRequest,
  User,
  UserSummary
} from '../types';
import { apiService } from './api';

class AuthService {
  async login(credentials: LoginRequest): Promise<JwtAuthenticationResponse> {
    const apiResponse = await apiService.post<any>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    
    // Extract data from ApiResponse wrapper - backend returns { data: {...}, success: bool, message: string }
    const response = apiResponse.data || apiResponse;
    
    console.log('API Response:', apiResponse); // Debug log
    console.log('Extracted response:', response); // Debug log
    
    // Store token and user info
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(userData: SignUpRequest): Promise<JwtAuthenticationResponse> {
    const apiResponse = await apiService.post<any>(
      API_ENDPOINTS.REGISTER,
      userData
    );
    
    console.log('Register API Response:', apiResponse); // Debug log
    
    // Backend register chỉ trả về message, không có token và user
    // Cần login sau khi register thành công
    if (apiResponse.success || apiResponse.data) {
      // Auto login after successful registration
      const loginCredentials = {
        email: userData.email,
        password: userData.password
      };
      
      return await this.login(loginCredentials);
    } else {
      throw new Error(apiResponse.message || 'Registration failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    return await apiService.get<User>(API_ENDPOINTS.ME);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return await apiService.put<User>(API_ENDPOINTS.UPDATE_PROFILE, userData);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  getCurrentUserFromStorage(): UserSummary | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
export default authService;