# Supabase Authentication Theme Kit

Modern Next.js application with Supabase authentication, OAuth signin (GitHub & Google), theme switching, and user profile management.

## Features

- 🔐 **OAuth Authentication** - GitHub and Google signin via Supabase
- 🎨 **Theme Support** - Dark/Light mode with multiple color schemes
- 👤 **User Profiles** - Automatic profile creation with RLS policies
- 🗂️ **State Management** - Zustand store with persistence
- 🎯 **TypeScript** - Full type safety
- 🎨 **Modern UI** - Tailwind CSS and Radix UI components
- 📱 **Responsive Design** - Mobile-first approach

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Quick Start

**1. Clone and Install**
```bash
git clone <repository-url>
cd theme-supa-auth
pnpm install
```

**2. Environment Variables**

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**3. Configure Supabase**

Follow the complete setup guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**4. Run Development Server**
```bash
pnpm dev
```

## Authentication Flow

1. User clicks "Sign In" → Opens dialog
2. User selects OAuth provider (GitHub/Google)
3. Provider authorization → Redirects back to app
4. Supabase creates auth user → Trigger creates profile in database
5. App loads user state → User logged in with persisted session

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Lint code
pnpm lint:fix     # Fix linting issues
pnpm format       # Format code with Biome
```

## Customization

**Themes**
- Multiple color schemes available in `lib/color-schemes.ts`
- Add custom themes by extending the configuration
- Theme settings persist across sessions

**Styling**
- Tailwind CSS with custom CSS variables
- Theme-specific styles in `styles/` directory
- Responsive breakpoints for mobile, tablet, desktop

**Components**
- All UI components in `components/ui/` use Radix UI
- Custom components in `components/custom/` for reusability
- Form components with validation support

## Documentation

- **Supabase Setup**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - OAuth, database, and security configuration
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## License

MIT License
