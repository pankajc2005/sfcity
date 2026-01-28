import React from 'react';
import { FilterCriteria } from '../../types';
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
export declare const FilterPanel: React.FC<FilterPanelProps>;
export default FilterPanel;
//# sourceMappingURL=FilterPanel.d.ts.map