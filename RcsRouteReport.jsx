import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './rcsNetworkReport.css'; // Adjust the path as needed

const RouteReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const routeName = queryParams.get('routeName') || '';
  const fromPoint = queryParams.get('fromPoint') || '';
  const toPoint = queryParams.get('toPoint') || '';
  const stageLength = queryParams.get('stageLength') || '';

  useEffect(() => {
    // Construct the API endpoint with the query parameters
    let apiUrl = `http://localhost:8080/api/getallNetworkRoute`;

    // Append query parameters if they exist
    const params = new URLSearchParams();
    if (routeName) params.append('routeName', routeName);
    if (fromPoint) params.append('fromPoint', fromPoint);
    if (toPoint) params.append('toPoint', toPoint);
    if (stageLength) params.append('stageLength', stageLength);

    if (params.toString()) {
      apiUrl += `?${params.toString()}`;
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
  }, [routeName, fromPoint, toPoint, stageLength]);

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
    csvRows.push(['RCS Route Name', 'From Point', 'To Point', 'RCS Network Route', 'Stage Length'].join(','));

    reportData.forEach(row => {
      csvRows.push([
        row.routeName,
        row.fromPoint,
        row.toPoint,
        row.networkRouteCd,
        row.stageLength,
      ].join(','));
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
          Government of India<br />
          Ministry of Civil Aviation<br />
          RAJIV GANDHI BHAVAN, SAFDARJUNG AIRPORT,<br />
          NEW DELHI - 110 003
        </p>
      </div>
      <table className="sample">
        <thead>
          <tr>
            <td className="headingreport" colSpan={5}>Network Route Report</td>
          </tr>
          <tr>
            <th className="ColumnNameLeft">RCS Route Name</th>
            <th className="ColumnNameLeft">From Point</th>
            <th className="ColumnNameLeft">To Point</th>
            <th className="ColumnNameLeft">Network Route Code</th>
            <th className="ColumnNameLeft">Stage Length</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index}>
              <td className="DataLeft">{row.routeName}</td>
              <td className="DataLeft">{row.fromPoint}</td>
              <td className="DataLeft">{row.toPoint}</td>
              <td className="DataLeft">{row.networkRouteCd}</td>
              <td className="DataLeft">{row.stageLength}</td>
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

export default RouteReport;
