import { createSignal, Show } from 'solid-js';
import authStore from '../store/authStore';

/**
 * Signup component for user registration with artisan theme
 * 
 * @param {Object} props Component properties
 * @param {Function} props.onSuccess Callback function to execute after successful signup
 * @param {Function} props.onLogin Callback function to navigate to login page
 */
export default function Signup(props) {
  const [username, setUsername] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [isAdmin, setIsAdmin] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validate form
    if (password() !== confirmPassword()) {
      setErrorMessage("Passwords don't match");
      return;
    }
    
    if (password().length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authStore.signup(username(), email(), password(), isAdmin());
      // Execute success callback if provided
      if (props.onSuccess) {
        props.onSuccess();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div class="auth-container">
      <div class="auth-form">
        <div class="auth-header">
          <h2>Join Our Poetic Community</h2>
          <p class="auth-subtitle">Create an account to embark on your literary journey</p>
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
              minLength={3}
              maxLength={20}
              placeholder="Choose a username"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading()}
              placeholder="Your email address"
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
              minLength={6}
              placeholder="Create a password (6+ characters)"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading()}
              placeholder="Confirm your password"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                checked={isAdmin()}
                onChange={(e) => setIsAdmin(e.target.checked)}
                disabled={isLoading()}
              />
              Register as Admin
            </label>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" disabled={isLoading()}>
              {isLoading() ? 'Creating Account...' : 'Create Account'}
            </button>
            <a href="#" class="btn-link" onClick={(e) => { e.preventDefault(); props.onLogin && props.onLogin(); }}>
              Already have an account? Sign in
            </a>
          </div>
        </form>
        
        <div class="auth-decoration">
          <div class="auth-decoration-line"></div>
          <span class="auth-decoration-text">Begin your verse</span>
          <div class="auth-decoration-line"></div>
        </div>
      </div>
    </div>
  );
}
