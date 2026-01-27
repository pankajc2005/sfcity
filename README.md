# SafeCity MVP - Smart Crime Mapping & Patrol Decision Support

A data-driven crime analysis platform designed to help law enforcement agencies visualize crime data, identify hotspots, and make informed patrol deployment decisions using FIR (First Information Report) data.

## Project Overview

**SafeCity** is an MVP (Minimum Viable Product) that focuses on:
- ✅ Clarity and usability in crime visualization
- ✅ Trust through explainable insights
- ✅ Actionable patrol recommendations based on data
- ✅ Support for multiple stakeholders (analysts, officers, administrators)

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- TypeScript 5.0+
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SafeCity

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Available Scripts

```bash
# Development - Watch TypeScript compilation
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── Dashboard/       # User dashboard views (Analyst, Officer, Admin)
│   ├── DataIngestion/   # File upload and data import
│   ├── Filters/         # Filter controls and state management
│   ├── Hotspots/        # Crime hotspot visualization
│   ├── Insights/        # Crime insights and trends display
│   ├── Map/             # Interactive map component
│   ├── Recommendations/ # Patrol recommendations
│   ├── Reports/         # Export and reporting
│   └── Zones/           # Accident and sensitive zone management
├── services/            # Business logic and API integration
│   ├── firService.ts
│   ├── hotspotService.ts
│   ├── insightService.ts
│   ├── filterService.ts
│   ├── accidentService.ts
│   ├── exportService.ts
│   └── authService.ts
├── utils/               # Utility functions
│   ├── csvParser.ts
│   ├── validation.ts
│   ├── geoUtils.ts
│   └── pdfGenerator.ts
├── hooks/               # Custom React hooks
│   ├── useFilters.ts
│   └── useAuth.ts
├── types/               # TypeScript type definitions
├── config/              # Configuration and constants
└── App.tsx             # Main application component

data/
└── sample-fir-dataset.csv    # Preloaded historical FIR data
```

---

## Architecture & Design Patterns

### Data Flow
1. **FIR Data Ingestion** → CSV/Excel upload or preloaded dataset
2. **Data Validation** → Ensure required fields and data integrity
3. **Filtering & Analysis** → Apply user-selected filters
4. **Hotspot Calculation** → Grid-based density analysis
5. **Insight Generation** → Time-series and categorical analysis
6. **Visualization** → Map rendering and charts
7. **Export** → CSV and PDF generation

### Key Algorithms

#### Hotspot Detection (Grid-Based Density)
- **Algorithm:** Spatial grid clustering
- **Time Complexity:** O(n) where n = number of FIR records
- **Space Complexity:** O(zones) where zones = number of grid cells
- **Why:** Efficient for real-time updates and supports dynamic filtering

#### Insight Generation
- **Algorithm:** Time-series aggregation and categorical counting
- **Time Complexity:** O(n log n) for sorting + O(n) for aggregation
- **Why:** Provides quick pattern detection without complex ML

---

## Feature Implementation Timeline

### Phase 1: Core Setup ✓
- [x] Project initialization with React + TypeScript
- [x] Jest & testing configuration
- [x] Type definitions and constants
- [x] Git version control setup

### Phase 2: Data Management (In Progress)
- [ ] FIR CSV parser utility
- [ ] Data validation service
- [ ] File upload component
- [ ] In-memory data storage

### Phase 3: Visualization
- [ ] Interactive crime map (Leaflet)
- [ ] Point and heatmap rendering
- [ ] Map controls (zoom, pan)

### Phase 4: Analysis
- [ ] Hotspot detection algorithm
- [ ] Pattern insight generation
- [ ] Trend visualization

### Phase 5: Features
- [ ] Real-time filtering
- [ ] Patrol recommendations
- [ ] Accident monitoring
- [ ] Sensitive zone tracking

### Phase 6: Export & Reporting
- [ ] CSV export
- [ ] PDF report generation
- [ ] Data summarization

### Phase 7: Multi-User Support
- [ ] User authentication (mock)
- [ ] Role-based access control
- [ ] Role-specific dashboards

---

## Technology Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| **UI Framework** | React 19 | Component-based, ecosystem support |
| **Language** | TypeScript 5 | Type safety, better IDE support |
| **Testing** | Jest + RTL | Comprehensive test coverage, React-focused |
| **Mapping** | Leaflet (planned) | Lightweight, open-source, geospatial support |
| **Charts** | Recharts (planned) | React-native, responsive, customizable |
| **Parsing** | PapaParse (planned) | CSV/Excel parsing, streaming support |
| **Export** | PDFKit/html2pdf (planned) | PDF generation, flexible formatting |
| **State Management** | React Context API (planned) | Sufficient for MVP complexity |

---

## Code Quality Standards

- **Type Safety:** Strict TypeScript (`strict: true`)
- **Test Coverage:** Minimum 70% for services
- **Code Style:** ESLint + Prettier (planned)
- **Documentation:** JSDoc comments for complex functions
- **Commits:** Atomic, descriptive commit messages

---

## Development Guidelines

### Creating a New Component

```typescript
// src/components/Feature/FeatureComponent.tsx
import React from 'react';

interface FeatureComponentProps {
  title: string;
}

export const FeatureComponent: React.FC<FeatureComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Creating a Service

```typescript
// src/services/featureService.ts
export const featureService = {
  getData: async (id: string) => {
    // Implementation
  },
};
```

### Writing Tests

```typescript
// src/components/Feature/FeatureComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { FeatureComponent } from './FeatureComponent';

describe('FeatureComponent', () => {
  it('renders the title', () => {
    render(<FeatureComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## Known Limitations (MVP)

- Real-time data updates not implemented
- Authentication is mock-based
- Geospatial queries are client-side (not database optimized)
- Single-user per session
- No data persistence across sessions

---

## Future Enhancements

- [ ] Backend API integration
- [ ] Real-time FIR data streaming
- [ ] Machine learning-based hotspot prediction
- [ ] Mobile application
- [ ] Advanced RBAC system
- [ ] Data encryption and compliance (GDPR, etc.)
- [ ] Multi-language support
- [ ] CCTV integration
- [ ] Facial recognition (with consent)
- [ ] Predictive analytics

---

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make atomic commits with descriptive messages
3. Write tests for new functionality
4. Ensure tests pass: `npm test`
5. Submit a pull request

---

## License

MIT License - See LICENSE file for details

---

## Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Last Updated:** January 27, 2026
**Version:** 0.1.0 (MVP)
