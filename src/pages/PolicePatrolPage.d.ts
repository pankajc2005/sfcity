import { FIR } from '../types';

export interface PolicePatrolPageProps {
  filteredFIRs: FIR[];
}

export interface PatrolRoute {
  id: string;
  name: string;
  zones: string[];
  duration: string;
  startTime: string;
  endTime: string;
  crimeDensity: 'High' | 'Medium' | 'Low';
  crimeTypes: string[];
  checkpoints: Checkpoint[];
  priority: number;
}

export interface Checkpoint {
  location: string;
  estimatedTime: string;
  crimeCount: number;
  notes: string;
}

export declare const PolicePatrolPage: React.FC<PolicePatrolPageProps>;
