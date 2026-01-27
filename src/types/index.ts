// FIR (First Information Report) data structure
export interface FIR {
  id: string;
  crimeType: string;
  date: Date;
  time: string;
  latitude: number;
  longitude: number;
  area: string;
  zone: string;
  policeStation: string;
  description?: string;
  isAccident?: boolean;
  isSensitiveZone?: boolean;
  severity?: 'low' | 'medium' | 'high';
}

// Hotspot analysis data
export interface Hotspot {
  zoneId: string;
  zoneName: string;
  centerLat: number;
  centerLng: number;
  firCount: number;
  severity: 'low' | 'medium' | 'high';
  percentage: number;
  lastUpdated: Date;
}

// Filter criteria
export interface FilterCriteria {
  dateFrom?: Date;
  dateTo?: Date;
  crimeTypes?: string[];
  areas?: string[];
  zones?: string[];
  policeStations?: string[];
  severity?: 'low' | 'medium' | 'high';
}

// Insights and statistics
export interface CrimeInsight {
  peakHours: { hour: number; count: number }[];
  dayWiseTrends: { day: string; count: number }[];
  topCrimeTypes: { type: string; count: number }[];
  totalFIRs: number;
  totalHotspots: number;
  generatedAt: Date;
}

// Patrol recommendation
export interface PatrolRecommendation {
  id: string;
  zone: string;
  timeSlot: string;
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  supportingData: {
    firCount: number;
    crimeTypes: string[];
    hotspotSeverity: string;
  };
}

// User authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'analyst' | 'officer' | 'admin';
  loginTime?: Date;
}

// Sensitive zone definition
export interface SensitiveZone {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'market' | 'government' | 'other';
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

// Accident analysis
export interface AccidentAnalysis {
  totalAccidents: number;
  timeWiseTrends: { time: string; count: number }[];
  locationWiseTrends: { location: string; count: number }[];
  severityDistribution: { severity: string; count: number }[];
}

// Export options
export interface ExportOptions {
  format: 'csv' | 'pdf';
  includeCharts: boolean;
  includeRecommendations: boolean;
  dateRange?: { from: Date; to: Date };
}
