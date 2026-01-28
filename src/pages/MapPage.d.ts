import React from 'react';
import { FIR, Hotspot } from '../types';
import './MapPage.css';
interface MapPageProps {
    filteredFIRs: FIR[];
    hotspots: Hotspot[];
    selectedFIR?: FIR;
    onFIRSelect: (fir?: FIR) => void;
}
export declare const MapPage: React.FC<MapPageProps>;
export {};
//# sourceMappingURL=MapPage.d.ts.map