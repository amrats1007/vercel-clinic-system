-- Fix any existing data issues and ensure proper UUIDs
-- This script can be run to fix existing data

-- Update any appointments that might have invalid clinic_id
UPDATE appointments 
SET clinic_id = '550e8400-e29b-41d4-a716-446655440000'
WHERE clinic_id = '1' OR clinic_id NOT SIMILAR TO '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

-- Ensure doctors have proper UUIDs
UPDATE doctors 
SET clinic_id = '550e8400-e29b-41d4-a716-446655440000'
WHERE clinic_id = '1' OR clinic_id NOT SIMILAR TO '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
