-- SafraSphere Database Schema
-- MySQL Database Setup for EV Charging Application

-- Create database
CREATE DATABASE IF NOT EXISTS safrasphere_db;
USE safrasphere_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Chargers table
CREATE TABLE IF NOT EXISTS chargers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    qr_code_value VARCHAR(255) NOT NULL UNIQUE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    power_rating DECIMAL(5, 2) DEFAULT 22.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Charging sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    charger_id BIGINT NOT NULL,
    session_token TEXT,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    kwh_consumed DECIMAL(10, 2) DEFAULT 0.00,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    session_status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED', 'ERROR') DEFAULT 'ACTIVE',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (charger_id) REFERENCES chargers(id) ON DELETE CASCADE
);

-- Insert sample data

-- Insert Karur charger
INSERT INTO chargers (qr_code_value, latitude, longitude, location_name, is_active, power_rating) 
VALUES ('SAFRASPHERE_CHARGER_KARUR_001', 10.9601, 78.0766, 'Karur, Tamil Nadu', TRUE, 22.0)
ON DUPLICATE KEY UPDATE 
    latitude = VALUES(latitude),
    longitude = VALUES(longitude),
    location_name = VALUES(location_name),
    is_active = VALUES(is_active),
    power_rating = VALUES(power_rating);

-- Insert sample user
INSERT INTO users (name, email, location) 
VALUES ('Suvitha', 'suvitha@safrasphere.com', 'Karur, Tamil Nadu')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    location = VALUES(location);

-- Additional sample chargers for testing
INSERT INTO chargers (qr_code_value, latitude, longitude, location_name, is_active, power_rating) 
VALUES 
    ('SAFRASPHERE_CHARGER_KARUR_002', 10.9605, 78.0770, 'Karur Central, Tamil Nadu', TRUE, 50.0),
    ('SAFRASPHERE_CHARGER_KARUR_003', 10.9598, 78.0762, 'Karur Mall, Tamil Nadu', TRUE, 22.0)
ON DUPLICATE KEY UPDATE 
    latitude = VALUES(latitude),
    longitude = VALUES(longitude),
    location_name = VALUES(location_name),
    is_active = VALUES(is_active),
    power_rating = VALUES(power_rating);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chargers_location ON chargers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_chargers_qr_code ON chargers(qr_code_value);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_charger ON sessions(charger_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token(255));
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Display inserted data
SELECT 'Chargers:' as Info;
SELECT id, qr_code_value, latitude, longitude, location_name, is_active, power_rating FROM chargers;

SELECT 'Users:' as Info;
SELECT id, name, email, location FROM users;

SELECT 'Database setup completed successfully!' as Status;