# Dashboard UI Visual Mockup

## Desktop Layout Overview (1440px+)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║                        ━━━━━━━━━━━━━━━━━━━━                             ║
║                                                                           ║
║                      Analytics Dashboard                                  ║
║                 Real-time insights and performance metrics                ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ▸ Executive Summary                                                      ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                           ║
║  ┌─────────────────┬─────────────────┬─────────────────────────────┐    ║
║  │  🌐 WEBSITE     │  🛒 PAID        │                             │    ║
║  │     TRAFFIC     │     CONVERSIONS │    Monthly Recurring        │    ║
║  │                 │                 │    Revenue                  │    ║
║  │    40,235       │      324        │                             │    ║
║  │                 │                 │    $26,957.00               │    ║
║  ├─────────────────┼─────────────────┤                             │    ║
║  │  📈 TRIAL TO    │  📉 CHURN RATE  │    -15.71%                  │    ║
║  │     PAID RATE   │                 │    vs last month            │    ║
║  │                 │                 │                             │    ║
║  │    20.42%       │      0.05%      │                             │    ║
║  │                 │                 │                             │    ║
║  └─────────────────┴─────────────────┴─────────────────────────────┘    ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ▸ Performance Trends                                                     ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────┐    ║
║  │  Website Traffic Trends                                         │    ║
║  │  ─────────────────────────────────────────────────────────────  │    ║
║  │                                                                 │    ║
║  │      60k ┤                                                      │    ║
║  │      50k ┤    ╱╲    ╱╲  ╱╲                                     │    ║
║  │      40k ┤  ╱╲  ╲  ╱  ╲╱  ╲╱╲  ╱╲                              │    ║
║  │      30k ┤╱    ╲╱          ╲╱  ╲╱                              │    ║
║  │          └────────────────────────────────────────────────────  │    ║
║  │           Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec       │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                                                           ║
║  ┌──────────────────────────────────┬──────────────────────────────┐    ║
║  │  MRR Growth (Last 12 months)     │  Conversion Funnel           │    ║
║  │  ──────────────────────────────  │  ──────────────────────────  │    ║
║  │                                  │                              │    ║
║  │  35k ┤      ╱╲                   │  ████████████████  40,235    │    ║
║  │  30k ┤  ╱╲╱╲  ╲  ╱╲              │  ██████████  2,783           │    ║
║  │  25k ┤╱      ╲╱  ╲╱╲             │  ████████  1,587             │    ║
║  │  20k ┤              ╲            │  ████  324                   │    ║
║  │      └────────────────────────   │                              │    ║
║  │       1  2  3  4  5  6  7  8     │  Website → Signup → Trial    │    ║
║  └──────────────────────────────────┴──────────────────────────────┘    ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ▸ Detailed Metrics                                                       ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                           ║
║  ┌─────────────────────────────────┬─────────────────────────────┐      ║
║  │  Top Keywords                   │  Regional Performance       │      ║
║  │  ─────────────────────────────  │  ─────────────────────────  │      ║
║  │  Keyword    Traffic  Conv  Pos  │  Region    Sessions  Conv   │      ║
║  │  ────────────────────────────   │  ─────────────────────────  │      ║
║  │  keyword1   12,345   5.2%  1    │  US        45,678    234    │      ║
║  │  keyword2   10,234   4.8%  2    │  UK        23,456    123    │      ║
║  │  keyword3    8,765   4.5%  3    │  CA        12,345     67    │      ║
║  │  keyword4    7,654   4.2%  4    │  AU         8,901     45    │      ║
║  │  keyword5    6,543   3.9%  5    ├─────────────────────────────┤      ║
║  │  keyword6    5,432   3.7%  6    │  Channel Performance        │      ║
║  │  keyword7    4,321   3.5%  7    │  ─────────────────────────  │      ║
║  │  keyword8    3,210   3.2%  8    │  Channel   Sessions  Conv   │      ║
║  │  keyword9    2,109   3.0%  9    │  ─────────────────────────  │      ║
║  │  keyword10   1,098   2.8%  10   │  Organic   34,567    178    │      ║
║  │  ...         ...    ...   ...   │  Paid      23,456    123    │      ║
║  │  (Dynamic row count to match)   │  Social    12,345     67    │      ║
║  └─────────────────────────────────┴─────────────────────────────┘      ║
║                                                                           ║
║  Note: Top Keywords displays dynamic number of rows to align perfectly   ║
║        with the combined height of Regional + Channel Performance        ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ▸ Active Alerts                                                          ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────┐    ║
║  │  [ Critical ]  [ High ]  [ Medium ]  [ Low ]                    │    ║
║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    ║
║  │                                                                 │    ║
║  │  ┌───────────────────────────────────────────────────────────┐ │    ║
║  │  │ 🔴 MRR dropped by 15.71%              2 hours ago         │ │    ║
║  │  │ Investigate recent churn and pricing changes              │ │    ║
║  │  │ [ REVENUE ]                                               │ │    ║
║  │  └───────────────────────────────────────────────────────────┘ │    ║
║  │                                                                 │    ║
║  │  ┌───────────────────────────────────────────────────────────┐ │    ║
║  │  │ 🔴 Conversion rate below threshold    5 hours ago         │ │    ║
║  │  │ Review landing page and user experience                   │ │    ║
║  │  │ [ CONVERSION ]                                            │ │    ║
║  │  └───────────────────────────────────────────────────────────┘ │    ║
║  │                                                                 │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## Tablet Layout (768px - 1024px)

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║              Analytics Dashboard                  ║
║         Real-time insights and metrics            ║
║                                                   ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  ▸ Executive Summary                              ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  ┌───────────────────┬───────────────────┐       ║
║  │  🌐 WEBSITE       │  🛒 PAID          │       ║
║  │     TRAFFIC       │     CONVERSIONS   │       ║
║  │    40,235         │      324          │       ║
║  ├───────────────────┼───────────────────┤       ║
║  │  📈 TRIAL TO      │  📉 CHURN RATE    │       ║
║  │     PAID RATE     │                   │       ║
║  │    20.42%         │      0.05%        │       ║
║  ├───────────────────┴───────────────────┤       ║
║  │  💰 MONTHLY RECURRING REVENUE         │       ║
║  │                                       │       ║
║  │         $26,957.00                    │       ║
║  │         -15.71% vs last month         │       ║
║  └───────────────────────────────────────┘       ║
║                                                   ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  ▸ Performance Trends                             ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  ┌─────────────────────────────────────────┐     ║
║  │  Website Traffic Trends                 │     ║
║  │  [Chart spanning full width]            │     ║
║  └─────────────────────────────────────────┘     ║
║                                                   ║
║  ┌─────────────────────────────────────────┐     ║
║  │  MRR Growth (Last 12 months)            │     ║
║  │  [Chart spanning full width]            │     ║
║  └─────────────────────────────────────────┘     ║
║                                                   ║
║  ┌─────────────────────────────────────────┐     ║
║  │  Conversion Funnel                      │     ║
║  │  [Funnel spanning full width]           │     ║
║  └─────────────────────────────────────────┘     ║
║                                                   ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  ▸ Detailed Metrics                               ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                   ║
║  ┌─────────────────────────────────────────┐     ║
║  │  Top Keywords                           │     ║
║  │  [Table spanning full width]            │     ║
║  └─────────────────────────────────────────┘     ║
║                                                   ║
║  ┌─────────────────────────────────────────┐     ║
║  │  Regional Performance                   │     ║
║  │  [Table spanning full width]            │     ║
║  └─────────────────────────────────────────┘     ║
║                                                   ║
║  ┌─────────────────────────────────────────┐     ║
║  │  Channel Performance                    │     ║
║  │  [Table spanning full width]            │     ║
║  └─────────────────────────────────────────┘     ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## Mobile Layout (<768px)

```
╔═══════════════════════════════╗
║                               ║
║     Analytics Dashboard       ║
║   Real-time insights          ║
║                               ║
╠═══════════════════════════════╣
║                               ║
║  ▸ Executive Summary          ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                               ║
║  ┌─────────────────────────┐ ║
║  │  🌐 WEBSITE TRAFFIC     │ ║
║  │       40,235            │ ║
║  └─────────────────────────┘ ║
║                               ║
║  ┌─────────────────────────┐ ║
║  │  💰 MONTHLY RECURRING   │ ║
║  │       REVENUE           │ ║
║  │     $26,957.00          │ ║
║  │   -15.71% vs last month │ ║
║  └─────────────────────────┘ ║
║                               ║
║  ┌─────────────────────────┐ ║
║  │  🛒 PAID CONVERSIONS    │ ║
║  │         324             │ ║
║  └─────────────────────────┘ ║
║                               ║
║  ┌─────────────────────────┐ ║
║  │  📈 TRIAL TO PAID RATE  │ ║
║  │       20.42%            │ ║
║  └─────────────────────────┘ ║
║                               ║
║  ┌─────────────────────────┐ ║
║  │  📉 CHURN RATE          │ ║
║  │       0.05%             │ ║
║  └─────────────────────────┘ ║
║                               ║
╠═══════════════════════════════╣
║                               ║
║  ▸ Performance Trends         ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                               ║
║  [Charts stacked vertically]  ║
║                               ║
╠═══════════════════════════════╣
║                               ║
║  ▸ Detailed Metrics           ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                               ║
║  [Tables stacked vertically]  ║
║                               ║
╚═══════════════════════════════╝
```

---

## Component Detail: Executive Summary Card

### Desktop - Windows Logo Layout

```
┌─────────────────┬─────────────────┬─────────────────────────────┐
│                 │                 │                             │
│  🌐             │  💰             │   💰 MONTHLY RECURRING      │
│  WEBSITE        │  MONTHLY        │      REVENUE                │
│  TRAFFIC        │  RECURRING      │                             │
│                 │  REVENUE        │                             │
│                 │                 │                             │
│    40,235       │                 │      $26,957.00             │
│                 │   $26,957.00    │                             │
│                 │                 │                             │
│                 │   ┌──────────┐  │      ┌──────────────┐      │
│                 │   │ -15.71%  │  │      │   -15.71%    │      │
│                 │   │ vs last  │  │      │  vs last     │      │
│                 │   │  month   │  │      │   month      │      │
│                 │   └──────────┘  │      └──────────────┘      │
├─────────────────┼─────────────────┤                             │
│                 │                 │                             │
│  🛒             │  📈             │                             │
│  PAID           │  TRIAL TO       │                             │
│  CONVERSIONS    │  PAID RATE      │                             │
│                 │                 │                             │
│                 │                 │                             │
│      324        │    20.42%       │                             │
│                 │                 │                             │
├─────────────────┴─────────────────┤                             │
│                                   │                             │
│  📉 CHURN RATE                    │                             │
│                                   │                             │
│      0.05%                        │                             │
│                                   │                             │
└───────────────────────────────────┴─────────────────────────────┘
```

**Key Features:**
- First 4 cards in 2x2 grid (left)
- MRR card spans 2 rows (right, 1.5x width)
- Churn rate spans full width of left section
- All cards have equal height in their row
- Consistent padding and spacing
- Icons for visual identification

---

## Component Detail: Section Headers

### Styled Section Header

```
▸ Executive Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**CSS Implementation:**
```css
.dashboard-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(135deg, #A855F7, #F472B6) 1;
  position: relative;
}

.dashboard-section h2::before {
  content: '▸';
  color: #A855F7;
  margin-right: 0.5rem;
  font-size: 1.2em;
}
```

---

## Component Detail: Alert Tabs

### Tab Bar with Severity Colors

```
┌─────────────────────────────────────────────────────────────────┐
│  [ Critical ]  [ High ]  [ Medium ]  [ Low ]                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│     (red)      (orange)   (blue)     (green)                    │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Active tab has colored text matching severity
- Thick colored underline on active tab
- Inactive tabs are muted gray
- Smooth transition on tab change
- Background is dark tertiary color

---

## Component Detail: Alert Badge

### Enhanced Alert Card

```
┌───────────────────────────────────────────────────────────┐
│ 🔴 MRR dropped by 15.71%                    2 hours ago   │
│                                                           │
│ Investigate recent churn and pricing changes. Review      │
│ customer feedback and consider promotional offers.        │
│                                                           │
│ [ REVENUE ]                                               │
└───────────────────────────────────────────────────────────┘
```

**Features:**
- Left border colored by severity (4px)
- Icon indicating severity level
- Bold title text
- Timestamp in muted color
- Description in secondary text
- Type badge at bottom
- Hover effect: slight translate and shadow increase
- Dark tertiary background

---

## Color Palette Reference

### Chart Colors (High Contrast)

**Line Charts:**
- MRR Growth: `#10B981` (Bright Green)
- Traffic Trends: `#22D3EE` (Cyan)
- Grid Lines: `rgba(255, 255, 255, 0.1)`
- Text Labels: `#D1D5DB`

**Funnel Chart (Gradient):**
1. Stage 1: `#10B981` (Green)
2. Stage 2: `#22D3EE` (Cyan)
3. Stage 3: `#F59E0B` (Orange)
4. Stage 4: `#F472B6` (Pink)

### Alert Severity Colors

- Critical: `#EF4444` (Red)
- High: `#F59E0B` (Orange)
- Medium: `#3B82F6` (Blue)
- Low: `#10B981` (Green)

### Background Colors

- Primary: `#1F213A`
- Secondary (Cards): `#252740`
- Tertiary (Elevated): `#2D2F48`
- Hover: `#34364F`

---

## Animation & Interaction Notes

### Hover Effects

**Cards:**
```css
.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}
```

**Alert Badges:**
```css
.alert-badge:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  background: #34364F;
}
```

**Buttons:**
```css
button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}
```

### Transitions

All transitions use: `250ms ease`

---

## Accessibility Considerations

1. **Color Contrast:** All text meets WCAG AA standards
2. **Focus States:** Visible focus indicators on interactive elements
3. **Keyboard Navigation:** Full keyboard support for tabs and buttons
4. **Screen Readers:** Proper ARIA labels and semantic HTML
5. **Responsive Text:** Font sizes scale appropriately

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern CSS features used (Grid, Flexbox, CSS Variables) are well-supported.
