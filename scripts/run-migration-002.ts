/**
 * Migration Script: Promo Codes & Referral System
 * Run this to add promo code and referral tables to the database
 *
 * Usage:
 * npx tsx scripts/run-migration-002.ts
 */

import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  console.log('🚀 Running promo codes & referral system migration...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'src/lib/db/migrations/002_promo_and_referrals.sql');
    const migration = fs.readFileSync(migrationPath, 'utf-8');

    // Split into individual statements
    const statements = migration
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
        // Extract object name for logging
        const match = statement.match(/CREATE (?:TABLE|INDEX|OR REPLACE FUNCTION|TRIGGER)(?: IF NOT EXISTS)?\s+(\w+)/i) ||
                     statement.match(/ALTER TABLE\s+(\w+)/i) ||
                     statement.match(/INSERT INTO\s+(\w+)/i);
        const objectName = match ? match[1] : `statement ${i + 1}`;

        process.stdout.write(`⏳ Executing ${objectName}...`);
        await sql.query(statement);
        process.stdout.write(` ✅\n`);
        successCount++;
      } catch (error: any) {
        // If it's already exists error, that's okay
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          process.stdout.write(` ⏭️  (already exists)\n`);
          successCount++;
        } else {
          process.stdout.write(` ❌\n`);
          console.error(`Error executing statement ${i + 1}:`, error);
          console.error('Statement:', statement.substring(0, 100) + '...\n');
          errorCount++;
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Migration complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

    // Verify tables were created
    const result = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('promo_codes', 'promo_code_usage', 'user_referral_codes', 'referrals', 'referral_rewards')
      ORDER BY table_name
    `;

    console.log('📊 New tables created:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    console.log('\n✨ Promo codes & referral system is ready to use!\n');

  } catch (error) {
    console.error('\n❌ Fatal error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
