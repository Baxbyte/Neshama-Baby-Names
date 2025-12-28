# Neshama Baby Names - Jewish Baby Naming Application

## Overview

Neshama Baby Names is a Jewish baby naming application that helps parents find meaningful names to honor their heritage. The app supports both **Ashkenazi and Sephardic naming traditions**, allowing users to search through a curated database of Jewish names (both English and Hebrew), build complete name combinations using drag-and-drop functionality, and save their favorite name ideas. The name "Neshama" (נשמה) means "soul" in Hebrew, reflecting the app's purpose of choosing names that carry spiritual significance—whether for Brit Milah, Simchat Bat, or conversion (Ger).

### Naming Traditions Supported
- **Ashkenazi Tradition**: Names honor deceased relatives to keep their memory alive (zichrono livracha)
- **Sephardic Tradition**: Names often honor living grandparents as a sign of respect and blessing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: 
  - React Context API for global app state (relatives, selected names, last name)
  - TanStack React Query for server state and API caching
  - Local storage persistence for user session data
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom "Heritage & Hope" theme (cream backgrounds, deep blue primary, warm gold accents)
- **Drag and Drop**: @dnd-kit/core and @dnd-kit/sortable for name builder functionality
- **Typography**: Cinzel (display), Playfair Display (serif), and Lato (sans-serif) fonts

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API endpoints under `/api/` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Build System**: 
  - Vite for frontend development and production builds
  - esbuild for server bundling with selective dependency bundling for cold start optimization

### Data Layer
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` using Drizzle schema definitions
- **Tables**:
  - `users`: Basic user accounts (id, username, password)
  - `savedNames`: Saved name combinations (firstName, middleName, hebrewName, lastName with Hebrew variants)
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components (NameBuilder, NameCard, NameSearch, etc.)
│   │   ├── pages/        # Route pages (home, saved-names)
│   │   ├── lib/          # Utilities, API client, context, name data
│   │   └── hooks/        # Custom React hooks
├── server/           # Backend Express application
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between client and server
│   └── schema.ts     # Drizzle database schema and Zod types
└── migrations/       # Drizzle database migrations
```

### Key Design Decisions

1. **Monorepo Structure**: Client and server share TypeScript types through the `shared/` directory, ensuring type safety across the full stack.

2. **Static Name Database**: Names are stored as a static TypeScript array in `client/src/lib/data.ts` rather than the database for fast client-side filtering and searching.

3. **Drag-and-Drop Name Builder**: Users can drag names from the search results into three slots (first name, middle name, Hebrew name) to compose full name combinations.

4. **Local Storage Persistence**: App state persists across browser sessions using localStorage, providing a seamless experience without requiring authentication.

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection managed via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migration tool (`npm run db:push` to sync schema)

### Third-Party UI Libraries
- **Radix UI**: Headless UI primitives for accessible components
- **shadcn/ui**: Pre-built component library (new-york style variant)
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **embla-carousel-react**: Carousel component
- **vaul**: Drawer component
- **cmdk**: Command palette component

### Build & Development
- **Vite**: Frontend build tool with HMR
- **Replit Plugins**: 
  - `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
  - `@replit/vite-plugin-cartographer`: Development tooling
  - `@replit/vite-plugin-dev-banner`: Development banner

### Fonts (External CDN)
- Google Fonts: Cinzel, Playfair Display, Lato