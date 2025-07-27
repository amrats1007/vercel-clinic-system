-- Add missing columns to users table for enhanced patient registration and staff management

-- Add patient-specific fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add staff-specific fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS specialization VARCHAR(100),
ADD COLUMN IF NOT EXISTS license_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clinic_role ON users(clinic_id, role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_specialization ON users(specialization);

-- Update existing demo data with additional fields
UPDATE users SET 
  department = 'General Medicine',
  specialization = 'General Medicine',
  license_number = 'DOC-2024-001'
WHERE email = 'dr.omar@citymedical.com';

UPDATE users SET 
  department = 'Pediatrics',
  specialization = 'Pediatrics',
  license_number = 'DOC-2024-002'
WHERE email = 'dr.sara@citymedical.com';

UPDATE users SET 
  department = 'Reception'
WHERE email = 'secretary@citymedical.com';

UPDATE users SET 
  department = 'Administration'
WHERE email = 'purchasing@citymedical.com';

-- Add sample patient data with enhanced fields
UPDATE users SET 
  date_of_birth = '1990-05-15',
  gender = 'male',
  address = '123 King Fahd Road, Riyadh, Saudi Arabia'
WHERE email = 'patient1@email.com';

-- Insert additional sample patients
INSERT INTO users (
  email, password_hash, first_name, last_name, phone, role, 
  date_of_birth, gender, address, is_active
) VALUES 
(
  'patient2@email.com', 
  '$2a$10$example', 
  'Fatima', 
  'Al-Zahra', 
  '+966-50-222-2222', 
  'patient',
  '1985-08-22',
  'female',
  '456 Prince Mohammed Road, Jeddah, Saudi Arabia',
  true
),
(
  'patient3@email.com', 
  '$2a$10$example', 
  'Ahmed', 
  'Al-Rashid', 
  '+966-50-333-3333', 
  'patient',
  '1992-12-10',
  'male',
  '789 Olaya Street, Riyadh, Saudi Arabia',
  true
) ON CONFLICT (email) DO NOTHING;

-- Create departments table for better organization
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample departments
INSERT INTO departments (clinic_id, name, name_ar, description) 
SELECT 
  c.id,
  dept.name,
  dept.name_ar,
  dept.description
FROM clinics c
CROSS JOIN (
  VALUES 
    ('General Medicine', 'الطب العام', 'General medical consultations and treatments'),
    ('Pediatrics', 'طب الأطفال', 'Medical care for infants, children, and adolescents'),
    ('Cardiology', 'أمراض القلب', 'Heart and cardiovascular system care'),
    ('Dermatology', 'الأمراض الجلدية', 'Skin, hair, and nail conditions'),
    ('Reception', 'الاستقبال', 'Patient reception and administrative services'),
    ('Administration', 'الإدارة', 'Administrative and support services')
) AS dept(name, name_ar, description)
WHERE c.name IN ('City Medical Center', 'Family Health Clinic')
ON CONFLICT DO NOTHING;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at 
  BEFORE UPDATE ON departments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraint for department (optional, for future use)
-- ALTER TABLE users ADD COLUMN department_id UUID REFERENCES departments(id);
