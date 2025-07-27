-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'staff', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  opening_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  specialization VARCHAR(255),
  license_number VARCHAR(100),
  bio TEXT,
  consultation_fee DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availability table for doctors
CREATE TABLE IF NOT EXISTS doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@clinic.com', '$2a$10$example', 'Admin', 'User', '+1234567890', 'admin'),
('dr.smith@clinic.com', '$2a$10$example', 'John', 'Smith', '+1234567891', 'staff'),
('dr.johnson@clinic.com', '$2a$10$example', 'Sarah', 'Johnson', '+1234567892', 'staff'),
('patient@example.com', '$2a$10$example', 'Jane', 'Doe', '+1234567893', 'patient');

-- First, let's get the clinic UUID after insertion
INSERT INTO clinics (id, name, address, phone, email, opening_hours) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Central Medical Clinic', '123 Main St, City, State 12345', '+1234567890', 'info@centralmedical.com', 
 '{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "08:00", "close": "17:00"}, "saturday": {"open": "09:00", "close": "13:00"}, "sunday": {"closed": true}}');

-- Update doctors insertion to use proper UUIDs
INSERT INTO doctors (id, user_id, clinic_id, specialization, license_number, bio, consultation_fee)
SELECT '660e8400-e29b-41d4-a716-446655440001', u.id, '550e8400-e29b-41d4-a716-446655440000', 'General Practice', 'MD12345', 'Experienced general practitioner with 15 years of experience.', 150.00
FROM users u 
WHERE u.email = 'dr.smith@clinic.com';

INSERT INTO doctors (id, user_id, clinic_id, specialization, license_number, bio, consultation_fee)
SELECT '660e8400-e29b-41d4-a716-446655440002', u.id, '550e8400-e29b-41d4-a716-446655440000', 'Cardiology', 'MD12346', 'Specialized cardiologist focusing on heart health and prevention.', 200.00
FROM users u 
WHERE u.email = 'dr.johnson@clinic.com';

-- Insert doctor availability (Monday to Friday, 9 AM to 5 PM)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT d.id, generate_series(1, 5), '09:00'::time, '17:00'::time
FROM doctors d;
