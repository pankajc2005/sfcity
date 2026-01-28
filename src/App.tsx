import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FIR, FilterCriteria } from './types';
import { firService } from './services/firService';
import { filterService } from './services/filterService';
import { dataLoaderService } from './services/dataLoaderService';
import { parseCSV } from './utils/csvParser';
import { validateFIRBatch } from './utils/validation';
import { NavigationBar } from './components/Navigation/NavigationBar';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DataTablePage } from './pages/DataTablePage';
import { IntegrationPage } from './pages/IntegrationPage';
import { PolicePatrolPage } from './pages/PolicePatrolPage';
import './App.css';

interface AppState {
  allFIRs: FIR[];
  filteredFIRs: FIR[];
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
    filters: filterService.resetFilters(),
    searchQuery: '',
    loading: false,
    error: null,
  });

  const [selectedFIR, setSelectedFIR] = useState<FIR | undefined>(undefined);

  // Initialize with Mumbai FIR data from CSV
  useEffect(() => {
    const loadMumbaiData = async () => {
      setState((s) => ({ ...s, loading: true }));
      
      try {
        const { records, errors } = await dataLoaderService.loadMumbaiData();

        if (errors.length > 0) {
          console.error('Data loading errors:', errors);
        }

        if (records.length === 0) {
          setState((s) => ({
            ...s,
            error: 'No data could be loaded from the CSV file',
            loading: false,
          }));
          return;
        }

        // Validate records
        const { validRecords, invalidRecords } = validateFIRBatch(records);

        if (invalidRecords.length > 0) {
          console.warn(`${invalidRecords.length} records failed validation`);
        }

        // Clear existing data and add valid records
        firService.clear();
        const result = firService.addFIRBatch(validRecords);

        if (result.failed > 0) {
          console.warn(`Failed to add ${result.failed} records`);
        }

        // Update state
        const allFIRs = firService.getAll();

        setState((s) => ({
          ...s,
          allFIRs,
          filteredFIRs: allFIRs,
          error: null,
          loading: false,
        }));
      } catch (error) {
        setState((s) => ({
          ...s,
          error: error instanceof Error ? error.message : 'Failed to load data',
          loading: false,
        }));
      }
    };

    loadMumbaiData();
  }, []);

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

        setState((s) => ({
          ...s,
          allFIRs,
          filteredFIRs: allFIRs,
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

    setState((s) => ({
      ...s,
      searchQuery: query,
      filteredFIRs: filtered,
    }));
  };

  /**
   * Resets all filters
   */
  const handleResetFilters = () => {
    const resetFilters = filterService.resetFilters();

    setState((s) => ({
      ...s,
      filters: resetFilters,
      filteredFIRs: state.allFIRs,
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
  const handleFiltersChange = (newFilters: FilterCriteria) => {
    const filtered = filterService.searchAndFilter(
      state.allFIRs,
      newFilters,
      state.searchQuery
    );
    setState((s) => ({
      ...s,
      filters: newFilters,
      filteredFIRs: filtered,
    }));
  };

  return (
    <Router>
      <div className="app-layout">
        <NavigationBar />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  allFIRs={state.allFIRs}
                  filteredFIRs={state.filteredFIRs}
                  filters={state.filters}
                  searchQuery={state.searchQuery}
                  error={state.error}
                  onFileUpload={handleFileUpload}
                  onFiltersChange={handleFiltersChange}
                  onSearch={handleSearch}
                  onResetFilters={handleResetFilters}
                  onExportCSV={handleExportCSV}
                />
              }
            />
            <Route
              path="/map"
              element={
                <MapPage
                  filteredFIRs={state.filteredFIRs}
                  selectedFIR={selectedFIR}
                  onFIRSelect={setSelectedFIR}
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <AnalyticsPage
                  filteredFIRs={state.filteredFIRs}
                />
              }
            />
            <Route
              path="/data"
              element={<DataTablePage filteredFIRs={state.filteredFIRs} />}
            />
            <Route path="/integration" element={<IntegrationPage />} />
            <Route
              path="/policing"
              element={<PolicePatrolPage filteredFIRs={state.filteredFIRs} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
