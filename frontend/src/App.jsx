import { createSignal, lazy, Suspense, Show, onMount } from 'solid-js';
import './App.css';
import authStore from './store/authStore';

// Import components
import PoemBrowser from './pages/PoemBrowser';
import Login from './components/Login';
import Signup from './components/Signup';
import Unauthorized from './components/Unauthorized';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

/**
 * Simple application with conditional rendering based on auth state
 */
export default function App() {
  // Map path to page name
  const getPageFromPath = (path) => {
    const pathSegments = path.split('/').filter(Boolean);
    const mainPath = pathSegments[0] || 'home';
    
    const validPages = ['home', 'login', 'signup', 'admin', 'profile'];
    return validPages.includes(mainPath) ? mainPath : 'home';
  };
  
  // Initialize page based on URL path
  const initialPage = getPageFromPath(window.location.pathname);
  const [currentPage, setCurrentPage] = createSignal(initialPage);
  
  // Navigation helper
  const navigate = (page) => {
    setCurrentPage(page);
    // Update the URL to match the page (without page reload)
    const newPath = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', newPath);
  };
  
  // Handle browser back/forward button
  onMount(() => {
    window.addEventListener('popstate', () => {
      const newPage = getPageFromPath(window.location.pathname);
      setCurrentPage(newPage);
    });
  });
  
  // Logout handler
  const handleLogout = () => {
    authStore.logout();
    navigate('home');
  };
  
  // Page renderer based on current page and auth state
  const renderPage = () => {
    switch (currentPage()) {
      case 'home':
        return <PoemBrowser />;
      case 'login':
        return <Login 
          onSuccess={() => navigate('home')} 
          onSignup={() => navigate('signup')} 
        />;
      case 'signup':
        return <Signup 
          onSuccess={() => navigate('home')} 
          onLogin={() => navigate('login')} 
        />;
      case 'admin':
        return authStore.isAuthenticated && authStore.isAdmin 
          ? <AdminDashboard /> 
          : <Unauthorized />;
      case 'profile':
        return authStore.isAuthenticated 
          ? <UserProfile /> 
          : <Unauthorized />;
      default:
        return <div>Page not found</div>;
    }
  };
  
  return (
    <div class="app-container">
      {/* Navigation bar */}
      <nav class="navbar">
        <div class="navbar-logo">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>
            Poetry App
          </a>
        </div>
        
        <div class="navbar-menu">
          <a class="navbar-item" href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>
            Home
          </a>
          
          <Show when={authStore.isAuthenticated}>
            <a class="navbar-item" href="#" onClick={(e) => { e.preventDefault(); navigate('profile'); }}>
              My Profile
            </a>
            
            <Show when={authStore.isAdmin}>
              <a class="navbar-item" href="#" onClick={(e) => { e.preventDefault(); navigate('admin'); }}>
                Admin Dashboard
              </a>
            </Show>
          </Show>
        </div>
        
        <div class="navbar-auth">
          <Show
            when={authStore.isAuthenticated}
            fallback={
              <>
                <a class="btn-link" href="#" onClick={(e) => { e.preventDefault(); navigate('login'); }}>
                  Login
                </a>
                <a class="btn-primary" href="#" onClick={(e) => { e.preventDefault(); navigate('signup'); }}>
                  Sign Up
                </a>
              </>
            }
          >
            <span class="user-welcome">Welcome, {authStore.username}</span>
            <button class="btn-logout" onClick={handleLogout}>Logout</button>
          </Show>
        </div>
      </nav>
      
      {/* Main content */}
      <main class="content-container">
        <Suspense fallback={<div class="loading">Loading...</div>}>
          {renderPage()}
        </Suspense>
      </main>
      
      {/* Footer */}
      <footer class="app-footer">
        <p>&copy; {new Date().getFullYear()} Poetry App</p>
      </footer>
    </div>
  );
}
