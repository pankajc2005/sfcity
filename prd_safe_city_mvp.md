# Product Requirements Document (PRD)

## Product Name
**SafeCity – Smart Crime Mapping & Patrol Decision Support (MVP)**

---

## 1. Overview

SafeCity is a data-driven crime analysis platform designed to help law enforcement agencies **visualize crime data, identify hotspots, and make informed patrol deployment decisions** using FIR (First Information Report) data.

The MVP focuses on **clarity, usability, and trust**, providing descriptive insights rather than automated or opaque AI decisions. The system supports multiple stakeholders, including police analysts, senior officers, and city administrators.

---

## 2. Goals

The goals of the SafeCity MVP are:

1. Enable clear visualization of FIR-based crime data on a city map.
2. Accurately identify crime hotspots based on historical data.
3. Reduce manual effort required to analyze crime trends.
4. Support patrol planning decisions using data-backed insights.
5. Lay a strong foundation for future AI/ML enhancements.

---

## 3. Target Users

The MVP is designed for a **mixed user group**:

- **Police Analysts** – Analyze trends and hotspots
- **Senior Officers** – Decide patrol focus and resource allocation
- **City Administrators** – Monitor safety and sensitive zones

All users interact with the same dashboard but may focus on different insights.

---

## 4. User Stories

1. **As a police analyst**, I want to view crime incidents on a map so that I can quickly identify high-crime areas.
2. **As a senior officer**, I want to see crime hotspots by time and category so that I can plan patrols effectively.
3. **As an administrator**, I want to monitor accident-prone and sensitive areas to improve public safety planning.
4. **As a user**, I want to filter crime data by date and type so that I can focus on relevant patterns.

---

## 5. Functional Requirements

### 5.1 FIR Data Management

1. The system must support FIR data ingestion from:
   - Manually uploaded CSV/Excel files
   - Preloaded historical datasets
   - External APIs (assumed but mocked in MVP)
2. Each FIR record must include:
   - FIR ID
   - Crime type
   - Date and time
   - Latitude and longitude
   - Area/zone
   - Police station
   - Optional tags (accident, sensitive zone)

---

### 5.2 Crime Mapping

3. The system must display FIR records on an interactive city map.
4. FIRs must be visualized as points and/or heatmaps.
5. Users must be able to zoom and pan the map.

---

### 5.3 Filters & Controls

6. Users must be able to filter data by:
   - Date range
   - Crime type
   - Area/zone
7. Filters must update the map and insights in real time.

---

### 5.4 Hotspot Identification

8. The system must divide the city into logical zones or grids.
9. The system must calculate FIR density per zone.
10. Zones must be classified as low, medium, or high crime.
11. High-crime zones must be visually highlighted on the map.

---

### 5.5 Pattern Insights

12. The system must generate basic descriptive insights, including:
    - Peak crime hours
    - Most frequent crime types
    - Day-wise or time-wise trends
13. Insights must be shown as simple charts or text summaries.

---

### 5.6 Patrol Recommendations

14. The system must generate **text-based patrol recommendations** based on:
    - Hotspots
    - Time-based patterns
15. Recommendations must be advisory, not automated commands.

Example:
> "Increase night patrols in Zone B between 8 PM – 11 PM."

---

### 5.7 Reporting

16. Users must be able to export filtered data and insights as:
    - CSV
    - PDF reports

---

## 6. Non-Goals (Out of Scope)

The MVP will **not** include:

- Real-time CCTV or video feeds
- Facial recognition or individual-level predictions
- Public or citizen-facing dashboards
- Automated patrol routing
- Advanced deep learning models
- Mobile applications

---

## 7. Design Considerations

- Clean, map-first dashboard layout
- Color-coded hotspots for clarity
- Simple charts (bar/line) for trends
- Focus on explainability over complexity

Mockups are optional but recommended before implementation.

---

## 8. Technical Considerations

- Backend must support geospatial queries
- Data processing should be batch-based for MVP
- Architecture should allow future ML model integration
- Access control and authentication can be basic

---

## 9. Success Metrics

The MVP will be considered successful if:

1. Hotspots identified align with historical crime concentration.
2. Users report reduced manual analysis effort.
3. Patrol decisions can be directly derived from system insights.
4. Stakeholders trust and regularly use the dashboard.

---

## 10. Open Questions

1. Exact city zoning strategy (grid vs administrative zones)
2. Frequency of FIR data updates
3. User role-based access control depth
4. Data privacy and compliance requirements

---

**End of PRD**