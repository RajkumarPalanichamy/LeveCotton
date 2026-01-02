# LeveCotton - Premium Fashion E-commerce

A modern e-commerce platform for premium fashion built with Next.js, TypeScript, and shadcn/ui.

## Project Overview

LeveCotton is a complete e-commerce solution featuring:

- **Frontend Store**: Product catalog with filtering, shopping cart, wishlist
- **Admin Dashboard**: Product management with edit/delete functionality
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **API Integration**: RESTful API with 97+ products across 4 categories
- **Responsive Design**: Mobile-first approach with beautiful UI

## Features

### Store Frontend
- 97 products across 4 categories (New Arrivals, Best Sellers, Collections, Sale)
- Advanced filtering by color, fabric, and price range
- Product detail pages with image galleries
- Shopping cart and wishlist functionality
- Responsive design for all devices

### Admin Dashboard
- Product management (edit/delete operations)
- Real-time product updates
- Category-based product organization
- Clean admin interface

## Getting Started

```sh
# Clone the repository
git clone https://github.com/Harish0327/style-hub-admin.git

# Navigate to project directory
cd style-hub-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and state management

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── [category]/        # Category pages
│   ├── product/[id]/      # Product detail pages
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript definitions
└── public/               # Static assets
```

## Deployment

For dynamic functionality with API routes, deploy to:
- **Vercel** (recommended)
- **Railway**
- **Render**
- **Netlify Functions**

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting
