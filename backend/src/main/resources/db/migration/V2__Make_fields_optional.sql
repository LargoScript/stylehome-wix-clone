-- Migration V2: Make last_name and phone optional
-- This migration allows null values for last_name and phone columns

-- For H2 database (development)
ALTER TABLE consultations ALTER COLUMN last_name VARCHAR(100) NULL;
ALTER TABLE consultations ALTER COLUMN phone VARCHAR(50) NULL;
