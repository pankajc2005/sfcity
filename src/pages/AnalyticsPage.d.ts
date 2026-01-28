import React from 'react';
import { FIR, Hotspot } from '../types';

interface AnalyticsPageProps {
  filteredFIRs: FIR[];
  hotspots: Hotspot[];
}

export declare const AnalyticsPage: React.FC<AnalyticsPageProps>;
