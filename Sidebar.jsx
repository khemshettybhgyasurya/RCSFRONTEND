import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; // Import Framer Motion components
import './Sidebar.css';

const Sidebar = () => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State for sidebar visibility
  const [isOpen, setIsOpen] = useState(true); // State for animation control

  // Define the animation variants
  const showAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const toggleSubmenu = (item) => {
    setOpenSubmenu(openSubmenu === item ? null : item);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsOpen(prev => !prev); // Toggle the animation state
  };

  return (
    <>
     
 
      <div className={`sidebar ${isSidebarVisible ? '' : 'hidden'}`}>
        <AnimatePresence>
          {isOpen && (
            <motion.h3
              variants={showAnimation}
              initial="hidden"
              animate="show"
              exit="exit"
              className="logo"
            >
         <span> <h6>  <b>RCS-VGF Module </b> <img 
        src='/sidebar-toggler.jpg' // Adjust path as necessary
        alt="Toggle Sidebar"
        onClick={toggleSidebar}
        className="toggle-sidebar-btn"
      /></h6> </span>
            </motion.h3>
          )}
        </AnimatePresence>
     
        <ul className='side-nav'>
          {/* Masters as a heading without any submenu */}
          <li className='li-ch'>
    <div className="masters-heading">
      <h4>Masters</h4>
      <img src="/path/to/your/icon.png" alt="" className="masters-icon" />
    </div>
  </li>

          <li className='li-ch'>
            <Link to="/rcs-route" onClick={() => toggleSubmenu('RCS Route')}>RCS Network Route</Link>
            {openSubmenu === 'RCS Route' && (
              <ul className="submenu">
                <li><Link to="/rcs-network-route/new">New</Link></li>
                <li><Link to="/rcs-network-route/search">Search</Link></li>
                <li><Link to="/rcs-network-route/RcsNetworkReportParam">Report</Link></li>
              </ul>
            )}
          </li>
          <li className='li-ch'>
            <Link to="/rcs-route" onClick={() => toggleSubmenu('RCS Route')}>RCS  Routes</Link>
            {openSubmenu === 'RCS Route' && (
              <ul className="submenu">
                <li><Link to="/rcs-routes/new">New</Link></li>
                <li><Link to="/rcs-routes/RcsRoutesSearchParam">Search</Link></li>
                <li><Link to="/rcs-routes/RcsRouteReportParam">Report</Link></li>
              </ul>
            )}
          </li>
      
         
          <li className='li-ch'>
            <Link to="/award-letter-master" onClick={() => toggleSubmenu('Award Letter Master')}>Award Letter Master</Link>
            {openSubmenu === 'Award Letter Master' && (
              <ul className="submenu">
                <li><Link to="/award-letter-master/new">New</Link></li>
                <li><Link to="/award-letter-master/search">Search</Link></li>
                <li><Link to="/award-letter-master/AwardReportparam">Report</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
