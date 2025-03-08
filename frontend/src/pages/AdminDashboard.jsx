import { createSignal, onMount } from 'solid-js';

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
      <h1>Admin Dashboard</h1>
      <p>This page is only accessible to users with the ADMIN role.</p>
      
      <div class="admin-panel">
        <h2>User Management</h2>
        
        {loading() && <p>Loading users...</p>}
        
        {error() && (
          <div class="error-message">
            Error: {error()}
          </div>
        )}
        
        {!loading() && !error() && (
          <table class="users-table">
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
      
      <div class="admin-panel">
        <h2>Site Statistics</h2>
        <div class="stat-cards">
          <div class="stat-card">
            <h3>Total Users</h3>
            <p class="stat-number">{users().length}</p>
          </div>
          <div class="stat-card">
            <h3>Admin Users</h3>
            <p class="stat-number">
              {users().filter(u => u.roles.includes('ADMIN')).length}
            </p>
          </div>
          <div class="stat-card">
            <h3>Regular Users</h3>
            <p class="stat-number">
              {users().filter(u => u.roles.includes('USER') && !u.roles.includes('ADMIN')).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
