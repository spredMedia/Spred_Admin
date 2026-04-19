# Mobile & Responsive Design Components

## Overview

Phase 11 implements comprehensive mobile and responsive design for the SPRED Admin Dashboard with touch-friendly interfaces, optimized layouts for all screen sizes, and offline support.

## Components

### 1. MobileNav
**File:** `components/MobileNav.tsx`

Floating action button menu for mobile devices with slide-out navigation.

**Features:**
- Fixed FAB button (bottom-right)
- Slide-out menu with smooth animations
- Overlay backdrop
- Badge indicators for important items
- Hidden on desktop (lg:hidden)

**Usage:**
```tsx
<MobileNav items={navItems} />
```

### 2. ResponsiveDataTable
**File:** `components/ResponsiveDataTable.tsx`

Smart data table that adapts between desktop table and mobile card layouts.

**Features:**
- Desktop: Traditional HTML table
- Mobile: Card-based expandable rows
- High-priority columns always visible
- Other columns in expandable section
- CSV export functionality
- Search across all fields

**Usage:**
```tsx
<ResponsiveDataTable
  columns={[
    { key: "name", label: "Name", priority: "high" },
    { key: "email", label: "Email", priority: "medium" }
  ]}
  data={users}
  title="Users"
  onRowClick={(row) => handleRowClick(row)}
/>
```

### 3. ResponsiveChartContainer
**File:** `components/ResponsiveChartContainer.tsx`

Wrapper for charts with responsive sizing and fullscreen capability.

**Features:**
- Auto-responsive height
- Fullscreen mode on mobile (MAG icon)
- Title and subtitle support
- Customizable heights

**Usage:**
```tsx
<ResponsiveChartContainer
  title="Revenue Trend"
  subtitle="Last 30 days"
  height="h-80"
>
  <LineChart data={data} />
</ResponsiveChartContainer>
```

### 4. TouchFriendlyButton
**File:** `components/TouchFriendlyButton.tsx`

Large, touch-friendly buttons with minimum 48px height for mobile.

**Features:**
- Minimum 48x48px tap target (WCAG)
- Multiple variants: primary, secondary, outline, ghost
- Three sizes: sm (40px), md (48px), lg (56px)
- Active scale animation
- Loading state support
- Focus ring styling

**Usage:**
```tsx
<TouchFriendlyButton
  size="lg"
  variant="primary"
  icon={<Plus />}
>
  Add Item
</TouchFriendlyButton>
```

### 5. TabletOptimizedLayout
**File:** `components/TabletOptimizedLayout.tsx`

Split-view layout for tablets and desktops with mobile list view.

**Features:**
- Mobile: Swappable list/detail views
- Tablet/Desktop: Side-by-side layout
- Smooth transitions between views
- Navigation chevrons

**Usage:**
```tsx
<TabletOptimizedLayout
  listPanel={<UserList />}
  detailPanel={<UserDetail />}
  listTitle="Users"
  detailTitle="User Details"
/>
```

### 6. ResponsiveMetricCard
**File:** `components/ResponsiveMetricCard.tsx`

Metric cards that adapt layout and text size based on screen size.

**Features:**
- Vertical and horizontal layouts
- Responsive text sizing
- Trend indicators (up/down/stable)
- Multiple color variants
- Icon support
- Responsive typography

**Usage:**
```tsx
<ResponsiveMetricCard
  label="Revenue"
  value="$45,230"
  unit="USD"
  trend="up"
  trendValue={12.5}
  color="emerald"
/>
```

### 7. ResponsiveGrid
**File:** `components/ResponsiveGrid.tsx`

Auto-stacking grid with responsive column counts.

**Features:**
- Configurable columns per breakpoint
- Mobile: 1 column default
- Tablet: 2 columns
- Desktop: 4 columns
- Adjustable gap sizes

**Usage:**
```tsx
<ResponsiveGrid
  columns={{ mobile: 1, tablet: 2, desktop: 4 }}
  gap="medium"
>
  {items.map(item => <Card key={item.id} {...item} />)}
</ResponsiveGrid>
```

### 8. OfflineIndicator
**File:** `components/OfflineIndicator.tsx`

Toast-style indicator for online/offline status with offline support messaging.

**Features:**
- Automatic online/offline detection
- Shows for 3 seconds when coming back online
- Persistent when offline
- Helpful messaging about offline capabilities
- Auto-dismisses when online

**Usage:**
```tsx
import { OfflineIndicator } from "@/components/OfflineIndicator"

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <OfflineIndicator />
    </div>
  )
}
```

## Responsive Design Breakpoints

```
Mobile:   < 768px  (md)
Tablet:   768px - 1024px  (lg)
Desktop:  > 1024px
```

## Tailwind Classes Used

- `hidden` / `md:hidden` / `lg:hidden` - Show/hide at breakpoints
- `block` / `md:block` / `lg:block` - Show/hide at breakpoints
- `grid-cols-1` / `md:grid-cols-2` / `lg:grid-cols-4` - Responsive columns
- `p-4 md:p-6 lg:p-8` - Responsive padding
- `text-sm md:text-base lg:text-lg` - Responsive text sizes
- `gap-3 md:gap-4` - Responsive gaps

## Touch Targets

All interactive elements follow WCAG guidelines:
- Minimum 48x48px tap target
- Sufficient spacing between targets
- Clear hover/active states
- Large enough text (min 14px on mobile)

## Responsive Typography

**Mobile (< 768px):**
- Headings: 18-24px
- Body: 12-14px
- Labels: 10-12px

**Desktop (> 768px):**
- Headings: 24-32px
- Body: 14-16px
- Labels: 11-13px

## Testing Checklist

- [ ] Mobile (375px width) - Single column, full width
- [ ] Tablet (768px width) - 2 columns, split view
- [ ] Desktop (1200px width) - Full multi-column layout
- [ ] Touch targets - All buttons 48x48px minimum
- [ ] Responsive images - Proper scaling
- [ ] Horizontal scroll - No overflow on mobile
- [ ] Font sizes - Readable at all sizes
- [ ] Offline mode - Works without internet
- [ ] Landscape mode - Proper layout rotation
- [ ] Dark mode - Contrast meets WCAG AA

## Implementation Guide

1. Use `ResponsiveGrid` for most layout needs
2. Wrap tables with `ResponsiveDataTable`
3. Wrap charts with `ResponsiveChartContainer`
4. Use `TouchFriendlyButton` for all CTAs
5. Use `ResponsiveMetricCard` for KPI displays
6. Include `OfflineIndicator` in root layout
7. Include `MobileNav` in dashboard layout
8. Test on actual devices, not just browser DevTools

## Performance Tips

- Use `hidden` classes to hide content rather than conditional rendering
- Leverage responsive images with `next/image`
- Use CSS Grid for layouts over Flexbox when possible
- Minimize mobile-specific JavaScript
- Cache offline-critical data with Service Workers

## Accessibility

- All interactive elements have focus rings
- Text contrast meets WCAG AA standards (4.5:1)
- Touch targets are 48x48px minimum
- Proper semantic HTML (`button`, `nav`, etc.)
- ARIA labels for icons and complex widgets
