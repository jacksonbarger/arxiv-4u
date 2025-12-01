/**
 * Database Initialization Script
 * Run this to set up the Vercel Postgres database with all tables
 *
 * Usage:
 * 1. Set up Vercel Postgres in your Vercel project dashboard
 * 2. Pull environment variables: vercel env pull .env.local
 * 3. Run: npx tsx scripts/init-db.ts
 */

import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  console.log('🚀 Initializing Vercel Postgres database...\n');

  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split into individual statements (basic split on semicolons)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📄 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        // Extract table/object name for logging
        const match = statement.match(/CREATE (?:TABLE|INDEX|OR REPLACE FUNCTION|TRIGGER)(?: IF NOT EXISTS)?\s+(\w+)/i);
        const objectName = match ? match[1] : `statement ${i + 1}`;

        process.stdout.write(`⏳ Creating ${objectName}...`);
        await sql.query(statement);
        process.stdout.write(` ✅\n`);
        successCount++;
      } catch (error) {
        process.stdout.write(` ❌\n`);
        console.error(`Error executing statement ${i + 1}:`, error);
        console.error('Statement:', statement.substring(0, 100) + '...\n');
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Initialization complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

    // Verify tables were created
    const result = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log('📊 Tables in database:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n✨ Database is ready to use!\n');

  } catch (error) {
    console.error('\n❌ Fatal error during database initialization:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
