-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired tokens (optional)
-- This would typically be done with a cron job or scheduled task
-- For now, we'll just create the function that can be called manually

-- Insert some test data (optional, for development)
-- Note: These tokens are just examples and should not be used in production
-- INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES
-- ((SELECT id FROM users WHERE email = 'patient@example.com'), 'test-token-123', NOW() + INTERVAL '1 hour');

COMMENT ON TABLE password_reset_tokens IS 'Stores secure tokens for password reset functionality';
COMMENT ON COLUMN password_reset_tokens.token IS 'Cryptographically secure random token for password reset';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Token expiration time (typically 1 hour from creation)';
