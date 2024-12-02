import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RcsHome.css'; // Ensure this CSS file includes styles for HeaderFooter
import HeaderFooter from './HeaderFooter'; // Import the HeaderFooter component

const RcsNetworkRouteForm = () => {
  const [formData, setFormData] = useState({
    networkRouteCd: '',
    networkroutename: '',
    networkName: '',
    networkIataCode: '',
    category: 'Select One',
    remarks: '',
  });
  const [error, setError] = useState('');
  const [airportData, setAirportData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/getrcsuser')
      .then(response => response.text())
      .then(data => {
        setFormData(prevState => ({ ...prevState, networkRouteCd: data }));
      })
      .catch(error => {
        console.error('Error fetching network route code:', error);
        setError(`Error fetching network route code: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/getairportdetails')
      .then(response => response.json())
      .then(data => {
        const airportMap = data.reduce((acc, item) => {
          const [icao, name, iata] = item;
          acc[icao] = { name, iata };
          return acc;
        }, {});
        setAirportData(airportMap);
      })
      .catch(error => {
        console.error('Error fetching airport data:', error);
        setError(`Error fetching airport data: ${error.message}`);
      });
  }, []);

  const translateIcaoCodes = (icaoCodes) => {
    if (!icaoCodes) return { names: '', iataCodes: '' };
    const codes = icaoCodes.split('-');
    const names = codes.map(code => airportData[code]?.name || 'Unknown');
    const iataCodes = codes.map(code => airportData[code]?.iata || 'Unknown');
    return { names: names.join('-'), iataCodes: iataCodes.join('-') };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'networkroutename') {
      const { names, iataCodes } = translateIcaoCodes(value);
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        networkName: names,
        networkIataCode: iataCodes,
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (!formData.networkRouteCd) {
      return 'Please Enter the Route Code (Mandatory)';
    }
    if (!formData.networkroutename) {
      return 'Please Enter the ICAO Code (Mandatory)';
    }
    if (formData.category === 'Select One') {
      return 'Please Select the Category (Mandatory)';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      window.alert(error);
      return;
    }

    setError('');
    fetch('http://localhost:8080/api/rcsuser', {
      method: 'POST',
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
      .catch(error => {
        setError(error.message);
        window.alert(error.message);
      });
  };

  const handleReset = () => {
    fetch('http://localhost:8080/api/getrcsuser')
      .then(response => response.text())
      .then(data => {
        setFormData({
          networkRouteCd: data,
          networkroutename: '',
          networkName: '',
          networkIataCode: '',
          category: 'Select One',
          remarks: '',
        });
      })
      .catch(error => console.error('Error fetching network route code:', error));
  };

  const handleSearch = () => {
    console.log('Navigating to /search');
    navigate('/rcs-network-route/search');
  };

  return (
    <HeaderFooter>
    <div style={{marginTop:'70px', marginLeft:'335px'}}><h4>RCS Network Route [New]</h4></div>
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
              readOnly
            />
          </div>
          <div className="form-group">
            <label>RCS Network Route in IATA Code:</label>
            <input
              type="text"
              name="networkIataCode"
              value={formData.networkIataCode}
              onChange={handleChange}
              readOnly
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

export default RcsNetworkRouteForm;
