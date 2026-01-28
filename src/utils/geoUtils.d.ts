import { FIR, Hotspot } from '../types';
export interface GridConfig {
    latGridSize: number;
    lngGridSize: number;
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
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
export declare const detectHotspots: (firs: FIR[], config?: GridConfig) => Hotspot[];
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
export declare const haversineDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
/**
 * Finds FIRs within a specified radius of a point
 * Useful for proximity-based analysis
 *
 * Time Complexity: O(n) - scans all FIRs to calculate distance
 * Could be optimized with spatial index
 */
export declare const findNearbyFIRs: (firs: FIR[], centerLat: number, centerLng: number, radiusKm: number) => FIR[];
/**
 * Clusters nearby FIRs using DBSCAN-inspired approach
 * Groups FIRs that are within radiusKm of each other
 *
 * Time Complexity: O(n²) - considers all pairs
 * Space Complexity: O(n) for cluster storage
 *
 * Returns array of FIR clusters
 */
export declare const clusterFIRs: (firs: FIR[], radiusKm?: number) => FIR[][];
/**
 * Calculates the bounding box for a set of geographic points
 * Useful for map centering and zoom level calculation
 */
export declare const calculateBounds: (firs: FIR[]) => {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
};
/**
 * Gets the center point of a set of FIRs (geographic centroid)
 * Time Complexity: O(n)
 */
export declare const getCenter: (firs: FIR[]) => {
    lat: number;
    lng: number;
} | null;
//# sourceMappingURL=geoUtils.d.ts.map