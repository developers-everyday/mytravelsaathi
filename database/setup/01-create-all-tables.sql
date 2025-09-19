-- =============================================================================
-- Complete Database Setup Script
-- =============================================================================
-- This script creates all tables in the correct order
-- Run this after creating your Cloud SQL instance
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hotels table
\i schemas/01-hotels-table.sql

-- Create users table
\i schemas/03-users-table.sql

-- Create bookings table (after hotels and users)
\i schemas/02-bookings-table.sql

-- Insert sample data
\i sample-data/01-swiss-hotels.sql
\i sample-data/02-goa-hotels.sql

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_hotels FROM hotels;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_bookings FROM bookings;
