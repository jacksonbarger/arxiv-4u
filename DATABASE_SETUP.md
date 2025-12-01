# Database Setup Guide

This guide will help you set up Vercel Postgres for Arxiv-4U.

## Prerequisites

- Vercel account
- Vercel CLI installed (`npm i -g vercel`)
- Project linked to Vercel (`vercel link`)

## Step 1: Create Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `arxiv-4u` project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a database name (e.g., `arxiv-4u-db`)
7. Select your region (choose closest to your users)
8. Click **Create**

## Step 2: Pull Environment Variables

Once the database is created, pull the environment variables to your local `.env.local`:

```bash
vercel env pull .env.local
```

This will automatically add all the Postgres connection strings:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- And other Postgres-related variables

## Step 3: Initialize Database Schema

Run the initialization script to create all tables:

```bash
npm run db:init
```

This will:
- Create all tables (users, subscriptions, business_plans, etc.)
- Set up indexes for performance
- Create triggers for auto-updating timestamps
- Display a summary of created objects

**Expected Output:**
```
🚀 Initializing Vercel Postgres database...

⏳ Creating users... ✅
⏳ Creating subscriptions... ✅
⏳ Creating business_plans... ✅
...

✅ Initialization complete!
   Success: 25
   Errors: 0

📊 Tables in database:
   - users
   - subscriptions
   - business_plans
   - one_time_purchases
   - paper_cache
   - bookmarks
   - reading_history
   - notifications
   - usage_analytics

✨ Database is ready to use!
```

## Step 4: Migrate Existing Data (Optional)

If you have existing users in Vercel KV, migrate them to Postgres:

```bash
npm run db:migrate
```

This will:
- Copy all users from KV to Postgres
- Migrate notifications
- Preserve all existing data
- Skip users that already exist (idempotent)

**Note:** This is safe to run multiple times.

## Step 5: Verify Setup

Test your database connection:

```bash
# Start the dev server
npm run dev

# Try creating a test user (via signup page)
# Check that data appears in Vercel Postgres dashboard
```

## Database Schema Overview

### Core Tables

**users**
- User authentication and profile
- Subscription tier and status
- Usage tracking (business plans generated)
- Stripe customer association

**subscriptions**
- Active subscriptions (Basic, Premium)
- Trial periods
- Stripe subscription metadata

**business_plans**
- Generated business plans
- Purchase type (free, one-time, subscription)
- Plan content (JSONB)
- Versioning support

**one_time_purchases**
- $0.99 business plan purchases
- Payment intent tracking
- Status management

**paper_cache**
- AI-generated analysis results
- Commercial scores
- Marketing insights
- Auto-expiration (7 days)

**bookmarks**
- User-saved papers
- Collection organization
- Notes

**reading_history**
- Viewed papers tracking
- View count and duration
- Last viewed timestamp

**notifications**
- In-app notifications
- Read/unread status
- Action URLs

**usage_analytics**
- Event tracking
- User behavior analysis
- JSONB event data

## Common Operations

### Reset Database

**⚠️ WARNING: This will delete ALL data!**

```bash
# Drop all tables
npm run db:reset

# Re-initialize
npm run db:init
```

### Check Database Status

Go to your Vercel dashboard:
1. Project → Storage → Your Postgres database
2. Click "Data" tab to browse tables
3. Click "Query" tab to run SQL queries

### Manual SQL Queries

You can run queries via:

1. **Vercel Dashboard:**
   - Go to Storage → Postgres → Query tab
   - Run SQL directly

2. **Local psql:**
   ```bash
   # Get connection string from .env.local
   psql $POSTGRES_URL
   ```

3. **In your code:**
   ```typescript
   import { sql } from '@vercel/postgres';

   const result = await sql`SELECT * FROM users LIMIT 10`;
   console.log(result.rows);
   ```

## Troubleshooting

### "Connection failed" Error

1. Check that environment variables are set:
   ```bash
   echo $POSTGRES_URL
   ```

2. Re-pull from Vercel:
   ```bash
   vercel env pull .env.local --force
   ```

3. Restart your dev server

### "Table already exists" Error

This is normal if you run `db:init` multiple times. The schema uses `CREATE TABLE IF NOT EXISTS`, so it's safe.

### Migration Issues

If migration fails:

1. Check that both KV and Postgres env vars are set
2. Verify KV has data: `vercel kv get user:email:your@email.com`
3. Run migration with `--verbose` flag (add to script if needed)
4. Check Vercel dashboard for database connection

### Performance Issues

If queries are slow:

1. Check indexes are created (should happen during `db:init`)
2. Monitor query performance in Vercel dashboard
3. Consider adding more indexes based on your query patterns

## Production Deployment

When deploying to production:

1. **Environment Variables:**
   - All Postgres env vars are auto-configured by Vercel
   - Ensure Stripe keys are set in Vercel dashboard
   - Set `ANTHROPIC_API_KEY` in Vercel

2. **Database:**
   - Production and preview deployments share the same database
   - Consider creating separate databases for production/staging
   - Set up automated backups (available in Vercel Pro)

3. **Migrations:**
   - Run migrations from your local machine initially
   - For production updates, consider using a deployment script
   - Always test migrations on a staging database first

## Security Best Practices

1. **Never commit `.env.local`** - already in .gitignore
2. **Use different databases** for development and production
3. **Enable SSL** in production (enabled by default)
4. **Regular backups** - Vercel Pro includes point-in-time recovery
5. **Monitor access logs** in Vercel dashboard
6. **Use connection pooling** - `POSTGRES_URL` includes this by default

## Need Help?

- **Vercel Postgres Docs:** https://vercel.com/docs/storage/vercel-postgres
- **SQL Reference:** https://www.postgresql.org/docs/
- **Vercel Support:** https://vercel.com/support

---

**Last Updated:** 2024
**Schema Version:** 1.0
