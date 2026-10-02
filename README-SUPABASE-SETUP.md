# MindWell Supabase Setup Guide

This guide will help you migrate from Cosmic backend to Supabase backend for your MindWell application.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to Settings → API to get your project URL and API keys

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: For AI chat functionality
OPENAI_API_KEY=your-openai-api-key-here
```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql`
3. Click **Run** to execute the SQL

### 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication → Settings**
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. Add these **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/login`
   - `http://localhost:3000/signup`

### 6. Enable OAuth Providers

To enable Google and GitHub sign-in:

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Set Application type to "Web application"
6. Add authorized redirect URIs: `https://vzbapjgyxdcargacupeb.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret
8. Paste the credentials into Supabase only; never commit them to this repository.

#### GitHub OAuth:
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL: `https://vzbapjgyxdcargacupeb.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret

#### In Supabase:
1. Go to Authentication → Providers
2. Enable Google provider, paste Client ID and Secret
3. Enable GitHub provider, paste Client ID and Secret
4. Save changes

### 7. Run Setup Validation

```bash
node setup-supabase.js
```

This script will validate your configuration and provide next steps.

### 8. Start Development Server

```bash
npm run dev
```

## 📁 Files Created/Modified

### New Files:
- `lib/supabaseClient.ts` - Supabase client configuration
- `supabase-setup.sql` - Database schema and policies
- `setup-supabase.js` - Setup validation script
- `.env.local` - Environment variables template
- `README-SUPABASE-SETUP.md` - This setup guide

### Modified Files:
- `package.json` - Added Supabase dependencies, removed Cosmic packages
- `middleware.ts` - Updated to use Supabase auth middleware
- `app/layout.tsx` - Added Supabase session provider
- `app/api/auth/[...cosmic-authentication]/route.ts` - Replaced with Supabase auth handlers
- `app/api/profile/route.ts` - Updated to use Supabase database
- `app/api/sessions/route.ts` - Updated to use Supabase database
- `app/api/admin/sessions/route.ts` - Updated to use Supabase database
- `app/api/admin/analytics/route.ts` - Updated to use Supabase database
- `app/api/ai/chat/route.ts` - Fixed environment variable reference
- `app/components/Sidebar.tsx` - Updated to use Supabase session
- `app/components/DashboardShell.tsx` - Updated to use Supabase session
- `app/components/UserDropdown.tsx` - Updated to use Supabase session

## 🔧 Database Schema

The migration creates two main tables:

### `users` table:
- `id` (UUID, Primary Key, references auth.users)
- `email` (TEXT, Unique)
- `display_name` (TEXT)
- `phone` (TEXT)
- `onboarded` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `sessions` table:
- `id` (UUID, Primary Key)
- `user_id` (UUID, references auth.users)
- `email` (TEXT)
- `date` (DATE)
- `time` (TIME)
- `support_type` (TEXT)
- `notes` (TEXT)
- `status` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔒 Security Policies

Row Level Security (RLS) is enabled with the following policies:

### Users Table:
- Users can view, update, and insert their own profile
- Admin can view all user profiles

### Sessions Table:
- Users can view, create, and update their own sessions
- Admin can view all sessions

## 🧪 Testing the Migration

### Authentication Testing:
1. Try signing up a new user
2. Try logging in with existing credentials
3. Test password reset functionality
4. Verify protected routes work correctly

### Database Testing:
1. Create a user profile
2. Book a counseling session
3. View sessions in dashboard
4. Test admin analytics (if admin user)

### API Testing:
```bash
# Test profile API
curl -X GET http://localhost:3000/api/profile \
  -H "Cookie: sb-access-token=your-token"

# Test sessions API
curl -X GET http://localhost:3000/api/sessions \
  -H "Cookie: sb-access-token=your-token"
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Module not found" errors:**
   - Run `npm install` to ensure all dependencies are installed

2. **Authentication not working:**
   - Check that your Supabase URL and keys are correct in `.env.local`
   - Verify redirect URLs are configured in Supabase dashboard

3. **Database connection issues:**
   - Ensure the database schema has been created by running `supabase-setup.sql`
   - Check that RLS policies are properly configured

4. **TypeScript errors:**
   - Run `npm run lint` to check for any remaining issues
   - Ensure all Supabase types are properly imported

### Getting Help:

If you encounter issues:
1. Check the browser console for error messages
2. Check the terminal for server-side errors
3. Verify your environment variables are loaded correctly
4. Ensure your Supabase project is properly configured

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## ✅ Migration Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Authentication configured
- [ ] Dependencies installed
- [ ] Application tested
- [ ] Admin functionality verified

---

🎉 **Congratulations!** Your MindWell application has been successfully migrated from Cosmic to Supabase backend.
