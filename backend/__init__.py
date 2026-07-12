# Import all models here so SQLAlchemy's metadata knows about them.
# This is required for Alembic autogenerate and Base.metadata.create_all() to work.

from app.models.user import User, UserRole
from app.models.vehicle import Vehicle, VehicleStatus, VehicleType
from app.models.driver import Driver, DriverStatus, LicenseCategory
from app.models.trip import Trip, TripStatus
from app.models.maintenance import MaintenanceLog, MaintenanceStatus, MaintenanceType
from app.models.fuel_log import FuelLog
from app.models.expense import Expense, ExpenseType

__all__ = [
    "User", "UserRole",
    "Vehicle", "VehicleStatus", "VehicleType",
    "Driver", "DriverStatus", "LicenseCategory",
    "Trip", "TripStatus",
    "MaintenanceLog", "MaintenanceStatus", "MaintenanceType",
    "FuelLog",
    "Expense", "ExpenseType",
]
