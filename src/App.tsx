import React, { useState, useEffect } from 'react';
import { FIR, FilterCriteria, Hotspot } from './types';
import { firService } from './services/firService';
import { filterService } from './services/filterService';
import { hotspotService } from './services/hotspotService';
import { insightService } from './services/insightService';
import { parseCSV } from './utils/csvParser';
import { validateFIRBatch } from './utils/validation';

interface AppState {
  allFIRs: FIR[];
  filteredFIRs: FIR[];
  hotspots: Hotspot[];
  filters: FilterCriteria;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

/**
 * SafeCity MVP - Main Application Component
 *
 * Orchestrates all features:
 * - FIR data management
 * - Filtering and search
 * - Hotspot detection
 * - Insight generation
 *
 * Architecture: Presentational component with state management
 */
export const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    allFIRs: [],
    filteredFIRs: [],
    hotspots: [],
    filters: filterService.resetFilters(),
    searchQuery: '',
    loading: false,
    error: null,
  });

  // Initialize with preloaded data on mount
  useEffect(() => {
    loadPreloadedData();
  }, []);

  /**
   * Loads preloaded sample FIR dataset
   * In production, this would fetch from backend API
   */
  const loadPreloadedData = async () => {
    try {
      setState((s) => ({ ...s, loading: true }));

      // Sample FIR data for MVP
      const sampleFIRs: FIR[] = [
        {
          id: 'FIR001',
          crimeType: 'Theft',
          date: new Date('2026-01-20'),
          time: '14:30',
          latitude: 28.5355,
          longitude: 77.3910,
          area: 'Downtown',
          zone: 'Zone A',
          policeStation: 'Central PS',
          isAccident: false,
          isSensitiveZone: false,
        },
        {
          id: 'FIR002',
          crimeType: 'Assault',
          date: new Date('2026-01-21'),
          time: '09:45',
          latitude: 28.5360,
          longitude: 77.3920,
          area: 'Downtown',
          zone: 'Zone A',
          policeStation: 'Central PS',
          isAccident: false,
          isSensitiveZone: false,
        },
        {
          id: 'FIR003',
          crimeType: 'Robbery',
          date: new Date('2026-01-19'),
          time: '22:00',
          latitude: 28.6000,
          longitude: 77.4000,
          area: 'Uptown',
          zone: 'Zone B',
          policeStation: 'North PS',
          isAccident: false,
          isSensitiveZone: false,
        },
      ];

      // Validate and add to service
      sampleFIRs.forEach((fir) => firService.addFIR(fir));

      const allFIRs = firService.getAll();
      const hotspots = hotspotService.detectHotspots(allFIRs);

      setState((s) => ({
        ...s,
        allFIRs,
        filteredFIRs: allFIRs,
        hotspots,
        loading: false,
      }));
    } catch (error) {
      setState((s) => ({
        ...s,
        error:
          error instanceof Error ? error.message : 'Failed to load data',
        loading: false,
      }));
    }
  };

  /**
   * Handles CSV file upload and import
   */
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { records, errors } = parseCSV(content);

        if (errors.length > 0) {
          setState((s) => ({
            ...s,
            error: `CSV Import Errors: ${errors.slice(0, 3).join('; ')}`,
          }));
          return;
        }

        // Validate records
        const { validRecords, invalidRecords } = validateFIRBatch(records);

        if (invalidRecords.length > 0) {
          setState((s) => ({
            ...s,
            error: `${invalidRecords.length} records failed validation`,
          }));
        }

        // Add valid records to service
        const result = firService.addFIRBatch(validRecords);

        if (result.failed > 0) {
          setState((s) => ({
            ...s,
            error: `Failed to add ${result.failed} records`,
          }));
        }

        // Update state
        const allFIRs = firService.getAll();
        const hotspots = hotspotService.detectHotspots(allFIRs);

        setState((s) => ({
          ...s,
          allFIRs,
          filteredFIRs: allFIRs,
          hotspots,
          error: null,
        }));
      } catch (error) {
        setState((s) => ({
          ...s,
          error:
            error instanceof Error ? error.message : 'File upload failed',
        }));
      }
    };

    reader.readAsText(file);
  };

  // /**
  //  * Updates filter criteria and recomputes filtered results
  //  * (Will be used by FilterPanel component in next phase)
  //  */
  // const handleFilterChange = (newFilters: FilterCriteria) => {
  //   const validation = filterService.validateCriteria(newFilters);

  //   if (!validation.valid) {
  //     setState((s) => ({ ...s, error: validation.errors.join('; ') }));
  //     return;
  //   }

  //   const filtered = filterService.searchAndFilter(
  //     state.allFIRs,
  //     newFilters,
  //     state.searchQuery
  //   );

  //   const hotspots = hotspotService.detectHotspots(filtered);

  //   setState((s) => ({
  //     ...s,
  //     filters: newFilters,
  //     filteredFIRs: filtered,
  //     hotspots,
  //     error: null,
  //   }));
  // };

  /**
   * Updates search query and recomputes filtered results
   */
  const handleSearch = (query: string) => {
    const filtered = filterService.searchAndFilter(
      state.allFIRs,
      state.filters,
      query
    );

    const hotspots = hotspotService.detectHotspots(filtered);

    setState((s) => ({
      ...s,
      searchQuery: query,
      filteredFIRs: filtered,
      hotspots,
    }));
  };

  /**
   * Resets all filters
   */
  const handleResetFilters = () => {
    const resetFilters = filterService.resetFilters();
    const hotspots = hotspotService.detectHotspots(state.allFIRs);

    setState((s) => ({
      ...s,
      filters: resetFilters,
      filteredFIRs: state.allFIRs,
      hotspots,
      searchQuery: '',
    }));
  };

  /**
   * Exports filtered data as CSV
   */
  const handleExportCSV = () => {
    const csv = firService.exportAsCSV(state.filteredFIRs);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safecity-fir-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Generate insights from filtered data
  const insights = insightService.generateInsights(state.filteredFIRs);
  const hotspotStats = hotspotService.getStatistics(state.hotspots);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SafeCity MVP - Crime Mapping & Patrol Decision Support</h1>
        <p>
          Total FIRs: {state.allFIRs.length} | Filtered: {state.filteredFIRs.length} | Hotspots: {state.hotspots.length}
        </p>
      </header>

      {state.error && (
        <div className="error-banner">
          <strong>Error:</strong> {state.error}
        </div>
      )}

      <main className="app-main">
        {/* Control Panel */}
        <section className="control-panel">
          <h2>Data & Filters</h2>

          {/* File Upload */}
          <div className="file-upload">
            <label>Upload FIR Data (CSV):</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>

          {/* Search */}
          <div className="search-box">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search by ID, area, crime type..."
              value={state.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="filter-actions">
            <button onClick={handleResetFilters}>Reset Filters</button>
            <button onClick={handleExportCSV}>Export CSV</button>
          </div>
        </section>

        {/* Statistics Panel */}
        <section className="statistics-panel">
          <h2>Crime Statistics & Insights</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total FIRs Analyzed</h3>
              <p className="stat-value">{state.filteredFIRs.length}</p>
            </div>

            <div className="stat-card">
              <h3>Total Hotspots</h3>
              <p className="stat-value">{hotspotStats.totalHotspots}</p>
            </div>

            <div className="stat-card">
              <h3>High-Risk Zones</h3>
              <p className="stat-value" style={{ color: 'red' }}>
                {hotspotStats.highRisk}
              </p>
            </div>

            <div className="stat-card">
              <h3>Medium-Risk Zones</h3>
              <p className="stat-value" style={{ color: 'orange' }}>
                {hotspotStats.mediumRisk}
              </p>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="insights-section">
            <h3>Peak Crime Hours</h3>
            <ul>
              {insights.peakHours.slice(0, 5).map((hour) => (
                <li key={hour.hour}>
                  {hour.hour}:00 - {hour.count} incidents
                </li>
              ))}
            </ul>
          </div>

          {/* Top Crime Types */}
          <div className="insights-section">
            <h3>Top Crime Types</h3>
            <ul>
              {insights.topCrimeTypes.map((crime) => (
                <li key={crime.type}>
                  {crime.type}: {crime.count} incidents
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Hotspots Panel */}
        <section className="hotspots-panel">
          <h2>Crime Hotspots</h2>

          {state.hotspots.length === 0 ? (
            <p>No hotspots detected. Upload FIR data to analyze.</p>
          ) : (
            <div className="hotspots-list">
              {state.hotspots.map((hotspot) => (
                <div key={hotspot.zoneId} className={`hotspot-card severity-${hotspot.severity}`}>
                  <h4>{hotspot.zoneName}</h4>
                  <p>
                    <strong>FIR Count:</strong> {hotspot.firCount} ({hotspot.percentage.toFixed(1)}%)
                  </p>
                  <p>
                    <strong>Severity:</strong> <span className={`badge severity-${hotspot.severity}`}>{hotspot.severity.toUpperCase()}</span>
                  </p>
                  <p>
                    <strong>Location:</strong> {hotspot.centerLat.toFixed(4)}, {hotspot.centerLng.toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Data Table */}
        <section className="data-table-panel">
          <h2>FIR Records</h2>

          {state.filteredFIRs.length === 0 ? (
            <p>No records match the current filters.</p>
          ) : (
            <table className="fir-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Crime Type</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Area</th>
                  <th>Zone</th>
                  <th>Police Station</th>
                </tr>
              </thead>
              <tbody>
                {state.filteredFIRs.slice(0, 20).map((fir) => (
                  <tr key={fir.id}>
                    <td>{fir.id}</td>
                    <td>{fir.crimeType}</td>
                    <td>{fir.date.toLocaleDateString()}</td>
                    <td>{fir.time}</td>
                    <td>{fir.area}</td>
                    <td>{fir.zone}</td>
                    <td>{fir.policeStation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {state.filteredFIRs.length > 20 && (
            <p className="table-note">
              Showing 20 of {state.filteredFIRs.length} records. Export to see all.
            </p>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>
          SafeCity MVP v0.1.0 | Data-Driven Crime Mapping &amp; Patrol Decision
          Support
        </p>
      </footer>
    </div>
  );
};

export default App;
