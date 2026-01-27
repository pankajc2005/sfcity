import { firService } from './firService';
import { FIR, FilterCriteria } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('firService', () => {
  const validFIR: FIR = {
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
  };

  beforeEach(() => {
    firService.clear();
    localStorage.clear();
  });

  describe('addFIR', () => {
    it('should add a valid FIR record', () => {
      const result = firService.addFIR(validFIR);

      expect(result.success).toBe(true);
      expect(result.firId).toBe('FIR001');
    });

    it('should reject invalid FIR', () => {
      const invalid: FIR = {
        ...validFIR,
        id: '',
      };

      const result = firService.addFIR(invalid);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should return all FIR records', () => {
      firService.addFIR(validFIR);
      firService.addFIR({ ...validFIR, id: 'FIR002' });

      const all = firService.getAll();

      expect(all).toHaveLength(2);
    });

    it('should return a copy of data', () => {
      firService.addFIR(validFIR);
      const all = firService.getAll();

      all[0].crimeType = 'Modified';
      const allAgain = firService.getAll();

      expect(allAgain[0].crimeType).toBe('Theft'); // Original unchanged
    });
  });

  describe('getFIRById', () => {
    it('should find FIR by ID', () => {
      firService.addFIR(validFIR);

      const found = firService.getFIRById('FIR001');

      expect(found).toBeDefined();
      expect(found?.crimeType).toBe('Theft');
    });

    it('should return undefined for non-existent ID', () => {
      const found = firService.getFIRById('NONEXISTENT');

      expect(found).toBeUndefined();
    });
  });

  describe('search', () => {
    beforeEach(() => {
      firService.addFIR(validFIR);
      firService.addFIR({
        ...validFIR,
        id: 'FIR002',
        crimeType: 'Assault',
        area: 'Uptown',
      });
      firService.addFIR({
        ...validFIR,
        id: 'FIR003',
        crimeType: 'Robbery',
        date: new Date('2026-01-15'),
      });
    });

    it('should filter by crime type', () => {
      const criteria: FilterCriteria = {
        crimeTypes: ['Theft'],
        areas: [],
        zones: [],
        policeStations: [],
      };

      const results = firService.search(criteria);

      expect(results).toHaveLength(1);
      expect(results[0].crimeType).toBe('Theft');
    });

    it('should filter by date range', () => {
      const criteria: FilterCriteria = {
        crimeTypes: [],
        areas: [],
        zones: [],
        policeStations: [],
        dateFrom: new Date('2026-01-18'),
        dateTo: new Date('2026-01-22'),
      };

      const results = firService.search(criteria);

      expect(results).toHaveLength(2);
    });

    it('should filter by area', () => {
      const criteria: FilterCriteria = {
        crimeTypes: [],
        areas: ['Downtown'],
        zones: [],
        policeStations: [],
      };

      const results = firService.search(criteria);

      expect(results).toHaveLength(2);
    });

    it('should apply multiple filters', () => {
      const criteria: FilterCriteria = {
        crimeTypes: ['Theft', 'Assault'],
        areas: ['Downtown'],
        zones: [],
        policeStations: [],
      };

      const results = firService.search(criteria);

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('FIR001');
    });
  });

  describe('updateFIR', () => {
    beforeEach(() => {
      firService.addFIR(validFIR);
    });

    it('should update FIR record', () => {
      const updated = firService.updateFIR('FIR001', {
        crimeType: 'Robbery',
      });

      expect(updated).toBe(true);
      const fir = firService.getFIRById('FIR001');
      expect(fir?.crimeType).toBe('Robbery');
    });

    it('should prevent ID changes', () => {
      firService.updateFIR('FIR001', { id: 'NEWID' as any });

      const fir = firService.getFIRById('FIR001');
      expect(fir?.id).toBe('FIR001');
    });

    it('should return false for non-existent FIR', () => {
      const updated = firService.updateFIR('NONEXISTENT', {
        crimeType: 'Robbery',
      });

      expect(updated).toBe(false);
    });
  });

  describe('deleteFIR', () => {
    beforeEach(() => {
      firService.addFIR(validFIR);
    });

    it('should delete FIR record', () => {
      const deleted = firService.deleteFIR('FIR001');

      expect(deleted).toBe(true);
      expect(firService.getFIRById('FIR001')).toBeUndefined();
    });

    it('should return false for non-existent FIR', () => {
      const deleted = firService.deleteFIR('NONEXISTENT');

      expect(deleted).toBe(false);
    });
  });

  describe('getStatistics', () => {
    beforeEach(() => {
      firService.addFIR(validFIR);
      firService.addFIR({
        ...validFIR,
        id: 'FIR002',
        crimeType: 'Assault',
      });
    });

    it('should generate statistics', () => {
      const stats = firService.getStatistics();

      expect(stats.total).toBe(2);
      expect(stats.byType['Theft']).toBe(1);
      expect(stats.byType['Assault']).toBe(1);
      expect(stats.byArea['Downtown']).toBe(2);
    });
  });

  describe('addFIRBatch', () => {
    it('should add multiple FIRs', () => {
      const batch = [
        validFIR,
        { ...validFIR, id: 'FIR002' },
      ];

      const result = firService.addFIRBatch(batch);

      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
      expect(firService.getAll()).toHaveLength(2);
    });

    it('should handle mixed valid/invalid FIRs', () => {
      const batch = [
        validFIR,
        { ...validFIR, id: '' }, // Invalid
        { ...validFIR, id: 'FIR002' },
      ];

      const result = firService.addFIRBatch(batch);

      expect(result.success).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('exportAsCSV', () => {
    beforeEach(() => {
      firService.addFIR(validFIR);
    });

    it('should export data as CSV', () => {
      const csv = firService.exportAsCSV();

      expect(csv).toContain('id,crimeType');
      expect(csv).toContain('FIR001,Theft');
    });
  });
});
