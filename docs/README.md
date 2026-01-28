# Solveo Dashboard - Angular Frontend Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Documentation Index](#documentation-index)

## 🎯 Overview

The Solveo Dashboard is a modern Angular 18 application designed for comprehensive business analytics and performance monitoring. It provides real-time insights into metrics, regional performance, channel analytics, keyword tracking, and intelligent alerting.

### Key Features

- **Executive Dashboard**: Real-time KPI monitoring with MRR growth, traffic trends, and conversion funnels
- **Keyword Analytics**: Year-over-year keyword performance tracking with AI overview impact analysis
- **Regional Performance**: Multi-level geographic performance metrics with time-based aggregation
- **Channel Analytics**: Detailed channel performance metrics with monthly breakdowns
- **Intelligent Alerts**: Severity-based alert system with multiple alert types
- **Responsive Design**: Fully responsive UI with dynamic table sizing and mobile optimization
- **Advanced Filtering**: Multi-criteria filtering with debounced search across all views

## 🛠 Technology Stack

### Core Framework
- **Angular**: 18.2.0 (Standalone Components)
- **TypeScript**: 5.5.2
- **RxJS**: 7.8.0

### UI Components & Styling
- **Angular Material**: 18.2.14 (Tables, Forms, Buttons, Icons)
- **Angular CDK**: 18.2.14
- **Chart.js**: 4.4.0 (with ng2-charts 6.0.1)

### Development Tools
- **Angular CLI**: 18.2.1
- **Jasmine & Karma**: Testing framework
- **TypeScript Strict Mode**: Enabled for type safety

### Build Configuration
- **Target**: ES2022
- **Module System**: ES2022
- **Bundler**: Angular DevKit Build Angular

## 📁 Project Structure

```
SolveoDashboardAssignment.Web/
├── src/
│   ├── app/
│   │   ├── core/                      # Core application modules
│   │   │   ├── layout/                # Layout components
│   │   │   │   └── header/            # Navigation header
│   │   │   ├── models/                # TypeScript interfaces & types
│   │   │   │   ├── alerts.models.ts
│   │   │   │   ├── channel-aggregated-metrics.ts
│   │   │   │   ├── channel-monthly-metrics.ts
│   │   │   │   ├── common.models.ts
│   │   │   │   ├── dashboard.models.ts
│   │   │   │   ├── metrics.models.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/              # Application services
│   │   │   │   ├── alerts.service.ts
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── http-error.interceptor.ts
│   │   │   │   ├── metrics.service.ts
│   │   │   │   └── index.ts
│   │   │   └── utils/                 # Utility functions
│   │   │       └── http-params.util.ts
│   │   ├── features/                  # Feature modules
│   │   │   ├── alerts/                # Alerts view
│   │   │   ├── channels/              # Channels analytics
│   │   │   ├── dashboard/             # Main dashboard
│   │   │   ├── keywords/              # Keyword performance
│   │   │   └── regions/               # Regional analytics
│   │   ├── shared/                    # Shared components
│   │   │   └── components/
│   │   │       ├── alert-badge/       # Alert display component
│   │   │       ├── data-table/        # Reusable table component
│   │   │       ├── funnel-chart/      # Conversion funnel chart
│   │   │       ├── line-chart/        # Line chart component
│   │   │       └── metric-card/       # KPI card component
│   │   ├── app.component.ts           # Root component
│   │   ├── app.config.ts              # Application configuration
│   │   └── app.routes.ts              # Route definitions
│   ├── environments/                  # Environment configurations
│   ├── styles/                        # Global styles
│   │   ├── animations.css
│   │   ├── mixins.css
│   │   └── variables.css
│   ├── index.html                     # Main HTML file
│   ├── main.ts                        # Application entry point
│   └── styles.css                     # Global styles
├── docs/                              # Documentation
├── plans/                             # Architecture & planning docs
├── angular.json                       # Angular CLI configuration
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # Project readme
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v18.2.1)

### Installation

```bash
# Navigate to the project directory
cd SolveoDashboardAssignment.Web

# Install dependencies
npm install

# Start development server
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`

### Build

```bash
# Development build
npm run build

# Production build
ng build --configuration production
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
ng test --code-coverage
```

## 🏗 Architecture

### Design Patterns

#### Standalone Components
All components use Angular's standalone component architecture, eliminating the need for NgModules and improving tree-shaking.

#### Reactive Programming
Extensive use of RxJS observables for asynchronous data handling and state management.

#### OnPush Change Detection
Performance-optimized components using `ChangeDetectionStrategy.OnPush` where applicable.

#### Service Layer Pattern
Clear separation between presentation (components) and business logic (services).

### Key Architectural Decisions

1. **Lazy Loading**: All feature routes use lazy loading for optimal initial load performance
2. **HTTP Interceptors**: Global error handling via functional HTTP interceptor
3. **Type Safety**: Strict TypeScript configuration with comprehensive interfaces
4. **Responsive Design**: Mobile-first approach with dynamic layout adjustments
5. **Modular Structure**: Clear separation of core, features, and shared modules

### Data Flow

```
Component → Service → HTTP Client → API
    ↓
Observable Stream
    ↓
Component (Subscribe)
    ↓
Template (Async Pipe / Direct Binding)
```

### State Management

The application uses component-level state management with:
- Local component state for UI concerns
- Service-based state for shared data
- RxJS BehaviorSubjects for reactive state updates

## 📚 Documentation Index

### Core Documentation
- **[Folder Structure](./FOLDER-STRUCTURE.md)** - Detailed folder organization and conventions
- **[Models & Interfaces](./MODELS.md)** - Complete TypeScript interface reference
- **[Services](./SERVICES.md)** - Service layer documentation with API endpoints
- **[Components](./COMPONENTS.md)** - Component reference with inputs/outputs

### Feature Documentation
- **[Dashboard Component](./components/DASHBOARD.md)** - Main dashboard implementation
- **[Keywords Component](./components/KEYWORDS.md)** - Keyword analytics
- **[Regions Component](./components/REGIONS.md)** - Regional performance
- **[Channels Component](./components/CHANNELS.md)** - Channel analytics
- **[Alerts Component](./components/ALERTS.md)** - Alert management

### Shared Components
- **[Metric Card](./components/METRIC-CARD.md)** - KPI display component
- **[Line Chart](./components/LINE-CHART.md)** - Chart.js line chart wrapper
- **[Funnel Chart](./components/FUNNEL-CHART.md)** - Conversion funnel visualization
- **[Data Table](./components/DATA-TABLE.md)** - Reusable table component
- **[Alert Badge](./components/ALERT-BADGE.md)** - Alert display badge

## 🔧 Configuration

### Environment Variables

Located in [`src/environments/environment.ts`](../src/environments/environment.ts):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### Angular Configuration

Key settings in [`angular.json`](../angular.json):
- Output path: `dist/solveo-dashboard-assignment.web`
- Budget limits: 500kB warning, 1MB error
- Material theme: Azure Blue
- Source maps enabled in development

### TypeScript Configuration

Strict mode enabled with:
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

## 🎨 Styling

### CSS Architecture

- **Global Styles**: [`src/styles.css`](../src/styles.css)
- **CSS Variables**: [`src/styles/variables.css`](../src/styles/variables.css)
- **Animations**: [`src/styles/animations.css`](../src/styles/animations.css)
- **Mixins**: [`src/styles/mixins.css`](../src/styles/mixins.css)

### Material Theme

Using Angular Material's pre-built Azure Blue theme with custom overrides for dark mode support.

## 🔐 HTTP Error Handling

Global error interceptor ([`http-error.interceptor.ts`](../src/app/core/services/http-error.interceptor.ts)) handles:
- Network errors
- HTTP status codes (400, 401, 403, 404, 500, 503)
- User-friendly error messages
- Console logging for debugging

## 📊 Performance Optimizations

1. **Lazy Loading**: All routes lazy load their components
2. **OnPush Change Detection**: Used in performance-critical components
3. **TrackBy Functions**: Implemented in all `*ngFor` loops
4. **Debounced Search**: 300ms debounce on all search inputs
5. **Virtual Scrolling**: Ready for implementation with Angular CDK
6. **Dynamic Table Rows**: Viewport-based row calculation for optimal rendering

## 🧪 Testing

### Unit Tests

Each component includes a `.spec.ts` file with:
- Component creation tests
- Input/output validation
- Service interaction mocking
- Template rendering verification

### Running Tests

```bash
# Run all tests
ng test

# Run with coverage
ng test --code-coverage

# Run in headless mode (CI)
ng test --browsers=ChromeHeadless --watch=false
```

## 🚢 Deployment

### Production Build

```bash
ng build --configuration production
```

Output will be in `dist/solveo-dashboard-assignment.web/`

### Deployment Checklist

- [ ] Update environment.ts with production API URL
- [ ] Run production build
- [ ] Test build locally with `http-server dist/solveo-dashboard-assignment.web`
- [ ] Verify all routes work correctly
- [ ] Check console for errors
- [ ] Validate API connectivity

## 📝 Code Style & Conventions

### Naming Conventions

- **Components**: PascalCase with `.component.ts` suffix
- **Services**: PascalCase with `.service.ts` suffix
- **Interfaces**: PascalCase (e.g., `Alert`, `MetricsService`)
- **Files**: kebab-case (e.g., `alert-badge.component.ts`)

### Component Structure

```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [...],
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // when applicable
})
export class ComponentNameComponent implements OnInit {
  // Inputs
  @Input() data: Type;
  
  // Outputs
  @Output() event = new EventEmitter<Type>();
  
  // Public properties
  publicProperty: Type;
  
  // Private properties
  private privateProperty: Type;
  
  // Constructor
  constructor(private service: Service) {}
  
  // Lifecycle hooks
  ngOnInit(): void {}
  
  // Public methods
  publicMethod(): void {}
  
  // Private methods
  private privateMethod(): void {}
}
```

## 🤝 Contributing

### Development Workflow

1. Create feature branch from `main`
2. Implement changes with tests
3. Run linter and tests
4. Submit pull request
5. Code review
6. Merge to main

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For questions or issues, please contact the development team.

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Angular Version**: 18.2.0
