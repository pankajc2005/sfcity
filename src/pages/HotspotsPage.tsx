import React from 'react';
import { Hotspot } from '../types';
import { hotspotService } from '../services/hotspotService';
import './HotspotsPage.css';

interface HotspotsPageProps {
  hotspots: Hotspot[];
}

export const HotspotsPage: React.FC<HotspotsPageProps> = ({ hotspots }) => {
  const hotspotStats = hotspotService.getStatistics(hotspots);

  return (
    <div className="hotspots-page">
      <header className="page-header">
        <h1>Crime Hotspots</h1>
        <p className="page-subtitle">High-risk zones requiring attention</p>
      </header>

      <div className="hotspot-stats">
        <div className="stat-card">
          <h3>Total Hotspots</h3>
          <p className="stat-value">{hotspotStats.totalHotspots}</p>
        </div>
        <div className="stat-card high-risk">
          <h3>High-Risk Zones</h3>
          <p className="stat-value">{hotspotStats.highRisk}</p>
        </div>
        <div className="stat-card medium-risk">
          <h3>Medium-Risk Zones</h3>
          <p className="stat-value">{hotspotStats.mediumRisk}</p>
        </div>
        <div className="stat-card low-risk">
          <h3>Low-Risk Zones</h3>
          <p className="stat-value">{hotspotStats.lowRisk}</p>
        </div>
      </div>

      <section className="hotspots-list-section">
        {hotspots.length === 0 ? (
          <div className="empty-state">
            <p>No hotspots detected. Upload FIR data to analyze.</p>
          </div>
        ) : (
          <div className="hotspots-grid">
            {hotspots.map((hotspot) => (
              <div
                key={hotspot.zoneId}
                className={`hotspot-card severity-${hotspot.severity}`}
              >
                <div className="hotspot-header">
                  <h3>{hotspot.zoneName}</h3>
                  <span className={`badge severity-${hotspot.severity}`}>
                    {hotspot.severity.toUpperCase()}
                  </span>
                </div>
                <div className="hotspot-body">
                  <div className="hotspot-stat">
                    <span className="label">FIR Count:</span>
                    <span className="value">{hotspot.firCount}</span>
                  </div>
                  <div className="hotspot-stat">
                    <span className="label">Percentage:</span>
                    <span className="value">{hotspot.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="hotspot-stat">
                    <span className="label">Location:</span>
                    <span className="value">
                      {hotspot.centerLat.toFixed(4)}, {hotspot.centerLng.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
