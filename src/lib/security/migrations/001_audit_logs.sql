-- Audit Logs Table Migration
-- Stores security-relevant events for compliance and monitoring

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  user_id VARCHAR(255),
  email VARCHAR(255),
  ip_address VARCHAR(45),  -- IPv6 compatible
  user_agent TEXT,
  request_id VARCHAR(36),
  metadata JSONB DEFAULT '{}',
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);

-- Composite index for security analysis
CREATE INDEX IF NOT EXISTS idx_audit_logs_security
ON audit_logs(action, ip_address, created_at)
WHERE success = false;

-- Add comment for documentation
COMMENT ON TABLE audit_logs IS 'Security audit trail for sensitive actions';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed (auth:login, payment:succeeded, etc.)';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional context as JSON (paperId, amount, etc.)';
COMMENT ON COLUMN audit_logs.request_id IS 'Correlation ID for distributed tracing';
