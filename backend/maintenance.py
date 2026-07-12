import enum
from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class MaintenanceStatus(str, enum.Enum):
    ACTIVE = "Active"
    CLOSED = "Closed"


class MaintenanceType(str, enum.Enum):
    OIL_CHANGE = "Oil Change"
    TIRE_REPLACEMENT = "Tire Replacement"
    BRAKE_SERVICE = "Brake Service"
    ENGINE_REPAIR = "Engine Repair"
    ELECTRICAL = "Electrical"
    BODY_WORK = "Body Work"
    INSPECTION = "Inspection"
    OTHER = "Other"


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Foreign key
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False, index=True)

    # Core fields
    maintenance_type: Mapped[MaintenanceType] = mapped_column(SAEnum(MaintenanceType), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    cost: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[MaintenanceStatus] = mapped_column(
        SAEnum(MaintenanceStatus), nullable=False, default=MaintenanceStatus.ACTIVE
    )

    # Timestamps
    opened_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    closed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Who performed the work
    performed_by: Mapped[str] = mapped_column(String(100), nullable=True)
    workshop: Mapped[str] = mapped_column(String(200), nullable=True)

    # Relationship
    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="maintenance_logs")

    def __repr__(self):
        return f"<MaintenanceLog #{self.id} vehicle={self.vehicle_id} [{self.status}]>"
