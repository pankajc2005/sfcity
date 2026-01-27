import { filterService } from './filterService';
import { FIR, FilterCriteria } from '../types';

describe('filterService', () => {
  const firs: FIR[] = [
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
      area: 'Uptown',
      zone: 'Zone B',
      policeStation: 'North PS',
      isAccident: false,
      isSensitiveZone: false,
    },
  ];

  describe('applyFilters', () => {
    it('should apply crime type filter', () => {
      const criteria: FilterCriteria = {
        crimeTypes: ['Theft'],
        areas: [],
        zones: [],
        policeStations: [],
      };

      const results = filterService.applyFilters(firs, criteria);

      expect(results).toHaveLength(1);
      expect(results[0].crimeType).toBe('Theft');
    });

    it('should apply date range filter', () => {
      const criteria: FilterCriteria = {
        dateFrom: new Date('2026-01-20'),
        dateTo: new Date('2026-01-20'),
        crimeTypes: [],
        areas: [],
        zones: [],
        policeStations: [],
      };

      const results = filterService.applyFilters(firs, criteria);

      expect(results).toHaveLength(1);
    });
  });

  describe('search', () => {
    it('should search by FIR ID', () => {
      const results = filterService.search(firs, 'FIR001');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('FIR001');
    });

    it('should search by area (case-insensitive)', () => {
      const results = filterService.search(firs, 'downtown');

      expect(results).toHaveLength(1);
    });

    it('should return all on empty query', () => {
      const results = filterService.search(firs, '');

      expect(results).toEqual(firs);
    });
  });

  describe('validateCriteria', () => {
    it('should detect invalid date range', () => {
      const criteria: FilterCriteria = {
        dateFrom: new Date('2026-01-25'),
        dateTo: new Date('2026-01-20'),
        crimeTypes: [],
        areas: [],
        zones: [],
        policeStations: [],
      };

      const result = filterService.validateCriteria(criteria);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getFilterOptions', () => {
    it('should extract all filter options', () => {
      const options = filterService.getFilterOptions(firs);

      expect(options.crimeTypes).toContain('Theft');
      expect(options.areas).toContain('Downtown');
      expect(options.zones).toContain('Zone A');
      expect(options.policeStations).toContain('Central PS');
    });
  });

  describe('hasActiveFilters', () => {
    it('should detect no active filters', () => {
      const criteria = filterService.resetFilters();

      expect(filterService.hasActiveFilters(criteria)).toBe(false);
    });

    it('should detect active filters', () => {
      const criteria: FilterCriteria = {
        crimeTypes: ['Theft'],
        areas: [],
        zones: [],
        policeStations: [],
      };

      expect(filterService.hasActiveFilters(criteria)).toBe(true);
    });
  });
});
