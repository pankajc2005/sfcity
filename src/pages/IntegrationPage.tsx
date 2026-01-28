import React from 'react';
import { IntegrationDashboard } from '../components/Integration/IntegrationDashboard';
import './IntegrationPage.css';

export const IntegrationPage: React.FC = () => {
  return (
    <div className="integration-page">
      <header className="page-header">
        <h1>Integration Dashboard</h1>
        <p className="page-subtitle">System integration and connectivity status</p>
      </header>

      <section className="integration-section">
        <IntegrationDashboard />
      </section>
    </div>
  );
};
