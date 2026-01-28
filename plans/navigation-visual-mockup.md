# Navigation Visual Mockup

## Current vs. Proposed Navigation

### 🔴 CURRENT LAYOUT (To Be Removed)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo] Solveo Dashboard    [Search Bar]    [🔔3] [👤 User ▼]      │
└─────────────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────────────────┐
│          │                                                          │
│  [🏠]    │                                                          │
│ Dashboard│                                                          │
│          │                                                          │
│  [🔍]    │                                                          │
│ Keywords │                    MAIN CONTENT                         │
│          │                                                          │
│  [🌍]    │                                                          │
│ Regions  │                                                          │
│          │                                                          │
│  [📺]    │                                                          │
│ Channels │                                                          │
│          │                                                          │
│  [🔔3]   │                                                          │
│  Alerts  │                                                          │
│          │                                                          │
│  [⚙️]    │                                                          │
│ Settings │                                                          │
│          │                                                          │
│  [⬇️]    │                                                          │
│ Download │                                                          │
│          │                                                          │
└──────────┴──────────────────────────────────────────────────────────┘
```

**Issues**:
- ❌ Sidebar takes up valuable horizontal space
- ❌ Header has unnecessary elements (notifications, profile, settings)
- ❌ Alerts tab shows badge number (should be removed)
- ❌ Download report button in sidebar (should be removed)
- ❌ Settings in sidebar (should be removed)

---

### ✅ PROPOSED LAYOUT (New Design)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Logo]  [Search Bar]    Dashboard  Keywords  Regions  Channels  Alerts     │
│  Solveo                      ═══                                            │
└─────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                                                                             │
│                                                                             │
│                                                                             │
│                          FULL WIDTH MAIN CONTENT                            │
│                                                                             │
│                                                                             │
│                                                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Improvements**:
- ✅ Full-width content area (no sidebar)
- ✅ Clean horizontal navigation
- ✅ Only essential elements in header
- ✅ Active tab indicated by gradient underline
- ✅ More screen real estate for dashboard content

---

## Detailed Header Breakdown

### Header Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────┐  ┌─────────────────────┐  ┌──────────────────────────────────┐  │
│  │ Logo │  │    Search Bar       │  │  Navigation Tabs                 │  │
│  │ Icon │  │  🔍 Search...       │  │  Dashboard Keywords Regions ...  │  │
│  │ Text │  │                     │  │                                  │  │
│  └──────┘  └─────────────────────┘  └──────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Logo Section (Left)
```
┌─────────────────────┐
│  ◆  Solveo Dashboard│
│ [Gradient Icon]     │
└─────────────────────┘
```
- **Icon**: Gradient diamond/logo (32x32px)
- **Text**: "Solveo Dashboard" (18px, semibold)
- **Hover**: Slight scale effect (1.02)
- **Clickable**: Routes to `/dashboard`

#### 2. Search Bar (Center-Left)
```
┌─────────────────────────────┐
│  🔍  Search...              │
└─────────────────────────────┘
```
- **Width**: Max 500px, flexible
- **Background**: `var(--bg-tertiary)` (#2D2F48)
- **Border**: 1px solid `var(--border-primary)`
- **Border Radius**: 12px
- **Padding**: 12px 16px 12px 48px (left padding for icon)
- **Icon**: Search icon (20x20px) positioned absolute left
- **Focus State**: 
  - Border color: `var(--color-purple)`
  - Box shadow: 0 0 0 3px rgba(168, 85, 247, 0.1)
  - Background: `var(--bg-secondary)`

#### 3. Navigation Tabs (Right)
```
┌────────────────────────────────────────────────────────┐
│  Dashboard  Keywords  Regions  Channels  Alerts        │
│     ═══                                                │
└────────────────────────────────────────────────────────┘
```
- **Layout**: Horizontal flex with gap (32px)
- **Tab Styling**:
  - Font size: 15px
  - Font weight: 500 (medium)
  - Color: `var(--text-secondary)` (inactive)
  - Color: `var(--text-primary)` (active)
  - Padding: 20px 0
  - Position: relative (for underline)

**Active Tab Indicator**:
```css
.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.6);
  border-radius: 2px 2px 0 0;
}
```

**Hover State** (inactive tabs):
```css
.nav-tab:hover {
  color: var(--text-primary);
  transform: translateY(-1px);
}
```

---

## Navigation Tab States

### Dashboard Tab (Active)
```
┌─────────────┐
│  Dashboard  │
│  ═══════════│ ← Gradient underline with glow
└─────────────┘
```
- Text: White (#FFFFFF)
- Underline: Purple-Pink gradient
- Glow: Purple shadow

### Keywords Tab (Inactive, Hover)
```
┌──────────┐
│ Keywords │ ← Slightly lifted, lighter color
└──────────┘
```
- Text: Light gray → White on hover
- Transform: translateY(-1px)
- Transition: 0.3s ease

### Alerts Tab (No Badge)
```
┌────────┐
│ Alerts │ ← No number badge
└────────┘
```
- **Important**: No badge number displayed
- Same styling as other tabs
- Badge removed from requirements

---

## Responsive Behavior

### Desktop (> 1024px)
```
[Logo] [Search Bar - 500px]  Dashboard  Keywords  Regions  Channels  Alerts
```
- Full layout visible
- Search bar at max width
- All tabs visible

### Tablet (768px - 1024px)
```
[Logo] [Search - 300px]  Dashboard  Keywords  Regions  Channels  Alerts
```
- Search bar reduced to 300px
- All tabs still visible
- Tighter spacing

### Mobile (< 768px)
```
[Logo]  [☰]
```
- Logo only visible
- Hamburger menu for navigation
- Search bar hidden or in menu
- Tabs in dropdown/slide-out menu

---

## Color Specifications

### Header Background
```css
background-color: rgba(37, 39, 64, 0.8);
backdrop-filter: blur(12px);
border-bottom: 1px solid var(--border-primary);
box-shadow: var(--shadow-md);
```
- Semi-transparent dark background
- Blur effect for depth
- Subtle border and shadow

### Navigation Tab Colors

**Inactive Tab**:
- Text: `#D1D5DB` (var(--text-secondary))
- Hover: `#FFFFFF` (var(--text-primary))

**Active Tab**:
- Text: `#FFFFFF` (var(--text-primary))
- Underline: `linear-gradient(135deg, #A855F7, #F472B6)`
- Glow: `0 0 8px rgba(168, 85, 247, 0.6)`

### Search Bar Colors

**Default State**:
- Background: `#2D2F48` (var(--bg-tertiary))
- Border: `#374151` (var(--border-primary))
- Text: `#FFFFFF` (var(--text-primary))
- Placeholder: `#6B7280` (var(--text-muted))

**Focus State**:
- Background: `#252740` (var(--bg-secondary))
- Border: `#A855F7` (var(--color-purple))
- Box Shadow: `0 0 0 3px rgba(168, 85, 247, 0.1)`

---

## Animation Specifications

### Tab Switch Animation
```css
@keyframes slideUnderline {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

.nav-tab.active::after {
  animation: slideUnderline 0.3s ease;
  transform-origin: left;
}
```

### Hover Lift Animation
```css
.nav-tab {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-tab:hover {
  transform: translateY(-1px);
}
```

### Search Bar Focus Animation
```css
.search-input {
  transition: all 0.3s ease;
}

.search-input:focus {
  transform: translateY(-1px);
}
```

---

## Accessibility Considerations

### Keyboard Navigation
- Tab key navigates through: Logo → Search → Nav Tabs
- Enter key activates navigation
- Focus visible with outline: `2px solid var(--color-purple)`

### Screen Readers
```html
<nav aria-label="Main navigation">
  <a href="/dashboard" aria-current="page">Dashboard</a>
  <a href="/keywords">Keywords</a>
  <a href="/regions">Regions</a>
  <a href="/channels">Channels</a>
  <a href="/alerts">Alerts</a>
</nav>
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .nav-tab,
  .nav-tab::after,
  .search-input {
    transition: none;
    animation: none;
  }
}
```

---

## Implementation Notes

### Files to Modify
1. **Header Component HTML** ([`header.component.html`](src/app/core/layout/header/header.component.html))
   - Remove: Notifications button, user profile, dropdowns
   - Add: Navigation tabs with RouterLink
   - Keep: Logo, search bar

2. **Header Component TypeScript** ([`header.component.ts`](src/app/core/layout/header/header.component.ts))
   - Remove: Notification logic, user menu logic
   - Add: Navigation items array
   - Add: Active route detection

3. **Header Component CSS** ([`header.component.css`](src/app/core/layout/header/header.component.css))
   - Remove: Dropdown styles, notification styles
   - Add: Navigation tab styles
   - Add: Active state underline animation

4. **App Component HTML** ([`app.component.html`](src/app/app.component.html))
   - Remove: `<app-sidebar>` component
   - Update: Layout structure

5. **App Component CSS** ([`app.component.css`](src/app/app.component.css))
   - Remove: Sidebar-related margins
   - Update: Main content to full width

### Testing Checklist
- [ ] Navigation tabs route correctly
- [ ] Active tab indicator shows on correct tab
- [ ] Hover effects work smoothly
- [ ] Search bar focus state works
- [ ] Keyboard navigation works
- [ ] Responsive behavior on mobile
- [ ] Accessibility with screen reader
- [ ] Reduced motion preference respected

---

## Visual Comparison

### Before (Current)
- Header: 70px height
- Sidebar: 240px width (collapsed: 64px)
- Content area: calc(100vw - 240px)
- Navigation: Vertical in sidebar
- Extra elements: Notifications, profile, settings, download

### After (Proposed)
- Header: 70px height
- Sidebar: **REMOVED**
- Content area: **100vw** (full width)
- Navigation: Horizontal in header
- Elements: Logo, search, navigation tabs only

### Space Gained
- **240px** additional horizontal space
- **~15%** more content area on typical 1920px screen
- Cleaner, more modern interface
- Better focus on dashboard content

---

*Mockup created: 2026-01-28*  
*Status: Ready for Review*  
*Next: Implement in Code mode*
