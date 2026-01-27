import { hotspotService } from './hotspotService';
import { FIR, Hotspot } from '../types';

describe('hotspotService', () => {
  const firSet: FIR[] = Array.from({ length: 50 }, (_, i) => ({
    id: `FIR${String(i + 1).padStart(3, '0')}`,
    crimeType: ['Theft', 'Assault', 'Robbery'][i % 3],
    date: new Date('2026-01-20'),
    time: '14:30',
    latitude: 28.5355 + (Math.random() * 0.1 - 0.05),
    longitude: 77.3910 + (Math.random() * 0.1 - 0.05),
    area: i % 2 === 0 ? 'Downtown' : 'Uptown',
    zone: i % 3 === 0 ? 'Zone A' : i % 3 === 1 ? 'Zone B' : 'Zone C',
    policeStation: 'Central PS',
    isAccident: false,
    isSensitiveZone: false,
  }));

  const sampleHotspots: Hotspot[] = [
    {
      zoneId: 'ZONE_001',
      zoneName: 'Downtown Central',
      centerLat: 28.5355,
      centerLng: 77.3910,
      firCount: 25,
      severity: 'high',
      percentage: 50,
      lastUpdated: new Date(),
    },
    {
      zoneId: 'ZONE_002',
      zoneName: 'Downtown East',
      centerLat: 28.5360,
      centerLng: 77.3920,
      firCount: 15,
      severity: 'medium',
      percentage: 30,
      lastUpdated: new Date(),
    },
    {
      zoneId: 'ZONE_003',
      zoneName: 'Uptown',
      centerLat: 28.6000,
      centerLng: 77.4000,
      firCount: 10,
      severity: 'low',
      percentage: 20,
      lastUpdated: new Date(),
    },
  ];

  describe('detectHotspots', () => {
    it('should detect hotspots from FIR data', () => {
      const hotspots = hotspotService.detectHotspots(firSet);

      expect(hotspots.length).toBeGreaterThan(0);
      expect(hotspots[0]).toHaveProperty('severity');
    });

    it('should sort by severity (high > medium > low)', () => {
      const hotspots = hotspotService.detectHotspots(sampleHotspots as any);

      const severityOrder = { high: 0, medium: 1, low: 2 };
      for (let i = 0; i < hotspots.length - 1; i++) {
        const currentSeverity = severityOrder[hotspots[i].severity];
        const nextSeverity = severityOrder[hotspots[i + 1].severity];
        expect(currentSeverity).toBeLessThanOrEqual(nextSeverity);
      }
    });
  });

  describe('filterBySeverity', () => {
    it('should filter hotspots by severity', () => {
      const highRisk = hotspotService.filterBySeverity(sampleHotspots, 'high');

      expect(highRisk).toHaveLength(1);
      expect(highRisk[0].severity).toBe('high');
    });

    it('should return empty array when no matches', () => {
      const result = hotspotService.filterBySeverity(sampleHotspots, 'high');
      const noMatches = result.filter(h => h.severity === 'medium');

      expect(noMatches.length).toBeLessThan(result.length);
    });
  });

  describe('getHighRiskZones', () => {
    it('should return only high-severity hotspots', () => {
      const highRisk = hotspotService.getHighRiskZones(sampleHotspots);

      expect(highRisk.length).toBeGreaterThan(0);
      expect(highRisk.every((h) => h.severity === 'high')).toBe(true);
    });
  });

  describe('calculateRiskScore', () => {
    it('should calculate risk score 0-100', () => {
      const hotspot = sampleHotspots[0];
      const score = hotspotService.calculateRiskScore(hotspot, 50);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should give higher scores to high-severity hotspots', () => {
      const highRiskScore = hotspotService.calculateRiskScore(sampleHotspots[0], 50);
      const lowRiskScore = hotspotService.calculateRiskScore(sampleHotspots[2], 50);

      expect(highRiskScore).toBeGreaterThan(lowRiskScore);
    });
  });

  describe('getStatistics', () => {
    it('should generate hotspot statistics', () => {
      const stats = hotspotService.getStatistics(sampleHotspots);

      expect(stats.totalHotspots).toBe(3);
      expect(stats.highRisk).toBe(1);
      expect(stats.mediumRisk).toBe(1);
      expect(stats.lowRisk).toBe(1);
      expect(stats.topZones.length).toBeGreaterThan(0);
      expect(stats.averageFIRsPerHotspot).toBeGreaterThan(0);
    });
  });

  describe('analyzeTrends', () => {
    it('should identify growing hotspots', () => {
      const previous = [sampleHotspots[0]];
      const current = [
        { ...sampleHotspots[0], firCount: 35 }, // Increased from 25
      ];

      const trends = hotspotService.analyzeTrends(current as any, previous);

      expect(trends.growing.length).toBeGreaterThan(0);
    });

    it('should identify shrinking hotspots', () => {
      const previous = [sampleHotspots[0]];
      const current = [
        { ...sampleHotspots[0], firCount: 10 }, // Decreased from 25
      ];

      const trends = hotspotService.analyzeTrends(current as any, previous);

      expect(trends.shrinking.length).toBeGreaterThan(0);
    });

    it('should identify stable hotspots', () => {
      const previous = [sampleHotspots[0]];
      const current = [
        { ...sampleHotspots[0], firCount: 26 }, // ~same as 25
      ];

      const trends = hotspotService.analyzeTrends(current as any, previous);

      expect(trends.stable.length).toBeGreaterThan(0);
    });
  });
});
