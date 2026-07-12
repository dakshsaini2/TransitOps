import enum
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class VehicleStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"


class VehicleType(str, enum.Enum):
    TRUCK = "Truck"
    VAN = "Van"
    PICKUP = "Pickup"
    TRAILER = "Trailer"
    BUS = "Bus"
    OTHER = "Other"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Core fields from spec
    reg_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[VehicleType] = mapped_column(SAEnum(VehicleType), nullable=False)
    max_load_kg: Mapped[float] = mapped_column(Float, nullable=False)
    odometer: Mapped[float] = mapped_column(Float, default=0.0)          # km
    acquisition_cost: Mapped[float] = mapped_column(Float, default=0.0)  # currency
    status: Mapped[VehicleStatus] = mapped_column(
        SAEnum(VehicleStatus), nullable=False, default=VehicleStatus.AVAILABLE
    )

    # Extra operational fields
    region: Mapped[str] = mapped_column(String(100), nullable=True)
    year: Mapped[int] = mapped_column(Integer, nullable=True)
    notes: Mapped[str] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trips: Mapped[list["Trip"]] = relationship("Trip", back_populates="vehicle")
    maintenance_logs: Mapped[list["MaintenanceLog"]] = relationship("MaintenanceLog", back_populates="vehicle")
    fuel_logs: Mapped[list["FuelLog"]] = relationship("FuelLog", back_populates="vehicle")
    expenses: Mapped[list["Expense"]] = relationship("Expense", back_populates="vehicle")

    def __repr__(self):
        return f"<Vehicle {self.reg_number} — {self.status}>"
