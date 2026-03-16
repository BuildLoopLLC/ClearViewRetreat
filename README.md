# ClearView Retreat Website

A modern, responsive website for ClearViewRetreat.org, a Christian retreat center. Built with Next.js, React, and Tailwind CSS, featuring a comprehensive admin panel for content management.

## 🌟 Features

### Public Website
- **Beautiful Homepage** with hero section, features, and testimonials
- **Events Management** - showcase upcoming retreats and events
- **Blog System** - share spiritual insights and retreat experiences
- **Photo Gallery** - showcase the beauty of the retreat center
- **Contact Forms** - easy communication with potential guests
- **Newsletter Signup** - popup with customizable message and footer link
- **Legal Pages** - Terms & Conditions, Privacy Policy, and Cookie Policy (GDPR compliant)
- **Cookie Consent Banner** - GDPR-compliant cookie consent with scroll detection
- **Responsive Design** - works perfectly on all devices
- **SEO Optimized** - built for search engine visibility

### Admin Panel
- **Dashboard** - overview of content and statistics with clickable stat cards
- **Blog Management** - create, edit, and delete blog posts
- **Event Management** - manage retreats and events
- **Gallery Management** - upload and organize photos
- **Newsletter Management** - view subscribers, export to CSV, delete subscribers with pagination
- **File Manager** - upload, view, copy links, and delete files (supports images, PDFs, documents, etc.)
- **User Management** - add/remove admin users directly from the admin panel
- **Site Settings** - comprehensive content management system for all site sections
  - Homepage content
  - About pages
  - Events pages
  - Contact pages
  - Footer content and social media links
  - Legal pages (Terms, Privacy, Cookie Policy)
  - Support options
  - Custom sections
- **Email Settings** - configure email notifications for various events
- **Content Preview** - see changes before publishing
- **Rich Text Editor** - WYSIWYG editor with HTML support for content management

### Technical Features
- **Modern Stack** - Next.js 14, React 18, TypeScript
- **Database** - Railway SQLite database with better-sqlite3
- **Authentication** - Firebase Authentication with role-based access control
- **File Storage** - Railway Buckets (S3-compatible storage)
- **Hosting** - Railway platform
- **Styling** - Tailwind CSS with custom design system
- **Animations** - Framer Motion for smooth interactions
- **Image Optimization** - Next.js Image component with Sharp
- **Form Handling** - React Hook Form with validation
- **Markdown Rendering** - React Markdown for README and content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Railway account (for hosting, database, and storage)
- Firebase project (for authentication)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BuildLoopLLC/ClearViewRetreat.git
   cd ClearViewRetreat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Railway SQLite Database
   DATABASE_URL="file:./data/clearview.db"
   
   # Firebase Authentication
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_CLIENT_EMAIL="your-client-email"
   FIREBASE_PRIVATE_KEY="your-private-key"
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   
   # Railway Buckets (S3-compatible)
   RAILWAY_BUCKET_NAME="your-bucket-name"
   RAILWAY_BUCKET_ENDPOINT="https://your-bucket-endpoint.railway.app"
   RAILWAY_ACCESS_KEY_ID="your-access-key"
   RAILWAY_SECRET_ACCESS_KEY="your-secret-key"
   
   # Application
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # The database will be created automatically on first run
   # Or run setup scripts if available
   npm run setup
   ```

   To import blog posts from a WordPress export (WXR XML), see [WordPress migration (production)](docs/WORDPRESS_MIGRATION.md). Locally: `npm run migrate-wordpress-posts -- /path/to/export.xml`.

5. **Set up Firebase Admin**
   ```bash
   # Create your first admin user
   npx tsx scripts/add-admin-user.ts <email> <password> [displayName]
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
clearview-retreat/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel routes
│   │   ├── blog/          # Blog management
│   │   ├── events/        # Event management
│   │   ├── gallery/        # Gallery management
│   │   ├── newsletter/    # Newsletter subscribers
│   │   ├── files/         # File manager
│   │   ├── users/         # Admin user management
│   │   └── settings/      # Site settings
│   ├── api/               # API routes
│   │   ├── sqlite-content/    # Content management API
│   │   ├── sqlite-blog/       # Blog API
│   │   ├── newsletter/        # Newsletter API
│   │   ├── files/             # File management API
│   │   └── users/            # User management API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Header, Footer, etc.
│   ├── sections/         # Homepage sections
│   ├── admin/            # Admin components
│   │   ├── ContentManager.tsx    # Content editor
│   │   ├── RichTextEditor.tsx   # WYSIWYG editor
│   │   └── ...
│   ├── ui/               # UI components
│   │   ├── CookieBanner.tsx      # Cookie consent
│   │   ├── NewsletterPopup.tsx   # Newsletter signup
│   │   └── ...
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── firebase-admin.ts # Firebase Admin SDK
│   ├── s3.ts            # S3/Railway Buckets client
│   └── database.ts       # SQLite database helper
├── hooks/                # Custom React hooks
│   └── useWebsiteContentSQLite.ts  # Content fetching hook
├── public/              # Static assets
│   ├── icon.png         # Favicon
│   └── images/          # Static images
├── scripts/             # Setup and utility scripts
│   ├── add-admin-user.ts
│   └── ...
├── data/                # SQLite database files (gitignored)
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
└── README.md            # This file
```

## 🎨 Design System

### Colors
- **Primary**: Warm orange (#ed7a1a) - represents warmth and hospitality
- **Secondary**: Natural green (#5c6b5c) - represents nature and growth
- **Accent**: Sky blue (#0ea5e9) - represents peace and spirituality
- **Warm**: Earthy brown (#b07a6e) - represents stability and comfort

### Typography
- **Display**: Playfair Display - for headings and titles
- **Body**: Inter - for body text and UI elements

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Consistent shadow and hover effects
- **Forms**: Clean, accessible input styles
- **Navigation**: Sticky header with mobile menu

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔐 Authentication & Authorization

- **Firebase Authentication** for user management
- **Role-based access control**:
  - `USER`: Basic access
  - `ADMIN`: Full content management
  - `SUPER_ADMIN`: Protected super admin account (admin@clearviewretreat.org)

### Admin User Management
- Add new admin users directly from the admin panel
- Remove admin access (keeps user account)
- Super admin account cannot be deleted
- All admin users are managed through Firebase with custom claims

## 🗄️ Database Schema

### Core Models (SQLite)
- **website_content**: Editable site content with sections and subsections
- **blog_posts**: Blog articles and content
- **blog_categories**: Blog post categories
- **events**: Retreats and events
- **gallery_photos**: Photo collections
- **newsletter_subscribers**: Newsletter email list
- **email_settings**: Email notification configurations
- **activities**: Activity log for content changes

## 📦 File Storage

- **Railway Buckets** (S3-compatible storage)
- Supports images, PDFs, documents, and other file types
- Presigned URLs for secure file access
- File manager in admin panel for upload/delete/copy links
- Automatic thumbnail generation for images

## 🚀 Deployment

### Railway (Current Platform)

1. **Connect your GitHub repository** to Railway
2. **Set up services**:
   - **Web Service**: Your Next.js application
   - **Database**: Railway SQLite (or PostgreSQL if preferred)
   - **Storage**: Railway Buckets for file storage
3. **Set environment variables** in Railway dashboard:
   - Firebase credentials
   - Railway bucket credentials
   - Database URL
   - Other required variables
4. **Deploy automatically** on push to main branch

### Environment Variables for Production

```env
# Railway SQLite Database
DATABASE_URL="file:./data/clearview.db"

# Firebase Authentication
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-client-email"
FIREBASE_PRIVATE_KEY="your-private-key"
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"

# Railway Buckets
RAILWAY_BUCKET_NAME="your-bucket-name"
RAILWAY_BUCKET_ENDPOINT="https://your-bucket-endpoint.railway.app"
RAILWAY_ACCESS_KEY_ID="your-access-key"
RAILWAY_SECRET_ACCESS_KEY="your-secret-key"

# Application
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run setup        # Run setup scripts
```

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Tailwind CSS** for styling

## 📝 Content Management

### Site Settings
The admin panel includes a comprehensive content management system accessible via `/admin/settings`:

- **Homepage**: Hero section, features, statistics, testimonials
- **About Pages**: History, beliefs, board, founders, gratitude, attractions
- **Events Pages**: Main events page, registration pages, event types
- **Contact Pages**: Contact forms, location, staff, volunteer opportunities
- **Footer**: Footer content and social media links (Facebook, Instagram, YouTube, Twitter, LinkedIn)
- **Legal Pages**: Terms & Conditions, Privacy Policy, Cookie Policy (all editable with rich text)
- **Support Options**: Various support options with modal content
- **Custom Sections**: Create custom content sections for any page

### Blog Posts
- Rich text editor with HTML support
- Featured images and excerpts
- Draft/published status management
- SEO-friendly URLs
- Category management

### Events
- Date and time management
- Registration tracking
- Location and capacity details
- Featured event highlighting
- Group event registration system

### Galleries
- Photo upload and organization
- Category-based filtering
- Lightbox image viewing
- Responsive grid layouts

### Newsletter
- Popup signup with customizable message
- Footer link for newsletter signup
- Admin panel to view all subscribers
- Export subscribers to CSV
- Delete subscribers (with confirmation)
- Pagination for large subscriber lists
- Email notification settings integration

### File Manager
- Upload various file types (images, PDFs, documents, etc.)
- View all uploaded files
- Copy public URLs for files
- Delete files
- Organized by folders

## 🔧 Customization

### Themes
- Easy color scheme changes in `tailwind.config.js`
- Component variants for different styles
- CSS custom properties for dynamic theming

### Content
- Editable text through admin panel
- Image management system
- SEO meta tags customization
- Social media integration

## 📊 Performance

- **Image Optimization** with Next.js Image and Sharp
- **Code Splitting** for faster loading
- **Lazy Loading** for better UX
- **SEO Optimization** for search engines
- **Accessibility** compliance
- **Cookie Consent** with GDPR compliance

## 🔒 Security Features

- **Firebase Authentication** with secure token management
- **Role-based access control** for admin panel
- **Super admin protection** - cannot delete super admin account
- **GDPR Compliance** - cookie consent banner and privacy policy
- **Secure file storage** with presigned URLs
- **Input validation** on all forms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Firebase** for authentication
- **Railway** for hosting, database, and storage
- **React Markdown** for markdown rendering
- **React Quill** for rich text editing

## 📞 Support

For support or questions:
- **Email**: info@clearviewretreat.org
- **Website**: https://clearviewretreat.org

---

**Built with ❤️ for spiritual renewal and community building**
