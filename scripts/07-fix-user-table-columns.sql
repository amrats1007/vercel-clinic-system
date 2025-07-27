-- Add missing columns to users table safely
DO $$ 
BEGIN
    -- Add date_of_birth column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'date_of_birth') THEN
        ALTER TABLE users ADD COLUMN date_of_birth DATE;
    END IF;
    
    -- Add gender column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'gender') THEN
        ALTER TABLE users ADD COLUMN gender VARCHAR(10) CHECK (gender IN ('male', 'female'));
    END IF;
    
    -- Add address column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'address') THEN
        ALTER TABLE users ADD COLUMN address TEXT;
    END IF;
    
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add clinic_id column if it doesn't exist (for staff users)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'clinic_id') THEN
        ALTER TABLE users ADD COLUMN clinic_id UUID REFERENCES clinics(id);
    END IF;
    
    -- Add department column if it doesn't exist (for staff users)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'department') THEN
        ALTER TABLE users ADD COLUMN department VARCHAR(100);
    END IF;
    
    -- Add specialization column if it doesn't exist (for doctors)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'specialization') THEN
        ALTER TABLE users ADD COLUMN specialization VARCHAR(100);
    END IF;
    
    -- Add license_number column if it doesn't exist (for doctors)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'license_number') THEN
        ALTER TABLE users ADD COLUMN license_number VARCHAR(50);
    END IF;
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Add force_password_change column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'force_password_change') THEN
        ALTER TABLE users ADD COLUMN force_password_change BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add constraints
DO $$
BEGIN
    -- Add gender constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'users_gender_check') THEN
        ALTER TABLE users ADD CONSTRAINT users_gender_check CHECK (gender IN ('male', 'female') OR gender IS NULL);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_clinic_id ON users(clinic_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_date_of_birth ON users(date_of_birth);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_gender ON users(gender);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_specialization ON users(specialization);

-- Update existing users to have default values for new columns
UPDATE users 
SET 
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW()),
    is_active = COALESCE(is_active, true),
    force_password_change = COALESCE(force_password_change, false)
WHERE created_at IS NULL OR updated_at IS NULL OR is_active IS NULL OR force_password_change IS NULL;

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing sample data with new fields
UPDATE users 
SET 
    date_of_birth = '1990-01-15',
    gender = 'male',
    address = '123 King Fahd Road, Riyadh, Saudi Arabia'
WHERE email = 'patient@example.com' AND date_of_birth IS NULL;

UPDATE users 
SET 
    date_of_birth = '1985-03-22',
    gender = 'female',
    address = '456 Prince Mohammed Bin Abdulaziz Road, Jeddah, Saudi Arabia'
WHERE email = 'patient2@example.com' AND date_of_birth IS NULL;

UPDATE users 
SET 
    department = 'Cardiology',
    specialization = 'Interventional Cardiology',
    license_number = 'DOC-2024-001'
WHERE email = 'doctor@clinic1.com' AND department IS NULL;

UPDATE users 
SET 
    department = 'Pediatrics',
    specialization = 'General Pediatrics',
    license_number = 'DOC-2024-002'
WHERE email = 'doctor2@clinic1.com' AND department IS NULL;

-- Insert some additional sample patients with complete information
INSERT INTO users (
    email, password_hash, first_name, last_name, phone, role, 
    date_of_birth, gender, address, is_active, created_at, updated_at
) VALUES 
(
    'ahmed.patient@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', -- password123
    'Ahmed',
    'Al-Rashid',
    '+966-50-123-4567',
    'patient',
    '1988-07-10',
    'male',
    '789 Olaya Street, Riyadh, Saudi Arabia',
    true,
    NOW(),
    NOW()
),
(
    'fatima.patient@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', -- password123
    'Fatima',
    'Al-Zahra',
    '+966-55-987-6543',
    'patient',
    '1992-12-05',
    'female',
    '321 Tahlia Street, Jeddah, Saudi Arabia',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Insert some sample data if the table is empty
INSERT INTO users (first_name, last_name, email, password_hash, role, phone, gender, address, created_at, updated_at)
SELECT 
    'John', 'Doe', 'john.doe@example.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', -- password: 'password123'
    'patient', '+1234567890', 'male', '123 Main St, City, State', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'john.doe@example.com');

INSERT INTO users (first_name, last_name, email, password_hash, role, phone, gender, address, created_at, updated_at)
SELECT 
    'Jane', 'Smith', 'jane.smith@example.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', -- password: 'password123'
    'patient', '+1234567891', 'female', '456 Oak Ave, City, State', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'jane.smith@example.com');

COMMIT;
