import { Show } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import authStore from '../store/authStore';

/**
 * Navigation bar component with authentication-aware rendering
 */
export default function Navbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };
  
  return (
    <nav class="navbar">
      <div class="navbar-logo">
        <A href="/">Poetry App</A>
      </div>
      
      <div class="navbar-menu">
        <A class="navbar-item" href="/">Home</A>
        
        <Show when={authStore.isAuthenticated}>
          {/* Links for authenticated users */}
          <A class="navbar-item" href="/profile">My Profile</A>
          
          <Show when={authStore.isAdmin}>
            {/* Links only for admin users */}
            <A class="navbar-item" href="/admin">Admin Dashboard</A>
          </Show>
        </Show>
      </div>
      
      <div class="navbar-auth">
        <Show
          when={authStore.isAuthenticated}
          fallback={
            <>
              <A class="btn-link" href="/login">Login</A>
              <A class="btn-primary" href="/signup">Sign Up</A>
            </>
          }
        >
          <span class="user-welcome">Welcome, {authStore.username}</span>
          <button class="btn-logout" onClick={handleLogout}>Logout</button>
        </Show>
      </div>
    </nav>
  );
}
