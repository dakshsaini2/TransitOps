import enum
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class TripStatus(str, enum.Enum):
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Foreign keys
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False, index=True)
    driver_id: Mapped[int] = mapped_column(ForeignKey("drivers.id"), nullable=False, index=True)

    # Route
    source: Mapped[str] = mapped_column(String(200), nullable=False)
    destination: Mapped[str] = mapped_column(String(200), nullable=False)

    # Cargo & distance
    cargo_weight: Mapped[float] = mapped_column(Float, nullable=False)       # kg
    planned_distance: Mapped[float] = mapped_column(Float, nullable=False)   # km
    actual_distance: Mapped[float] = mapped_column(Float, nullable=True)     # filled on complete
    fuel_consumed: Mapped[float] = mapped_column(Float, nullable=True)       # litres, filled on complete

    # Revenue (used in ROI calculation)
    revenue: Mapped[float] = mapped_column(Float, default=0.0)

    # Lifecycle
    status: Mapped[TripStatus] = mapped_column(
        SAEnum(TripStatus), nullable=False, default=TripStatus.DRAFT
    )

    # Timestamps
    dispatched_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    cancelled_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Notes
    notes: Mapped[str] = mapped_column(Text, nullable=True)

    # Relationships
    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="trips")
    driver: Mapped["Driver"] = relationship("Driver", back_populates="trips")
    fuel_logs: Mapped[list["FuelLog"]] = relationship("FuelLog", back_populates="trip")

    def __repr__(self):
        return f"<Trip #{self.id} {self.source}→{self.destination} [{self.status}]>"
