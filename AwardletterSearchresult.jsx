import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RcsHome.css';
import HeaderFooter from './HeaderFooter';

const AwardLetterSearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [commonFilter, setCommonFilter] = useState('');
  const recordsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const saoCd = queryParams.get('saoCd') || '';
  const saoName = queryParams.get('saoName') || '';
  const awdltrDetails = queryParams.get('awdltrDetails') || '';

  // Fetch data from the /api/getawardletters endpoint
  useEffect(() => {
    fetch('http://localhost:8080/api/getawardletters')
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

  // Apply filtering based on URL parameters and common filter
  useEffect(() => {
    const filtered = results.filter(
      (result) =>
        (saoCd ? String(result.saoCd || '').toLowerCase() === saoCd.toLowerCase() : true) &&
        (saoName ? String(result.saoName || '').toLowerCase().includes(saoName.toLowerCase()) : true) &&
        (awdltrDetails ? String(result.awdltrDetails || '').toLowerCase().includes(awdltrDetails.toLowerCase()) : true) &&
        (commonFilter
          ? [result.saoCd, result.saoName, result.awdltrDetails]
              .filter((field) => field != null) // Filter out null values
              .some((field) => String(field).toLowerCase().includes(commonFilter.toLowerCase()))
          : true)
    );
    setFilteredResults(filtered);
    setCurrentPage(1); // Reset to the first page when filter changes
  }, [results, saoCd, saoName, awdltrDetails, commonFilter]);

  const handleEdit = (awdltrId) => {
    navigate(`/award-letter-master/Awardedit/${awdltrId}`);
  };

  const handleDelete = (awdltrId) => {
    fetch(`http://localhost:8080/api/getawardletters/${awdltrId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete');
        }
        const updatedResults = results.filter((result) => result.awdltrId !== awdltrId);
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
        <h4>Award Letters [Search Result]</h4>
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
              <th>SAO Code</th>
              <th>SAO Name</th>
              <th>Award Letter Details</th>
              <th>Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((result, index) => (
              <tr key={index}>
                <td>{result.saoCd}</td>
                <td>{result.saoName}</td>
                <td>{result.awdltrDetails}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(result.awdltrId)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(result.awdltrId)}>Delete</button>
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

export default AwardLetterSearchResultsPage;
