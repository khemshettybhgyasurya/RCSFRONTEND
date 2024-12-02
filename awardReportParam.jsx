import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RcsHome.css';
import HeaderFooter from './HeaderFooter';

const AwardParamPage = () => {
    const [formData, setFormData] = useState({
        operatorName: '',
        awdltrDetails: '',
    });
    const [operators, setOperators] = useState([]);
    const [awardLetters, setAwardLetters] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [operatorsResponse, awardLettersResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/getoperators'),
                    fetch('http://localhost:8080/api/getawardletters')
                ]);

                if (!operatorsResponse.ok || !awardLettersResponse.ok) {
                    throw new Error('One or both fetch requests failed');
                }

                const operatorsData = await operatorsResponse.json();
                const awardLettersData = await awardLettersResponse.json();

                // Log responses to check the structure
                console.log('Operators Data:', operatorsData);
                console.log('Award Letters Data:', awardLettersData);

                setOperators(operatorsData);
                setAwardLetters(awardLettersData);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { operatorName, awdltrDetails } = formData;
        // You can navigate to another page or perform any action here
        console.log('Selected Operator:', operatorName);
        console.log('Selected Award Letter:', awdltrDetails);
        navigate(`/award-letter-master/searchResult?operatorName=${operatorName}&awdltrDetails=${awdltrDetails}`);
    };

    const handleRouteChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setFormData({
            operatorName: '',
            awdltrDetails: '',
        });
    };

    return (
        <HeaderFooter>
            <div style={{ marginTop: '70px', marginLeft: '335px' }}>
                <h4>Award Letter Master Report [Param]</h4>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name of Selected Airline Operator (SAO):</label>
                        <select
                            name="operatorName"
                            value={formData.operatorName}
                            onChange={handleRouteChange}
                        >
                            <option value="">Select an Operator</option>
                            {operators.map((operator, index) => (
                                <option key={index} value={operator.name || operator.operatorName}>
                                    {operator.name || operator.operatorName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Letter of Award (LoA) No :</label>
                        <select
                            name="awdltrDetails"
                            value={formData.awdltrDetails}
                            onChange={handleRouteChange}
                        >
                            <option value="">Select Award Letter</option>
                            {awardLetters.map((letter, index) => (
                                <option key={index} value={letter.details || letter.awdltrDetails}>
                                    {letter.details || letter.awdltrDetails}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                        <button type="submit">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </HeaderFooter>
    );
};

export default AwardParamPage;
