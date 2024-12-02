import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RcsHome.css';
import HeaderFooter from './HeaderFooter';

const RcsRouteEdit = () => {
    const { networkRouteCd } = useParams(); // Get networkRouteCd from the URL
   
    const { id } = useParams(); // Get the route ID from the URL
    const [formData, setFormData] = useState({
        newRouteCode: '',
        routeName: '',
        networkRouteCd: '',
        fromPoint: '',
        toPoint: '',
        stageLength: '',
        fromState: '',
        toState: ''
    });
    const [error, setError] = useState(null); // Initialize error state
    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
        console.log('Fetching data for RouteId:', networkRouteCd); // Debugging
        fetch(`http://localhost:8080/api/getallNetworkRoute/${networkRouteCd}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
                setFormData({
                    newRouteCode: data.newRouteCode || '',
                    routeName: data.routeName || '',
                    fromPoint: data.fromPoint || '',
                    toPoint: data.toPoint || '',
                    stageLength: data.stageLength || '',
                    fromState: data.fromState || '',
                    toState: data.toState || '',
                });
            })
            .catch(error => {
                console.error('Error fetching network route code:', error);
                setError(`Error fetching network route code: ${error.message}`);
            });
    }, [networkRouteCd]); // Make sure the id is included as a dependency
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/api/updateNetworkRoute/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => { throw new Error(error.message) });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // Optionally redirect or show a success message
            })
            .catch(error => setError(`Error updating data: ${error.message}`));
    };

    const handleReset = () => {
        fetch(`http://localhost:8080/api/getallNetworkRoute/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log('Reset data:', data);
                setFormData({
                    newRouteCode: data.newRouteCode || '',
                    routeName: data.routeName || '',
                    fromPoint: data.fromPoint || '',
                    toPoint: data.toPoint || '',
                    stageLength: data.stageLength || '',
                    fromState: data.fromState || '',
                    toState: data.toState || '',
                });
            })
            .catch(error => setError(`Error resetting data: ${error.message}`));
    };

    const handleSearch = () => {
        navigate('/rcs-routes/RcsRoutesSearchParam');
    };

    return (
        <HeaderFooter>
            <div style={{ marginTop: '70px', marginLeft: '335px' }}><h4>RCS Route [Edit]</h4></div>
            <div className="container">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>RCS Route Name :</label>
                        <input
                            type="text"
                            name="routeName"
                            value={formData.routeName}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>From Point:</label>
                        <input
                            type="text"
                            name="fromPoint"
                            value={formData.fromPoint}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>From State:</label>
                        <input
                            type="text"
                            name="fromState"
                            value={formData.fromState}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>To Point:</label>
                        <input
                            type="text"
                            name="toPoint"
                            value={formData.toPoint}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>To State:</label>
                        <input
                            type="text"
                            name="toState"
                            value={formData.toState}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Stage Length:</label>
                        <input
                            type="text"
                            name="stageLength"
                            value={formData.stageLength}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleReset}>Reset</button>
                        <button type="button" onClick={handleSearch}>Search</button>
                    </div>
                </form>
            </div>
        </HeaderFooter>
    );
};

export default RcsRouteEdit;
