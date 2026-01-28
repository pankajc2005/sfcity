import React from 'react';
import 'leaflet/dist/leaflet.css';
import { FIR, Hotspot } from '../../types';
import './CrimeMap.css';
interface CrimeMapProps {
    firs: FIR[];
    hotspots: Hotspot[];
    selectedFIR?: FIR;
    onFIRSelect?: (fir: FIR) => void;
}
/**
 * CrimeMap Component - Task 3.0
 *
 * Interactive crime mapping using Leaflet.js
 * Features:
 * - Display FIR locations as markers
 * - Hotspot visualization with color-coding by severity
 * - Interactive popups showing crime details
 * - Zoom and pan controls
 * - Layer toggle for FIRs and hotspots
 *
 * Time Complexity: O(n) for rendering markers (n = number of FIRs)
 * Space Complexity: O(n) for marker storage
 */
export declare const CrimeMap: React.FC<CrimeMapProps>;
export default CrimeMap;
//# sourceMappingURL=CrimeMap.d.ts.map