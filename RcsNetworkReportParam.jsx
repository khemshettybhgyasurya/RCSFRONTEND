import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RcsHome.css';
import HeaderFooter from './HeaderFooter';

const RcsRouteParamPage = () => {
    const [formData, setFormData] = useState({
        routeName: '',
        fromPoint: '',
        toPoint: '',
        stageLength: ''
    });
    const [networkRoutes, setNetworkRoutes] = useState([]);
    const [routeSegments, setRouteSegments] = useState([]);
 

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { routeName, fromPoint, toPoint, stageLength } = formData;
        navigate(`/rcs-routes/RcsRouteSearchResult?routeName=${routeName}&fromPoint=${fromPoint}&toPoint=${toPoint}&stageLength=${stageLength}`);
    };

    useEffect(() => {
        const fetchNetworkRoutes = async () => {
            try {
                
                const response = await fetch('http://localhost:8080/api/network-routes');
                const data = await response.json();
                setNetworkRoutes(data);
            } catch (err) {
                console.error('Error fetching network routes:', err);
            } finally {
               
            }
        };

        fetchNetworkRoutes();
    }, []);

    const handleRouteChange = (e) => {
        const selectedRouteName = e.target.value;
        setFormData(prevState => ({
            ...prevState,
            routeName: selectedRouteName,
            fromPoint: '',
            toPoint: ''
        }));

        if (selectedRouteName) {
            const segments = selectedRouteName.split('-');
            setRouteSegments(segments);
        } else {
            setRouteSegments([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleReset = () => {
        setFormData({
            routeName: '',
            fromPoint: '',
            toPoint: '',
            stageLength: ''
        });
        setRouteSegments([]);
    };

    return (
        <HeaderFooter>
            <div style={{ marginTop: '70px', marginLeft: '335px' }}>
                <h4>RCS Route Report[Param]</h4>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Route Name:</label>
                        <select
                            name="routeName"
                            value={formData.routeName}
                            onChange={handleRouteChange}
                        >
                            <option value="">Select a Route</option>
                            {networkRoutes.map((route, index) => (
                                <option key={index} value={route[1]}>
                                    {route[1]} {/* Display route name */}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>From Point:</label>
                        <select
                            name="fromPoint"
                            value={formData.fromPoint}
                            onChange={handleInputChange}
                        >
                            <option value="">[Select One]</option>
                            {routeSegments.map((segment, index) => (
                                <option key={index} value={segment}>
                                    {segment}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>To Point:</label>
                        <select
                            name="toPoint"
                            value={formData.toPoint}
                            onChange={handleInputChange}
                        >
                            <option value="">[Select One]</option>
                            {routeSegments.map((segment, index) => (
                                <option key={index} value={segment}>
                                    {segment}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Stage Length (KM):</label>
                        <input
                            type="text"
                            name="stageLength"
                            value={formData.stageLength}
                            onChange={handleInputChange}
                        />
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

export default RcsRouteParamPage;
