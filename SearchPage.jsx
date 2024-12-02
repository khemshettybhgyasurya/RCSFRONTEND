import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RcsHome.css';
import HeaderFooter from './HeaderFooter';

const SearchPage = () => {
  const navigate = useNavigate();
  const [routeCode, setRouteCode] = useState('');
  const [icaoCode, setIcaoCode] = useState('');
  const [iataCode, setIataCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/rcs-network-route/searchresult?networkRouteCd=${routeCode}&networkRouteName=${icaoCode}&networkIataCode=${iataCode}`);
  };

  return (
    <HeaderFooter>
    <div style={{marginTop:'70px', marginLeft:'335px'}}><h4>RCS Network Route [Param]</h4></div>
  
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Route Code:</label>
            <input type="text" value={routeCode} onChange={(e) => setRouteCode(e.target.value)} />
          </div>
          <div className="form-group">
            <label>RCS Network Route in ICAO Code:</label>
            <input type="text" value={icaoCode} onChange={(e) => setIcaoCode(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Network Route in IATA Code:</label>
            <input type="text" value={iataCode} onChange={(e) => setIataCode(e.target.value)} />
          </div>
          <div className="form-group">
            <button type="button">Reset</button>
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
    </HeaderFooter>
  );
};

export default SearchPage;
