import { FIR, Hotspot } from '../types';
import { ZONE_DENSITY_THRESHOLDS } from '../config/constants';

/**
 * Geospatial Utilities for Crime Mapping and Hotspot Detection
 *
 * Algorithm: Grid-based spatial clustering
 * - Divides the city into uniform grid cells
 * - Calculates FIR density per cell
 * - Classifies cells by severity
 * - Time Complexity: O(n) for density calculation, O(g) for grid processing where g = grid cells
 */

interface GridCell {
  id: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  centerLat: number;
  centerLng: number;
  firCount: number;
  firs: FIR[];
}

export interface GridConfig {
  latGridSize: number; // degrees
  lngGridSize: number; // degrees
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// Default grid configuration for Delhi, India
const DEFAULT_GRID_CONFIG: GridConfig = {
  latGridSize: 0.05, // ~5km at equator
  lngGridSize: 0.05, // ~5km at equator
  minLat: 28.4,
  maxLat: 28.9,
  minLng: 76.8,
  maxLng: 77.4,
};

/**
 * Creates a grid of cells covering the specified area
 * Each cell represents a geographic zone
 *
 * Time Complexity: O(rows × cols) where rows/cols depend on grid size
 */
function createGrid(config: GridConfig): GridCell[] {
  const cells: GridCell[] = [];
  let cellId = 0;

  for (let lat = config.minLat; lat < config.maxLat; lat += config.latGridSize) {
    for (
      let lng = config.minLng;
      lng < config.maxLng;
      lng += config.lngGridSize
    ) {
      const minLat = lat;
      const maxLat = lat + config.latGridSize;
      const minLng = lng;
      const maxLng = lng + config.lngGridSize;

      cells.push({
        id: `GRID_${cellId}`,
        minLat,
        maxLat,
        minLng,
        maxLng,
        centerLat: (minLat + maxLat) / 2,
        centerLng: (minLng + maxLng) / 2,
        firCount: 0,
        firs: [],
      });

      cellId++;
    }
  }

  return cells;
}

/**
 * Assigns FIR records to grid cells
 * Time Complexity: O(n × g) where n = FIRs, g = grid cells (optimizable with spatial indexing)
 * Optimization: Could use R-tree or quadtree for large datasets
 */
function assignFIRsToGrid(firs: FIR[], grid: GridCell[]): void {
  firs.forEach((fir) => {
    for (const cell of grid) {
      if (
        fir.latitude >= cell.minLat &&
        fir.latitude < cell.maxLat &&
        fir.longitude >= cell.minLng &&
        fir.longitude < cell.maxLng
      ) {
        cell.firs.push(fir);
        cell.firCount++;
        break; // Each FIR assigned to one cell only
      }
    }
  });
}

/**
 * Classifies grid cells by crime density severity
 * Uses thresholds from config constants
 */
function classifyBySeverity(
  firCount: number
): 'low' | 'medium' | 'high' {
  if (firCount >= ZONE_DENSITY_THRESHOLDS.high) return 'high';
  if (firCount >= ZONE_DENSITY_THRESHOLDS.medium) return 'medium';
  return 'low';
}

/**
 * Detects crime hotspots from FIR data using grid-based clustering
 * Returns array of hotspot zones
 *
 * Main Algorithm Steps:
 * 1. Create uniform grid covering the city
 * 2. Assign each FIR to its grid cell (O(n) with spatial indexing)
 * 3. Calculate density for each cell
 * 4. Classify cells by severity
 * 5. Filter cells with detectable crime (> threshold)
 *
 * Time Complexity: O(n + g) where n = FIRs, g = grid cells
 */
export const detectHotspots = (
  firs: FIR[],
  config: GridConfig = DEFAULT_GRID_CONFIG
): Hotspot[] => {
  if (firs.length === 0) return [];

  // Create grid
  const grid = createGrid(config);

  // Assign FIRs to grid cells
  assignFIRsToGrid(firs, grid);

  // Convert grid cells to hotspots
  const hotspots: Hotspot[] = [];
  const totalFIRs = firs.length;

  grid.forEach((cell) => {
    if (cell.firCount > 0) {
      hotspots.push({
        zoneId: cell.id,
        zoneName: `Zone ${cell.id.replace('GRID_', '')}`,
        centerLat: cell.centerLat,
        centerLng: cell.centerLng,
        firCount: cell.firCount,
        severity: classifyBySeverity(cell.firCount),
        percentage: (cell.firCount / totalFIRs) * 100,
        lastUpdated: new Date(),
      });
    }
  });

  return hotspots.sort((a, b) => b.firCount - a.firCount); // Sort by density
};

/**
 * Calculates Haversine distance between two geographic points
 * Used for proximity-based queries and radius searches
 *
 * Formula: d = 2 * R * arcsin(sqrt(sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlng/2)))
 * where R = Earth's radius (6,371 km)
 *
 * Time Complexity: O(1) - constant time calculation
 * Returns distance in kilometers
 */
export const haversineDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Converts degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Finds FIRs within a specified radius of a point
 * Useful for proximity-based analysis
 *
 * Time Complexity: O(n) - scans all FIRs to calculate distance
 * Could be optimized with spatial index
 */
export const findNearbyFIRs = (
  firs: FIR[],
  centerLat: number,
  centerLng: number,
  radiusKm: number
): FIR[] => {
  return firs.filter((fir) => {
    const distance = haversineDistance(
      centerLat,
      centerLng,
      fir.latitude,
      fir.longitude
    );
    return distance <= radiusKm;
  });
};

/**
 * Clusters nearby FIRs using DBSCAN-inspired approach
 * Groups FIRs that are within radiusKm of each other
 *
 * Time Complexity: O(n²) - considers all pairs
 * Space Complexity: O(n) for cluster storage
 *
 * Returns array of FIR clusters
 */
export const clusterFIRs = (
  firs: FIR[],
  radiusKm: number = 0.5
): FIR[][] => {
  const clusters: FIR[][] = [];
  const visited = new Set<string>();

  firs.forEach((fir) => {
    if (visited.has(fir.id)) return;

    const cluster: FIR[] = [fir];
    visited.add(fir.id);

    // Find all nearby FIRs
    const nearby = findNearbyFIRs(firs, fir.latitude, fir.longitude, radiusKm);

    nearby.forEach((nearFir) => {
      if (!visited.has(nearFir.id)) {
        cluster.push(nearFir);
        visited.add(nearFir.id);
      }
    });

    if (cluster.length > 0) {
      clusters.push(cluster);
    }
  });

  return clusters.sort((a, b) => b.length - a.length); // Sort by cluster size
};

/**
 * Calculates the bounding box for a set of geographic points
 * Useful for map centering and zoom level calculation
 */
export const calculateBounds = (
  firs: FIR[]
): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} => {
  if (firs.length === 0) {
    return {
      minLat: DEFAULT_GRID_CONFIG.minLat,
      maxLat: DEFAULT_GRID_CONFIG.maxLat,
      minLng: DEFAULT_GRID_CONFIG.minLng,
      maxLng: DEFAULT_GRID_CONFIG.maxLng,
    };
  }

  let minLat = firs[0].latitude;
  let maxLat = firs[0].latitude;
  let minLng = firs[0].longitude;
  let maxLng = firs[0].longitude;

  firs.forEach((fir) => {
    minLat = Math.min(minLat, fir.latitude);
    maxLat = Math.max(maxLat, fir.latitude);
    minLng = Math.min(minLng, fir.longitude);
    maxLng = Math.max(maxLng, fir.longitude);
  });

  return { minLat, maxLat, minLng, maxLng };
};

/**
 * Gets the center point of a set of FIRs (geographic centroid)
 * Time Complexity: O(n)
 */
export const getCenter = (
  firs: FIR[]
): { lat: number; lng: number } | null => {
  if (firs.length === 0) return null;

  let sumLat = 0;
  let sumLng = 0;

  firs.forEach((fir) => {
    sumLat += fir.latitude;
    sumLng += fir.longitude;
  });

  return {
    lat: sumLat / firs.length,
    lng: sumLng / firs.length,
  };
};
