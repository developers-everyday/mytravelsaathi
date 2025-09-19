-- =============================================================================
-- Users Table Schema
-- =============================================================================
-- This file contains the schema for the users table
-- =============================================================================

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    user_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR NOT NULL,
    email       VARCHAR UNIQUE NOT NULL,
    phone       VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Stores user information';
COMMENT ON COLUMN users.user_id IS 'Unique user identifier (UUID)';
COMMENT ON COLUMN users.name IS 'User full name';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.phone IS 'User phone number';
COMMENT ON COLUMN users.created_at IS 'User registration timestamp';
