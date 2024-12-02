import React, { useState, useEffect } from 'react';
import './helpwindow.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const HelpModal = ({ isOpen, onClose, onOperatorSelect }) => {
  const [operators, setOperators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperator, setSelectedOperator] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchOperators = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/getoperators');
          if (response.ok) {
            const data = await response.json();
            console.log(data); // Ensure data structure is as expected
            setOperators(data);
          } else {
            console.error('Error fetching operators: ', response.statusText);
          }
        } catch (err) {
          console.error('Error fetching operators:', err);
        }
      };

      fetchOperators();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter operators based on search query
  const filteredOperators = operators.filter((operator) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesName = operator.operatorName.toLowerCase().includes(searchLower);
    const matchesCode = operator.operatorCd.toLowerCase().includes(searchLower);
    return matchesName || matchesCode;
  });

  const handleSelection = (operator) => {
    setSelectedOperator(operator.operatorCd);
    onOperatorSelect(operator); // Notify parent component about the selected operator
    onClose(); // Optionally close the modal after selection
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Operators [Help]</h2>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtered Operator List Header */}
        <div className="operator-list-header">
          <span className="operator-name-header">Operator Name</span>
          <span className="operator-code-header">Operator Code</span>
        </div>

        {/* Filtered Operators */}
        <ul>
          {filteredOperators.length > 0 ? (
            filteredOperators.map((operator) => (
              <li key={operator.operatorCd}>
                <div className="operator-item">
                  <input
                    type="radio"
                    name="operator"
                    value={operator.operatorCd}
                    checked={selectedOperator === operator.operatorCd}
                    onChange={() => handleSelection(operator)}
                  />
                  <span className="operator-name">{operator.operatorName}</span>
                  <span className="operator-code">{operator.operatorCd}</span>
                </div>
              </li>
            ))
          ) : (
            <li>No operators found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HelpModal;
