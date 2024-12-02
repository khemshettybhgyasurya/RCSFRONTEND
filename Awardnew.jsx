import React, { useState, useEffect } from 'react';
import './RcsHome.css';
import HeaderFooter from './HeaderFooter';
import HelpModal from './HelpModal';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AwardLetterMaster = () => {
  const [formData, setFormData] = useState({
    saoCd: '',
    saoName: '',
    awdltrDetails: '',
    loaDate: '',
    biddRound: '',
    saoAgreementNo: '',
    saoAgreementDate: '',
    saoAgreementFromdate: '',
    saoAgreementTodate: '',
    pbgNo: '',
    pbgAmount: '',
    pbgIssueBank: '',
    pbgIssueDt: '',
    pbgBranchCode: '',
    pbgOfficialDesig: '',
    pbgEmail: '',
    rcsNetworkRoute: '',
    apbgAptname: '', // State for APBG Airport Name
    apbgNo: '',
    apbgIssueDt: '',
    apbgAmount: '',
    pbgCliamdate: '',
    dateVarify: '',
    extDate1: '',
    extDate2: '',
    extDate3: '',
    extDate4: '',
    extDate5: '',
    apbgBank: '',
    apbgOfficialName: '',
    apbgOfficialDesig: '',
    apbgAddress: '',
    apbgEmail: '',
    apbgContactno: '',
    apbgFaxno: '',
    apbgValidity: '',
    apbgSaoaDate: ''
  });

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]); // State to store fetched data
  const [airports, setAirports] = useState([]); // State to store airports data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch users data when component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rcs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data); // Update state with fetched data
      } catch (error) {
        setError(error.message); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };


    const handleFileChange = (event) => {
      const file = event.target.files[0]; // Get the selected file
      console.log(file); // Display the selected file in the console or save it in your state
      setFormData({ ...formData, fileUploadPath: file }); // If you want to save it to your formData state
    };
    fetchUsers();
  }, []); // Empty dependency array means this useEffect runs once on mount

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/getAllAirports');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(data); // Add this line to verify data structure
        setAirports(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
 
  const validateForm = () => {
    if (!formData.saoName) {
      return 'Please enter the saoName (Mandatory)';
    }
    if (!formData.awdltrDetails) {
      return 'Please enter the awdltrDetails (Mandatory)';
    }
    if (!formData.loaDate) {
      return 'Please enter loaDate (Mandatory)';
    }
    return ''; // return null if no errors
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    console.log('Selected file:', file); // Display the selected file in the console
    setFormData((prevData) => ({
      ...prevData,
      apbgDocument: file, // Save the file in formData
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      window.alert(error);
      return;
    }
  
  
      setError('');
      fetch('http://localhost:8080/api/getawardletters', {
        method: 'POST',
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
        .catch(error => {
          setError(error.message);
          window.alert(error.message);
        });
    };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOperatorSelect = (operator) => {
    setFormData(prevData => ({
      ...prevData,
      saoName: operator.operatorName,
      saoCd: operator.operatorCd
    }));
    setIsModalOpen(false);
  };

  return (
    <HeaderFooter>
      <div style={{ marginTop: '70px', marginLeft: '335px' }}>
        <h4>Award Letter Master [New]</h4>
      </div>

      <div className="container">
        {loading && <p>Loading...</p>} {/* Display loading message */}
        {error && <p>Error: {error}</p>} {/* Display error message */}

        <form onSubmit={handleSubmit}>
          {/* General Information */}
          <section className="form-section">
            <h6 style={{ color: 'blue', textDecoration: 'underline' }}>General Information</h6>
            <div className="form-group">
              <label>
                Name of Selected Airline Operator (SAO):
                <div className="input-container">
                  <input
                    type="text"
                    name="saoName"
                    value={formData.saoName}
                    onChange={handleChange}
                  />
                   <input
                    type="hidden"
                    name="saoCd"
                    value={formData.saoCd}
                    onChange={handleChange}
                  />
                  <i className="fas fa-info-circle info-icon" onClick={toggleModal}></i>
                </div>
              </label>
            </div>
            {/* Help Modal */}
            <HelpModal isOpen={isModalOpen} onClose={toggleModal} onOperatorSelect={handleOperatorSelect} />
          </section>

          {/* Award Letter Details */}
          <section className="form-section">
            <h6 style={{ color: 'black', textDecoration: 'underline' }}>Award Letter Details</h6>
            <div className="form-row" style={{ display: 'flex', gap: '50px' }}>
              <label>
                Letter of Award (LoA) No:
                <input type="text" name="awdltrDetails" value={formData.awdltrDetails} onChange={handleChange} />
              </label>
              <label className="col-md-6">
                Date:
                <input type="date" name="loaDate" value={formData.loaDate} onChange={handleChange} />
              </label>
            </div>

            <div className="form-row row">
              <div className="col-md-6">
                <label>
                  Bidding Round:
                  <select name="biddRound" value={formData.biddRound} onChange={handleChange}>
                    <option value="">Select One</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="3.1">3.1</option>
                    <option value="4">4</option>
                    <option value="4.1">4.1</option>
                    <option value="4.2">4.2</option>
                    <option value="4.3">4.3</option>
                 
                    <option value="5">5</option>
                    <option value="5.1">5.1</option>
                    <option value="5.2">5.2</option>
                    <option value="5.3">5.3</option>
                  </select>
                </label>
              </div>
              <div className="col-md-4">
                <label>
                  RCS-Route-Network awarded (as per LoA):
                  <select
                    className="col-md-10"
                    name="rcsNetworkRoute"
                    value={formData.rcsNetworkRoute}
                    onChange={handleChange}
                  >
                    <option value="">Select a route</option>
                    {users.map((route) => (
                      <option key={route.networkRouteName} value={route.networkRouteName}>
                        {route.networkRouteName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </section>

         {/* Agreement details */}
<h6 style={{ color: 'black', textDecoration: 'underline' }}>Agreement Details</h6>

<section>
  {/* First row for SAOA No and Date of Signing */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Selected Airline Operator Agreement (SAOA) No:
        <input
          type="text"
          name="saoAgreementNo"
          value={formData.saoAgreementNo}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Date of Signing of SAOA:
        <input
          type="date"
          name="saoAgreementDate"
          value={formData.saoAgreementDate}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Second row for From Date and To Date */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        SAO Agreement effected From date:
        <input
          type="date"
          name="saoAgreementFromdate"
          value={formData.saoAgreementFromdate}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        To date:
        <input
          type="date"
          name="saoAgreementTodate"
          value={formData.saoAgreementTodate}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>
</section>


                   {/* Bank Guarantee Details */}
<section className="form-section">
  <h6 style={{ color: 'blue', textDecoration: 'underline' }}>Bank Guarantee Details</h6>
  <h6 style={{ color: 'black', textDecoration: 'underline' }}>Performance Bank Guarantee (PBG)</h6>
  
  {/* First row for PBG No and Amount */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Performance Bank Guarantee (PBG) No:
        <input
          type="text"
          name="pbgNo"
          value={formData.pbgNo}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Amount of Performance Bank Guarantee (PBG) in INR:
        <input
          type="number"
          name="pbgAmount"
          value={formData.pbgAmount}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Second row for Date of Issue */}
  <div className="form-row" style={{ marginBottom: '15px' }}>
    <label>
      Date of Issue:
      <input
        type="date"
        name="pbgIssueDt"
        value={formData.pbgIssueDt}
        onChange={handleChange}
        style={{ width: '100%' }}
      />
    </label>
  </div>
</section>


          {/* Issuing Bank Details */}
<section className="form-section">
  <h6 style={{ color: 'black', textDecoration: 'underline' }}>Issuing Bank Details</h6>

  {/* First row for Name of Bank issuing PBG and Branch Code */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Name of Bank issuing PBG:
        <input
          type="text"
          name="pbgIssueBank"
          value={formData.pbgIssueBank}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Branch Code:
        <input
          type="text"
          name="pbgBranchCode"
          value={formData.pbgBranchCode}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Second row for Name of the Official and Designation */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Name of the Official of the issuing of PBG:
        <input
          type="text"
          name="pbgOfficialName"
          value={formData.pbgOfficialName}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Designation:
        <input
          type="text"
          name="pbgOfficialDesig"
          value={formData.pbgOfficialDesig}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Third row for Address and Email ID */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Address:
        <input
          type="text"
          name="pbgAddress"
          value={formData.pbgAddress}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Email ID:
        <input
          type="text"
          name="pbgEmail"
          value={formData.pbgEmail}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Fourth row for Contact No and Fax No */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Contact No:
        <input
          type="text"
          name="pbgContactno"
          value={formData.pbgContactno}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Fax No:
        <input
          type="text"
          name="pbgFaxno"
          value={formData.pbgFaxno}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Fifth row for Last date of validity and Date of Validity as per SAOA */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Last date of validity of Performance Bank Guarantee:
        <input
          type="date"
          name="pbgValidity"
          value={formData.pbgValidity}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Date of Validity of Performance Bank Guarantee as per SAOA:
        <input
          type="date"
          name="pbgSaoaDate"
          value={formData.pbgSaoaDate}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>
</section>


          {/* Additional Performance Bank Guarantee Details */}
<section className="form-section">
  <h6 style={{ color: 'black', textDecoration: 'underline' }}>Additional Performance Bank Guarantee Details</h6>

  {/* First row for Airport name and Additional Performance Bank Guarantee No */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Airport name for Additional Performance Bank Guarantee (APBG):
        <select
          name="apbgAptname"
          value={formData.apbgAptname}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          <option value="">Select an airport</option>
          {airports.length > 0 ? (
            airports.map((airport) => (
              <option key={airport.airportName} value={airport.airportName}>
                {airport.airportName}
              </option>
            ))
          ) : (
            <option value="">No airports available</option>
          )}
        </select>
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Additional Performance Bank Guarantee (APBG) No:
        <input
          type="number"
          name="apbgNo"
          value={formData.apbgNo}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Second row for Date of Issue and Amount of Performance Bank Guarantee (PBG) in INR */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Date of Issue:
        <input
          type="date"
          name="apbgIssueDt"
          value={formData.apbgIssueDt}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Amount of Performance Bank Guarantee (PBG) in INR:
        <input
          type="number"
          name="apbgAmount"
          value={formData.apbgAmount}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Third row for Claim Period and Date of Verification */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Claim Period:
        <input
          type="date"
          name="pbgClaimdate"
          value={formData.pbgClaimdate}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Date of Verification:
        <input
          type="date"
          name="dateVerify"
          value={formData.dateVerify}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Fourth row for Extension Date 1 and Extension Date 2 */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Extension Date 1:
        <input
          type="date"
          name="extDate1"
          value={formData.extDate1}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Extension Date 2:
        <input
          type="date"
          name="extDate2"
          value={formData.extDate2}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Fifth row for Extension Date 3 and Extension Date 4 */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Extension Date 3:
        <input
          type="date"
          name="extDate3"
          value={formData.extDate3}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Extension Date 4:
        <input
          type="date"
          name="extDate4"
          value={formData.extDate4}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Sixth row for Extension Date 5 */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Extension Date 5:
        <input
          type="date"
          name="extDate5"
          value={formData.extDate5}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>
</section>

         {/* Issuing Bank Details for Additional Performance Bank Guarantee */}
<section className="form-section">
  <h6 style={{ color: 'black', textDecoration: 'underline' }}>Issuing Bank Details for Additional Performance Bank Guarantee</h6>

  {/* First row for Name of Bank issuing APBG and Branch Code */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Name of Bank issuing APBG:
        <input
          type="text"
          name="apbgBank"
          value={formData.apbgBank}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Branch Code:
        <input
          type="number"
          name="apbgBranchCode"
          value={formData.apbgBranchCode}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Second row for Name of the Official and Designation */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Name of the Official of the issuing of APBG:
        <input
          type="text"
          name="apbgOfficialName"
          value={formData.apbgOfficialName}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Designation:
        <input
          type="text"
          name="apbgOfficialDesig"
          value={formData.apbgOfficialDesig}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Third row for Address and Email ID */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Address:
        <input
          type="text"
          name="apbgAddress"
          value={formData.apbgAddress}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Email ID:
        <input
          type="text"
          name="apbgEmail"
          value={formData.apbgEmail}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Fourth row for Contact No and Fax No */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Contact No:
        <input
          type="text"
          name="apbgContactno"
          value={formData.apbgContactno}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Fax No:
        <input
          type="text"
          name="apbgFaxno"
          value={formData.apbgFaxno}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

  {/* Fifth row for Last date of validity and Date of Validity as per SAOA */}
  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Last date of validity of Additional Performance Bank Guarantee:
        <input
          type="date"
          name="apbgValidity"
          value={formData.apbgValidity}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
    <div style={{ flex: 1 }}>
      <label>
        Date of Validity of Additional Performance Bank Guarantee as per SAOA:
        <input
          type="date"
          name="apbgSaoaDate"
          value={formData.apbgSaoaDate}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>

   {/* Additional row for file upload */}
   <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label>
        Upload Additional Document:
        <input
          type="file"
          name="fileUploadPath"
          onChange={handleFileChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  </div>
</section>




          {/* Additional sections as needed */}

          <button type="submit">Submit</button>
        </form>
      </div>
    </HeaderFooter>
  );
};

export default AwardLetterMaster;
