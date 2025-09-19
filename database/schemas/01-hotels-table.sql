-- =============================================================================
-- Hotels Table Schema
-- =============================================================================
-- This file contains the schema for the hotels table
-- =============================================================================

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS hotels CASCADE;

-- Create hotels table
CREATE TABLE hotels(
    id            INTEGER NOT NULL PRIMARY KEY,
    name          VARCHAR NOT NULL,
    location      VARCHAR NOT NULL,
    price_tier    VARCHAR NOT NULL,
    checkin_date  DATE    NOT NULL,
    checkout_date DATE    NOT NULL,
    booked        BIT     NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE hotels IS 'Stores hotel information and availability';
COMMENT ON COLUMN hotels.id IS 'Unique hotel identifier';
COMMENT ON COLUMN hotels.name IS 'Hotel name';
COMMENT ON COLUMN hotels.location IS 'Hotel location/city';
COMMENT ON COLUMN hotels.price_tier IS 'Price category (Luxury, Upscale, Midscale, etc.)';
COMMENT ON COLUMN hotels.checkin_date IS 'Available check-in date';
COMMENT ON COLUMN hotels.checkout_date IS 'Available check-out date';
COMMENT ON COLUMN hotels.booked IS 'Booking status (0=available, 1=booked)';
