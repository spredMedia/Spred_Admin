# Design Document

## Overview

This design transforms the current Spred homepage into a modern, Netflix-style streaming interface with improved visual hierarchy, better content discovery, and enhanced user experience. The design emphasizes a dark theme, prominent hero content, organized content rows, and intuitive navigation patterns.

## Architecture

### Component Structure
```
Homepage
├── StatusBar (dark theme)
├── Header
│   ├── SpredLogo
│   ├── SearchBar
│   └── ProfileAvatar
├── CategoryTabs
│   ├── OriginalTab
│   ├── MoviesTab
│   ├── SeriesTab
│   └── CategoriesTab
├── ScrollableContent
│   ├── HeroSection
│   │   ├── BackgroundImage
│   │   ├── ContentOverlay
│   │   ├── TitleText
│   │   ├── WatchNowButton
│   │   └── ActionButtons
│   ├── ContentRows
│   │   ├── SectionTitle
│   │   └── HorizontalContentList
│   └── ContinueWatchingSection
└── BottomNavigation
    ├── HomeTab
    ├── NewReleaseTab
    ├── DownloadsTab
    └── SpredDealsTab
```

### Theme System Integration
- **Primary Colors**: Orange (#FF6B35) for branding and accents
- **Background**: Dark (#1a1a1a, #2a2a2a for cards)
- **Text**: White (#FFFFFF) and light gray (#E0E0E0)
- **Status Bar**: Dark content with white text

## Components and Interfaces

### Header Component
```typescript
interface HeaderProps {
  userInfo: UserInfo;
  onSearchPress: () => void;
  onProfilePress: () => void;
}
```

**Features:**
- Spred logo with orange branding
- Search bar with magnifying glass icon
- Circular profile avatar
- Fixed positioning at top

### CategoryTabs Component
```typescript
interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    contentType?: string;
  }>;
}
```

**Features:**
- Horizontal scrollable tabs
- Orange underline for active tab
- Smooth transition animations
- Content filtering integration

### HeroSection Component
```typescript
interface HeroSectionProps {
  featuredContent: ContentItem;
  onWatchNow: (content: ContentItem) => void;
  onAddToList?: (content: ContentItem) => void;
}
```

**Features:**
- Full-width background image with gradient overlay
- Large title text with proper typography
- Orange "WATCH NOW" button with play icon
- Additional action buttons (add to list, info)
- Responsive height (40% of screen)

### ContentRow Component
```typescript
interface ContentRowProps {
  title: string;
  data: ContentItem[];
  onItemPress: (item: ContentItem) => void;
  showProgress?: boolean;
}
```

**Features:**
- Section title with consistent typography
- Horizontal scrollable content list
- Movie poster thumbnails (aspect ratio 2:3)
- Progress indicators for continue watching
- Smooth scrolling with momentum

### BottomNavigation Component
```typescript
interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}
```

**Features:**
- Fixed bottom positioning
- Icon + label for each tab
- Orange highlighting for active tab
- Safe area handling

## Data Models

### ContentItem Model
```typescript
interface ContentItem {
  _ID: string;
  name: string;
  title: string;
  thumbnailUrl: string;
  backgroundImageUrl?: string;
  description?: string;
  duration?: string;
  categoryId: string;
  contentTypeId: string;
  isFeatured?: boolean;
  watchProgress?: number; // 0-100 for continue watching
}
```

### Category Model
```typescript
interface Category {
  _ID: string;
  name: string;
  displayOrder?: number;
}
```

### ContentType Model
```typescript
interface ContentType {
  _ID: string;
  name: string;
  label: string;
}
```

## Visual Design Specifications

### Layout Dimensions
- **Header Height**: 60px + safe area
- **Category Tabs Height**: 50px
- **Hero Section Height**: 40% of screen height (min 300px)
- **Content Row Height**: 200px (150px thumbnails + 50px spacing)
- **Bottom Navigation Height**: 60px + safe area

### Typography Scale
- **Hero Title**: 28px, bold, white
- **Section Titles**: 18px, bold, white
- **Tab Labels**: 14px, medium, white/orange
- **Navigation Labels**: 12px, medium, white/orange

### Spacing System
- **Screen Padding**: 16px horizontal
- **Content Row Spacing**: 24px vertical
- **Item Spacing**: 12px between content items
- **Section Spacing**: 32px between major sections

### Color Palette
```typescript
const colors = {
  background: '#1a1a1a',
  cardBackground: '#2a2a2a',
  primary: '#FF6B35', // Orange brand color
  text: '#FFFFFF',
  textSecondary: '#E0E0E0',
  textMuted: '#A0A0A0',
  overlay: 'rgba(0, 0, 0, 0.6)',
}
```

## Error Handling

### Loading States
- **Initial Load**: Full-screen loading with Spred logo
- **Content Loading**: Skeleton placeholders for content rows
- **Image Loading**: Placeholder with fade-in animation
- **Tab Switching**: Smooth transition with loading indicators

### Error States
- **Network Error**: Retry button with error message
- **No Content**: Empty state with illustration
- **Image Load Error**: Fallback placeholder image
- **Search Error**: Clear error message in search results

### Performance Optimizations
- **Image Lazy Loading**: Load images as they come into view
- **Content Virtualization**: Efficient rendering of large lists
- **Caching**: Cache API responses and images
- **Smooth Animations**: Use native driver for animations

## Testing Strategy

### Visual Testing
- **Responsive Design**: Test on various screen sizes
- **Dark Theme**: Verify all components work in dark mode
- **Image Loading**: Test with slow network conditions
- **Content Overflow**: Test with long titles and descriptions

### Interaction Testing
- **Tab Navigation**: Verify smooth tab switching
- **Content Selection**: Test navigation to video player
- **Search Functionality**: Test search input and results
- **Bottom Navigation**: Test navigation between screens

### Performance Testing
- **Scroll Performance**: Ensure smooth scrolling with large datasets
- **Memory Usage**: Monitor memory consumption with images
- **Load Times**: Measure initial load and content switching times
- **Animation Performance**: Verify 60fps animations

### Accessibility Testing
- **Screen Reader**: Test with VoiceOver/TalkBack
- **Color Contrast**: Verify text readability
- **Touch Targets**: Ensure minimum 44px touch targets
- **Focus Management**: Test keyboard/remote navigation