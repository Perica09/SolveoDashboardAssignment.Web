# Dark Theme Quick Reference Guide

## 🎨 Essential Design Tokens

### Colors (Copy-Paste Ready)

```css
/* Backgrounds */
--bg-primary: #1F213A;
--bg-secondary: #1A1B2F;
--bg-card: #252740;
--bg-card-hover: #2D2F4A;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #A855F7, #F472B6);
--gradient-secondary: linear-gradient(135deg, #22D3EE, #3B82F6);
--gradient-accent: linear-gradient(135deg, #10B981, #22D3EE);

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #D1D5DB;
--text-tertiary: #9CA3AF;
--text-muted: #6B7280;

/* Semantic */
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #22D3EE;

/* Borders */
--border-subtle: #374151;
--border-medium: #4B5563;

/* Shadows */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 20px rgba(168, 85, 247, 0.3);
```

### Spacing Scale

```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-7: 28px;
--spacing-8: 32px;
```

### Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 9999px;
```

### Typography

```css
--font-family: 'Inter', 'Poppins', 'Roboto', sans-serif;

--font-size-xs: 11px;
--font-size-sm: 12px;
--font-size-base: 14px;
--font-size-lg: 16px;
--font-size-xl: 18px;
--font-size-2xl: 24px;
--font-size-3xl: 28px;
--font-size-4xl: 32px;
--font-size-5xl: 48px;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

## 🧩 Common CSS Patterns

### Card Base

```css
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### Gradient Card

```css
.card-gradient {
  background: var(--bg-card);
  position: relative;
  overflow: hidden;
}

.card-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}
```

### Button Primary

```css
.btn-primary {
  background: var(--gradient-primary);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-6);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-glow);
}
```

### Loading Skeleton

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-card) 0%,
    var(--bg-card-hover) 50%,
    var(--bg-card) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Table Row Hover

```css
tr {
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

tr:hover {
  background-color: var(--bg-card-hover);
  box-shadow: inset 0 0 0 1px rgba(168, 85, 247, 0.2);
}
```

---

## 📊 Chart.js Configuration Snippets

### Global Defaults

```typescript
import { Chart } from 'chart.js';

Chart.defaults.color = '#D1D5DB';
Chart.defaults.borderColor = '#374151';
Chart.defaults.backgroundColor = '#252740';
Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.font.size = 12;
```

### Line Chart with Gradient

```typescript
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

const config = {
  type: 'line',
  data: {
    datasets: [{
      backgroundColor: gradient,
      borderColor: '#A855F7',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#A855F7',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2
    }]
  },
  options: {
    scales: {
      y: {
        grid: { color: '#374151' },
        ticks: { color: '#9CA3AF' }
      },
      x: {
        grid: { color: '#374151' },
        ticks: { color: '#9CA3AF' }
      }
    }
  }
};
```

### Bar Chart with Gradient

```typescript
const barGradient = ctx.createLinearGradient(0, 0, 0, 400);
barGradient.addColorStop(0, '#22D3EE');
barGradient.addColorStop(1, '#3B82F6');

const config = {
  type: 'bar',
  data: {
    datasets: [{
      backgroundColor: barGradient,
      borderRadius: 8,
      borderSkipped: false
    }]
  }
};
```

---

## 🎯 Component Checklist

### Metric Card
- [ ] Dark background (#252740)
- [ ] Gradient top border or overlay
- [ ] Large bold number (36-48px)
- [ ] Uppercase label (12px, #9CA3AF)
- [ ] Growth badge with gradient
- [ ] Hover lift effect
- [ ] Loading skeleton state

### Chart Component
- [ ] Dark card background
- [ ] Subtle grid lines (#374151)
- [ ] Gradient line/bar colors
- [ ] Light gray axis labels
- [ ] Dark tooltip with rounded corners
- [ ] Smooth animations
- [ ] Responsive height

### Data Table
- [ ] Dark card background
- [ ] Header with lighter background
- [ ] Row hover effect
- [ ] Subtle borders
- [ ] Sort indicators
- [ ] Loading skeleton
- [ ] Responsive scrolling

### Navigation
- [ ] Dark sidebar background (#1A1B2F)
- [ ] Active item gradient highlight
- [ ] Hover state on items
- [ ] Icons with text
- [ ] Collapsible functionality
- [ ] Smooth transitions

### Header
- [ ] Sticky positioning
- [ ] Dark background with shadow
- [ ] Logo on left
- [ ] Search bar
- [ ] Notification bell with badge
- [ ] User avatar
- [ ] Backdrop blur effect

---

## 🎨 Gradient Application Guide

### When to Use Primary Gradient (Purple → Pink)
- Metric cards (revenue, conversions)
- Active navigation items
- Primary action buttons
- Important highlights
- Success badges

### When to Use Secondary Gradient (Cyan → Blue)
- Charts and graphs
- Progress bars
- Secondary buttons
- Information badges
- Data visualizations

### When to Use Accent Gradient (Green → Cyan)
- Positive metrics (growth)
- Success states
- Completion indicators
- Positive trends
- Achievement badges

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
.container {
  padding: 16px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1200px+) */
@media (min-width: 1200px) {
  .container {
    padding: 32px;
  }
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## ✨ Animation Timing Functions

```css
/* Use these for smooth, professional animations */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Standard durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

---

## 🔧 Utility Classes

```css
/* Text */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }

/* Backgrounds */
.bg-card { background: var(--bg-card); }
.bg-gradient-primary { background: var(--gradient-primary); }
.bg-gradient-secondary { background: var(--gradient-secondary); }

/* Spacing */
.p-4 { padding: var(--spacing-4); }
.m-4 { margin: var(--spacing-4); }
.gap-4 { gap: var(--spacing-4); }

/* Borders */
.rounded { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }

/* Shadows */
.shadow { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }

/* Transitions */
.transition { transition: all 0.3s ease; }
```

---

## 🎯 Common Measurements

### Header
- Height: 64px
- Logo: 32px height
- Avatar: 40px diameter
- Notification badge: 20px diameter

### Sidebar
- Width (expanded): 240px
- Width (collapsed): 64px
- Icon size: 20px
- Active indicator: 4px left border

### Cards
- Min height: 120px (metric cards)
- Padding: 20-24px
- Border radius: 16px
- Gap between cards: 24px

### Charts
- Min height: 300px (mobile)
- Min height: 400px (desktop)
- Padding: 20px
- Border radius: 12px

### Tables
- Row height: 48px
- Header height: 56px
- Cell padding: 12-16px
- Border width: 1px

---

## 🚀 Performance Tips

1. **Use CSS transforms** for animations (GPU accelerated)
   ```css
   transform: translateY(-4px); /* Good */
   top: -4px; /* Avoid */
   ```

2. **Add will-change** for animated elements
   ```css
   .card:hover {
     will-change: transform, box-shadow;
   }
   ```

3. **Optimize gradients** with fixed stops
   ```css
   /* Good - specific stops */
   linear-gradient(135deg, #A855F7 0%, #F472B6 100%);
   ```

4. **Use CSS containment** for isolated components
   ```css
   .card {
     contain: layout style paint;
   }
   ```

5. **Debounce resize handlers**
   ```typescript
   @HostListener('window:resize')
   onResize = debounce(() => {
     // Handle resize
   }, 150);
   ```

---

## ✅ Pre-Implementation Checklist

- [ ] CSS variables file created
- [ ] Global styles updated
- [ ] Font family imported (Inter/Poppins)
- [ ] Chart.js defaults configured
- [ ] Angular Material theme customized
- [ ] Responsive breakpoints defined
- [ ] Animation keyframes created
- [ ] Utility classes defined

---

## 📝 File Structure Reference

```
src/
├── styles/
│   ├── variables.css      ← Design tokens
│   ├── mixins.css         ← Reusable patterns
│   ├── animations.css     ← Keyframes
│   ├── utilities.css      ← Helper classes
│   └── global.css         ← Global overrides
├── app/
│   ├── core/
│   │   └── layout/
│   │       ├── header/    ← New component
│   │       └── sidebar/   ← New component
│   └── shared/
│       └── components/
│           ├── metric-card/
│           ├── line-chart/
│           ├── data-table/
│           └── ...
```

---

## 🎨 Color Contrast Ratios (WCAG AA)

```
Background #1F213A vs:
- White text (#FFFFFF): 12.5:1 ✅
- Light gray (#D1D5DB): 8.2:1 ✅
- Medium gray (#9CA3AF): 5.1:1 ✅

Card #252740 vs:
- White text (#FFFFFF): 11.8:1 ✅
- Light gray (#D1D5DB): 7.8:1 ✅
```

---

**Quick Tip**: Bookmark this page for easy reference during implementation!

**Last Updated**: 2026-01-28
**Version**: 1.0
