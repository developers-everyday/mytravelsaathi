-- =============================================================================
-- Bookings Table Schema
-- =============================================================================
-- This file contains the schema for the bookings table
-- =============================================================================

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS bookings CASCADE;

-- Create bookings table
CREATE TABLE bookings (
    booking_id   SERIAL PRIMARY KEY,     -- unique booking ID
    user_id      VARCHAR NOT NULL,       -- who booked
    hotel_id     INTEGER NOT NULL,       -- FK → hotels.id
    check_in     DATE NOT NULL,
    check_out    DATE NOT NULL,
    guests       INT NOT NULL DEFAULT 1, -- number of guests
    created_at   TIMESTAMP DEFAULT NOW(),

    -- Add FK constraint to hotels table
    CONSTRAINT fk_hotel
        FOREIGN KEY (hotel_id)
        REFERENCES hotels (id)
);

-- Add comments for documentation
COMMENT ON TABLE bookings IS 'Stores hotel booking information';
COMMENT ON COLUMN bookings.booking_id IS 'Unique booking identifier';
COMMENT ON COLUMN bookings.user_id IS 'User who made the booking';
COMMENT ON COLUMN bookings.hotel_id IS 'Reference to hotels table';
COMMENT ON COLUMN bookings.check_in IS 'Check-in date';
COMMENT ON COLUMN bookings.check_out IS 'Check-out date';
COMMENT ON COLUMN bookings.guests IS 'Number of guests';
COMMENT ON COLUMN bookings.created_at IS 'Booking creation timestamp';
