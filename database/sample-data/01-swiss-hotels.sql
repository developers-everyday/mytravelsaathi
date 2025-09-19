-- =============================================================================
-- Swiss Hotels Sample Data
-- =============================================================================
-- This file contains sample hotel data for Switzerland
-- =============================================================================

-- Insert Swiss hotels sample data
INSERT INTO hotels(id, name, location, price_tier, checkin_date, checkout_date, booked)
VALUES
    (1, 'Hilton Basel', 'Basel', 'Luxury', '2024-04-20', '2024-04-22', B'0'),
    (2, 'Marriott Zurich', 'Zurich', 'Upscale', '2024-04-14', '2024-04-21', B'0'),
    (3, 'Hyatt Regency Basel', 'Basel', 'Upper Upscale', '2024-04-02', '2024-04-20', B'0'),
    (4, 'Radisson Blu Lucerne', 'Lucerne', 'Midscale', '2024-04-05', '2024-04-24', B'0'),
    (5, 'Best Western Bern', 'Bern', 'Upper Midscale', '2024-04-01', '2024-04-23', B'0'),
    (6, 'InterContinental Geneva', 'Geneva', 'Luxury', '2024-04-23', '2024-04-28', B'0'),
    (7, 'Sheraton Zurich', 'Zurich', 'Upper Upscale', '2024-04-02', '2024-04-27', B'0'),
    (8, 'Holiday Inn Basel', 'Basel', 'Upper Midscale', '2024-04-09', '2024-04-24', B'0'),
    (9, 'Courtyard Zurich', 'Zurich', 'Upscale', '2024-04-03', '2024-04-13', B'0'),
    (10, 'Comfort Inn Bern', 'Bern', 'Midscale', '2024-04-04', '2024-04-16', B'0');
