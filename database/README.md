# 🗄️ Database Setup for My Travel Saathi

This directory contains all database-related files for the My Travel Saathi application.

## 📁 Directory Structure

```
database/
├── README.md                    # This file
├── setup/                       # Database setup scripts
│   └── 01-create-all-tables.sql # Complete setup script
├── schemas/                     # Table schemas
│   ├── 01-hotels-table.sql      # Hotels table definition
│   ├── 02-bookings-table.sql    # Bookings table definition
│   └── 03-users-table.sql       # Users table definition
├── sample-data/                 # Sample data files
│   ├── 01-swiss-hotels.sql      # Swiss hotels data
│   └── 02-goa-hotels.sql        # Goa hotels data
└── migrations/                  # Future migration files
```

## 🚀 Quick Setup

### 1. Create Cloud SQL Instance
```bash
# Run from project root
./infrastructure/gcp-setup/cloud-sql-setup.sh
```

### 2. Setup Database Schema
```bash
# Connect to your Cloud SQL instance and run:
psql -h YOUR_INSTANCE_IP -U postgres -d postgres -f database/setup/01-create-all-tables.sql
```

## 📊 Database Schema

### Hotels Table
- **Purpose**: Stores hotel information and availability
- **Key Fields**: id, name, location, price_tier, checkin_date, checkout_date, booked

### Users Table
- **Purpose**: Stores user information
- **Key Fields**: user_id (UUID), name, email, phone, created_at

### Bookings Table
- **Purpose**: Stores booking information
- **Key Fields**: booking_id, user_id, hotel_id, check_in, check_out, guests, created_at
- **Foreign Keys**: hotel_id → hotels.id

## 🎯 Sample Data

The database comes pre-populated with:
- **20 Swiss Hotels**: Various price tiers across Swiss cities
- **20 Goa Hotels**: Luxury to midscale hotels in North and South Goa

## 🔧 Maintenance

- **Adding New Hotels**: Add to appropriate sample-data file
- **Schema Changes**: Create migration files in `migrations/` directory
- **Backup**: Use Cloud SQL automated backups

## 📝 Notes

- All timestamps use UTC
- UUIDs are used for user identification
- Foreign key constraints ensure data integrity
- Sample data includes both European and Indian destinations
