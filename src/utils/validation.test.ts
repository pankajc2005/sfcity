import { validateFIR, validateFIRBatch, findDuplicates, isValidGeoLocation, generateValidationReport } from './validation';
import { FIR } from '../types';

describe('validation', () => {
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

  describe('validateFIR', () => {
    it('should validate a correct FIR record', () => {
      const result = validateFIR(validFIR);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing ID', () => {
      const fir = { ...validFIR, id: '' };
      const result = validateFIR(fir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('FIR ID is required');
    });

    it('should detect missing crime type', () => {
      const fir = { ...validFIR, crimeType: '' };
      const result = validateFIR(fir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Crime type is required');
    });

    it('should detect invalid date', () => {
      const fir = { ...validFIR, date: new Date('invalid') };
      const result = validateFIR(fir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date format');
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const fir = { ...validFIR, date: futureDate };
      const result = validateFIR(fir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Date cannot be in the future');
    });

    it('should detect invalid time format', () => {
      const fir = { ...validFIR, time: '25:70' };
      const result = validateFIR(fir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Time must be in HH:MM or HH:MM:SS format');
    });

    it('should detect invalid latitude', () => {
      const fir = { ...validFIR, latitude: 100 };
      const result = validateFIR(fir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Latitude must be between -90 and 90');
    });

    it('should detect invalid longitude', () => {
      const fir = { ...validFIR, longitude: 200 };
      const result = validateFIR(fir);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Longitude must be between -180 and 180');
    });

    it('should accept valid time formats', () => {
      const fir1 = { ...validFIR, time: '14:30' };
      const fir2 = { ...validFIR, time: '14:30:45' };

      const result1 = validateFIR(fir1);
      const result2 = validateFIR(fir2);

      expect(result1.valid).toBe(true);
      expect(result2.valid).toBe(true);
    });
  });

  describe('validateFIRBatch', () => {
    it('should separate valid and invalid records', () => {
      const records: FIR[] = [
        validFIR,
        { ...validFIR, id: 'FIR002' },
        { ...validFIR, id: '', crimeType: '' },
      ];

      const result = validateFIRBatch(records);

      expect(result.validRecords).toHaveLength(2);
      expect(result.invalidRecords).toHaveLength(1);
    });
  });

  describe('findDuplicates', () => {
    it('should find duplicate FIR IDs', () => {
      const records: FIR[] = [
        validFIR,
        { ...validFIR, id: 'FIR001' }, // Duplicate
        { ...validFIR, id: 'FIR002' },
      ];

      const duplicates = findDuplicates(records);

      expect(duplicates).toHaveLength(2);
      expect(duplicates.every((d) => d.id === 'FIR001')).toBe(true);
    });

    it('should return empty array when no duplicates', () => {
      const records: FIR[] = [
        validFIR,
        { ...validFIR, id: 'FIR002' },
      ];

      const duplicates = findDuplicates(records);

      expect(duplicates).toHaveLength(0);
    });
  });

  describe('isValidGeoLocation', () => {
    it('should validate location within default bounds (Delhi)', () => {
      const valid = isValidGeoLocation(28.5355, 77.3910);
      expect(valid).toBe(true);
    });

    it('should reject location outside default bounds', () => {
      const invalid = isValidGeoLocation(35.0, 85.0); // Outside Delhi
      expect(invalid).toBe(false);
    });

    it('should validate with custom bounds', () => {
      const customBounds = {
        minLat: 20,
        maxLat: 30,
        minLng: 70,
        maxLng: 80,
      };

      const valid = isValidGeoLocation(25, 75, customBounds);
      expect(valid).toBe(true);

      const invalid = isValidGeoLocation(35, 85, customBounds);
      expect(invalid).toBe(false);
    });
  });

  describe('generateValidationReport', () => {
    it('should generate comprehensive validation report', () => {
      const records: FIR[] = [
        validFIR,
        { ...validFIR, id: 'FIR002' },
        { ...validFIR, id: 'FIR001' }, // Duplicate
        { ...validFIR, id: '', crimeType: '' }, // Invalid
      ];

      const report = generateValidationReport(records);

      expect(report.total).toBe(4);
      expect(report.valid).toBe(2);
      expect(report.invalid).toBe(1);
      expect(report.duplicates).toBe(2);
    });
  });
});
