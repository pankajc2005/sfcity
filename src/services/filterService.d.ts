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
declare class FilterService {
    /**
     * Applies filter criteria to FIR data
     * Returns filtered array
     *
     * Time Complexity: O(n) with chained filters
     */
    applyFilters(firs: FIR[], criteria: FilterCriteria): FIR[];
    /**
     * Searches FIRs by text (ID, area, police station, description)
     * Case-insensitive substring search
     *
     * Time Complexity: O(n) - linear search through all records
     */
    search(firs: FIR[], query: string): FIR[];
    /**
     * Combines search and filter operations
     * First applies filters, then searches within results
     */
    searchAndFilter(firs: FIR[], criteria: FilterCriteria, searchQuery: string): FIR[];
    /**
     * Validates filter criteria
     * Returns validation result with errors
     */
    validateCriteria(criteria: FilterCriteria): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Gets all unique values for a field
     * Useful for populating filter dropdowns
     *
     * Time Complexity: O(n)
     */
    getUniqueValues(firs: FIR[], field: keyof FIR): (string | number | boolean)[];
    /**
     * Gets filter options for UI dropdowns
     * Optional FIRs parameter - if not provided, fetches from firService
     */
    getFilterOptions(firs?: FIR[]): {
        crimeTypes: string[];
        areas: string[];
        zones: string[];
        policeStations: string[];
        dateRange: {
            earliest: Date;
            latest: Date;
        } | null;
    };
    /**
     * Resets all filters to default (empty)
     */
    resetFilters(): FilterCriteria;
    /**
     * Checks if any filters are active
     */
    hasActiveFilters(criteria: FilterCriteria): boolean;
}
export declare const filterService: FilterService;
export {};
//# sourceMappingURL=filterService.d.ts.map