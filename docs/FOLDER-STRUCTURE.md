# Folder Structure Documentation

## 📂 Complete Directory Structure

```
SolveoDashboardAssignment.Web/
├── .angular/                          # Angular cache (auto-generated)
├── .vscode/                           # VS Code workspace settings
├── docs/                              # 📚 Documentation files
│   ├── README.md                      # Main documentation index
│   ├── FOLDER-STRUCTURE.md            # This file
│   ├── MODELS.md                      # Models & interfaces reference
│   ├── SERVICES.md                    # Services documentation
│   ├── COMPONENTS.md                  # Components overview
│   └── components/                    # Individual component docs
│       ├── DASHBOARD.md
│       ├── KEYWORDS.md
│       ├── REGIONS.md
│       ├── CHANNELS.md
│       ├── ALERTS.md
│       ├── METRIC-CARD.md
│       ├── LINE-CHART.md
│       ├── FUNNEL-CHART.md
│       ├── DATA-TABLE.md
│       └── ALERT-BADGE.md
├── plans/                             # Architecture & planning documents
├── public/                            # Static assets
│   └── favicon.ico
├── screenshots/                       # Application screenshots
├── src/                               # 🎯 Source code
│   ├── app/                           # Application root
│   │   ├── core/                      # Core functionality (singleton services, models)
│   │   │   ├── layout/                # Layout components
│   │   │   │   └── header/
│   │   │   │       ├── header.component.ts
│   │   │   │       ├── header.component.html
│   │   │   │       └── header.component.css
│   │   │   ├── models/                # TypeScript interfaces & types
│   │   │   │   ├── alerts.models.ts
│   │   │   │   ├── channel-aggregated-metrics.ts
│   │   │   │   ├── channel-monthly-metrics.ts
│   │   │   │   ├── common.models.ts
│   │   │   │   ├── dashboard.models.ts
│   │   │   │   ├── metrics.models.ts
│   │   │   │   └── index.ts           # Barrel export
│   │   │   ├── services/              # Application services
│   │   │   │   ├── alerts.service.ts
│   │   │   │   ├── api.service.ts     # (Deprecated)
│   │   │   │   ├── http-error.interceptor.ts
│   │   │   │   ├── metrics.service.ts
│   │   │   │   └── index.ts           # Barrel export
│   │   │   └── utils/                 # Utility functions
│   │   │       └── http-params.util.ts
│   │   ├── features/                  # Feature modules (lazy-loaded)
│   │   │   ├── alerts/
│   │   │   │   ├── alerts.component.ts
│   │   │   │   ├── alerts.component.html
│   │   │   │   ├── alerts.component.css
│   │   │   │   └── alerts.component.spec.ts
│   │   │   ├── channels/
│   │   │   │   ├── channels.component.ts
│   │   │   │   ├── channels.component.html
│   │   │   │   ├── channels.component.css
│   │   │   │   └── channels.component.spec.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── dashboard.component.css
│   │   │   │   └── dashboard.component.spec.ts
│   │   │   ├── keywords/
│   │   │   │   ├── keywords.component.ts
│   │   │   │   ├── keywords.component.html
│   │   │   │   ├── keywords.component.css
│   │   │   │   └── keywords.component.spec.ts
│   │   │   └── regions/
│   │   │       ├── regions.component.ts
│   │   │       ├── regions.component.html
│   │   │       ├── regions.component.css
│   │   │       └── regions.component.spec.ts
│   │   ├── shared/                    # Shared/reusable components
│   │   │   └── components/
│   │   │       ├── alert-badge/
│   │   │       │   ├── alert-badge.component.ts
│   │   │       │   ├── alert-badge.component.html
│   │   │       │   └── alert-badge.component.css
│   │   │       ├── data-table/
│   │   │       │   ├── data-table.component.ts
│   │   │       │   ├── data-table.component.html
│   │   │       │   └── data-table.component.css
│   │   │       ├── funnel-chart/
│   │   │       │   ├── funnel-chart.component.ts
│   │   │       │   ├── funnel-chart.component.html
│   │   │       │   └── funnel-chart.component.css
│   │   │       ├── line-chart/
│   │   │       │   ├── line-chart.component.ts
│   │   │       │   ├── line-chart.component.html
│   │   │       │   └── line-chart.component.css
│   │   │       └── metric-card/
│   │   │           ├── metric-card.component.ts
│   │   │           ├── metric-card.component.html
│   │   │           └── metric-card.component.css
│   │   ├── app.component.ts           # Root component
│   │   ├── app.component.html         # Root template
│   │   ├── app.component.css          # Root styles
│   │   ├── app.component.spec.ts      # Root component tests
│   │   ├── app.config.ts              # Application configuration
│   │   └── app.routes.ts              # Route definitions
│   ├── environments/                  # Environment configurations
│   │   └── environment.ts
│   ├── styles/                        # Global styles
│   │   ├── animations.css             # CSS animations
│   │   ├── mixins.css                 # CSS mixins
│   │   └── variables.css              # CSS variables
│   ├── index.html                     # Main HTML file
│   ├── main.ts                        # Application entry point
│   └── styles.css                     # Global styles
├── .editorconfig                      # Editor configuration
├── .gitignore                         # Git ignore rules
├── angular.json                       # Angular CLI configuration
├── package.json                       # NPM dependencies
├── package-lock.json                  # NPM lock file
├── README.md                          # Project readme
├── tsconfig.app.json                  # TypeScript config for app
├── tsconfig.json                      # Base TypeScript config
└── tsconfig.spec.json                 # TypeScript config for tests
```

## 📋 Directory Descriptions

### Root Level

| Directory/File | Purpose |
|----------------|---------|
| `.angular/` | Angular build cache (auto-generated, gitignored) |
| `.vscode/` | VS Code workspace settings and configurations |
| `docs/` | Complete project documentation |
| `plans/` | Architecture diagrams and planning documents |
| `public/` | Static assets served as-is |
| `screenshots/` | Application screenshots for documentation |
| `src/` | **Main source code directory** |

### Source Directory (`src/`)

#### `src/app/` - Application Root

The main application directory containing all Angular code.

#### `src/app/core/` - Core Module

**Purpose**: Singleton services, models, and core functionality used throughout the app.

**Contents**:
- **`layout/`**: Application-wide layout components (header, footer, etc.)
- **`models/`**: TypeScript interfaces and type definitions
- **`services/`**: Singleton services for API communication and business logic
- **`utils/`**: Utility functions and helpers

**Rules**:
- Services should be provided in root (`providedIn: 'root'`)
- Models should be pure TypeScript interfaces
- No UI components except layout components
- Import only once in the application

#### `src/app/features/` - Feature Modules

**Purpose**: Feature-specific components that are lazy-loaded.

**Structure**: Each feature has its own directory with:
- Component TypeScript file
- Component HTML template
- Component CSS styles
- Component test file

**Features**:
- **`alerts/`**: Alert management and display
- **`channels/`**: Channel performance analytics
- **`dashboard/`**: Main dashboard with executive summary
- **`keywords/`**: Keyword performance tracking
- **`regions/`**: Regional performance metrics

**Rules**:
- Each feature is independently lazy-loaded
- Features should be self-contained
- Shared functionality goes in `shared/`
- Use standalone components

#### `src/app/shared/` - Shared Module

**Purpose**: Reusable components, directives, and pipes used across features.

**Contents**:
- **`components/`**: Reusable UI components
  - `alert-badge/`: Alert display badge
  - `data-table/`: Generic data table with sorting
  - `funnel-chart/`: Conversion funnel visualization
  - `line-chart/`: Line chart wrapper for Chart.js
  - `metric-card/`: KPI card component

**Rules**:
- Components must be reusable across features
- No feature-specific logic
- Use `@Input()` and `@Output()` for communication
- Implement `OnPush` change detection when possible

#### `src/environments/` - Environment Configuration

**Purpose**: Environment-specific configuration (API URLs, feature flags, etc.)

**Files**:
- `environment.ts`: Development environment
- `environment.prod.ts`: Production environment (if needed)

#### `src/styles/` - Global Styles

**Purpose**: Application-wide CSS styles and variables.

**Files**:
- `animations.css`: Reusable CSS animations
- `mixins.css`: CSS mixins for common patterns
- `variables.css`: CSS custom properties (colors, spacing, etc.)

## 🎯 Module Organization Strategy

### Core Module Pattern

```
core/
├── layout/          # Layout components
├── models/          # Data models
├── services/        # Singleton services
└── utils/           # Utility functions
```

**When to use**: Singleton services, app-wide models, utilities

### Feature Module Pattern

```
features/
├── feature-name/
│   ├── feature-name.component.ts
│   ├── feature-name.component.html
│   ├── feature-name.component.css
│   └── feature-name.component.spec.ts
```

**When to use**: Lazy-loaded routes, feature-specific logic

### Shared Module Pattern

```
shared/
└── components/
    ├── component-name/
    │   ├── component-name.component.ts
    │   ├── component-name.component.html
    │   └── component-name.component.css
```

**When to use**: Reusable UI components, directives, pipes

## 📝 File Naming Conventions

### Components
- **Format**: `component-name.component.ts`
- **Example**: `alert-badge.component.ts`
- **Class**: `AlertBadgeComponent`

### Services
- **Format**: `service-name.service.ts`
- **Example**: `metrics.service.ts`
- **Class**: `MetricsService`

### Models
- **Format**: `model-name.models.ts` or `model-name.ts`
- **Example**: `alerts.models.ts`
- **Interface**: `Alert`, `AlertParams`

### Utilities
- **Format**: `utility-name.util.ts`
- **Example**: `http-params.util.ts`
- **Function**: `buildHttpParams()`

### Interceptors
- **Format**: `interceptor-name.interceptor.ts`
- **Example**: `http-error.interceptor.ts`
- **Function**: `httpErrorInterceptor`

## 🔄 Import Paths

### Barrel Exports

Use barrel exports (`index.ts`) for cleaner imports:

```typescript
// ✅ Good - using barrel export
import { Alert, MetricsService } from '@app/core';

// ❌ Avoid - direct imports
import { Alert } from '@app/core/models/alerts.models';
import { MetricsService } from '@app/core/services/metrics.service';
```

### Relative vs Absolute Imports

```typescript
// Within same feature - use relative
import { HelperFunction } from './helper';

// Cross-feature or core - use absolute
import { MetricsService } from '../../core/services';
```

## 📦 Module Dependencies

### Dependency Flow

```
┌─────────────┐
│   Features  │ ← Can import from Core & Shared
└─────────────┘
      ↓
┌─────────────┐
│   Shared    │ ← Can import from Core only
└─────────────┘
      ↓
┌─────────────┐
│    Core     │ ← No dependencies on Features/Shared
└─────────────┘
```

### Rules

1. **Core** should not import from Features or Shared
2. **Shared** can import from Core but not Features
3. **Features** can import from Core and Shared
4. **Features** should not import from other Features

## 🎨 Style Organization

### Component Styles

Each component has its own CSS file:
```
component-name/
├── component-name.component.css  ← Component-specific styles
```

### Global Styles

```
styles/
├── variables.css    ← CSS custom properties
├── mixins.css       ← Reusable CSS patterns
└── animations.css   ← Animation definitions
```

### Style Hierarchy

1. **Global styles** (`styles.css`) - Base styles, resets
2. **CSS variables** (`variables.css`) - Theme colors, spacing
3. **Component styles** - Component-specific overrides

## 🧪 Test File Organization

Test files are co-located with their source files:

```
component-name/
├── component-name.component.ts
├── component-name.component.spec.ts  ← Test file
```

**Naming**: `*.spec.ts` for all test files

## 📚 Documentation Organization

```
docs/
├── README.md                    # Main documentation
├── FOLDER-STRUCTURE.md          # This file
├── MODELS.md                    # Models reference
├── SERVICES.md                  # Services reference
├── COMPONENTS.md                # Components overview
└── components/                  # Detailed component docs
    ├── DASHBOARD.md
    ├── KEYWORDS.md
    └── ...
```

## 🔍 Finding Files

### By Feature

```bash
# All dashboard-related files
src/app/features/dashboard/

# All alert-related files
src/app/features/alerts/
```

### By Type

```bash
# All models
src/app/core/models/

# All services
src/app/core/services/

# All shared components
src/app/shared/components/
```

### By Functionality

```bash
# HTTP-related
src/app/core/services/http-error.interceptor.ts
src/app/core/utils/http-params.util.ts

# Chart components
src/app/shared/components/line-chart/
src/app/shared/components/funnel-chart/
```

## 🚀 Best Practices

### 1. Keep Features Independent
Each feature should be self-contained and independently lazy-loadable.

### 2. Use Barrel Exports
Create `index.ts` files to simplify imports.

### 3. Co-locate Related Files
Keep component files together in their own directory.

### 4. Separate Concerns
- **Core**: App-wide singletons
- **Shared**: Reusable UI components
- **Features**: Business logic and views

### 5. Follow Naming Conventions
Consistent naming makes the codebase easier to navigate.

---

**Last Updated**: January 2026  
**Maintained By**: Development Team
