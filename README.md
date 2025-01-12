# UserFlow - Dynamic Form Management System

## Overview

Form management system built with Next.js and Supabase. The system consists of three main interfaces:

1. **User Interface**: A dynamic form flow that adapts based on layout configuration route = "/"
2. **Admin Interface**: Layout management system for creating and configuring form flows route = "/admin"
3. **Data Interface**: Data visualization dashboard for collected user responses route = "/data"

## Architecture

### Tech Stack
- **Frontend**: Next.js with App Router
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Shadcn/ui
- **State Management**: React Context + Hooks
- **Authentication**: Supabase Auth

### Key Components

#### Core Components
- `[slug]/page.jsx`: Page renderer for form flows
- `admin/page.js`: Admin interface for layout management
- `data/page.js`: Data visualization interface
- `SignIn.jsx`: Authentication component

#### Admin Components
- `LayoutSelector`: Layout selection and default management
- `ComponentList`: Component management for form pages
- `CreateLayoutSheet`: Layout creation interface
- `LayoutPreview`: Real-time layout preview

#### Data Components
- `UserTable`: User data visualization
- `RefreshButton`: Data refresh management

### Database Schema

#### Tables
1. **layouts**
   - id (UUID)
   - layout_name (String)
   - is_default (Boolean)
   - created_at (Timestamp)

2. **layout_pages**
   - layout_id (UUID, FK)
   - page_number (Integer)
   - components (Array)

3. **users**
   - id (UUID)
   - email (String)
   - current_page (String)
   - form_data (JSON)
   - layout_id (UUID, FK)

## Features

### User Flow
- Dynamic form progression based on layout configuration
- Progress tracking
- Form data persistence
- Responsive design with modern UI
- Success page on completion

### Admin Dashboard
- Layout creation and management
- Component drag-and-drop interface
- Default layout selection
- Real-time layout preview
- Component validation

### Data Dashboard
- Real-time user data visualization
- Form completion tracking
- Data export capabilities
- User progress monitoring