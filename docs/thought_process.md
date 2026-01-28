# ThoughtProcess.md – Frontend Development

## Dashboard Design Decisions

The frontend was designed to build a **reporting dashboard** for an AI coding assistant SaaS company, visualizing marketing and sales data with an emphasis on surfacing insights automatically, especially problem areas.

### 1. Executive Summary
- Key metrics for the last month are displayed prominently:
  - **Website Traffic**
  - **Trial-to-Paid Rate**
  - **Paid Conversions**
  - **Churn Rate**
  - **Monthly Recurring Revenue (MRR)**
- This gives users **a quick overview** of business performance without diving into tables.

### 2. Graphs and Visualizations
- **Website Traffic Over Time** – line chart showing monthly trends.
- **MRR Growth** – line chart for the last 12 months.
- **Conversion Funnel** – visual representation:  
  `Website Traffic → Unique Signups → Trials Started → Paid Conversions`
- These charts provide **trend analysis** and highlight areas of concern immediately.

### 3. Summary Tables
- **Top Keywords Table** – limited columns for quick insight.
- **Regional Performance Table** – averages per region.
- **Channel Performance Table** – averages per channel.
- **Sortable Columns** – users can reorder data to focus on key metrics.
- **Reasoning:** Full data is available on respective pages, while the dashboard shows a **high-level snapshot**.

### 4. Alerts Section
- Alerts are grouped by **severity in tabs** (red flags, warnings, etc.).
- Users can quickly see **problem areas** flagged by the system.

---

## Page Design

### Keywords Page
- Displays **full keyword data**.
- Features:
  - Sortable columns
  - Search field
  - Filters by category and AI overview
  - Pagination (10, 25, 50, 100 records)

### Regions Page
- Shows **regional metrics**.
- Features:
  - Sortable columns
  - Search field
  - Filters by region, country, city
  - Average calculations for last 3, 6, 9, or 12 months
  - Pagination (10, 25, 50, 100 records)

### Channels Page
- Shows **monthly channel metrics**.
- Features:
  - Sortable columns
  - Search field
  - Filters by year, month, or channel
  - Pagination (10, 25, 50, 100 records)

### Alerts Page
- Displays **all detected alerts**.
- Features:
  - Sortable columns
  - Search field
  - Filters by alert category
  - Pagination (10, 25, 50, 100 records)
  - Severity filter with colors indicating alert level and counts

---

## Frontend Requirements Addressed

- **Executive summary with key metrics** (MRR, signups, churn)
- **Line charts for trends over time**
- **Funnel visualization** (traffic → signup → trial → paid)
- **Filterable/sortable tables** for keywords, regions, channels
- **Geographic breakdown** (region/country/city drill-down)
- **Alerts/highlights** for problem areas (low conversion, declining metrics, wasted traffic)

---

## Technical Decisions

- **Angular 18** – chosen for modern standalone components and reactive programming.
- **RxJS Observables** – asynchronous data fetching and state management.
- **OnPush Change Detection** – performance optimization for dashboards with multiple tables and charts.
- **Angular Material** – provides consistent, responsive UI elements.
- **Charts** – Chart.js with ng2-charts for line charts and funnel visualization.
- **Tables** – Material tables with sorting, filtering, pagination.
- **Reusable Components** – KPI cards, charts, tables, and alert badges for maintainability.
- **Lazy Loading** – all feature modules are lazy-loaded to improve initial load performance.
- **Debounced Search** – 300ms debounce on all search fields to reduce unnecessary API calls.
- **TrackBy Functions** – optimized table rendering for large datasets.

---

## Workflow & Tools

- Developed and documented using **Kilo code** methodology, following the task description.
- Project follows a **modular, maintainable structure**, keeping dashboard snapshots separate from full data views.
- Frontend integrates smoothly with backend services for metrics, keywords, regional, channel, and alert data.

---

## Reasoning Summary

The chosen structure ensures:

- Users can **get a high-level view quickly** (dashboard).
- Detailed data is accessible **on dedicated pages** with full filtering and pagination.
- The dashboard emphasizes **insights and problem areas** rather than overwhelming with raw data.
- Frontend is **performant, maintainable, and responsive**, meeting the expectations in the task description.

