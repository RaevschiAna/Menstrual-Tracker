// Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css'; // Make sure to import the CSS file

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="layout">
      {/* Sidebar Section */}
      <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isOpen ? '✕' : '☰'}
        </button>
        
        <ul className="menu-list">
          <li className="menu-item">
            <span className="menu-icon" role="img" aria-label="home">🏠</span>
            <span className="menu-text">Home</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon" role="img" aria-label="dashboard">📊</span>
            <span className="menu-text">Dashboard</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon" role="img" aria-label="settings">⚙️</span>
            <span className="menu-text">Settings</span>
          </li>
        </ul>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        <h1>Welcome to your App</h1>
        <p>Try clicking the hamburger menu or the "X" to toggle the sidebar.</p>
      </div>
    </div>
  );
};

export default Sidebar;