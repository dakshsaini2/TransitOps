USE transitops;

-- Truncate tables to ensure fresh seed (disable constraints temporarily)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE expenses;
TRUNCATE TABLE fuel_logs;
TRUNCATE TABLE maintenance_logs;
TRUNCATE TABLE trips;
TRUNCATE TABLE drivers;
TRUNCATE TABLE vehicles;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Users (Passwords are hashed "admin123" using bcrypt)
INSERT INTO users (full_name, email, password, role) VALUES
('System Administrator', 'admin@transitops.com', '$2a$10$K7S0lZcZ9gP6kHlD/O1H6.qW5g1N02LekgWqL4M6p1K8H7qD2oW.S', 'ADMIN'),
('Fleet Manager John', 'manager@transitops.com', '$2a$10$K7S0lZcZ9gP6kHlD/O1H6.qW5g1N02LekgWqL4M6p1K8H7qD2oW.S', 'FLEET_MANAGER'),
('Dispatcher Daisy', 'dispatcher@transitops.com', '$2a$10$K7S0lZcZ9gP6kHlD/O1H6.qW5g1N02LekgWqL4M6p1K8H7qD2oW.S', 'DISPATCHER'),
('Safety Officer Sam', 'safety@transitops.com', '$2a$10$K7S0lZcZ9gP6kHlD/O1H6.qW5g1N02LekgWqL4M6p1K8H7qD2oW.S', 'SAFETY_OFFICER'),
('Financial Analyst Fiona', 'finance@transitops.com', '$2a$10$K7S0lZcZ9gP6kHlD/O1H6.qW5g1N02LekgWqL4M6p1K8H7qD2oW.S', 'FINANCIAL_ANALYST');

-- Seed Vehicles
INSERT INTO vehicles (registration_number, vehicle_name, model, vehicle_type, max_load_capacity, odometer, acquisition_cost, status) VALUES
('MH-12-PQ-1234', 'Volvo FH16 Heavy Hauler', 'FH16 2024', 'HEAVY_TRUCK', 25000.00, 15000.00, 185000.00, 'AVAILABLE'),
('DL-01-AB-5678', 'Tata Prima Cargo Express', 'Prima 4038', 'MEDIUM_TRUCK', 12000.00, 48000.00, 95000.00, 'AVAILABLE'),
('KA-51-XY-9012', 'Mahindra Bolero Pickup', 'Maxx HD', 'LIGHT_PICKUP', 25000.00, 2000.00, 25000.00, 'IN_SHOP'),
('KA-03-CD-3456', 'Scania V8 Streamline', 'R580 2022', 'HEAVY_TRUCK', 30000.00, 120000.00, 210000.00, 'ON_TRIP'),
('MH-02-JK-7890', 'Ford F-650 Dump Truck', 'F-650 2018', 'MEDIUM_TRUCK', 18000.00, 230000.00, 75000.00, 'RETIRED');

-- Seed Drivers
INSERT INTO drivers (full_name, license_number, license_category, license_expiry, contact_number, safety_score, status) VALUES
('Robert Downey', 'DL-123456789012', 'HEAVY_VEHICLE', '2028-12-31', '+919876543210', 98.50, 'AVAILABLE'),
('Chris Evans', 'DL-234567890123', 'HEAVY_VEHICLE', '2029-06-15', '+918765432109', 95.00, 'AVAILABLE'),
('Scarlett Johansson', 'DL-345678901234', 'COMMERCIAL_LIGHT', '2024-05-20', '+917654321098', 88.00, 'AVAILABLE'), -- Expired license
('Mark Ruffalo', 'DL-456789012345', 'HEAVY_VEHICLE', '2030-01-01', '+916543210987', 72.00, 'SUSPENDED'),   -- Suspended
('Chris Hemsworth', 'DL-567890123456', 'HEAVY_VEHICLE', '2027-08-22', '+915432109876', 99.00, 'ON_TRIP');

-- Seed Trips
-- Vehicle 4 is on trip, Driver 5 is on trip
INSERT INTO trips (trip_number, source, destination, vehicle_id, driver_id, created_by, cargo_weight, planned_distance, actual_distance, fuel_consumed, start_odometer, end_odometer, revenue, departure_time, arrival_time, status) VALUES
('TRIP-20260701-0001', 'Mumbai Port', 'Pune Logistics Hub', 1, 1, 3, 20000.00, 150.00, 152.50, 48.00, 14847.50, 15000.00, 45000.00, '2026-07-01 08:00:00', '2026-07-01 12:30:00', 'COMPLETED'),
('TRIP-20260710-0002', 'Delhi Warehouse', 'Jaipur Hub', 2, 2, 3, 8000.00, 270.00, NULL, NULL, 48000.00, NULL, 62000.00, NULL, NULL, 'DRAFT'),
('TRIP-20260712-0003', 'Bangalore HQ', 'Chennai Port', 4, 5, 3, 28000.00, 350.00, NULL, NULL, 120000.00, NULL, 90000.00, '2026-07-12 06:00:00', NULL, 'DISPATCHED');

-- Seed Maintenance Logs
INSERT INTO maintenance_logs (vehicle_id, maintenance_type, description, cost, start_date, end_date, status) VALUES
(3, 'Brake Caliper Replacement', 'Rear brakes squealing, replacing pads and calipers.', 850.00, '2026-07-11', NULL, 'ACTIVE'),
(1, 'Engine Oil and Filter Change', 'Routine 15,000 km service.', 450.00, '2026-06-30', '2026-06-30', 'COMPLETED');

-- Seed Fuel Logs
INSERT INTO fuel_logs (vehicle_id, liters, cost, fuel_date, odometer) VALUES
(1, 120.00, 180.00, '2026-07-01', 14900.00),
(4, 300.00, 450.00, '2026-07-12', 120000.00);

-- Seed Expenses
INSERT INTO expenses (vehicle_id, expense_type, amount, description, expense_date) VALUES
(1, 'TOLL', 75.00, 'Mumbai-Pune Expressway toll charge', '2026-07-01'),
(1, 'MAINTENANCE', 450.00, 'Completed Maintenance ID: 2 - Engine Oil and Filter Change', '2026-06-30'),
(2, 'PARKING', 45.00, 'Overnight secure parking Delhi depot', '2026-07-10');
