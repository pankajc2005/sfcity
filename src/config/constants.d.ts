export declare const CRIME_TYPES: readonly ["Theft", "Assault", "Robbery", "Burglary", "Fraud", "DUI", "Vandalism", "Traffic Violation", "Drug-related", "Domestic Violence", "Accident", "Other"];
export declare const SEVERITY_LEVELS: {
    readonly low: {
        readonly value: "low";
        readonly label: "Low";
        readonly color: "#90EE90";
    };
    readonly medium: {
        readonly value: "medium";
        readonly label: "Medium";
        readonly color: "#FFD700";
    };
    readonly high: {
        readonly value: "high";
        readonly label: "High";
        readonly color: "#FF4500";
    };
};
export declare const ZONE_DENSITY_THRESHOLDS: {
    readonly low: 5;
    readonly medium: 15;
    readonly high: 50;
};
export declare const TIME_PERIODS: {
    readonly MORNING: {
        readonly start: 6;
        readonly end: 12;
        readonly label: "Morning (6 AM - 12 PM)";
    };
    readonly AFTERNOON: {
        readonly start: 12;
        readonly end: 18;
        readonly label: "Afternoon (12 PM - 6 PM)";
    };
    readonly EVENING: {
        readonly start: 18;
        readonly end: 21;
        readonly label: "Evening (6 PM - 9 PM)";
    };
    readonly NIGHT: {
        readonly start: 21;
        readonly end: 6;
        readonly label: "Night (9 PM - 6 AM)";
    };
};
export declare const SENSITIVE_ZONE_TYPES: readonly ["school", "hospital", "market", "government", "religious", "other"];
export declare const DEFAULT_SENSITIVE_ZONES: ({
    id: string;
    name: string;
    type: "school";
    latitude: number;
    longitude: number;
    radius: number;
} | {
    id: string;
    name: string;
    type: "hospital";
    latitude: number;
    longitude: number;
    radius: number;
} | {
    id: string;
    name: string;
    type: "market";
    latitude: number;
    longitude: number;
    radius: number;
})[];
export declare const USER_ROLES: {
    readonly ANALYST: "analyst";
    readonly OFFICER: "officer";
    readonly ADMIN: "admin";
};
export declare const MAP_CONFIG: {
    readonly defaultZoom: 12;
    readonly minZoom: 8;
    readonly maxZoom: 18;
    readonly defaultCenter: {
        readonly lat: 28.7041;
        readonly lng: 77.1025;
    };
    readonly tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
};
export declare const PAGINATION: {
    readonly PAGE_SIZE: 20;
    readonly MAX_RECORDS: 10000;
};
export declare const API_ENDPOINTS: {
    readonly FIR: "/api/fir";
    readonly HOTSPOT: "/api/hotspot";
    readonly INSIGHTS: "/api/insights";
    readonly RECOMMENDATIONS: "/api/recommendations";
    readonly EXPORT: "/api/export";
    readonly AUTH: "/api/auth";
};
//# sourceMappingURL=constants.d.ts.map