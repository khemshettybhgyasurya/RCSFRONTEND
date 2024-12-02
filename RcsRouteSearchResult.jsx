import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
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
  const location = useLocation(); // Get location object

  // Parse query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const routeName = queryParams.get('routeName') || '';
  const fromPoint = queryParams.get('fromPoint') || '';
  const toPoint = queryParams.get('toPoint') || '';
  const stageLength = queryParams.get('stageLength') || '';  

  // Fetch data from the /api/getAllNetworkRoute endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/getallNetworkRoute');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setResults(data);
        setFilteredResults(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Fetch error: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  
 // Apply filtering based on URL parameters and common filter
useEffect(() => {
  const filtered = results.filter(
    (result) =>
      (routeName ? String(result.routeName || '').toLowerCase().includes(routeName.toLowerCase()) : true) &&
      (fromPoint ? String(result.fromPoint || '').toLowerCase().includes(fromPoint.toLowerCase()) : true) &&
      (toPoint ? String(result.toPoint || '').toLowerCase().includes(toPoint.toLowerCase()) : true) &&
      (stageLength ? String(result.stageLength || '').toLowerCase().includes(stageLength.toLowerCase()) : true) &&
      (commonFilter ? 
        [result.routeName, result.fromPoint, result.toPoint, result.stageLength]
          .filter(field => field != null)  // Filter out null values
          .some(field => field.toLowerCase().includes(commonFilter.toLowerCase()))
        : true)
  );
  setFilteredResults(filtered);
  setCurrentPage(1); // Reset to the first page when filter changes
}, [results, routeName, fromPoint, toPoint, stageLength, commonFilter]);

  const handleEdit = (newRouteCode) => {
    navigate(`/rcs-routes/RcsRouteEdit/${newRouteCode}`);
  };

  const handleDelete = (newRouteCode) => {
    fetch(`http://localhost:8080/api/getallNetworkRoute/${newRouteCode}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete');
        }
        const updatedResults = results.filter(
          (result) => result.newRouteCode !== newRouteCode
        );
        setResults(updatedResults);
        setFilteredResults(updatedResults);
      })
      .catch((error) => setError(error.message));
  };

  // Pagination
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
        <h4>RCS Route [Search Result]</h4>
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
              <th>RCS Route Name</th>
              <th>From Point</th>
              <th>To Point</th>
              <th>Stage Length</th>
              <th>Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((result, index) => (
                <tr key={index}>
                  <td>{result.routeName}</td>
                  <td>{result.fromPoint}</td>
                  <td>{result.toPoint}</td>
                  <td>{result.stageLength}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(result.newRouteCode)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(result.newRouteCode)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No results found</td>
              </tr>
            )}
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
