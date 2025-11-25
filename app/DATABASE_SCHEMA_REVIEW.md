# NeuroLint App Database Schema Review

## Overview
The Supabase database schema consists of 10 migration files creating a comprehensive database structure for the NeuroLint SaaS platform.

## Migration Files (Chronological)
1. `20250809233514_initial_schema.sql` - Core tables
2. `20250809233549_collaboration_tables.sql` - Collaboration features
3. `20250809233633_billing_and_integrations.sql` - Billing and integrations
4. `20250809233634_collaboration_analyses.sql` - Collaboration analytics
5. `20250809233634_user_subscriptions.sql` - User subscription management
6. `20250810001159_fix-collaboration-tables.sql` - Collaboration fixes
7. `20250810001424_fix-rls-policies.sql` - RLS policy fixes
8. `20250810001716_fix-rls-simple.sql` - Simplified RLS
9. `20250904094348_add_analysis_history_columns.sql` - Analytics enhancements
10. `20250904094619_add_analysis_history_columns.sql` - Additional analytics columns

## Core Tables

### User Management
- **profiles** - User profiles with subscription data (plan, trial, payment method)
- **user_settings** - Dashboard preferences, theme, notifications, onboarding status

### Code Analysis
- **analysis_history** - Analysis results with layers, execution time, and results
- **projects** - User project management with files, stats, and last analyzed timestamp
- **fix_history** - Code fix history with original/fixed code and issues fixed

### API & Usage
- **api_keys** - API key management with permissions, expiration, and usage tracking
- **usage_logs** - Detailed usage tracking (actions, files processed, layers used, cost, credits)

## Collaboration Tables

### Team Management
- **teams** - Team entities with owner, settings
- **team_members** - Team membership with roles (owner/admin/member)
- **team_invitations** - Pending team invitations with expiration

### Real-time Collaboration
- **collaboration_sessions** - Live collaboration sessions with document content, participants
- **collaboration_participants** - Session participants with user name, color, role, activity
- **collaboration_comments** - Comments on code with file path, line number, resolution status

## Billing & Integrations

### Billing
- **project_subscriptions** - Project-level subscriptions (plan, billing period, status)
- **project_usage** - Monthly usage tracking for projects
- **billing_cycles** - Historical billing cycles with usage and costs

### Webhooks
- **webhooks** - Webhook configurations with timeout/retry settings (Vercel optimized)
- **webhook_events** - Webhook event history with responses and retry tracking

### Third-party Integrations
- **integrations** - OAuth integrations (GitHub, GitLab, Jenkins) with tokens
- **integration_runs** - Integration execution history with performance metrics

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Team members can access team resources
- Proper role-based access (owner/admin/member)
- No infinite recursion in policy checks

### Optimizations
- Comprehensive indexing on user_id, timestamps, and status fields
- Updated_at triggers on all major tables
- Foreign key constraints with proper CASCADE behaviors
- Check constraints for enum-like fields

## Vercel-Specific Optimizations
- Webhook timeout tracking (default 10s)
- Processing time metrics on all async operations
- Retry logic with configurable delays
- Execution time tracking for performance monitoring

## Schema Completeness: ✅ COMPLETE

### All Required Features Supported:
- ✅ User authentication and profiles
- ✅ API key management
- ✅ Code analysis and fix history
- ✅ Project management
- ✅ Team collaboration
- ✅ Real-time collaboration sessions
- ✅ Billing and subscriptions
- ✅ Webhook integrations
- ✅ Third-party integrations (GitHub, GitLab, Jenkins)
- ✅ Usage tracking and analytics
- ✅ Comprehensive RLS policies

## Notes for Development
1. Run migrations in order using Supabase CLI: `supabase db push`
2. All environment variables documented in `.env.example`
3. Service role key required for admin operations
4. Anon key for client-side operations
5. RLS policies properly prevent privilege escalation
