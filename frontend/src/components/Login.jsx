import { createSignal, Show } from 'solid-js';
import authStore from '../store/authStore';

/**
 * Login component for user authentication with artisan theme
 * 
 * @param {Object} props Component properties
 * @param {Function} props.onSuccess Callback function to execute after successful login
 * @param {Function} props.onSignup Callback function to navigate to signup page
 */
export default function Login(props) {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [errorMessage, setErrorMessage] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      await authStore.login(username(), password());
      // Execute success callback if provided
      if (props.onSuccess) {
        props.onSuccess();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div class="auth-container">
      <div class="auth-form">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p class="auth-subtitle">Enter your credentials to continue your literary journey</p>
        </div>
        
        <Show when={errorMessage()}>
          <div class="error-message">{errorMessage()}</div>
        </Show>
        
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              value={username()}
              onInput={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading()}
              placeholder="Your username"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading()}
              placeholder="Your password"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" disabled={isLoading()}>
              {isLoading() ? 'Signing in...' : 'Sign In'}
            </button>
            <a href="#" class="btn-link" onClick={(e) => { e.preventDefault(); props.onSignup && props.onSignup(); }}>
              Don't have an account? Create one
            </a>
          </div>
        </form>
        
        <div class="auth-decoration">
          <div class="auth-decoration-line"></div>
          <span class="auth-decoration-text">Poetry awaits</span>
          <div class="auth-decoration-line"></div>
        </div>
      </div>
    </div>
  );
}
