import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './rcsNetworkReport.css'; // Adjust the path as needed

const NetworkRouteReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to get the current location

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const networkRouteCd = queryParams.get('networkRouteCd');
  const networkRouteName = queryParams.get('networkRouteName');
  const networkIataCode = queryParams.get('networkIataCode');

  useEffect(() => {
    // Construct the API endpoint with the query parameters
    let apiUrl = `http://localhost:8080/api/network-route-report`;
    
    if (networkRouteCd || networkRouteName || networkIataCode) {
      apiUrl += `?networkRouteCd=${networkRouteCd || ''}&networkRouteName=${networkRouteName || ''}&networkIataCode=${networkIataCode || ''}`;
    }

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [networkRouteCd, networkRouteName, networkIataCode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleBack = () => {
    navigate(-1); // Go back one step in history
  };

  const handleDownload = () => {
    const csvRows = [];
    csvRows.push(['Network Route Code', 'Network Route Name', 'Remarks'].join(','));

    reportData.forEach(row => {
      csvRows.push(row.join(','));
    });

    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'network_route_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div>
        <p className="govtInfo">
          Government of India<br/>
          Ministry of Civil Aviation<br/>
          RAJIV GANDHI BHAVAN, SAFDARJUNG AIRPORT,<br/>
          NEW DELHI - 110 003
        </p>
      </div>
      <table className="sample">
        <thead>
          <tr>
            <td className="headingreport" colSpan={3}>Network Route Report</td>
          </tr>
          <tr>
            <th className="ColumnNameLeft">Network Route Code</th>
            <th className="ColumnNameLeft">Network Route Name</th>
            <th className="ColumnNameLeft">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index}>
              <td className="DataLeft">{row[0]}</td>
              <td className="DataLeft">{row[1]}</td>
              <td className="DataLeft">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons">
        <button onClick={handleBack}>Back</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default NetworkRouteReport;
