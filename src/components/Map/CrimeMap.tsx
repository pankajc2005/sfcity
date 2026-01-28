import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { FIR } from '../../types';
import './CrimeMap.css';

interface CrimeMapProps {
  firs: FIR[];
  selectedFIR?: FIR;
  onFIRSelect?: (fir: FIR) => void;
}

/**
 * CrimeMap Component - Task 3.0
 *
 * Interactive crime mapping using Leaflet.js
 * Features:
 * - Display FIR locations as markers
 * - Interactive popups showing crime details
 * - Zoom and pan controls
 * - Layer toggle for FIRs heatmap and markers
 *
 * Time Complexity: O(n) for rendering markers (n = number of FIRs)
 * Space Complexity: O(n) for marker storage
 */
export const CrimeMap: React.FC<CrimeMapProps> = ({
  firs,
  selectedFIR,
  onFIRSelect,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const heatmapLayerRef = useRef<any>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'markers'>('heatmap');
  const containerId = 'crime-map-container';

  // Initialize map on component mount
  useEffect(() => {
    if (!mapRef.current) {
      // Create map instance (Malad, Mumbai)
      const map = L.map(containerId).setView([19.1776, 72.8298], 13);

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; OpenStreetMap contributors | SafeCity MVP',
        maxZoom: 19,
        minZoom: 5,
      }).addTo(map);

      mapRef.current = map;

      // Add controls
      L.control.zoom({ position: 'topleft' }).addTo(map);
      L.control.scale().addTo(map);
    }
  }, []);

  // Update markers when FIRs change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => mapRef.current!.removeLayer(marker));
    markersRef.current = [];

    // Update heatmap with FIR coordinates
    if (heatmapLayerRef.current) {
      mapRef.current.removeLayer(heatmapLayerRef.current);
    }

    const heatmapData = firs.map((fir) => [
      fir.latitude,
      fir.longitude,
      0.8, // Intensity (0-1)
    ]);

    if (heatmapData.length > 0) {
      heatmapLayerRef.current = (L as any).heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 1,
      });
      if (viewMode === 'heatmap') {
        heatmapLayerRef.current.addTo(mapRef.current);
      }
    }

    // Add markers for each FIR
    if (viewMode === 'markers') {
      firs.forEach((fir) => {
        // Determine marker color based on crime type
        const markerColor = fir.crimeType === 'Robbery' ? 'red' : fir.crimeType === 'Assault' ? 'orange' : 'blue';

        const marker = L.circleMarker(
          [fir.latitude, fir.longitude],
          {
            radius: 8,
            fillColor: markerColor,
            color: '#000',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.7,
          }
        )
          .bindPopup(
            `<div class="crime-popup">
              <strong>${fir.crimeType}</strong><br/>
              <small>${fir.date.toLocaleDateString()} ${fir.time}</small><br/>
              Area: ${fir.area}<br/>
              Zone: ${fir.zone}<br/>
              Station: ${fir.policeStation}
            </div>`
          )
          .on('click', () => {
            if (onFIRSelect) {
              onFIRSelect(fir);
            }
          });

        marker.addTo(mapRef.current!);
        markersRef.current.push(marker);
      });
    }
  }, [firs, onFIRSelect, viewMode]);

  // Handle selected FIR highlight
  useEffect(() => {
    if (!selectedFIR || !mapRef.current) return;

    // Pan to selected FIR
    mapRef.current.setView([selectedFIR.latitude, selectedFIR.longitude], 14);

    // Highlight marker
    markersRef.current.forEach((marker) => {
      const markerLatLng = marker.getLatLng();
      if (
        markerLatLng.lat === selectedFIR.latitude &&
        markerLatLng.lng === selectedFIR.longitude
      ) {
        marker.openPopup();
        marker.setStyle({ weight: 4, fillOpacity: 1 } as L.PathOptions);
      } else {
        marker.setStyle({ weight: 2, fillOpacity: 0.7 } as L.PathOptions);
      }
    });
  }, [selectedFIR]);

  return (
    <div className="crime-map-wrapper">
      <div className="map-header">
        <h2>🗺️ Crime Incident Map</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'heatmap' ? 'active' : ''}`}
            onClick={() => setViewMode('heatmap')}
          >
            🔥 Heatmap
          </button>
          <button
            className={`toggle-btn ${viewMode === 'markers' ? 'active' : ''}`}
            onClick={() => setViewMode('markers')}
          >
            📍 Markers
          </button>
        </div>
        {viewMode === 'heatmap' ? (
          <div className="map-legend heatmap-legend">
            <div className="legend-label">Crime Density:</div>
            <div className="heatmap-gradient">
              <div className="gradient-bar"></div>
              <div className="gradient-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="map-legend">
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: 'red' }}
              ></span>
              <span>Robbery</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: 'orange' }}
              ></span>
              <span>Assault</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: 'blue' }}
              ></span>
              <span>Other Crimes</span>
            </div>
          </div>
        )}
      </div>

      <div id={containerId} className="map-container"></div>

      <div className="map-footer">
        <p>
          📍 <strong>{firs.length}</strong> FIR Locations | 📊 View Mode: <strong>{viewMode === 'heatmap' ? 'Heatmap' : 'Markers'}</strong>
        </p>
        <p className="map-info">
          {viewMode === 'heatmap' 
            ? 'Heatmap shows crime density - warmer colors indicate higher crime concentration.' 
            : 'Click on markers to view details. Use zoom controls to explore the map.'}
        </p>
      </div>
    </div>
  );
};

export default CrimeMap;
