# Supabase Setup Guide

Complete guide for configuring Supabase authentication with OAuth providers, database setup, and security policies.

## Prerequisites

- Supabase account and project
- GitHub and/or Google developer accounts for OAuth

## OAuth Provider Setup

### GitHub OAuth

**1. Create GitHub OAuth App**
- Go to GitHub Settings → Developer settings → OAuth Apps
- Click "New OAuth App"
- Fill in the details:
  - **Application name**: Your app name
  - **Homepage URL**: `http://localhost:3000` (development)
  - **Authorization callback URL**: `https://your-project.supabase.co/auth/v1/callback`
- Click "Register application"

**2. Configure in Supabase**
- Supabase Dashboard → Authentication → Providers
- Enable GitHub provider
- Copy Client ID and Client Secret from GitHub to Supabase
- Save configuration

### Google OAuth

**1. Create Google OAuth Credentials**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to APIs & Services → Credentials
- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Configure consent screen if prompted
- Set Application type to "Web application"
- Add Authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
- Click "Create"

**2. Configure in Supabase**
- Supabase Dashboard → Authentication → Providers
- Enable Google provider
- Copy Client ID and Client Secret from Google to Supabase
- Save configuration

## Database Configuration

### Complete SQL Setup Script

Run the following SQL in your Supabase SQL Editor:

```sql
-- ============================================
-- 1. CREATE PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  name text,
  avatar text,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (lower(email));

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES
-- ============================================

-- Allow authenticated users to SELECT their own profile
CREATE POLICY "Select own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Allow authenticated users to UPDATE their own profile
CREATE POLICY "Update own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow authenticated users to INSERT their profile
CREATE POLICY "Insert profile by auth" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ============================================
-- 4. CREATE TRIGGER FUNCTION
-- ============================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS user_profile_insert ON auth.users;

-- Create the trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_auth_user_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar, "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL),
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER user_profile_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_auth_user_insert();
```

### What This Does

**Profiles Table**
- Stores user profile data linked to Supabase Auth users
- Cascades deletion when auth user is deleted
- Indexes email for fast lookups

**Row Level Security (RLS)**
- Only authenticated users can access profiles
- Users can only see and modify their own profile
- `auth.uid()` ensures users are isolated to their own data

**Automatic Profile Creation**
- Trigger automatically creates profile when user signs up
- Extracts name and avatar from OAuth provider metadata
- Prevents duplicate profiles with `ON CONFLICT DO NOTHING`

## Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get Your Credentials:**
- Supabase Dashboard → Settings → API
- Copy Project URL and anon/public key
- Never commit to version control

## Testing Your Setup

**1. Test OAuth Login**
- Start development server
- Try signing in with GitHub and Google
- Verify successful authentication

**2. Verify Profile Creation**
- Check Supabase Dashboard → Table Editor → profiles
- Confirm profile was created with correct data

**3. Test RLS Policies**
- Verify users can only access their own profile
- Test that unauthorized access is blocked

## Troubleshooting

**OAuth Redirect Mismatch**
- Ensure callback URLs match exactly in provider and Supabase
- Check for trailing slashes or protocol mismatches

**Profile Not Created**
- Verify trigger function exists in SQL Editor
- Check Supabase logs for errors
- Ensure RLS policies allow INSERT

**RLS Policy Issues**
- Confirm RLS is enabled: `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`
- Test policies with different user contexts
- Use Supabase SQL Editor to debug with `SELECT auth.uid();`

## Security Best Practices

1. **Never expose service keys** - Only use anon/public keys in client code
2. **Always use RLS** - Enable and test row-level security on all tables
3. **Validate OAuth redirects** - Use exact callback URLs
4. **Monitor logs** - Check Supabase Dashboard regularly
5. **Keep dependencies updated** - Update Supabase client libraries

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [OAuth Provider Setup](https://supabase.com/docs/guides/auth/social-login)
