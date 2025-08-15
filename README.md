# ClearView Retreat Website

A modern, responsive website for ClearViewRetreat.org, a Christian retreat center. Built with Next.js, React, and Tailwind CSS, featuring a comprehensive admin panel for content management.

## 🌟 Features

### Public Website
- **Beautiful Homepage** with hero section, features, and testimonials
- **Events Management** - showcase upcoming retreats and events
- **Blog System** - share spiritual insights and retreat experiences
- **Photo Gallery** - showcase the beauty of the retreat center
- **Contact Forms** - easy communication with potential guests
- **Responsive Design** - works perfectly on all devices
- **SEO Optimized** - built for search engine visibility

### Admin Panel
- **Dashboard** - overview of content and statistics
- **Blog Management** - create, edit, and delete blog posts
- **Event Management** - manage retreats and events
- **Gallery Management** - upload and organize photos
- **User Management** - control access and permissions
- **Content Preview** - see changes before publishing

### Technical Features
- **Modern Stack** - Next.js 14, React 18, TypeScript
- **Database** - PostgreSQL with Prisma ORM
- **Authentication** - NextAuth.js with role-based access
- **Styling** - Tailwind CSS with custom design system
- **Animations** - Framer Motion for smooth interactions
- **Image Optimization** - Next.js Image component
- **Form Handling** - React Hook Form with validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clearview-retreat.git
   cd clearview-retreat
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
   DATABASE_URL="postgresql://username:password@localhost:5432/clearview_retreat"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
clearview-retreat/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Header, Footer, etc.
│   ├── sections/         # Homepage sections
│   └── providers/        # Context providers
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema file
├── public/               # Static assets
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
└── README.md             # This file
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

- **NextAuth.js** for authentication
- **Role-based access control**:
  - `USER`: Basic access
  - `ADMIN`: Full content management
  - `SUPER_ADMIN`: System administration

## 🗄️ Database Schema

### Core Models
- **User**: Staff and admin accounts
- **BlogPost**: Blog articles and content
- **Event**: Retreats and events
- **Gallery**: Photo collections
- **Contact**: Contact form submissions
- **Registration**: Event registrations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Static export with `next export`
- **AWS**: Use AWS Amplify or custom setup
- **Docker**: Containerized deployment

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Tailwind CSS** for styling

## 📝 Content Management

### Blog Posts
- Rich text editor with Markdown support
- Featured images and excerpts
- Draft/published status management
- SEO-friendly URLs

### Events
- Date and time management
- Registration tracking
- Location and capacity details
- Featured event highlighting

### Galleries
- Photo upload and organization
- Category-based filtering
- Lightbox image viewing
- Responsive grid layouts

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

- **Image Optimization** with Next.js Image
- **Code Splitting** for faster loading
- **Lazy Loading** for better UX
- **SEO Optimization** for search engines
- **Accessibility** compliance

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
- **Prisma** for the excellent ORM
- **NextAuth.js** for authentication

## 📞 Support

For support or questions:
- **Email**: info@clearviewretreat.org
- **Phone**: (555) 123-4567
- **Website**: https://clearviewretreat.org

---

**Built with ❤️ for spiritual renewal and community building**
