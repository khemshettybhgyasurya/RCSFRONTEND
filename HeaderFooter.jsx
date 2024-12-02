// HeaderFooter.js
import React from 'react';
import './RcsHome.css'; // Import the CSS file
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
        <p>Airport: null/ ATMRCS1</p>
      </footer>
    </div>
  );
};

export default HeaderFooter;
