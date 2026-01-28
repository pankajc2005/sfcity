import React, { useState, useEffect } from 'react';
import { FIR } from '../types';
import './PolicePatrolPage.css';

interface PolicePatrolPageProps {
  filteredFIRs: FIR[];
}

interface PatrolRoute {
  id: string;
  name: string;
  zones: string[];
  duration: string;
  startTime: string;
  endTime: string;
  crimeDensity: 'High' | 'Medium' | 'Low';
  crimeTypes: string[];
  checkpoints: Checkpoint[];
  priority: number;
}

interface Checkpoint {
  location: string;
  estimatedTime: string;
  crimeCount: number;
  notes: string;
}

export const PolicePatrolPage: React.FC<PolicePatrolPageProps> = ({ filteredFIRs }) => {
  const [patrolRoutes, setPatrolRoutes] = useState<PatrolRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<PatrolRoute | null>(null);
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  // Generate patrol routes based on crime data
  useEffect(() => {
    const routes = generatePatrolRoutes(filteredFIRs, timeSlot);
    setPatrolRoutes(routes);
    if (routes.length > 0 && !selectedRoute) {
      setSelectedRoute(routes[0]);
    }
  }, [filteredFIRs, timeSlot]);

  const generatePatrolRoutes = (firs: FIR[], slot: string): PatrolRoute[] => {
    // Group FIRs by area/zone
    const zoneMap = new Map<string, FIR[]>();
    
    firs.forEach(fir => {
      const zone = fir.policeStation || 'Unknown Zone';
      if (!zoneMap.has(zone)) {
        zoneMap.set(zone, []);
      }
      zoneMap.get(zone)?.push(fir);
    });

    // Create patrol routes based on crime density
    const routes: PatrolRoute[] = [];
    let routeId = 1;

    zoneMap.forEach((zoneFIRs, zoneName) => {
      if (zoneFIRs.length === 0) return;

      // Analyze crime types in this zone
      const crimeTypeMap = new Map<string, number>();
      zoneFIRs.forEach(fir => {
        const type = fir.crimeType || 'Other';
        crimeTypeMap.set(type, (crimeTypeMap.get(type) || 0) + 1);
      });

      const topCrimeTypes = Array.from(crimeTypeMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type]) => type);

      // Determine crime density
      let density: 'High' | 'Medium' | 'Low';
      if (zoneFIRs.length > 50) density = 'High';
      else if (zoneFIRs.length > 20) density = 'Medium';
      else density = 'Low';

      // Create checkpoints within the zone
      const checkpoints: Checkpoint[] = [];
      const hotspots = identifyHotspots(zoneFIRs);
      
      hotspots.forEach((spot, idx) => {
        checkpoints.push({
          location: spot.location,
          estimatedTime: calculateCheckpointTime(slot, idx),
          crimeCount: spot.count,
          notes: `${spot.count} incidents reported. Focus on ${spot.primaryCrime}.`
        });
      });

      // Calculate patrol timing based on time slot
      const { startTime, endTime, duration } = getPatrolTiming(slot, density);

      routes.push({
        id: `ROUTE-${routeId}`,
        name: `Route ${routeId}: ${zoneName}`,
        zones: [zoneName],
        duration,
        startTime,
        endTime,
        crimeDensity: density,
        crimeTypes: topCrimeTypes,
        checkpoints,
        priority: zoneFIRs.length
      });

      routeId++;
    });

    // Sort by priority (crime density)
    return routes.sort((a, b) => b.priority - a.priority).slice(0, 8);
  };

  const identifyHotspots = (firs: FIR[]) => {
    const locationMap = new Map<string, { count: number; crimes: string[] }>();
    
    firs.forEach(fir => {
      const location = fir.area || fir.zone || fir.policeStation || 'Unknown';
      if (!locationMap.has(location)) {
        locationMap.set(location, { count: 0, crimes: [] });
      }
      const spot = locationMap.get(location)!;
      spot.count++;
      if (fir.crimeType) spot.crimes.push(fir.crimeType);
    });

    return Array.from(locationMap.entries())
      .map(([location, data]) => ({
        location,
        count: data.count,
        primaryCrime: data.crimes[0] || 'Various'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const calculateCheckpointTime = (slot: string, index: number): string => {
    const baseHours: Record<string, number> = {
      morning: 6,
      afternoon: 14,
      evening: 18,
      night: 22
    };
    
    const hour = (baseHours[slot] + Math.floor(index * 0.5)) % 24;
    const minute = (index * 30) % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getPatrolTiming = (slot: string, density: 'High' | 'Medium' | 'Low') => {
    const timings: Record<string, { start: string; base: number }> = {
      morning: { start: '06:00', base: 6 },
      afternoon: { start: '14:00', base: 14 },
      evening: { start: '18:00', base: 18 },
      night: { start: '22:00', base: 22 }
    };

    const durationHours = density === 'High' ? 4 : density === 'Medium' ? 3 : 2;
    const timing = timings[slot];
    const endHour = (timing.base + durationHours) % 24;

    return {
      startTime: timing.start,
      endTime: `${endHour.toString().padStart(2, '0')}:00`,
      duration: `${durationHours} hours`
    };
  };

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'High': return '#d32f2f';
      case 'Medium': return '#f57c00';
      case 'Low': return '#388e3c';
      default: return '#666';
    }
  };

  return (
    <div className="police-patrol-page">
      <header className="page-header">
        <h1>Police Patrol Routes</h1>
        <p className="page-subtitle">Optimized patrol routes through crime zones with timing</p>
      </header>

      <div className="time-slot-selector">
        <h3>Select Patrol Time Slot:</h3>
        <div className="time-buttons">
          <button
            className={timeSlot === 'morning' ? 'active' : ''}
            onClick={() => setTimeSlot('morning')}
          >
            🌅 Morning (06:00 - 12:00)
          </button>
          <button
            className={timeSlot === 'afternoon' ? 'active' : ''}
            onClick={() => setTimeSlot('afternoon')}
          >
            ☀️ Afternoon (14:00 - 18:00)
          </button>
          <button
            className={timeSlot === 'evening' ? 'active' : ''}
            onClick={() => setTimeSlot('evening')}
          >
            🌆 Evening (18:00 - 22:00)
          </button>
          <button
            className={timeSlot === 'night' ? 'active' : ''}
            onClick={() => setTimeSlot('night')}
          >
            🌙 Night (22:00 - 06:00)
          </button>
        </div>
      </div>

      <div className="patrol-summary">
        <div className="summary-card">
          <h4>Total Routes</h4>
          <p className="summary-value">{patrolRoutes.length}</p>
        </div>
        <div className="summary-card">
          <h4>High Priority</h4>
          <p className="summary-value">
            {patrolRoutes.filter(r => r.crimeDensity === 'High').length}
          </p>
        </div>
        <div className="summary-card">
          <h4>Total Crime Zones</h4>
          <p className="summary-value">{filteredFIRs.length}</p>
        </div>
      </div>

      <div className="patrol-content">
        <div className="routes-list">
          <h2>Patrol Routes</h2>
          {patrolRoutes.length === 0 ? (
            <div className="no-routes">
              <p>No patrol routes available. Load crime data to generate routes.</p>
            </div>
          ) : (
            patrolRoutes.map(route => (
              <div
                key={route.id}
                className={`route-card ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="route-header">
                  <h3>{route.name}</h3>
                  <span
                    className="density-badge"
                    style={{ backgroundColor: getDensityColor(route.crimeDensity) }}
                  >
                    {route.crimeDensity}
                  </span>
                </div>
                <div className="route-info">
                  <p><strong>Time:</strong> {route.startTime} - {route.endTime}</p>
                  <p><strong>Duration:</strong> {route.duration}</p>
                  <p><strong>Checkpoints:</strong> {route.checkpoints.length}</p>
                </div>
                <div className="route-crimes">
                  <strong>Common Crimes:</strong>
                  <div className="crime-tags">
                    {route.crimeTypes.map((crime, idx) => (
                      <span key={idx} className="crime-tag">{crime}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="route-details">
          {selectedRoute ? (
            <>
              <h2>Route Details: {selectedRoute.name}</h2>
              
              <div className="route-overview">
                <div className="overview-item">
                  <label>Route ID:</label>
                  <span>{selectedRoute.id}</span>
                </div>
                <div className="overview-item">
                  <label>Patrol Time:</label>
                  <span>{selectedRoute.startTime} - {selectedRoute.endTime}</span>
                </div>
                <div className="overview-item">
                  <label>Duration:</label>
                  <span>{selectedRoute.duration}</span>
                </div>
                <div className="overview-item">
                  <label>Crime Density:</label>
                  <span
                    className="density-value"
                    style={{ color: getDensityColor(selectedRoute.crimeDensity) }}
                  >
                    {selectedRoute.crimeDensity}
                  </span>
                </div>
              </div>

              <div className="checkpoints-section">
                <h3>Patrol Checkpoints</h3>
                <div className="checkpoints-list">
                  {selectedRoute.checkpoints.map((checkpoint, idx) => (
                    <div key={idx} className="checkpoint-card">
                      <div className="checkpoint-number">{idx + 1}</div>
                      <div className="checkpoint-content">
                        <h4>{checkpoint.location}</h4>
                        <p className="checkpoint-time">
                          <strong>ETA:</strong> {checkpoint.estimatedTime}
                        </p>
                        <p className="checkpoint-crimes">
                          <strong>Crime Count:</strong> {checkpoint.crimeCount} incidents
                        </p>
                        <p className="checkpoint-notes">{checkpoint.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="route-recommendations">
                <h3>Patrol Recommendations</h3>
                <ul>
                  <li>Maintain regular communication with control room</li>
                  <li>Focus extra attention on high-crime checkpoints</li>
                  <li>Document any suspicious activities</li>
                  <li>Ensure all checkpoints are visited within estimated time</li>
                  {selectedRoute.crimeDensity === 'High' && (
                    <li><strong>High Priority:</strong> Consider backup patrol units</li>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a patrol route to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
