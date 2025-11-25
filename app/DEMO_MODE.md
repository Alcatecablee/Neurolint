# 🎮 Demo Mode - Test Without Supabase

Demo mode allows you to test and develop the NeuroLint app without needing Supabase credentials or any external services.

## ✅ What Works in Demo Mode

### Full UI Testing
- ✅ All pages render (landing, pricing, docs, dashboard)
- ✅ Navigation and routing
- ✅ UI components, layouts, and styling
- ✅ Dashboard with realistic mock data

### Dashboard Features
- ✅ **Projects**: View 3 demo projects with stats
- ✅ **Analysis History**: See past code analysis results
- ✅ **API Keys**: Manage 3 demo API keys  
- ✅ **Teams**: View team collaboration features
- ✅ **Usage Logs**: See usage analytics and metrics
- ✅ **Settings**: Access user preferences

### Mock Data Included
- Demo user with Professional plan
- 3 sample projects with different stats
- Analysis history with fix results
- API keys with different permissions
- Team collaboration sessions
- Usage tracking data

## 🚀 How to Use Demo Mode

### 1. Already Enabled!
Demo mode is automatically enabled via `.env.local`:
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

### 2. Start the App
```bash
cd app
npm run dev
```

### 3. Access Dashboard
Navigate to: `http://localhost:3000/dashboard`

**Demo Login:**
- Email: demo@neurolint.dev
- Password: (any password works in demo mode)

Or just navigate directly to `/dashboard` - you'll be automatically "logged in"

## 🔄 Switching Between Demo and Real Mode

### Demo Mode (Current)
```env
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

### Real Mode (When Ready)
```env
# .env.local
NEXT_PUBLIC_DEMO_MODE=false

# Add your real Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# ... other credentials from .env.example
```

## 📝 What Demo Mode Does

### Authentication
- Bypasses Supabase auth
- Auto-logs you in as demo user
- No password validation needed

### Database Queries
- Intercepts all Supabase queries
- Returns mock data from `lib/demo-data.ts`
- Simulates real database responses

### API Calls
- Most API routes will return demo data
- Some features may show "Demo Mode" notices
- Writes/updates are logged but not persisted

## 🧪 Testing Features

### What You CAN Test
✅ UI/UX and visual design
✅ Navigation and page layouts
✅ Component functionality
✅ Dashboard interactions
✅ Form validation (client-side)
✅ Responsive design
✅ Theme switching
✅ Settings management (UI)

### What You CANNOT Test (Requires Real Services)
❌ Actual database persistence
❌ Real authentication flows
❌ PayPal payment processing
❌ GitHub/GitLab OAuth
❌ Email sending
❌ Webhook delivery
❌ Real-time collaboration sync

## 🎨 Customizing Demo Data

Edit `app/lib/demo-data.ts` to customize:
- Projects and their stats
- Analysis history entries
- API keys and permissions
- Team information
- Usage logs

Example:
```typescript
// Add more demo projects
export const DEMO_PROJECTS = [
  {
    id: 'my-project',
    name: 'My Custom Project',
    description: 'Testing feature X',
    // ... other fields
  },
  // ... existing projects
];
```

## 💡 Tips

1. **Inspect Console**: Demo mode logs all database operations to console
2. **No Data Loss**: Since nothing persists, you can't break anything!
3. **Fast Iteration**: Test UI changes instantly without backend setup
4. **Realistic Data**: Mock data mimics real database structure

## 🐛 Troubleshooting

### "Cannot find module" errors
Run: `npm install` in the `/app` directory

### Page shows "Loading..." forever
Check browser console for errors. Make sure `.env.local` has `NEXT_PUBLIC_DEMO_MODE=true`

### Features not working
Some features requiring real services will show disabled state or placeholder messages in demo mode

## 🎯 Next Steps

Once you're ready for production:

1. Set up Supabase project
2. Run database migrations
3. Configure environment variables
4. Switch `NEXT_PUBLIC_DEMO_MODE=false`
5. Test with real services

---

**Demo mode lets you develop and test 80% of features without any backend setup!**
