"""
Seed the database with realistic demo data.
Run: python -m app.seed
"""
import asyncio
from datetime import date, timedelta
from faker import Faker
from passlib.context import CryptContext
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle, VehicleStatus, VehicleType
from app.models.driver import Driver, DriverStatus, LicenseCategory
from app.models.trip import Trip, TripStatus
from app.models.maintenance import MaintenanceLog, MaintenanceStatus, MaintenanceType
from app.models.fuel_log import FuelLog
from app.models.expense import Expense, ExpenseType
import app.models  # noqa — ensure all models are registered

fake = Faker("en_IN")
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed():
    # Create tables first
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        await seed_users(db)
        vehicles = await seed_vehicles(db)
        drivers = await seed_drivers(db)
        await seed_trips(db, vehicles, drivers)
        await seed_maintenance(db, vehicles)
        await seed_fuel_and_expenses(db, vehicles)
        await db.commit()

    logger.success("Database seeded successfully!")
    logger.info("Login credentials:")
    logger.info("  Fleet Manager  → fleet@transitops.com  / password123")
    logger.info("  Driver         → driver@transitops.com / password123")
    logger.info("  Safety Officer → safety@transitops.com / password123")
    logger.info("  Finance        → finance@transitops.com / password123")


async def seed_users(db: AsyncSession):
    users = [
        User(name="Fleet Manager",    email="fleet@transitops.com",   password_hash=pwd_ctx.hash("password123"), role=UserRole.FLEET_MANAGER),
        User(name="Alex Driver",      email="driver@transitops.com",  password_hash=pwd_ctx.hash("password123"), role=UserRole.DRIVER),
        User(name="Safety Officer",   email="safety@transitops.com",  password_hash=pwd_ctx.hash("password123"), role=UserRole.SAFETY_OFFICER),
        User(name="Finance Analyst",  email="finance@transitops.com", password_hash=pwd_ctx.hash("password123"), role=UserRole.FINANCIAL_ANALYST),
    ]
    db.add_all(users)
    await db.flush()
    logger.info(f"Seeded {len(users)} users.")


async def seed_vehicles(db: AsyncSession) -> list[Vehicle]:
    vehicles = [
        Vehicle(reg_number="VAN-05",   name="Ford Transit Van",      type=VehicleType.VAN,    max_load_kg=500,  odometer=12400, acquisition_cost=850000, status=VehicleStatus.AVAILABLE, region="North"),
        Vehicle(reg_number="TRK-01",   name="Tata Prima Truck",      type=VehicleType.TRUCK,  max_load_kg=5000, odometer=55200, acquisition_cost=2500000, status=VehicleStatus.AVAILABLE, region="North"),
        Vehicle(reg_number="TRK-02",   name="Ashok Leyland Captain", type=VehicleType.TRUCK,  max_load_kg=8000, odometer=88000, acquisition_cost=3200000, status=VehicleStatus.AVAILABLE, region="South"),
        Vehicle(reg_number="PKP-03",   name="Mahindra Bolero Pickup",type=VehicleType.PICKUP, max_load_kg=750,  odometer=23100, acquisition_cost=650000,  status=VehicleStatus.AVAILABLE, region="East"),
        Vehicle(reg_number="VAN-07",   name="Force Traveller Van",   type=VehicleType.VAN,    max_load_kg=1200, odometer=41000, acquisition_cost=1100000, status=VehicleStatus.IN_SHOP,   region="West"),
        Vehicle(reg_number="TRL-04",   name="Eicher Pro Trailer",    type=VehicleType.TRAILER,max_load_kg=15000,odometer=105000,acquisition_cost=4500000, status=VehicleStatus.AVAILABLE, region="South"),
        Vehicle(reg_number="TRK-08",   name="BharatBenz 1617",       type=VehicleType.TRUCK,  max_load_kg=6000, odometer=71000, acquisition_cost=2800000, status=VehicleStatus.ON_TRIP,   region="North"),
        Vehicle(reg_number="PKP-09",   name="Tata Xenon Pickup",     type=VehicleType.PICKUP, max_load_kg=900,  odometer=18500, acquisition_cost=720000,  status=VehicleStatus.AVAILABLE, region="East"),
        Vehicle(reg_number="VAN-10",   name="Kia Carnival",          type=VehicleType.VAN,    max_load_kg=400,  odometer=9200,  acquisition_cost=3500000, status=VehicleStatus.AVAILABLE, region="West"),
        Vehicle(reg_number="TRK-11",   name="Volvo FMX",             type=VehicleType.TRUCK,  max_load_kg=20000,odometer=210000,acquisition_cost=8500000, status=VehicleStatus.RETIRED,   region="North"),
    ]
    db.add_all(vehicles)
    await db.flush()
    logger.info(f"Seeded {len(vehicles)} vehicles.")
    return vehicles


async def seed_drivers(db: AsyncSession) -> list[Driver]:
    today = date.today()
    drivers = [
        Driver(name="Alex Kumar",      license_number="DL-2024-00123", license_category=LicenseCategory.C,  license_expiry=today + timedelta(days=365), contact="9876543210", safety_score=95.0, status=DriverStatus.AVAILABLE),
        Driver(name="Priya Singh",     license_number="MH-2023-00456", license_category=LicenseCategory.CE, license_expiry=today + timedelta(days=180), contact="9876500011", safety_score=88.5, status=DriverStatus.AVAILABLE),
        Driver(name="Ravi Sharma",     license_number="KA-2022-00789", license_category=LicenseCategory.B,  license_expiry=today + timedelta(days=730), contact="9123456780", safety_score=91.0, status=DriverStatus.ON_TRIP),
        Driver(name="Sunita Rao",      license_number="TN-2021-01122", license_category=LicenseCategory.D,  license_expiry=today - timedelta(days=30),  contact="9000012345", safety_score=79.0, status=DriverStatus.OFF_DUTY),   # expired license
        Driver(name="Mohammed Irfan",  license_number="UP-2024-03344", license_category=LicenseCategory.CE, license_expiry=today + timedelta(days=500), contact="8800099876", safety_score=97.5, status=DriverStatus.AVAILABLE),
        Driver(name="Deepak Verma",    license_number="GJ-2023-05567", license_category=LicenseCategory.C,  license_expiry=today + timedelta(days=290), contact="7700055432", safety_score=82.0, status=DriverStatus.SUSPENDED),   # suspended
        Driver(name="Anjali Nair",     license_number="KL-2024-07788", license_category=LicenseCategory.B,  license_expiry=today + timedelta(days=410), contact="9988776655", safety_score=93.0, status=DriverStatus.AVAILABLE),
        Driver(name="Harpreet Kaur",   license_number="PB-2022-09901", license_category=LicenseCategory.CE, license_expiry=today + timedelta(days=600), contact="9111122334", safety_score=89.0, status=DriverStatus.AVAILABLE),
        Driver(name="Vijay Patil",     license_number="MH-2023-11223", license_category=LicenseCategory.C,  license_expiry=today + timedelta(days=120), contact="8222233445", safety_score=76.5, status=DriverStatus.OFF_DUTY),
        Driver(name="Kavitha Menon",   license_number="TN-2024-13456", license_category=LicenseCategory.B,  license_expiry=today + timedelta(days=800), contact="7333344556", safety_score=99.0, status=DriverStatus.AVAILABLE),
    ]
    db.add_all(drivers)
    await db.flush()
    logger.info(f"Seeded {len(drivers)} drivers.")
    return drivers


async def seed_trips(db: AsyncSession, vehicles: list[Vehicle], drivers: list[Driver]):
    today = date.today()
    trips = [
        # Completed trip — Van-05 / Alex
        Trip(vehicle_id=vehicles[0].id, driver_id=drivers[0].id,
             source="Delhi", destination="Jaipur",
             cargo_weight=450, planned_distance=280, actual_distance=285,
             fuel_consumed=32.5, revenue=18000,
             status=TripStatus.COMPLETED),
        # Another completed
        Trip(vehicle_id=vehicles[1].id, driver_id=drivers[1].id,
             source="Mumbai", destination="Pune",
             cargo_weight=3200, planned_distance=150, actual_distance=152,
             fuel_consumed=58.0, revenue=42000,
             status=TripStatus.COMPLETED),
        # Active / dispatched
        Trip(vehicle_id=vehicles[6].id, driver_id=drivers[2].id,
             source="Bangalore", destination="Chennai",
             cargo_weight=5000, planned_distance=350, actual_distance=None,
             fuel_consumed=None, revenue=60000,
             status=TripStatus.DISPATCHED),
        # Draft trips
        Trip(vehicle_id=vehicles[3].id, driver_id=drivers[4].id,
             source="Kolkata", destination="Bhubaneswar",
             cargo_weight=600, planned_distance=450,
             revenue=25000, status=TripStatus.DRAFT),
        Trip(vehicle_id=vehicles[5].id, driver_id=drivers[6].id,
             source="Hyderabad", destination="Vijayawada",
             cargo_weight=12000, planned_distance=270,
             revenue=75000, status=TripStatus.DRAFT),
        # Cancelled
        Trip(vehicle_id=vehicles[7].id, driver_id=drivers[7].id,
             source="Ahmedabad", destination="Surat",
             cargo_weight=700, planned_distance=265,
             revenue=0, status=TripStatus.CANCELLED),
    ]
    db.add_all(trips)
    await db.flush()
    logger.info(f"Seeded {len(trips)} trips.")


async def seed_maintenance(db: AsyncSession, vehicles: list[Vehicle]):
    logs = [
        # VAN-07 is In Shop — active maintenance
        MaintenanceLog(vehicle_id=vehicles[4].id, maintenance_type=MaintenanceType.ENGINE_REPAIR,
                       description="Engine overhaul after coolant leak", cost=45000,
                       status=MaintenanceStatus.ACTIVE, workshop="QuickFix Garage"),
        # Closed records
        MaintenanceLog(vehicle_id=vehicles[0].id, maintenance_type=MaintenanceType.OIL_CHANGE,
                       description="Routine oil & filter change", cost=2500,
                       status=MaintenanceStatus.CLOSED, workshop="Shell Service Centre"),
        MaintenanceLog(vehicle_id=vehicles[1].id, maintenance_type=MaintenanceType.TIRE_REPLACEMENT,
                       description="Replaced all 6 tyres", cost=32000,
                       status=MaintenanceStatus.CLOSED, workshop="MRF Tyre Shop"),
        MaintenanceLog(vehicle_id=vehicles[2].id, maintenance_type=MaintenanceType.BRAKE_SERVICE,
                       description="Brake pad replacement + fluid flush", cost=8500,
                       status=MaintenanceStatus.CLOSED, workshop="AutoZone"),
    ]
    db.add_all(logs)
    await db.flush()
    logger.info(f"Seeded {len(logs)} maintenance logs.")


async def seed_fuel_and_expenses(db: AsyncSession, vehicles: list[Vehicle]):
    today = date.today()
    fuel_logs = [
        FuelLog(vehicle_id=vehicles[0].id, liters=32.5, cost=3510, date=today - timedelta(days=3)),
        FuelLog(vehicle_id=vehicles[1].id, liters=58.0, cost=6264, date=today - timedelta(days=5)),
        FuelLog(vehicle_id=vehicles[2].id, liters=45.0, cost=4860, date=today - timedelta(days=7)),
        FuelLog(vehicle_id=vehicles[3].id, liters=28.0, cost=3024, date=today - timedelta(days=2)),
        FuelLog(vehicle_id=vehicles[6].id, liters=70.0, cost=7560, date=today - timedelta(days=1)),
        FuelLog(vehicle_id=vehicles[7].id, liters=35.0, cost=3780, date=today - timedelta(days=4)),
    ]
    expenses = [
        Expense(vehicle_id=vehicles[0].id, type=ExpenseType.TOLL,        amount=320,   date=today - timedelta(days=3), note="Delhi-Jaipur highway toll"),
        Expense(vehicle_id=vehicles[1].id, type=ExpenseType.TOLL,        amount=180,   date=today - timedelta(days=5), note="Mumbai-Pune expressway"),
        Expense(vehicle_id=vehicles[2].id, type=ExpenseType.INSURANCE,   amount=85000, date=today - timedelta(days=30), note="Annual insurance renewal"),
        Expense(vehicle_id=vehicles[4].id, type=ExpenseType.MAINTENANCE, amount=45000, date=today - timedelta(days=2), note="Engine overhaul"),
        Expense(vehicle_id=vehicles[6].id, type=ExpenseType.PARKING,     amount=500,   date=today - timedelta(days=1), note="Overnight parking Blr"),
        Expense(vehicle_id=vehicles[3].id, type=ExpenseType.FINE,        amount=2000,  date=today - timedelta(days=10), note="Overloading penalty"),
    ]
    db.add_all(fuel_logs)
    db.add_all(expenses)
    await db.flush()
    logger.info(f"Seeded {len(fuel_logs)} fuel logs and {len(expenses)} expenses.")


if __name__ == "__main__":
    asyncio.run(seed())
