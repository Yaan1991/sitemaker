# Overview

This is a personal portfolio website for Yan Kuzmichev, a composer, sound designer, and sound engineer with 14+ years of experience. The site showcases his work across theatre, film, and audio productions, featuring project galleries, detailed work descriptions, and contact information. Built as a modern full-stack web application with a focus on visual presentation and user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming, using a dark neon aesthetic
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Animations**: Framer Motion for smooth page transitions and component animations
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: Hot reload with Vite integration in development mode
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Project Structure
- **Monorepo**: Client, server, and shared code in single repository
- **Client**: React frontend in `/client` directory
- **Server**: Express backend in `/server` directory  
- **Shared**: Common types and schemas in `/shared` directory
- **Component Organization**: Atomic design with reusable UI components

## Key Features
- **Portfolio Showcase**: Project galleries organized by category (theatre, film, audio)
- **Auto-slider**: Custom carousel component for project presentations
- **SEO Optimization**: React Helmet for meta tags and structured data
- **Responsive Design**: Mobile-first approach with glass morphism effects
- **Contact Form**: Validated contact form with toast notifications
- **Timeline View**: Chronological work history display

# External Dependencies

## Database
- **PostgreSQL**: Primary database with Neon serverless PostgreSQL
- **Drizzle Kit**: Database migrations and schema management

## UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

## Form and Validation
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Zod integration for form validation

## Routing and State
- **Wouter**: Minimalist router for React
- **TanStack Query**: Server state management and caching

## Assets and Media
- **WebP Images**: Optimized image formats for better performance
- **Google Fonts**: Inter font family for typography
- **Custom Icons**: PNG icons for social media links