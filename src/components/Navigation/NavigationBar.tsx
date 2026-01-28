import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

export const NavigationBar: React.FC = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-header">
        <h2>SafeCity</h2>
      </div>
      <ul className="nav-menu">
        <li>
          <NavLink to="/" end>
            <span className="nav-icon">▪</span>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/map">
            <span className="nav-icon">▪</span>
            Crime Map
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics">
            <span className="nav-icon">▪</span>
            Analytics
          </NavLink>
        </li>
        <li>
          <NavLink to="/data">
            <span className="nav-icon">▪</span>
            FIR Records
          </NavLink>
        </li>
        <li>
          <NavLink to="/integration">
            <span className="nav-icon">▪</span>
            Integration
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
