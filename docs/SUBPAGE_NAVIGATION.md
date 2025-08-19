# Subpage Navigation System

This document describes the consistent subpage navigation system used across the ClearView Retreat website.

## Overview

The subpage navigation system provides a consistent way to display and link to subpages for each main page section. It's designed to be reusable and maintain visual consistency across the site.

## Components

### SubpageNavigation Component

Located at `components/ui/SubpageNavigation.tsx`, this component provides:

- Consistent styling and layout
- Animated entrance effects
- Responsive grid layout
- Hover effects and interactions
- Optional descriptions for each subpage

## Usage

### Basic Implementation

```tsx
import SubpageNavigation from '@/components/ui/SubpageNavigation'

const pageSubpages = [
  {
    title: 'Subpage Title',
    href: '/page/subpage',
    description: 'Optional description of the subpage'
  }
]

export default function PageComponent() {
  return (
    <div>
      {/* Main page content */}
      <SubpageNavigation
        title="Section Title"
        subtitle="Optional subtitle"
        subpages={pageSubpages}
      />
    </div>
  )
}
```

### Subpage Interface

Each subpage should follow this structure:

```tsx
interface Subpage {
  title: string      // Display name for the subpage
  href: string       // URL path to the subpage
  description?: string // Optional description (recommended)
}
```

## Current Implementations

### About Page (`/about`)
- History
- Beliefs
- Board of Trustees
- Founders
- With Gratitude

### Events Page (`/events`)
- Upcoming Events
- Past Events
- Event Registration
- Event Types
- Testimonials

### Contact Page (`/contact`)
- Get in Touch
- Location & Directions
- Staff Directory
- Volunteer Opportunities
- Prayer Requests

### Gallery Page (`/gallery`)
- Retreat Center
- Event Photos
- Nature & Grounds
- Community Life
- Testimonials Gallery

## Styling

The component uses:
- Primary and accent color gradients for backgrounds
- Consistent typography with the site's design system
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Smooth animations and hover effects
- Shadow and border styling for cards

## Adding New Subpages

1. Define the subpage array in your page component
2. Import and use the SubpageNavigation component
3. Create the actual subpage files at the specified routes
4. Ensure consistent naming and descriptions

## Best Practices

- Keep subpage titles concise but descriptive
- Provide helpful descriptions for each subpage
- Use consistent URL patterns (`/page/subpage`)
- Group related subpages logically
- Maintain visual hierarchy with the main page content

## Future Enhancements

- Add breadcrumb navigation
- Implement active state styling
- Add search functionality for subpages
- Include subpage icons or images
- Add pagination for pages with many subpages
