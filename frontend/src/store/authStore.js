import { createSignal, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

// Parse token to get user information
const parseToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// Create and export auth store
export const createAuthStore = () => {
  // Initial state from localStorage if available
  const storedToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null;

  // Create signals and store
  const [token, setToken] = createSignal(storedToken || '');
  const [user, setUser] = createSignal(storedUser || null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [store, setStore] = createStore({ 
    isAuthenticated: !!storedToken,
    isAdmin: storedUser?.roles?.includes('ADMIN') || false,
    username: storedUser?.username || ''
  });

  // Update store when token/user changes
  createEffect(() => {
    const currentToken = token();
    const currentUser = user();
    
    if (currentToken && currentUser) {
      localStorage.setItem('authToken', currentToken);
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      setStore({
        isAuthenticated: true,
        isAdmin: currentUser.roles?.includes('ADMIN') || false,
        username: currentUser.username
      });
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      setStore({
        isAuthenticated: false,
        isAdmin: false,
        username: ''
      });
    }
  });

  // Auth actions
  const login = async (username, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setToken(data.token);
      setUser({
        username: data.username,
        roles: data.roles
      });
      
      return data;
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password, isAdmin = false) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, isAdmin })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      setToken(data.token);
      setUser({
        username: data.username,
        roles: data.roles
      });
      
      return data;
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  // Helper to check authorization for routes
  const checkAccess = (requiredRole = null) => {
    if (!store.isAuthenticated) return false;
    if (!requiredRole) return true;
    return user()?.roles?.includes(requiredRole) || false;
  };

  return {
    // State
    token,
    user,
    loading,
    error,
    store,
    
    // Actions
    login,
    signup,
    logout,
    checkAccess,
    
    // Getters
    get isAuthenticated() { return store.isAuthenticated; },
    get isAdmin() { return store.isAdmin; },
    get username() { return store.username; }
  };
};

// Create a singleton instance of the auth store
const authStore = createAuthStore();
export default authStore;
