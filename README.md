# Style Hub Admin - Next.js Version

A modern e-commerce admin dashboard built with Next.js, TypeScript, and shadcn/ui.

## Project Overview

This project has been converted from a React/Vite application to Next.js with the following features:

- **Frontend Store**: Product catalog, shopping cart, checkout
- **Admin Dashboard**: Product management, order tracking, customer management
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Local Storage**: Client-side data persistence

## Getting Started

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd style-hub-admin

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

This project is built with:

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **React** - UI library
- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and state management

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── product/[id]/      # Dynamic product pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── Navbar.tsx        # Navigation component
│   └── providers.tsx     # Client-side providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Features

### Store Frontend
- Product catalog with filtering
- Product detail pages
- Shopping cart functionality
- Checkout process
- Responsive design

### Admin Dashboard
- Product management (CRUD operations)
- Order tracking and management
- Customer information
- Dashboard analytics
- Inventory management

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
