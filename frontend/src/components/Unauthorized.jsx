import { useNavigate } from '@solidjs/router';

/**
 * Page shown when a user tries to access a resource they don't have permission for
 */
export default function Unauthorized() {
  const navigate = useNavigate();
  
  return (
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Please contact an administrator if you believe this is an error.</p>
        
        <div class="unauthorized-actions">
          <button class="btn-primary" onClick={() => navigate('/')}>
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
