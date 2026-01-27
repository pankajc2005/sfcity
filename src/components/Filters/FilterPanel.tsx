import React, { useState } from 'react';
import { FilterCriteria } from '../../types';
import { filterService } from '../../services/filterService';
import './FilterPanel.css';

interface FilterPanelProps {
  onFiltersChange: (filters: FilterCriteria) => void;
  onSearch: (query: string) => void;
  currentFilters: FilterCriteria;
  searchQuery: string;
}

/**
 * FilterPanel Component - Task 4.0
 *
 * Multi-criteria filtering interface for FIR data
 * Features:
 * - Date range filtering
 * - Crime type selection
 * - Area filtering
 * - Zone filtering
 * - Police station filtering
 * - Severity level filtering
 * - Full-text search
 *
 * Time Complexity: O(1) for filter state updates
 * Space Complexity: O(n) for filter options (where n = unique values count)
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFiltersChange,
  onSearch,
  currentFilters,
  searchQuery,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Get available filter options from service
  const filterOptions = filterService.getFilterOptions();

  /**
   * Handle individual filter changes
   */
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters: FilterCriteria = {
      ...currentFilters,
      dateFrom: e.target.value ? new Date(e.target.value) : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters: FilterCriteria = {
      ...currentFilters,
      dateTo: e.target.value ? new Date(e.target.value) : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleCrimeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    const crimeTypes = currentFilters.crimeTypes || [];

    let newCrimeTypes: string[];
    if (selectedType === '') {
      newCrimeTypes = [];
    } else if (crimeTypes.includes(selectedType)) {
      newCrimeTypes = crimeTypes.filter((t) => t !== selectedType);
    } else {
      newCrimeTypes = [...crimeTypes, selectedType];
    }

    const newFilters: FilterCriteria = {
      ...currentFilters,
      crimeTypes: newCrimeTypes.length > 0 ? newCrimeTypes : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters: FilterCriteria = {
      ...currentFilters,
      areas: e.target.value ? [e.target.value] : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters: FilterCriteria = {
      ...currentFilters,
      zones: e.target.value ? [e.target.value] : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters: FilterCriteria = {
      ...currentFilters,
      policeStations: e.target.value ? [e.target.value] : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'low' | 'medium' | 'high' | '';
    const newFilters: FilterCriteria = {
      ...currentFilters,
      severity: value ? (value as 'low' | 'medium' | 'high') : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearch(query);
    onSearch(query);
  };

  const handleClearFilters = () => {
    const emptyFilters = filterService.resetFilters();
    onFiltersChange(emptyFilters);
    setLocalSearch('');
    onSearch('');
  };

  // Format date for input element
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Advanced Filters</h3>
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Search Box */}
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="ID, area, crime type..."
              value={localSearch}
              onChange={handleSearchChange}
              className="filter-input"
            />
          </div>

          {/* Date Range */}
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="date-from">Date From</label>
              <input
                id="date-from"
                type="date"
                value={formatDateForInput(currentFilters.dateFrom)}
                onChange={handleDateFromChange}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="date-to">Date To</label>
              <input
                id="date-to"
                type="date"
                value={formatDateForInput(currentFilters.dateTo)}
                onChange={handleDateToChange}
                className="filter-input"
              />
            </div>
          </div>

          {/* Crime Type */}
          <div className="filter-group">
            <label htmlFor="crime-type">Crime Type</label>
            <select
              id="crime-type"
              onChange={handleCrimeTypeChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              {filterOptions.crimeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                  {currentFilters.crimeTypes?.includes(type) ? ' ✓' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div className="filter-group">
            <label htmlFor="area">Area</label>
            <select
              id="area"
              value={currentFilters.areas?.[0] || ''}
              onChange={handleAreaChange}
              className="filter-select"
            >
              <option value="">All Areas</option>
              {filterOptions.areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Zone */}
          <div className="filter-group">
            <label htmlFor="zone">Zone</label>
            <select
              id="zone"
              value={currentFilters.zones?.[0] || ''}
              onChange={handleZoneChange}
              className="filter-select"
            >
              <option value="">All Zones</option>
              {filterOptions.zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          {/* Police Station */}
          <div className="filter-group">
            <label htmlFor="station">Police Station</label>
            <select
              id="station"
              value={currentFilters.policeStations?.[0] || ''}
              onChange={handleStationChange}
              className="filter-select"
            >
              <option value="">All Stations</option>
              {filterOptions.policeStations.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Level */}
          <div className="filter-group">
            <label htmlFor="severity">Severity</label>
            <select
              id="severity"
              value={currentFilters.severity || ''}
              onChange={handleSeverityChange}
              className="filter-select"
            >
              <option value="">All Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Clear Button */}
          <button onClick={handleClearFilters} className="clear-filters-button">
            Clear All Filters
          </button>

          {/* Active Filters Display */}
          {filterService.hasActiveFilters(currentFilters) && (
            <div className="active-filters">
              <p className="active-filters-label">Active Filters:</p>
              <div className="filter-tags">
                {currentFilters.dateFrom && (
                  <span className="filter-tag">
                    From: {currentFilters.dateFrom.toLocaleDateString()}
                  </span>
                )}
                {currentFilters.dateTo && (
                  <span className="filter-tag">
                    To: {currentFilters.dateTo.toLocaleDateString()}
                  </span>
                )}
                {currentFilters.crimeTypes?.map((type) => (
                  <span key={type} className="filter-tag">
                    Crime: {type}
                  </span>
                ))}
                {currentFilters.areas?.map((area) => (
                  <span key={area} className="filter-tag">
                    Area: {area}
                  </span>
                ))}
                {currentFilters.zones?.map((zone) => (
                  <span key={zone} className="filter-tag">
                    Zone: {zone}
                  </span>
                ))}
                {currentFilters.policeStations?.map((station) => (
                  <span key={station} className="filter-tag">
                    Station: {station}
                  </span>
                ))}
                {currentFilters.severity && (
                  <span className="filter-tag">
                    Severity: {currentFilters.severity}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
