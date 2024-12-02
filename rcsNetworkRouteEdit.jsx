import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RcsHome.css'; // Ensure this CSS file includes styles for HeaderFooter
import HeaderFooter from './HeaderFooter'; // Import the HeaderFooter component
const EditPage = () => {
  const { networkRouteCd } = useParams(); // Get networkRouteCd from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    networkRouteCd: '',
    networkroutename: '',
    networkName: '',
    networkIataCode: '',
    category: 'Select One',
    remarks: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Fetching data for networkRouteCd:', networkRouteCd); // Debugging
    fetch(`http://localhost:8080/api/rcs/${networkRouteCd}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data); // Debugging
        setFormData({
          networkRouteCd: data.networkRouteCd || '',
          networkroutename: data.networkroutename || '',
          networkName: data.networkName || '',
          networkIataCode: data.networkIataCode || '',
          category: data.category || 'Select One',
          remarks: data.remarks || ''
        });
      })
      .catch(error => {
        console.error('Error fetching network route code:', error);
        setError(`Error fetching network route code: ${error.message}`);
      });
  }, [networkRouteCd]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/rcs/${networkRouteCd}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => { throw new Error(error.message) });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        // Optionally redirect or show a success message
      })
      .catch(error => setError(`Error updating data: ${error.message}`));
  };

  const handleReset = () => {
    // Fetch initial data again to reset form data
    fetch(`http://localhost:8080/api/rcs/${networkRouteCd}`)
      .then(response => response.json())
      .then(data => {
        console.log('Reset data:', data); // Debugging
        setFormData({
          networkRouteCd: data.networkRouteCd || '',
          networkroutename: data.networkroutename || '',
          networkName: data.networkName || '',
          networkIataCode: data.networkIataCode || '',
          category: data.category || 'Select One',
          remarks: data.remarks || ''
        });
      })
      .catch(error => setError(`Error resetting data: ${error.message}`));
  };

  const handleSearch = () => {
    
    navigate('/rcs-network-route/search');
  };

  return (
    <HeaderFooter>
    <div style={{marginTop:'70px', marginLeft:'335px'}}><h4>RCS Network Route [Edit]</h4></div>
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Route Code:</label>
          <input
            type="text"
            name="networkRouteCd"
            value={formData.networkRouteCd}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>RCS Network Route in ICAO Code:</label>
          <input
            type="text"
            name="networkroutename"
            value={formData.networkroutename}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>RCS Network Route in Airport Name:</label>
          <input
            type="text"
            name="networkName"
            value={formData.networkName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>RCS Network Route in IATA Code:</label>
          <input
            type="text"
            name="networkIataCode"
            value={formData.networkIataCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Category of aircraft in the Screen:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Select One">Select One</option>
            <option value="Fixed Wings">Fixed Wings</option>
            <option value="Rotary Wings">Rotary Wings</option>
            <option value="Sea Plane">Sea Plane</option>
          </select>
        </div>
        <div className="form-group">
          <label>Remarks:</label>
          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button type="submit">Save</button>
          <button type="button" onClick={handleReset}>Reset</button>
          <button type="button" onClick={handleSearch}>Search</button>
        </div>
      </form>
    </div>
    </HeaderFooter>
  );
};

export default EditPage;
