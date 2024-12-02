// RcsHome.js
import React from 'react';
import Sidebar from './Sidebar';
import HeaderFooter from './HeaderFooter'; // Import the HeaderFooter component

const RcsHome = () => {
  return (
    <HeaderFooter>
      <Sidebar />
      <div>
        <p>This is the home page after a successful login.</p>
      </div>
    </HeaderFooter>
  );
};

export default RcsHome;
