# Subpage Template Guide

This guide provides a template and examples for creating the remaining subpages for the ClearView Retreat website.

## Quick Start Template

Use this basic structure for most subpages:

```tsx
import SubpageLayout from '@/components/ui/SubpageLayout'

export default function PageNamePage() {
  return (
    <SubpageLayout
      title="Page Title"
      subtitle="Optional subtitle describing the page content"
      breadcrumbs={[
        { name: 'Section Name', href: '/section' },
        { name: 'Page Name', href: '/section/page' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Page content goes here */}
        <div className="prose prose-lg max-w-none">
          <p>Your content here...</p>
        </div>
      </div>
    </SubpageLayout>
  )
}
```

## Required Subpages to Create

### About Section (`/about/`)
- [x] `/about/history` → `app/about/history/page.tsx` ✅
- [ ] `/about/beliefs` → `app/about/beliefs/page.tsx`
- [ ] `/about/board` → `app/about/board/page.tsx`
- [ ] `/about/founders` → `app/about/founders/page.tsx`
- [ ] `/about/gratitude` → `app/about/gratitude/page.tsx`

### Events Section (`/events/`)
- [x] `/events/upcoming` → `app/events/upcoming/page.tsx` ✅
- [ ] `/events/past` → `app/events/past/page.tsx`
- [ ] `/events/register` → `app/events/register/page.tsx`
- [ ] `/events/types` → `app/events/types/page.tsx`
- [ ] `/events/testimonials` → `app/events/testimonials/page.tsx`

### Contact Section (`/contact/`)
- [ ] `/contact/contact-us` → `app/contact/contact-us/page.tsx`
- [ ] `/contact/location` → `app/contact/location/page.tsx`
- [ ] `/contact/staff` → `app/contact/staff/page.tsx`
- [ ] `/contact/volunteer` → `app/contact/volunteer/page.tsx`
- [ ] `/contact/prayer` → `app/contact/prayer/page.tsx`

### Gallery Section (`/gallery/`)
- [ ] `/gallery/retreat-center` → `app/gallery/retreat-center/page.tsx`
- [ ] `/gallery/events` → `app/gallery/events/page.tsx`
- [ ] `/gallery/nature` → `app/gallery/nature/page.tsx`
- [ ] `/gallery/community` → `app/gallery/community/page.tsx`
- [ ] `/gallery/testimonials` → `app/gallery/testimonials/page.tsx`

## Content Guidelines

### About Section Subpages
- **History**: Timeline format with milestones and achievements
- **Beliefs**: Theological statements with biblical references
- **Board of Trustees**: Individual profiles with photos and bios
- **Founders**: Personal stories and vision statements
- **With Gratitude**: Acknowledgments and thank you messages

### Events Section Subpages
- **Upcoming Events**: Event listings with registration (✅ Complete)
- **Past Events**: Photo galleries and event summaries
- **Event Registration**: Registration forms and information
- **Event Types**: Categories and descriptions of different events
- **Testimonials**: Stories from event participants

### Contact Section Subpages
- **Contact Us**: General contact form and information
- **Location & Directions**: Maps, address, and driving directions
- **Staff Directory**: Team member profiles and contact info
- **Volunteer Opportunities**: Ways to get involved and serve
- **Prayer Requests**: Prayer request submission form

### Gallery Section Subpages
- **Retreat Center**: Photos of facilities and amenities
- **Event Photos**: Images from various events and activities
- **Nature & Grounds**: Landscape and outdoor area photos
- **Community Life**: People and fellowship moments
- **Testimonials Gallery**: Visual stories and quotes

## File Structure

```
app/
├── about/
│   ├── page.tsx (main about page)
│   ├── history/
│   │   └── page.tsx ✅
│   ├── beliefs/
│   │   └── page.tsx
│   ├── board/
│   │   └── page.tsx
│   ├── founders/
│   │   └── page.tsx
│   └── gratitude/
│       └── page.tsx
├── events/
│   ├── page.tsx (main events page)
│   ├── upcoming/
│   │   └── page.tsx ✅
│   ├── past/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── types/
│   │   └── page.tsx
│   └── testimonials/
│       └── page.tsx
├── contact/
│   ├── page.tsx (main contact page)
│   ├── contact-us/
│   │   └── page.tsx
│   ├── location/
│   │   └── page.tsx
│   ├── staff/
│   │   └── page.tsx
│   ├── volunteer/
│   │   └── page.tsx
│   └── prayer/
│       └── page.tsx
└── gallery/
    ├── page.tsx (main gallery page)
    ├── retreat-center/
    │   └── page.tsx
    ├── events/
    │   └── page.tsx
    ├── nature/
    │   └── page.tsx
    ├── community/
    │   └── page.tsx
    └── testimonials/
        └── page.tsx
```

## Common Components to Use

### 1. SubpageLayout
- Provides consistent page structure
- Includes breadcrumbs and page header
- Handles animations and responsive design

### 2. Content Sections
- Use semantic HTML with proper headings
- Include relevant images and media
- Add call-to-action sections where appropriate

### 3. Interactive Elements
- Forms for contact and registration pages
- Image galleries for gallery subpages
- Event listings for events subpages

## Styling Guidelines

### Typography
- Use `font-display` for headings
- Maintain consistent text hierarchy
- Use appropriate text colors (`text-secondary-900`, `text-secondary-600`)

### Spacing
- Use consistent spacing classes (`mb-8`, `py-16`, etc.)
- Maintain visual rhythm throughout pages
- Use responsive spacing for mobile devices

### Colors
- Primary colors for CTAs and highlights
- Secondary colors for text and backgrounds
- Accent colors for special elements

## Next Steps

1. **Create the remaining subpage files** using the template
2. **Add appropriate content** for each subpage
3. **Test navigation** to ensure all links work
4. **Add images and media** to enhance content
5. **Implement forms** for contact and registration pages
6. **Add SEO metadata** for each subpage

## Example Implementation

See these completed examples for reference:
- `app/about/history/page.tsx` - Timeline-based content
- `app/events/upcoming/page.tsx` - Event listings with filtering

Each subpage should provide valuable, specific content that enhances the user's understanding of your ministry and encourages engagement.
