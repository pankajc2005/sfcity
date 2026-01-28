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
export interface FilterCriteria {
    dateFrom?: Date;
    dateTo?: Date;
    crimeTypes?: string[];
    areas?: string[];
    zones?: string[];
    policeStations?: string[];
    severity?: 'low' | 'medium' | 'high';
}
export interface CrimeInsight {
    peakHours: {
        hour: number;
        count: number;
    }[];
    dayWiseTrends: {
        day: string;
        count: number;
    }[];
    topCrimeTypes: {
        type: string;
        count: number;
    }[];
    monthlyTrends: {
        month: string;
        count: number;
    }[];
    areaStatistics: {
        area: string;
        count: number;
    }[];
    predictedPeakHours: number[];
    highRiskDays: {
        day: string;
        count: number;
    }[];
    totalFIRs: number;
    totalHotspots: number;
    generatedAt: Date;
}
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
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'analyst' | 'officer' | 'admin';
    loginTime?: Date;
}
export interface SensitiveZone {
    id: string;
    name: string;
    type: 'school' | 'hospital' | 'market' | 'government' | 'other';
    latitude: number;
    longitude: number;
    radius: number;
}
export interface AccidentAnalysis {
    totalAccidents: number;
    timeWiseTrends: {
        time: string;
        count: number;
    }[];
    locationWiseTrends: {
        location: string;
        count: number;
    }[];
    severityDistribution: {
        severity: string;
        count: number;
    }[];
}
export interface ExportOptions {
    format: 'csv' | 'pdf';
    includeCharts: boolean;
    includeRecommendations: boolean;
    dateRange?: {
        from: Date;
        to: Date;
    };
}
//# sourceMappingURL=index.d.ts.map