import { insightService } from './insightService';
import { FIR } from '../types';

describe('insightService', () => {
  const firs: FIR[] = [
    {
      id: 'FIR001',
      crimeType: 'Theft',
      date: new Date('2026-01-20T14:30:00'),
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
      date: new Date('2026-01-20T22:00:00'),
      time: '22:00',
      latitude: 28.5360,
      longitude: 77.3920,
      area: 'Uptown',
      zone: 'Zone B',
      policeStation: 'North PS',
      isAccident: false,
      isSensitiveZone: false,
    },
    {
      id: 'FIR003',
      crimeType: 'Theft',
      date: new Date('2026-01-21T14:30:00'),
      time: '14:30',
      latitude: 28.5355,
      longitude: 77.3910,
      area: 'Downtown',
      zone: 'Zone A',
      policeStation: 'Central PS',
      isAccident: false,
      isSensitiveZone: false,
    },
  ];

  describe('generateInsights', () => {
    it('should generate insights object', () => {
      const insights = insightService.generateInsights(firs);

      expect(insights).toHaveProperty('peakHours');
      expect(insights).toHaveProperty('dayWiseTrends');
      expect(insights).toHaveProperty('topCrimeTypes');
      expect(insights.totalFIRs).toBe(3);
    });
  });

  describe('getPeakHours', () => {
    it('should identify peak hours', () => {
      const peakHours = insightService.getPeakHours(firs);

      expect(peakHours).toHaveLength(24);
      expect(peakHours[0].count).toBeGreaterThanOrEqual(peakHours[peakHours.length - 1].count);
    });

    it('should count crimes by hour correctly', () => {
      const peakHours = insightService.getPeakHours(firs);
      const hour14 = peakHours.find((h) => h.hour === 14);

      expect(hour14?.count).toBe(2);
    });
  });

  describe('getDayWiseTrends', () => {
    it('should return trends for all 7 days', () => {
      const trends = insightService.getDayWiseTrends(firs);

      expect(trends).toHaveLength(7);
    });
  });

  describe('getTopCrimeTypes', () => {
    it('should return top crime types', () => {
      const topTypes = insightService.getTopCrimeTypes(firs);

      expect(topTypes.length).toBeGreaterThan(0);
      expect(topTypes[0].type).toBe('Theft');
      expect(topTypes[0].count).toBe(2);
    });

    it('should limit results', () => {
      const topTypes = insightService.getTopCrimeTypes(firs, 1);

      expect(topTypes).toHaveLength(1);
    });
  });

  describe('getMonthlyTrends', () => {
    it('should return all 12 months', () => {
      const trends = insightService.getMonthlyTrends(firs);

      expect(trends).toHaveLength(12);
    });
  });

  describe('getAreaStatistics', () => {
    it('should count crimes by area', () => {
      const areas = insightService.getAreaStatistics(firs);

      const downtown = areas.find((a) => a.area === 'Downtown');
      expect(downtown?.count).toBe(2);
    });
  });

  describe('getPredictedPeakHours', () => {
    it('should return top 3 peak hours', () => {
      const peak = insightService.getPredictedPeakHours(firs);

      expect(peak.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getHighRiskDays', () => {
    it('should identify high-risk days', () => {
      const highRiskDays = insightService.getHighRiskDays(firs);

      expect(Array.isArray(highRiskDays)).toBe(true);
    });
  });
});
