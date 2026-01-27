// Crime Types
export const CRIME_TYPES = [
  'Theft',
  'Assault',
  'Robbery',
  'Burglary',
  'Fraud',
  'DUI',
  'Vandalism',
  'Traffic Violation',
  'Drug-related',
  'Domestic Violence',
  'Accident',
  'Other',
] as const;

// Severity Levels
export const SEVERITY_LEVELS = {
  low: { value: 'low', label: 'Low', color: '#90EE90' },
  medium: { value: 'medium', label: 'Medium', color: '#FFD700' },
  high: { value: 'high', label: 'High', color: '#FF4500' },
} as const;

// Zone Configuration
export const ZONE_DENSITY_THRESHOLDS = {
  low: 5,
  medium: 15,
  high: 50,
} as const;

// Time Periods for Analysis
export const TIME_PERIODS = {
  MORNING: { start: 6, end: 12, label: 'Morning (6 AM - 12 PM)' },
  AFTERNOON: { start: 12, end: 18, label: 'Afternoon (12 PM - 6 PM)' },
  EVENING: { start: 18, end: 21, label: 'Evening (6 PM - 9 PM)' },
  NIGHT: { start: 21, end: 6, label: 'Night (9 PM - 6 AM)' },
} as const;

// Sensitive Zone Types
export const SENSITIVE_ZONE_TYPES = [
  'school',
  'hospital',
  'market',
  'government',
  'religious',
  'other',
] as const;

// Default Sensitive Zones (can be extended)
export const DEFAULT_SENSITIVE_ZONES = [
  {
    id: 'school-1',
    name: 'Central Public School',
    type: 'school' as const,
    latitude: 28.5355,
    longitude: 77.3910,
    radius: 500,
  },
  {
    id: 'hospital-1',
    name: 'City Hospital',
    type: 'hospital' as const,
    latitude: 28.5355,
    longitude: 77.3910,
    radius: 800,
  },
  {
    id: 'market-1',
    name: 'Central Market',
    type: 'market' as const,
    latitude: 28.5355,
    longitude: 77.3910,
    radius: 1000,
  },
];

// User Roles
export const USER_ROLES = {
  ANALYST: 'analyst',
  OFFICER: 'officer',
  ADMIN: 'admin',
} as const;

// Map Settings
export const MAP_CONFIG = {
  defaultZoom: 12,
  minZoom: 8,
  maxZoom: 18,
  defaultCenter: { lat: 28.7041, lng: 77.1025 }, // Delhi, India
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
} as const;

// Pagination
export const PAGINATION = {
  PAGE_SIZE: 20,
  MAX_RECORDS: 10000,
} as const;

// API Endpoints (for future integration)
export const API_ENDPOINTS = {
  FIR: '/api/fir',
  HOTSPOT: '/api/hotspot',
  INSIGHTS: '/api/insights',
  RECOMMENDATIONS: '/api/recommendations',
  EXPORT: '/api/export',
  AUTH: '/api/auth',
} as const;
