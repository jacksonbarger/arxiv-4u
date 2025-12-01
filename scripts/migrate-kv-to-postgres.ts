/**
 * Migration Script: Vercel KV → Vercel Postgres
 * Migrates existing user data from Vercel KV (Redis) to Postgres
 *
 * Usage:
 * 1. Ensure both KV and Postgres env vars are set in .env.local
 * 2. Run database initialization first: npx tsx scripts/init-db.ts
 * 3. Run migration: npx tsx scripts/migrate-kv-to-postgres.ts
 */

import { kv } from '@vercel/kv';
import { sql } from '@vercel/postgres';

interface KVUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: string;
  emailNotifications: boolean;
  notificationFrequency: 'daily' | 'weekly';
  notificationCategories: string[];
}

async function migrateUsers() {
  console.log('👥 Migrating users from KV to Postgres...\n');

  try {
    // Get all user IDs from KV
    // We'll scan for keys matching user:email:* pattern
    const emailKeys = await kv.keys('user:email:*');
    console.log(`Found ${emailKeys.length} users in KV\n`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const emailKey of emailKeys) {
      try {
        // Get user data from KV
        const userData = await kv.get<KVUser>(emailKey);
        if (!userData) {
          console.log(`⚠️  Skipping ${emailKey} - no data found`);
          skippedCount++;
          continue;
        }

        console.log(`⏳ Migrating ${userData.email}...`);

        // Check if user already exists in Postgres
        const existing = await sql`
          SELECT id FROM users WHERE email = ${userData.email} LIMIT 1
        `;

        if (existing.rows.length > 0) {
          console.log(`   ⏭️  Already exists in Postgres`);
          skippedCount++;
          continue;
        }

        // Insert into Postgres
        await sql`
          INSERT INTO users (
            id,
            email,
            username,
            password_hash,
            created_at,
            email_verified,
            verification_token,
            verification_token_expiry,
            email_notifications,
            notification_frequency,
            notification_categories,
            subscription_tier,
            subscription_status,
            free_business_plans_remaining
          ) VALUES (
            ${userData.id},
            ${userData.email},
            ${userData.username},
            ${userData.passwordHash},
            ${userData.createdAt},
            ${userData.emailVerified},
            ${userData.verificationToken || null},
            ${userData.verificationTokenExpiry || null},
            ${userData.emailNotifications},
            ${userData.notificationFrequency},
            ${JSON.stringify(userData.notificationCategories)},
            'free',
            'active',
            3
          )
        `;

        console.log(`   ✅ Migrated successfully`);
        migratedCount++;

      } catch (error) {
        console.error(`   ❌ Error migrating user:`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log(`   Migrated: ${migratedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

    if (errorCount === 0) {
      console.log('✅ Migration completed successfully!\n');
      console.log('⚠️  Note: You can now update your code to use Postgres instead of KV');
      console.log('   KV data has been preserved - you can delete it manually if desired\n');
    } else {
      console.log('⚠️  Migration completed with errors. Please review above.\n');
    }

  } catch (error) {
    console.error('\n❌ Fatal error during migration:', error);
    process.exit(1);
  }
}

async function migrateNotifications() {
  console.log('🔔 Migrating notifications from KV to Postgres...\n');

  try {
    // Get all notification user keys
    const notifUserKeys = await kv.keys('user:notifications:*');
    console.log(`Found ${notifUserKeys.length} users with notifications\n`);

    let totalMigrated = 0;

    for (const userKey of notifUserKeys) {
      try {
        const userId = userKey.replace('user:notifications:', '');
        const notificationIds = await kv.smembers(userKey);

        console.log(`⏳ Migrating ${notificationIds.length} notifications for user ${userId}...`);

        for (const notifId of notificationIds) {
          try {
            const notifData = await kv.get(`notification:${notifId}`);
            if (!notifData || typeof notifData !== 'object') continue;

            const notif = notifData as {
              id: string;
              userId: string;
              type: string;
              message: string;
              paperId?: string;
              paperTitle?: string;
              read: boolean;
              createdAt: string;
            };

            // Check if already exists
            const existing = await sql`SELECT id FROM notifications WHERE id = ${notif.id} LIMIT 1`;
            if (existing.rows.length > 0) continue;

            // Insert notification
            await sql`
              INSERT INTO notifications (
                id,
                user_id,
                type,
                title,
                message,
                paper_id,
                read,
                created_at
              ) VALUES (
                ${notif.id},
                ${notif.userId},
                ${notif.type},
                ${notif.paperTitle || 'Notification'},
                ${notif.message},
                ${notif.paperId || null},
                ${notif.read},
                ${notif.createdAt}
              )
            `;

            totalMigrated++;
          } catch (error) {
            console.error(`     ⚠️  Error migrating notification ${notifId}:`, error);
          }
        }

        console.log(`   ✅ Migrated notifications for user ${userId}`);

      } catch (error) {
        console.error(`   ❌ Error processing user notifications:`, error);
      }
    }

    console.log(`\n✅ Migrated ${totalMigrated} notifications total\n`);

  } catch (error) {
    console.error('\n⚠️  Error during notification migration:', error);
    console.log('   Continuing anyway - this is non-critical\n');
  }
}

// Run migrations
async function runAllMigrations() {
  console.log('🚀 Starting migration from Vercel KV to Postgres\n');
  console.log('='.repeat(50) + '\n');

  await migrateUsers();
  await migrateNotifications();

  console.log('='.repeat(50));
  console.log('✨ All migrations complete!\n');
  console.log('Next steps:');
  console.log('1. Verify data in Postgres database');
  console.log('2. Update your application code to use Postgres queries');
  console.log('3. Test thoroughly before removing KV dependencies\n');
}

runAllMigrations()
  .then(() => {
    console.log('👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
