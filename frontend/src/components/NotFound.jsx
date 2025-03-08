import { useNavigate } from '@solidjs/router';

/**
 * NotFound component displayed when navigating to non-existent routes
 */
export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        
        <div class="not-found-actions">
          <button class="btn-primary" onClick={() => navigate('/')}>
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
