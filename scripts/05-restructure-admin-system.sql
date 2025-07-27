-- Drop existing tables and recreate with new structure
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create clinics table
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  license_number VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table with new role structure
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'clinic_admin', 'doctor', 'secretary', 'purchasing', 'patient')),
  clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role permissions table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(50) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  actions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinic staff table for additional staff management
CREATE TABLE clinic_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  position VARCHAR(100),
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clinic_id, user_id)
);

-- Create doctors table (for medical staff)
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  specialization VARCHAR(255),
  specialization_ar VARCHAR(255),
  license_number VARCHAR(100),
  consultation_fee DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert role permissions
INSERT INTO role_permissions (role, resource, actions) VALUES
('super_admin', 'clinics', ARRAY['create', 'read', 'update', 'delete']),
('super_admin', 'users', ARRAY['create', 'read', 'update', 'delete']),
('super_admin', 'reports', ARRAY['read', 'export']),
('super_admin', 'settings', ARRAY['read', 'update']),

('clinic_admin', 'clinic_staff', ARRAY['create', 'read', 'update', 'delete']),
('clinic_admin', 'clinic_settings', ARRAY['read', 'update']),
('clinic_admin', 'clinic_reports', ARRAY['read', 'export']),
('clinic_admin', 'departments', ARRAY['create', 'read', 'update', 'delete']),
('clinic_admin', 'appointments', ARRAY['read', 'update']),

('doctor', 'appointments', ARRAY['read', 'update']),
('doctor', 'patients', ARRAY['read', 'update']),
('doctor', 'schedule', ARRAY['read', 'update']),

('secretary', 'appointments', ARRAY['create', 'read', 'update']),
('secretary', 'patients', ARRAY['create', 'read', 'update']),
('secretary', 'reception', ARRAY['create', 'read', 'update']),

('purchasing', 'inventory', ARRAY['create', 'read', 'update']),
('purchasing', 'suppliers', ARRAY['create', 'read', 'update']),
('purchasing', 'orders', ARRAY['create', 'read', 'update']),

('patient', 'appointments', ARRAY['create', 'read']),
('patient', 'profile', ARRAY['read', 'update']);

-- Insert sample clinics
INSERT INTO clinics (id, name, name_ar, description, address, city, phone, email, license_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'City Medical Center', 'مركز المدينة الطبي', 'A comprehensive medical center providing quality healthcare services', '123 Main Street, Downtown', 'Riyadh', '+966-11-123-4567', 'info@citymedical.com', 'LIC-001-2024'),
('550e8400-e29b-41d4-a716-446655440002', 'Family Health Clinic', 'عيادة صحة الأسرة', 'Specialized in family medicine and pediatrics', '456 Health Avenue', 'Jeddah', '+966-12-987-6543', 'contact@familyhealth.com', 'LIC-002-2024');

-- Insert departments
INSERT INTO departments (id, clinic_id, name, name_ar, description) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'General Medicine', 'الطب العام', 'General medical consultations'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Pediatrics', 'طب الأطفال', 'Children healthcare'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Family Medicine', 'طب الأسرة', 'Family healthcare services');

-- Insert sample users with different roles
-- Super Admin
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, clinic_id) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'admin@system.com', 'password', 'System', 'Administrator', '+966-50-000-0001', 'super_admin', NULL);

-- Clinic Admins (Clinic Owners)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, clinic_id) VALUES
('750e8400-e29b-41d4-a716-446655440002', 'admin@citymedical.com', 'password', 'Ahmed', 'Al-Rashid', '+966-50-111-1111', 'clinic_admin', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440003', 'admin@familyhealth.com', 'password', 'Fatima', 'Al-Zahra', '+966-50-222-2222', 'clinic_admin', '550e8400-e29b-41d4-a716-446655440002');

-- Doctors
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, clinic_id, department_id) VALUES
('750e8400-e29b-41d4-a716-446655440004', 'dr.omar@citymedical.com', 'password', 'Omar', 'Al-Mansouri', '+966-50-333-3333', 'doctor', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440005', 'dr.sara@citymedical.com', 'password', 'Sara', 'Al-Khalil', '+966-50-444-4444', 'doctor', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440006', 'dr.hassan@familyhealth.com', 'password', 'Hassan', 'Al-Nouri', '+966-50-555-5555', 'doctor', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003');

-- Secretaries
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, clinic_id) VALUES
('750e8400-e29b-41d4-a716-446655440007', 'secretary@citymedical.com', 'password', 'Maryam', 'Al-Otaibi', '+966-50-666-6666', 'secretary', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440008', 'secretary@familyhealth.com', 'password', 'Aisha', 'Al-Harbi', '+966-50-777-7777', 'secretary', '550e8400-e29b-41d4-a716-446655440002');

-- Purchasing Staff
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, clinic_id) VALUES
('750e8400-e29b-41d4-a716-446655440009', 'purchasing@citymedical.com', 'password', 'Khalid', 'Al-Ghamdi', '+966-50-888-8888', 'purchasing', '550e8400-e29b-41d4-a716-446655440001');

-- Sample Patients
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role) VALUES
('750e8400-e29b-41d4-a716-446655440010', 'patient1@email.com', 'password', 'Abdullah', 'Al-Saud', '+966-50-999-9999', 'patient'),
('750e8400-e29b-41d4-a716-446655440011', 'patient2@email.com', 'password', 'Noura', 'Al-Fahd', '+966-50-000-1111', 'patient');

-- Insert doctors data
INSERT INTO doctors (id, user_id, clinic_id, department_id, specialization, specialization_ar, license_number, consultation_fee) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'General Medicine', 'الطب العام', 'DOC-001-2024', 200.00),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'Pediatrics', 'طب الأطفال', 'DOC-002-2024', 250.00),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 'Family Medicine', 'طب الأسرة', 'DOC-003-2024', 180.00);

-- Insert clinic staff relationships
INSERT INTO clinic_staff (clinic_id, user_id, department_id, position, hire_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', NULL, 'Clinic Administrator', '2024-01-01'),
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'General Practitioner', '2024-01-15'),
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', 'Pediatrician', '2024-02-01'),
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440007', NULL, 'Secretary', '2024-01-10'),
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440009', NULL, 'Purchasing Manager', '2024-01-20'),
('550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', NULL, 'Clinic Administrator', '2024-01-01'),
('550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440003', 'Family Doctor', '2024-01-15'),
('550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440008', NULL, 'Secretary', '2024-01-10');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, clinic_id, appointment_date, appointment_time, status, notes) VALUES
('750e8400-e29b-41d4-a716-446655440010', '850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-02-15', '09:00:00', 'scheduled', 'Regular checkup'),
('750e8400-e29b-41d4-a716-446655440011', '850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-02-15', '10:30:00', 'scheduled', 'Child vaccination');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_clinic_id ON users(clinic_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_clinic_staff_clinic_id ON clinic_staff(clinic_id);
CREATE INDEX idx_doctors_clinic_id ON doctors(clinic_id);
