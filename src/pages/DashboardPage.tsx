import React from 'react';
import FilterPanel from '../components/Filters/FilterPanel';
import { FilterCriteria, FIR } from '../types';
import './DashboardPage.css';

interface DashboardPageProps {
  allFIRs: FIR[];
  filteredFIRs: FIR[];
  filters: FilterCriteria;
  searchQuery: string;
  error: string | null;
  onFileUpload: (file: File) => void;
  onFiltersChange: (filters: FilterCriteria) => void;
  onSearch: (query: string) => void;
  onResetFilters: () => void;
  onExportCSV: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  allFIRs,
  filteredFIRs,
  filters,
  searchQuery,
  error,
  onFileUpload,
  onFiltersChange,
  onSearch,
  onResetFilters,
  onExportCSV,
}) => {
  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Crime Mapping & Patrol Decision Support</p>
      </header>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total FIRs</h3>
          <p className="stat-value">{allFIRs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Filtered FIRs</h3>
          <p className="stat-value">{filteredFIRs.length}</p>
        </div>
      </div>

      <section className="control-panel">
        <h2>Data & Filters</h2>

        <div className="file-upload">
          <label>Upload FIR Data (CSV):</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileUpload(file);
            }}
          />
        </div>

        <div className="search-box">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by ID, area, crime type..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <button onClick={onResetFilters}>Reset Filters</button>
          <button onClick={onExportCSV}>Export CSV</button>
        </div>
      </section>

      <section className="filter-panel-section">
        <FilterPanel
          onFiltersChange={onFiltersChange}
          onSearch={onSearch}
          currentFilters={filters}
          searchQuery={searchQuery}
        />
      </section>
    </div>
  );
};
