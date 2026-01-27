# Project Structure

SafeCity MVP is organized into the following directories:

```
src/
├── components/          # React components
│   ├── Dashboard/       # User dashboard views
│   ├── DataIngestion/   # File upload and data import
│   ├── Filters/         # Filter controls
│   ├── Hotspots/        # Hotspot visualization
│   ├── Insights/        # Crime insights display
│   ├── Map/             # Interactive map
│   ├── Recommendations/ # Patrol recommendations
│   ├── Reports/         # Export and reporting
│   └── Zones/           # Accident and sensitive zones
├── services/            # Business logic and API integration
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── config/              # Configuration and constants
└── App.tsx             # Main application component

data/
└── sample-fir-dataset.csv    # Preloaded historical FIR data
```
