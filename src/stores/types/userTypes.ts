/**
 * In the project, the backend imitation is performed on API routers.
 */

export interface AuthState {
  isFetching: boolean;
  isAuthenticated: boolean;
  user?: any;
  error?: string;
}
