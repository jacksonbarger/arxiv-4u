/**
 * Run Promo & Referral Migration (Fixed)
 * Executes the entire SQL file as one query
 */

import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('🚀 Running promo codes & referral system migration...\n');

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'src/lib/db/migrations/002_promo_and_referrals.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Execute the entire migration as one query
    console.log('📄 Executing migration SQL...');
    await sql.query(migrationSQL);

    console.log('\n✅ Migration completed successfully!\n');
    console.log('📊 New tables created:');
    console.log('   - promo_codes');
    console.log('   - promo_code_usage');
    console.log('   - user_referral_codes');
    console.log('   - referrals');
    console.log('   - referral_rewards\n');

  } catch (error) {
    console.error('❌ Error running migration:', error);
    throw error;
  }
}

// Run the script
runMigration()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to run migration:', error);
    process.exit(1);
  });
