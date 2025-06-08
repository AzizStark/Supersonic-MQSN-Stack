import { createSignal, onMount } from 'solid-js';
import BookManagement from '../components/BookManagement';

/**
 * Admin dashboard page accessible only to users with ADMIN role
 */
export default function AdminDashboard() {
  const [users, setUsers] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  
  // Fetch users on component mount
  onMount(async () => {
    try {
      setLoading(true);
      // This is a mock - in a real app, you would fetch from API
      // We're simulating delay and response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in a real app this would come from API
      setUsers([
        { id: 1, username: 'admin', email: 'admin@example.com', roles: ['ADMIN', 'USER'] },
        { id: 2, username: 'user', email: 'user@example.com', roles: ['USER'] },
        { id: 3, username: 'john.doe', email: 'john@example.com', roles: ['USER'] },
        { id: 4, username: 'manager', email: 'manager@example.com', roles: ['USER', 'ADMIN'] }
      ]);
      
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  });
  
  return (
    <div class="admin-dashboard">
      <h1 class="artisan-title">Admin Dashboard</h1>
      <p class="artisan-subtitle">Manage your book shop's content and users</p>
      
      <div class="admin-panel artisan-panel">
        <h2 class="panel-title">User Management</h2>
        <p class="panel-description">Review and manage user accounts and permissions</p>
        
        {loading() && <p class="loading-message"><span class="loading-icon">⟳</span> Loading users...</p>}
        
        {error() && (
          <div class="error-message">
            <span class="error-icon">!</span> Error: {error()}
          </div>
        )}
        
        {!loading() && !error() && (
          <table class="users-table artisan-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users().map(user => (
                <tr>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.roles.join(', ')}</td>
                  <td>
                    <button class="btn-small">Edit</button>
                    <button class="btn-small btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div class="admin-panel artisan-panel">
        <h2 class="panel-title">Shop Statistics</h2>
        <p class="panel-description">A glimpse into your literary community</p>
        <div class="stat-cards">
          <div class="stat-card">
            <h3 class="stat-title">Total Patrons</h3>
            <p class="stat-number">{users().length}</p>
            <p class="stat-description">Readers in your community</p>
          </div>
          <div class="stat-card">
            <h3 class="stat-title">Curators</h3>
            <p class="stat-number">
              {users().filter(u => u.roles.includes('ADMIN')).length}
            </p>
            <p class="stat-description">Guardians of the collection</p>
          </div>
          <div class="stat-card">
            <h3 class="stat-title">Members</h3>
            <p class="stat-number">
              {users().filter(u => u.roles.includes('USER') && !u.roles.includes('ADMIN')).length}
            </p>
            <p class="stat-description">Regular bibliophiles</p>
          </div>
        </div>
      </div>
      
      <BookManagement />
    </div>
  );
}
