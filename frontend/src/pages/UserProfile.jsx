import { createSignal, onMount } from 'solid-js';
import authStore from '../store/authStore';

/**
 * User profile page accessible to any authenticated user
 */
export default function UserProfile() {
  const [userData, setUserData] = createSignal({
    username: authStore.username,
    email: '',
    roles: []
  });
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);
  const [editMode, setEditMode] = createSignal(false);
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  
  // Load user data
  onMount(() => {
    // In a real application, we would fetch more data from the API
    // Here we're using what we have from the auth store
    setUserData({
      username: authStore.username,
      email: authStore.user()?.email || 'user@example.com', // Mock email if not available
      roles: authStore.user()?.roles || []
    });
  });
  
  const toggleEditMode = () => setEditMode(!editMode());
  
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (password() !== confirmPassword()) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to update user data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Update succeeded - exit edit mode
      setEditMode(false);
      setPassword('');
      setConfirmPassword('');
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div class="profile-container">
      <h1>User Profile</h1>
      
      {error() && <div class="error-message">{error()}</div>}
      
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            {userData().username.charAt(0).toUpperCase()}
          </div>
          <h2>{userData().username}</h2>
        </div>
        
        {!editMode() ? (
          <div class="profile-details">
            <div class="profile-row">
              <span class="profile-label">Email:</span>
              <span>{userData().email}</span>
            </div>
            
            <div class="profile-row">
              <span class="profile-label">Roles:</span>
              <span>{userData().roles.join(', ')}</span>
            </div>
            
            <div class="profile-actions">
              <button
                class="btn-primary"
                onClick={toggleEditMode}
                disabled={loading()}
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form class="profile-edit-form" onSubmit={handleSave}>
            <div class="form-group">
              <label>Username</label>
              <input
                type="text"
                value={userData().username}
                disabled
                class="disabled-input"
              />
              <p class="form-help-text">Username cannot be changed</p>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                value={userData().email}
                onInput={(e) => setUserData({...userData(), email: e.target.value})}
                required
                disabled={loading()}
              />
            </div>
            
            <div class="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={password()}
                onInput={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                disabled={loading()}
              />
            </div>
            
            <div class="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                disabled={loading()}
              />
            </div>
            
            <div class="profile-edit-actions">
              <button
                type="button"
                class="btn-secondary"
                onClick={toggleEditMode}
                disabled={loading()}
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                disabled={loading()}
              >
                {loading() ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
