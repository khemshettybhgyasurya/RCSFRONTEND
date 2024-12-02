import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RcsHome.css';
import HeaderFooter from './HeaderFooter';

const RcsRouteNew = () => {
    const [formData, setFormData] = useState({
        routeName: '',
        networkRouteCd: '',
        fromPoint: '',
        toPoint: '',
        stageLength: '',
        fromState: '',
        toState: ''
    });
    const [networkRoutes, setNetworkRoutes] = useState([]);
    const [routeSegments, setRouteSegments] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch network routes
                const response = await fetch('http://localhost:8080/api/network-routes');
                const data = await response.json();
                setNetworkRoutes(data);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchStateName = async (airportCd, field) => {
        try {
            const response = await fetch(`http://localhost:8080/api/state-name/${airportCd}`);
            if (response.ok) {
                const stateName = await response.text();
                setFormData(prevState => ({
                    ...prevState,
                    [field]: stateName
                }));
            } else {
                console.error('Error fetching state name:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching state name:', error.message);
        }
    };

    const handleRouteChange = (e) => {
        const selectedRouteName = e.target.value;
        setFormData(prevState => ({
            ...prevState,
            routeName: selectedRouteName,
            fromPoint: '',
            toPoint: ''
        }));

        if (selectedRouteName) {
            // Split the selected route name into segments (airports)
            const segments = selectedRouteName.split('-');
            setRouteSegments(segments);
        } else {
            setRouteSegments([]);
        }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Fetch state name when 'fromPoint' or 'toPoint' changes
        if (name === 'fromPoint' || name === 'toPoint') {
            if (value) {
                await fetchStateName(value, name === 'fromPoint' ? 'fromState' : 'toState');
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    [name === 'fromPoint' ? 'fromState' : 'toState']: ''
                }));
            }
        }
    };

    const createRoute = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/insertNetworkRoute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                navigate('/some-other-page');
            } else {
                console.error('Error creating route:', await response.text());
            }
        } catch (error) {
            console.error('Error creating route:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            routeName: '',
            networkRouteCd: '',
            fromPoint: '',
            toPoint: '',
            stageLength: '',
            fromState: '',
            toState: ''
        });
        setRouteSegments([]);
    };

   

      const handleSearch = () => {
        console.log('Navigating to /rcs-routes/RcsRouteSearchResult');
        navigate('/rcs-routes/RcsRouteSearchResult');
      };

    return (
        <HeaderFooter>
            <div style={{ marginTop: '70px', marginLeft: '335px' }}>
                <h4>RCS Routes [New]</h4>
            </div>
            <div className="container">
                <form>
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
                        <label>From State:</label>
                        <input
                            type="text"
                            name="fromState"
                            value={formData.fromState}
                            onChange={handleInputChange}
                        />
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
                        <label>To State:</label>
                        <input
                            type="text"
                            name="toState"
                            value={formData.toState}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label>Stage Length:</label>
                        <input
                            type="text"
                            name="stageLength"
                            value={formData.stageLength}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <button type="button" onClick={createRoute} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                        <button type="button" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </HeaderFooter>
    );
};

export default RcsRouteNew;
