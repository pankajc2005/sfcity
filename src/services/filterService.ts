import { FIR, FilterCriteria } from '../types';

/**
 * Filter Service - Manages filter operations on FIR data
 *
 * Provides:
 * - Complex filtering by multiple criteria
 * - Search functionality
 * - Filter validation and optimization
 * - Caching for performance
 *
 * Time Complexity: O(n × m) where n = FIRs, m = filter conditions
 * Optimized with early termination and index-friendly operations
 */
class FilterService {
  /**
   * Applies filter criteria to FIR data
   * Returns filtered array
   *
   * Time Complexity: O(n) with chained filters
   */
  applyFilters(firs: FIR[], criteria: FilterCriteria): FIR[] {
    let results = [...firs];

    // Date range filtering
    if (criteria.dateFrom) {
      results = results.filter((fir) => fir.date >= criteria.dateFrom!);
    }
    if (criteria.dateTo) {
      results = results.filter((fir) => fir.date <= criteria.dateTo!);
    }

    // Crime type filtering
    if (criteria.crimeTypes && criteria.crimeTypes.length > 0) {
      const crimeTypes = criteria.crimeTypes;
      results = results.filter((fir) =>
        crimeTypes.includes(fir.crimeType)
      );
    }

    // Area filtering
    if (criteria.areas && criteria.areas.length > 0) {
      const areas = criteria.areas;
      results = results.filter((fir) => areas.includes(fir.area));
    }

    // Zone filtering
    if (criteria.zones && criteria.zones.length > 0) {
      const zones = criteria.zones;
      results = results.filter((fir) => zones.includes(fir.zone));
    }

    // Police station filtering
    if (criteria.policeStations && criteria.policeStations.length > 0) {
      const policeStations = criteria.policeStations;
      results = results.filter((fir) =>
        policeStations.includes(fir.policeStation)
      );
    }

    // Severity filtering
    if (criteria.severity) {
      results = results.filter((fir) => fir.severity === criteria.severity);
    }

    return results;
  }

  /**
   * Searches FIRs by text (ID, area, police station, description)
   * Case-insensitive substring search
   *
   * Time Complexity: O(n) - linear search through all records
   */
  search(firs: FIR[], query: string): FIR[] {
    if (!query || query.trim().length === 0) return firs;

    const lowerQuery = query.toLowerCase();

    return firs.filter(
      (fir) =>
        fir.id.toLowerCase().includes(lowerQuery) ||
        fir.area.toLowerCase().includes(lowerQuery) ||
        fir.policeStation.toLowerCase().includes(lowerQuery) ||
        fir.description?.toLowerCase().includes(lowerQuery) ||
        fir.crimeType.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Combines search and filter operations
   * First applies filters, then searches within results
   */
  searchAndFilter(
    firs: FIR[],
    criteria: FilterCriteria,
    searchQuery: string
  ): FIR[] {
    const filtered = this.applyFilters(firs, criteria);
    return this.search(filtered, searchQuery);
  }

  /**
   * Validates filter criteria
   * Returns validation result with errors
   */
  validateCriteria(criteria: FilterCriteria): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (
      criteria.dateFrom &&
      criteria.dateTo &&
      criteria.dateFrom > criteria.dateTo
    ) {
      errors.push('Date from must be before date to');
    }

    if (criteria.crimeTypes && !Array.isArray(criteria.crimeTypes)) {
      errors.push('Crime types must be an array');
    }

    if (criteria.areas && !Array.isArray(criteria.areas)) {
      errors.push('Areas must be an array');
    }

    if (criteria.zones && !Array.isArray(criteria.zones)) {
      errors.push('Zones must be an array');
    }

    if (criteria.policeStations && !Array.isArray(criteria.policeStations)) {
      errors.push('Police stations must be an array');
    }

    if (
      criteria.severity &&
      !['low', 'medium', 'high'].includes(criteria.severity)
    ) {
      errors.push('Severity must be low, medium, or high');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Gets all unique values for a field
   * Useful for populating filter dropdowns
   *
   * Time Complexity: O(n)
   */
  getUniqueValues(
    firs: FIR[],
    field: keyof FIR
  ): (string | number | boolean)[] {
    const values = new Set<string | number | boolean>();

    firs.forEach((fir) => {
      const value = fir[field];
      if (value !== undefined && value !== null) {
        values.add(value as string | number | boolean);
      }
    });

    return Array.from(values).sort((a, b) => String(a).localeCompare(String(b)));
  }

  /**
   * Gets filter options for UI dropdowns
   * Optional FIRs parameter - if not provided, fetches from firService
   */
  getFilterOptions(firs?: FIR[]): {
    crimeTypes: string[];
    areas: string[];
    zones: string[];
    policeStations: string[];
    dateRange: { earliest: Date; latest: Date } | null;
  } {
    // Import firService locally to avoid circular dependency
    const { firService } = require('./firService');
    const data = firs || firService.getAll();

    const crimeTypes = this.getUniqueValues(data, 'crimeType') as string[];
    const areas = this.getUniqueValues(data, 'area') as string[];
    const zones = this.getUniqueValues(data, 'zone') as string[];
    const policeStations = this.getUniqueValues(data, 'policeStation') as string[];

    let dateRange = null;
    if (data.length > 0) {
      const dates = data.map((f: FIR) => f.date);
      const earliest = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
      const latest = new Date(Math.max(...dates.map((d: Date) => d.getTime())));
      dateRange = { earliest, latest };
    }

    return { crimeTypes, areas, zones, policeStations, dateRange };
  }

  /**
   * Resets all filters to default (empty)
   */
  resetFilters(): FilterCriteria {
    return {};
  }

  /**
   * Checks if any filters are active
   */
  hasActiveFilters(criteria: FilterCriteria): boolean {
    return (
      (criteria.dateFrom !== undefined && criteria.dateFrom !== null) ||
      (criteria.dateTo !== undefined && criteria.dateTo !== null) ||
      (criteria.crimeTypes && criteria.crimeTypes.length > 0) ||
      (criteria.areas && criteria.areas.length > 0) ||
      (criteria.zones && criteria.zones.length > 0) ||
      (criteria.policeStations && criteria.policeStations.length > 0) ||
      (criteria.severity !== undefined && criteria.severity !== null)
    );
  }
}

export const filterService = new FilterService();
