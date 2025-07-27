-- Add profile fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS medical_history TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing users with sample profile data
UPDATE users 
SET 
    date_of_birth = '1990-05-15',
    address = '123 Main Street, City, State 12345',
    emergency_contact = 'John Doe - +1234567890',
    medical_history = 'No significant medical history',
    allergies = 'No known allergies',
    updated_at = NOW()
WHERE role = 'patient' AND date_of_birth IS NULL;

-- Add some sample profile data for Arabic users
UPDATE users 
SET 
    date_of_birth = '1985-03-20',
    address = 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
    emergency_contact = 'أحمد محمد - +966501234567',
    medical_history = 'لا يوجد تاريخ طبي مهم',
    allergies = 'لا توجد حساسية معروفة',
    updated_at = NOW()
WHERE email LIKE '%arabic%' OR first_name IN ('أحمد', 'فاطمة', 'محمد', 'عائشة');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at);
