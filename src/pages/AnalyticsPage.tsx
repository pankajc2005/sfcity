import React from 'react';
import { AnalyticsPanel } from '../components/Analytics/AnalyticsPanel';
import { FIR, Hotspot } from '../types';
import { insightService } from '../services/insightService';
import './AnalyticsPage.css';

interface AnalyticsPageProps {
  filteredFIRs: FIR[];
  hotspots: Hotspot[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  filteredFIRs,
  hotspots,
}) => {
  const insights = insightService.generateInsights(filteredFIRs);

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>Analytics</h1>
        <p className="page-subtitle">Crime statistics and data insights</p>
      </header>

      {filteredFIRs.length === 0 ? (
        <div className="empty-state">
          <p>No data to analyze. Please upload a CSV file from the Dashboard.</p>
        </div>
      ) : (
        <>
          <section className="statistics-section">
            <h2>Crime Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total FIRs Analyzed</h3>
                <p className="stat-value">{filteredFIRs.length}</p>
              </div>

              <div className="stat-card">
                <h3>Peak Crime Hour</h3>
                <p className="stat-value">
                  {insights.peakHours[0]?.hour || 'N/A'}:00
                </p>
                <p className="stat-detail">
                  {insights.peakHours[0]?.count || 0} incidents
                </p>
              </div>

              <div className="stat-card">
                <h3>Most Common Crime</h3>
                <p className="stat-value-text">
                  {insights.topCrimeTypes[0]?.type || 'N/A'}
                </p>
                <p className="stat-detail">
                  {insights.topCrimeTypes[0]?.count || 0} incidents
                </p>
              </div>
            </div>
          </section>

          <section className="insights-section">
            <h2>Top Crime Types</h2>
            <div className="insights-list">
              {insights.topCrimeTypes.map((crime, index) => (
                <div key={crime.type} className="insight-item">
                  <span className="rank">{index + 1}</span>
                  <span className="label">{crime.type}</span>
                  <span className="value">{crime.count} incidents</span>
                </div>
              ))}
            </div>
          </section>

          <section className="insights-section">
            <h2>Peak Crime Hours</h2>
            <div className="insights-list">
              {insights.peakHours.slice(0, 10).map((hour, index) => (
                <div key={hour.hour} className="insight-item">
                  <span className="rank">{index + 1}</span>
                  <span className="label">{hour.hour}:00</span>
                  <span className="value">{hour.count} incidents</span>
                </div>
              ))}
            </div>
          </section>

          <section className="analytics-panel-section">
            <AnalyticsPanel insights={insights} hotspots={hotspots} />
          </section>
        </>
      )}
    </div>
  );
};
