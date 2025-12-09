# EMUNAH - Sistema de Vendas e Orçamentos

## Overview

EMUNAH is a complete web-based sales and production management system for personalized evangelical t-shirts. The system enables creating quotes (with or without registered clients), tracking orders through production stages, managing suppliers and products, and financial control. Key features include flexible quotation workflows, automatic quote-to-order conversion, production tracking, sales dashboard with metrics, supplier/product/print management, and payment control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Primary Server**: Express.js (TypeScript) running on Node.js
- **Legacy Server**: Flask (Python) with SQLAlchemy - appears to be a previous implementation
- **API Pattern**: RESTful endpoints under `/api/*` prefix
- **Server Entry**: `server/index.ts` with HTTP server creation

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Database**: PostgreSQL (configured via `DATABASE_URL` environment variable)
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui)
│   │   ├── pages/        # Route page components
│   │   ├── lib/          # Utilities and API client
│   │   └── hooks/        # Custom React hooks
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── db.ts         # Database connection
│   └── storage.ts    # Data access layer
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migration files
```

### Key Design Decisions
1. **Monorepo Structure**: Single repository with shared schema enables type safety across frontend and backend
2. **Component Library**: Using shadcn/ui (New York style) provides consistent, accessible UI components
3. **API Client Pattern**: Centralized API functions in `client/src/lib/api.ts` with React Query integration
4. **Schema-First Development**: Drizzle-Zod integration for validation schemas derived from database schema

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database queries and schema management

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **Radix UI**: Headless UI primitives (dialog, dropdown, tabs, etc.)
- **Recharts**: Dashboard charts and visualizations
- **date-fns**: Date formatting and manipulation

### Backend Libraries
- **Express**: HTTP server framework
- **pg**: PostgreSQL client for Node.js
- **connect-pg-simple**: PostgreSQL session store

### Build & Development
- **Vite**: Frontend bundling and dev server
- **esbuild**: Server-side bundling for production
- **TypeScript**: Type checking across the codebase

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `ADMIN_PHONE`: Admin credentials (optional, for legacy Flask app)