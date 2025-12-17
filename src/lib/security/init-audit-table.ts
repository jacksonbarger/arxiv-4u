'use server';

import { sql } from '@vercel/postgres';

/**
 * Initialize the audit_logs table
 * Run this once to create the table
 */
export async function initAuditTable(): Promise<{ success: boolean; message: string }> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(50) NOT NULL,
        user_id VARCHAR(255),
        email VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        request_id VARCHAR(36),
        metadata JSONB DEFAULT '{}',
        success BOOLEAN NOT NULL DEFAULT true,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success)`;

    console.log('✓ audit_logs table created successfully');
    return { success: true, message: 'audit_logs table initialized' };
  } catch (error) {
    console.error('Failed to create audit_logs table:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
