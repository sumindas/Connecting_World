import React, { useState } from 'react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (username === 'admin' && password === 'password') {
        // Redirect to admin dashboard or perform actions for successful login
        console.log('Admin login successful!');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Login</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="username">
            Username:
          </label>
          <input
            style={styles.input}
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="password">
            Password:
          </label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        
          />
        </div>
        {error && (
          <p style={styles.errorMessage}>{error}</p>
        )}

        <button type="submit" style={styles.button}>
          Sign in
        </button>

        
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #4b6cb7, #182848)',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '400px',
    width: '100%',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  errorMessage: {
    backgroundColor: '#ffe4e1',
    color: '#ff4500',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  // ... (other styles)
};

export default AdminLogin;
