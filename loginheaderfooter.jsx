import React from 'react';

import logoutImage from './avatar1_small.jpg'; // Import your image
import rightImage from './aai-logo.png'; // Import your image

const HeaderFooter = ({ children }) => {
  const handleIconClick = () => {
    // Handle icon click (e.g., logout)
    console.log('Icon clicked');
  };

  return (
    <div className="rcs-home">
      <header className="header">
        <img 
          src={rightImage} 
          alt="Right Logo" 
          className="right-image" 
        /> {/* Right-side image */}
      
        <div className="header-content">
          <h1>PORTAL FOR DISBURSAL OF VGF UNDER RCS UDAN ( FOR RCS )</h1>
        </div>
        <img 
          src={logoutImage} 
          alt="Logout" 
          className="logout-icon" 
          onClick={handleIconClick} 
        /> {/* Logout image */}
      </header>
      
      <main className="content">
        {children} {/* Render children content here */}
      </main>
      
      <footer className="footer">
        <div className="contact-info">
          <h7 className="contact-item">
            <i className='fa fa-phone faa-tada animated'></i> &nbsp;
            <b>Support Helplines:</b> 
            &nbsp; +91 90007 19888, +91 98668 19888, and +91 90324 06161 &nbsp; <b>Email ID:</b>   &nbsp; aimssupport@navayuga.com
          </h7>
          
        </div>
      </footer>
    </div>
  );
};

export default HeaderFooter;
