/**
 * Initialize Database Schema
 * Creates all base tables (users, subscriptions, business_plans, etc.)
 *
 * Usage: POSTGRES_URL="..." npx tsx scripts/init-schema.ts
 */

import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

async function initSchema() {
  try {
    console.log('🚀 Initializing database schema...\n');

    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

    // Execute the entire schema
    console.log('📄 Executing schema.sql...');
    await sql.query(schemaSQL);

    console.log('✅ Database schema initialized successfully!\n');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - subscriptions');
    console.log('   - business_plans');
    console.log('   - one_time_purchases');
    console.log('   - notification_queue\n');

  } catch (error) {
    console.error('❌ Error initializing schema:', error);
    throw error;
  }
}

// Run the script
initSchema()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize schema:', error);
    process.exit(1);
  });
