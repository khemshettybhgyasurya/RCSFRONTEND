import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rcslogin.css';
import './RcsHome.css'; // Ensure this CSS file includes styles for HeaderFooter
import HeaderFooter from './loginheaderfooter'; // Import the HeaderFooter component

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login/RCS-VGF', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const result = await response.text();
        console.log(result); // handle success
        alert('Login successful');
        navigate('/RcsHome'); // Redirect to another page
      } else {
        const errorText = await response.text();
        console.error(errorText); // handle error
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred');
    }
  };

  return (
    <HeaderFooter>
      <div className='bg'>
        <div className="login-container">
          <div className="login-box">
            <h4><b>AIRPORTS AUTHORITY OF INDIA </b></h4>
            <p>Please enter your username and password to login.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="User Name"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label>Remember me</label>
              </div>
              <button type="submit">Login</button>
            </form>
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </div>
      </div>
    </HeaderFooter>
  );
};

export default LoginPage;
