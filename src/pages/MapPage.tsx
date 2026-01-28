import React from 'react';
import { CrimeMap } from '../components/Map/CrimeMap';
import { FIR } from '../types';
import './MapPage.css';

interface MapPageProps {
  filteredFIRs: FIR[];
  selectedFIR?: FIR;
  onFIRSelect: (fir?: FIR) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  filteredFIRs,
  selectedFIR,
  onFIRSelect,
}) => {
  return (
    <div className="map-page">
      <header className="page-header">
        <h1>Crime Map</h1>
        <p className="page-subtitle">Visualize crime locations and hotspots</p>
      </header>

      {filteredFIRs.length === 0 ? (
        <div className="empty-state">
          <p>No FIR data to display. Please upload a CSV file from the Dashboard.</p>
        </div>
      ) : (
        <div className="map-container">
          <CrimeMap
            firs={filteredFIRs}
            selectedFIR={selectedFIR}
            onFIRSelect={onFIRSelect}
          />
        </div>
      )}
    </div>
  );
};
