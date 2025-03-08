import { Show, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import authStore from '../store/authStore';

/**
 * Protected route component for restricting access based on authentication status and roles
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render if authorized
 * @param {string} [props.requiredRole] Optional specific role required (e.g., 'ADMIN')
 * @returns {React.ReactNode} The protected component or a redirect
 */
export default function ProtectedRoute(props) {
  const navigate = useNavigate();
  
  // Check if user is authenticated and has required role (if specified)
  const hasAccess = () => {
    if (!authStore.isAuthenticated) {
      return false;
    }
    
    if (props.requiredRole && !authStore.user()?.roles?.includes(props.requiredRole)) {
      return false;
    }
    
    return true;
  };
  
  // Handle redirect when access is denied
  createEffect(() => {
    if (!hasAccess()) {
      navigate(authStore.isAuthenticated ? '/unauthorized' : '/login');
    }
  });
  
  return (
    <Show
      when={hasAccess()}
      fallback={<div>Redirecting...</div>}
    >
      {props.children}
    </Show>
  );
}
