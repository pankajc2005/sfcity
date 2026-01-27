import {
  detectHotspots,
  haversineDistance,
  findNearbyFIRs,
  clusterFIRs,
  calculateBounds,
  getCenter,
} from './geoUtils';
import { FIR } from '../types';

describe('geoUtils', () => {
  const firSet: FIR[] = [
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
      area: 'Downtown',
      zone: 'Zone A',
      policeStation: 'Central PS',
      isAccident: false,
      isSensitiveZone: false,
    },
    {
      id: 'FIR003',
      crimeType: 'Robbery',
      date: new Date('2026-01-19'),
      time: '22:00',
      latitude: 28.6000,
      longitude: 77.4000,
      area: 'Uptown',
      zone: 'Zone B',
      policeStation: 'North PS',
      isAccident: false,
      isSensitiveZone: false,
    },
  ];

  describe('haversineDistance', () => {
    it('should calculate distance between two points', () => {
      // Distance between two close points (Delhi)
      const distance = haversineDistance(28.5355, 77.3910, 28.5360, 77.3920);

      expect(distance).toBeCloseTo(0.12, 1); // ~0.12 km or 120 meters
    });

    it('should return 0 for the same point', () => {
      const distance = haversineDistance(28.5355, 77.3910, 28.5355, 77.3910);

      expect(distance).toBeLessThan(0.01);
    });
  });

  describe('detectHotspots', () => {
    it('should detect hotspots from FIR data', () => {
      const hotspots = detectHotspots(firSet);

      expect(hotspots.length).toBeGreaterThan(0);
      expect(hotspots[0]).toHaveProperty('zoneId');
      expect(hotspots[0]).toHaveProperty('firCount');
      expect(hotspots[0]).toHaveProperty('severity');
    });

    it('should return empty array for no FIRs', () => {
      const hotspots = detectHotspots([]);

      expect(hotspots).toHaveLength(0);
    });

    it('should sort hotspots by FIR count (descending)', () => {
      const hotspots = detectHotspots(firSet);

      for (let i = 0; i < hotspots.length - 1; i++) {
        expect(hotspots[i].firCount).toBeGreaterThanOrEqual(
          hotspots[i + 1].firCount
        );
      }
    });

    it('should classify severity correctly', () => {
      const hotspots = detectHotspots(firSet);

      hotspots.forEach((hotspot) => {
        expect(['low', 'medium', 'high']).toContain(hotspot.severity);
      });
    });
  });

  describe('findNearbyFIRs', () => {
    it('should find FIRs within radius', () => {
      const nearby = findNearbyFIRs(firSet, 28.5355, 77.3910, 0.5); // 500m radius

      expect(nearby.length).toBeGreaterThanOrEqual(1);
      expect(nearby.some((f) => f.id === 'FIR001')).toBe(true);
    });

    it('should not find FIRs outside radius', () => {
      const nearby = findNearbyFIRs(firSet, 28.5355, 77.3910, 0.01); // 10m radius

      expect(nearby).toHaveLength(1);
      expect(nearby[0].id).toBe('FIR001');
    });
  });

  describe('clusterFIRs', () => {
    it('should cluster nearby FIRs', () => {
      const clusters = clusterFIRs(firSet, 0.5); // 500m radius

      expect(clusters.length).toBeGreaterThan(0);
      expect(clusters.some((c) => c.length >= 2)).toBe(true); // At least one cluster with multiple FIRs
    });

    it('should sort clusters by size (descending)', () => {
      const clusters = clusterFIRs(firSet, 0.5);

      for (let i = 0; i < clusters.length - 1; i++) {
        expect(clusters[i].length).toBeGreaterThanOrEqual(clusters[i + 1].length);
      }
    });
  });

  describe('calculateBounds', () => {
    it('should calculate bounding box', () => {
      const bounds = calculateBounds(firSet);

      expect(bounds.minLat).toBeLessThanOrEqual(bounds.maxLat);
      expect(bounds.minLng).toBeLessThanOrEqual(bounds.maxLng);
      expect(bounds.minLat).toBeLessThanOrEqual(28.5355);
      expect(bounds.maxLat).toBeGreaterThanOrEqual(28.6000);
    });

    it('should return default bounds for empty array', () => {
      const bounds = calculateBounds([]);

      expect(bounds).toHaveProperty('minLat');
      expect(bounds).toHaveProperty('maxLat');
      expect(bounds).toHaveProperty('minLng');
      expect(bounds).toHaveProperty('maxLng');
    });
  });

  describe('getCenter', () => {
    it('should calculate geographic centroid', () => {
      const center = getCenter(firSet);

      expect(center).not.toBeNull();
      expect(center?.lat).toBeGreaterThan(28.5);
      expect(center?.lat).toBeLessThan(28.7);
    });

    it('should return null for empty array', () => {
      const center = getCenter([]);

      expect(center).toBeNull();
    });
  });
});
