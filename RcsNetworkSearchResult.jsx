import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RcsHome.css';
import HeaderFooter from './HeaderFooter';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [commonFilter, setCommonFilter] = useState('');
  const recordsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const networkRouteCd = queryParams.get('networkRouteCd') || '';
  const networkRouteName = queryParams.get('networkRouteName') || '';
  const networkIataCode = queryParams.get('networkIataCode') || '';

  // Fetch data from the /api/rcs endpoint
  useEffect(() => {
    fetch('http://localhost:8080/api/rcs')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setResults(data);
        setFilteredResults(data); // Initialize filtered results with all data
      })
      .catch((error) => setError(error.message));
  }, []);

  // Fetch data from the /api/filter-network-routes endpoint
  useEffect(() => {
    fetch('http://localhost:8080/api/filter-network-routes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const combinedResults = [...results, ...data];
        setResults(combinedResults);
        setFilteredResults(combinedResults);
      })
      .catch((error) => setError(error.message));
  }, []);

 // Apply filtering based on URL parameters and common filter
useEffect(() => {
  const filtered = results.filter(
    (result) =>
      (networkRouteCd ? String(result.networkRouteCd || '').toLowerCase() === networkRouteCd.toLowerCase() : true) &&
      (networkRouteName ? String(result.networkName || '').toLowerCase().includes(networkRouteName.toLowerCase()) : true) &&
      (networkIataCode ? String(result.networkIataCode || '').toLowerCase().includes(networkIataCode.toLowerCase()) : true) &&
      (commonFilter ? 
        [result.networkRouteCd, result.networkName, result.networkIataCode, result.remarks]
          .filter(field => field != null) // Filter out null values
          .some(field => String(field).toLowerCase().includes(commonFilter.toLowerCase()))
        : true)
  );
  setFilteredResults(filtered);
  setCurrentPage(1); // Reset to the first page when filter changes
}, [results, networkRouteCd, networkRouteName, networkIataCode, commonFilter]); // Include `results` here


  const handleEdit = (networkRouteCd) => {
    navigate(`/rcs-network-route/EditPage/${networkRouteCd}`);
  };

  const handleDelete = (networkRouteCd) => {
    fetch(`http://localhost:8080/api/rcs/${networkRouteCd}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete');
        }
        const updatedResults = results.filter(
          (result) => result.networkRouteCd !== networkRouteCd
        );
        setResults(updatedResults);
        setFilteredResults(updatedResults);
      })
      .catch((error) => setError(error.message));
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredResults.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredResults.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (e) => {
    setCommonFilter(e.target.value);
  };

  return (
    <HeaderFooter>
      <div style={{ marginTop: '70px', marginLeft: '335px' }}>
        <h4>RCS Network Route [Search Result]</h4>
      </div>
      <div className="container">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by common term"
            value={commonFilter}
            onChange={handleFilterChange}
          />
        </div>
        {error && <p className="alert alert-danger">{error}</p>}
        <table className="results-table">
          <thead>
            <tr>
              <th>Route Code</th>
              <th>RCS Network Route in ICAO Code</th>
              <th>Network Route in IATA Code</th>
              <th>Remarks</th>
              <th>Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((result, index) => (
              <tr key={index}>
                <td>{result.networkRouteCd}</td>
                <td>{result.networkName}</td>
                <td>{result.networkIataCode}</td>
                <td>{result.remarks}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(result.networkRouteCd)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(result.networkRouteCd)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === Math.ceil(filteredResults.length / recordsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </HeaderFooter>
  );
};

export default SearchResultsPage;
