import React from 'react';
import { FIR, Hotspot } from '../types';

interface MapPageProps {
  filteredFIRs: FIR[];
  hotspots: Hotspot[];
  selectedFIR?: FIR;
  onFIRSelect: (fir?: FIR) => void;
}

export declare const MapPage: React.FC<MapPageProps>;
