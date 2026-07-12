CREATE DATABASE IF NOT EXISTS transitops;

USE transitops;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM(
        'ADMIN',
        'FLEET_MANAGER',
        'DISPATCHER',
        'SAFETY_OFFICER',
        'FINANCIAL_ANALYST'
    ) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_name VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    vehicle_type VARCHAR(50),
    max_load_capacity DECIMAL(10, 2) NOT NULL,
    odometer DECIMAL(10, 2) DEFAULT 0,
    acquisition_cost DECIMAL(12, 2),
    status ENUM(
        'AVAILABLE',
        'ON_TRIP',
        'IN_SHOP',
        'RETIRED'
    ) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    license_category VARCHAR(20),
    license_expiry DATE NOT NULL,
    contact_number VARCHAR(20),
    safety_score DECIMAL(5, 2) DEFAULT 100,
    status ENUM(
        'AVAILABLE',
        'ON_TRIP',
        'OFF_DUTY',
        'SUSPENDED'
    ) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_number VARCHAR(50) UNIQUE,
    source VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    created_by INT,
    cargo_weight DECIMAL(10, 2) NOT NULL,
    planned_distance DECIMAL(10, 2),
    actual_distance DECIMAL(10, 2),
    fuel_consumed DECIMAL(10, 2),
    start_odometer DECIMAL(10, 2),
    end_odometer DECIMAL(10, 2),
    revenue DECIMAL(12, 2) DEFAULT 0,
    departure_time DATETIME,
    arrival_time DATETIME,
    status ENUM(
        'DRAFT',
        'DISPATCHED',
        'COMPLETED',
        'CANCELLED'
    ) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    FOREIGN KEY (driver_id) REFERENCES drivers (id),
    FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    maintenance_type VARCHAR(100),
    description TEXT,
    cost DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    status ENUM('ACTIVE', 'COMPLETED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

CREATE TABLE IF NOT EXISTS fuel_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    liters DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    fuel_date DATE NOT NULL,
    odometer DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    expense_type ENUM(
        'TOLL',
        'MAINTENANCE',
        'PARKING',
        'OTHER'
    ),
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    expense_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);