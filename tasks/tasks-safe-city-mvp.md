# SafeCity MVP - Task List

## Relevant Files

### Core Application Files
- `src/App.tsx` - Main application component and routing
- `src/App.test.tsx` - Unit tests for App component
- `src/types/index.ts` - TypeScript type definitions for FIR, hotspot, and user data
- `src/config/constants.ts` - Configuration constants (crime types, zones, API endpoints)

### FIR Data Management
- `src/services/firService.ts` - Service for FIR data operations (upload, fetch, validate)
- `src/services/firService.test.ts` - Unit tests for firService
- `src/components/DataIngestion/FileUpload.tsx` - File upload component for CSV/Excel
- `src/components/DataIngestion/FileUpload.test.tsx` - Tests for FileUpload component
- `src/utils/csvParser.ts` - CSV/Excel parsing utilities
- `src/utils/csvParser.test.ts` - Tests for CSV parser
- `src/utils/validation.ts` - Data validation utilities for FIR records
- `src/utils/validation.test.ts` - Tests for validation utilities
- `data/sample-fir-dataset.csv` - Preloaded historical FIR dataset

### Interactive Crime Map
- `src/components/Map/CrimeMap.tsx` - Main interactive map component
- `src/components/Map/CrimeMap.test.tsx` - Tests for CrimeMap component
- `src/components/Map/MapMarker.tsx` - Individual crime incident marker component
- `src/components/Map/Heatmap.tsx` - Heatmap visualization component
- `src/services/mapService.ts` - Map-related utilities and calculations
- `src/services/mapService.test.ts` - Tests for mapService

### Filtering & Search
- `src/components/Filters/FilterPanel.tsx` - Filter controls component
- `src/components/Filters/FilterPanel.test.tsx` - Tests for FilterPanel
- `src/services/filterService.ts` - Logic for applying filters to FIR data
- `src/services/filterService.test.ts` - Tests for filterService
- `src/hooks/useFilters.ts` - React hook for filter state management
- `src/hooks/useFilters.test.ts` - Tests for useFilters hook

### Hotspot Detection & Analysis
- `src/services/hotspotService.ts` - Hotspot detection algorithm and analysis
- `src/services/hotspotService.test.ts` - Tests for hotspotService
- `src/components/Hotspots/HotspotLayer.tsx` - Hotspot visualization layer on map
- `src/components/Hotspots/HotspotLegend.tsx` - Legend for hotspot severity levels
- `src/utils/geoUtils.ts` - Geospatial utility functions (zoning, distance calculations)
- `src/utils/geoUtils.test.ts` - Tests for geoUtils

### Pattern Insights & Recommendations
- `src/services/insightService.ts` - Generate insights and trends
- `src/services/insightService.test.ts` - Tests for insightService
- `src/components/Insights/InsightPanel.tsx` - Display peak hours, crime types, trends
- `src/components/Insights/InsightPanel.test.tsx` - Tests for InsightPanel
- `src/components/Insights/PatternChart.tsx` - Charts for time-based patterns
- `src/components/Recommendations/RecommendationPanel.tsx` - Patrol recommendations display
- `src/components/Recommendations/RecommendationPanel.test.tsx` - Tests for RecommendationPanel

### Accident & Sensitive Zone Monitoring
- `src/services/accidentService.ts` - Accident data and analysis service
- `src/services/accidentService.test.ts` - Tests for accidentService
- `src/components/Zones/SensitiveZoneLayer.tsx` - Sensitive zone visualization
- `src/components/Zones/AccidentAnalysis.tsx` - Accident-specific analysis and trends
- `src/components/Zones/AccidentAnalysis.test.tsx` - Tests for AccidentAnalysis
- `src/config/sensitiveZones.ts` - Configuration for pre-defined sensitive zones

### Reports & Export
- `src/services/exportService.ts` - CSV and PDF export logic
- `src/services/exportService.test.ts` - Tests for exportService
- `src/components/Reports/ExportModal.tsx` - Export options modal
- `src/components/Reports/ExportModal.test.tsx` - Tests for ExportModal
- `src/utils/pdfGenerator.ts` - PDF report generation utilities
- `src/utils/pdfGenerator.test.ts` - Tests for pdfGenerator

### Role-Based Dashboard
- `src/components/Dashboard/AnalystDashboard.tsx` - Analyst-focused dashboard view
- `src/components/Dashboard/AnalystDashboard.test.tsx` - Tests for AnalystDashboard
- `src/components/Dashboard/OfficerDashboard.tsx` - Officer/Admin-focused dashboard view
- `src/components/Dashboard/OfficerDashboard.test.tsx` - Tests for OfficerDashboard
- `src/components/Dashboard/AdminDashboard.tsx` - Administrator dashboard view
- `src/components/Dashboard/AdminDashboard.test.tsx` - Tests for AdminDashboard
- `src/services/authService.ts` - User authentication and role management
- `src/services/authService.test.ts` - Tests for authService
- `src/hooks/useAuth.ts` - React hook for auth state management

### Configuration & Setup
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest testing configuration
- `.env.example` - Environment variables template
- `README.md` - Project setup and usage documentation

### Notes

- Unit tests should be placed alongside the code files they test (e.g., `Component.tsx` and `Component.test.tsx` in the same directory).
- Use `npm test` to run all tests, or `npm test -- [path]` to run specific test files.
- All API calls should be abstracted in service files for easy mocking during tests.
- Consider using React Context API or Redux for global state management (filters, user auth).
- Use a mapping library like Leaflet or Mapbox for interactive map functionality.
- For CSV/Excel parsing, consider using libraries like `papaparse` or `xlsx`.
- For PDF generation, consider using `pdfkit` or `html2pdf`.

---

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/safe-city-mvp`)

- [ ] 1.0 Set up project structure & dependencies
  - [ ] 1.1 Initialize Node.js project with package.json and install base dependencies (React, TypeScript, testing libraries)
  - [ ] 1.2 Configure TypeScript with tsconfig.json for strict type checking
  - [ ] 1.3 Set up Jest and React Testing Library for unit testing
  - [ ] 1.4 Create project folder structure (src/components, src/services, src/utils, src/hooks, src/config, src/types, data)
  - [ ] 1.5 Create type definitions file (types/index.ts) with FIR, Hotspot, User, and Filter interfaces
  - [ ] 1.6 Create constants file with crime types, severity levels, zone definitions, and API endpoints
  - [ ] 1.7 Set up environment variables (.env.example and .env.local for development)
  - [ ] 1.8 Configure linting and code formatting (ESLint, Prettier)

- [ ] 2.0 Implement FIR data ingestion & management
  - [ ] 2.1 Create CSV/Excel parser utility (csvParser.ts) to extract FIR records from uploaded files
  - [ ] 2.2 Create data validation utility (validation.ts) to check for required fields (ID, crime type, date, latitude, longitude)
  - [ ] 2.3 Build FileUpload component with drag-and-drop support and file type validation
  - [ ] 2.4 Create FIR service (firService.ts) for managing FIR data operations (add, fetch, update, delete)
  - [ ] 2.5 Create or mock preloaded historical FIR dataset (sample-fir-dataset.csv)
  - [ ] 2.6 Implement in-memory or local database storage for FIR records (or integrate backend API)
  - [ ] 2.7 Add error handling and user feedback for data validation failures
  - [ ] 2.8 Write unit tests for CSV parser, validation, and FIR service

- [ ] 3.0 Build interactive crime mapping system
  - [ ] 3.1 Set up mapping library (Leaflet or Mapbox) and create base map component (CrimeMap.tsx)
  - [ ] 3.2 Implement map marker component (MapMarker.tsx) to display individual FIR records as points
  - [ ] 3.3 Add zoom and pan functionality to the map
  - [ ] 3.4 Implement click-on-marker functionality to display FIR details in a popup or sidebar
  - [ ] 3.5 Create heatmap visualization component (Heatmap.tsx) to show crime density
  - [ ] 3.6 Implement toggle between point view and heatmap view
  - [ ] 3.7 Add map styling and color coding for different crime types
  - [ ] 3.8 Create map service utility (mapService.ts) for map-related calculations and helpers
  - [ ] 3.9 Write unit tests for map components and mapService

- [ ] 4.0 Develop filtering & search functionality
  - [ ] 4.1 Create FilterPanel component with filter controls for date range, crime type, and area/zone
  - [ ] 4.2 Build useFilters React hook for centralized filter state management
  - [ ] 4.3 Create filter service (filterService.ts) to apply filter logic to FIR data
  - [ ] 4.4 Implement real-time map updates when filters are changed
  - [ ] 4.5 Add filter reset and clear all functionality
  - [ ] 4.6 Implement search by FIR ID, area name, or police station
  - [ ] 4.7 Add filter persistence (optional: save filters to localStorage)
  - [ ] 4.8 Write unit tests for FilterPanel component, useFilters hook, and filterService

- [ ] 5.0 Create hotspot detection & analysis
  - [ ] 5.1 Create geospatial utility functions (geoUtils.ts) for zone/grid calculations and distance metrics
  - [ ] 5.2 Implement hotspot detection algorithm (hotspotService.ts) to calculate FIR density per zone
  - [ ] 5.3 Create zone classification logic (low, medium, high crime severity)
  - [ ] 5.4 Build HotspotLayer component to visualize hotspots on the map with color coding
  - [ ] 5.5 Create HotspotLegend component to display severity levels and color meanings
  - [ ] 5.6 Implement dynamic hotspot recalculation when filters change
  - [ ] 5.7 Add tooltips to hotspot zones showing FIR count, percentage, and severity
  - [ ] 5.8 Write unit tests for geoUtils, hotspotService, and hotspot visualization components

- [ ] 6.0 Generate pattern insights & recommendations
  - [ ] 6.1 Create insight service (insightService.ts) to analyze:
        - Peak crime hours (hour-wise distribution)
        - Day-wise crime distribution
        - Most frequent crime types
        - Time-based trends (daily, weekly patterns)
  - [ ] 6.2 Build InsightPanel component to display insights as text summaries and basic charts (bar/line)
  - [ ] 6.3 Create PatternChart component for visualizing trends (use chart library like Chart.js or Recharts)
  - [ ] 6.4 Implement recommendation generation logic based on hotspots and time patterns
  - [ ] 6.5 Create RecommendationPanel component to display advisory patrol recommendations in text format
  - [ ] 6.6 Ensure recommendations are clear, specific, and actionable (e.g., "Increase night patrols in Zone B between 8 PM – 11 PM")
  - [ ] 6.7 Update insights and recommendations in real-time based on filter changes
  - [ ] 6.8 Write unit tests for insightService and insight/recommendation components

- [ ] 7.0 Build accident & sensitive zone monitoring
  - [ ] 7.1 Extend FIR type definition to include accident tags and sensitive zone flags
  - [ ] 7.2 Create accident service (accidentService.ts) for accident data analysis and trend calculation
  - [ ] 7.3 Create sensitive zone configuration file with pre-defined zones (schools, hospitals, markets)
  - [ ] 7.4 Build SensitiveZoneLayer component to visualize sensitive zones on the map with boundary outlines
  - [ ] 7.5 Create AccidentAnalysis component to display accident-specific insights and time-based trends
  - [ ] 7.6 Implement filtering and analysis specific to accident-tagged FIRs
  - [ ] 7.7 Add visual indicators on the map for accident hotspots and sensitive zones
  - [ ] 7.8 Write unit tests for accidentService and zone-related components

- [ ] 8.0 Implement reports & export functionality
  - [ ] 8.1 Create export service (exportService.ts) with CSV export logic for filtered FIR data
  - [ ] 8.2 Create PDF generator utility (pdfGenerator.ts) to generate summary reports with:
        - Data summary table
        - Hotspot analysis
        - Insights and trends
        - Patrol recommendations
  - [ ] 8.3 Build ExportModal component with export format options (CSV, PDF)
  - [ ] 8.4 Implement CSV export: include FIR ID, crime type, date, location, area, severity
  - [ ] 8.5 Implement PDF export: generate readable reports with charts and summaries
  - [ ] 8.6 Add timestamp and metadata to exported files
  - [ ] 8.7 Test CSV export for proper formatting and data integrity
  - [ ] 8.8 Test PDF export for visual quality and readability
  - [ ] 8.9 Write unit tests for exportService and pdfGenerator utilities

- [ ] 9.0 Add role-based dashboard views
  - [ ] 9.1 Create basic authentication service (authService.ts) with user roles (analyst, officer, admin)
  - [ ] 9.2 Build useAuth React hook for managing user authentication state
  - [ ] 9.3 Create AnalystDashboard component focused on trends, data exploration, and detailed insights
  - [ ] 9.4 Create OfficerDashboard component focused on hotspots and actionable patrol recommendations
  - [ ] 9.5 Create AdminDashboard component focused on sensitive zone monitoring and resource allocation overview
  - [ ] 9.6 Implement role-based access control to show/hide relevant features based on user role
  - [ ] 9.7 Implement role-based data summarization (e.g., analysts see raw data, officers see summaries)
  - [ ] 9.8 Add user login/logout functionality with role selection (for MVP, can be mock authentication)
  - [ ] 9.9 Create dashboard layout with responsive design for different screen sizes
  - [ ] 9.10 Write unit tests for auth service and dashboard components

---

## Implementation Notes

1. **State Management:** Consider using React Context API for global state (filters, user auth, FIR data) or Redux for more complex scenarios.

2. **Data Persistence:** For MVP, use in-memory storage or localStorage. For production, integrate a backend database (PostgreSQL with PostGIS for geospatial queries).

3. **Testing Strategy:**
   - Unit tests for all services and utilities
   - Component tests for UI interactions
   - Integration tests for filter-map-hotspot workflows
   - E2E tests for complete user journeys (optional for MVP)

4. **Code Quality:**
   - Maintain >80% code coverage for services
   - Use TypeScript strictly to catch type errors early
   - Follow naming conventions and component structure guidelines
   - Document complex algorithms (especially hotspot detection and geospatial logic)

5. **Performance Considerations:**
   - For large FIR datasets (>10K records), consider pagination and lazy loading
   - Optimize heatmap rendering with clustering
   - Debounce filter updates to prevent excessive re-renders

6. **Dependencies to Install:**
   ```bash
   npm install react react-dom typescript
   npm install react-router-dom axios
   npm install leaflet (or mapbox)
   npm install recharts (for charts)
   npm install papaparse xlsx (for CSV/Excel parsing)
   npm install html2pdf pdfkit (for PDF export)
   npm install --save-dev @testing-library/react jest @testing-library/jest-dom
   npm install --save-dev eslint prettier
   ```

7. **Recommended File Structure:**
   ```
   src/
   ├── components/
   │   ├── Dashboard/
   │   ├── DataIngestion/
   │   ├── Filters/
   │   ├── Hotspots/
   │   ├── Insights/
   │   ├── Map/
   │   ├── Recommendations/
   │   ├── Reports/
   │   └── Zones/
   ├── services/
   ├── utils/
   ├── hooks/
   ├── types/
   ├── config/
   ├── App.tsx
   └── index.tsx
   data/
   └── sample-fir-dataset.csv
   ```

---

**End of Task List**
