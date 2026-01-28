import React from 'react';
import { FilterCriteria, FIR } from '../../types';

interface DashboardPageProps {
  allFIRs: FIR[];
  filteredFIRs: FIR[];
  hotspots: any[];
  filters: FilterCriteria;
  searchQuery: string;
  error: string | null;
  onFileUpload: (file: File) => void;
  onFiltersChange: (filters: FilterCriteria) => void;
  onSearch: (query: string) => void;
  onResetFilters: () => void;
  onExportCSV: () => void;
}

export declare const DashboardPage: React.FC<DashboardPageProps>;
