import enum
from datetime import datetime, date
from sqlalchemy import String, Float, Date, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class DriverStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    OFF_DUTY = "Off Duty"
    SUSPENDED = "Suspended"


class LicenseCategory(str, enum.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"
    CE = "CE"
    OTHER = "Other"


class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Core fields from spec
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    license_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    license_category: Mapped[LicenseCategory] = mapped_column(SAEnum(LicenseCategory), nullable=False)
    license_expiry: Mapped[date] = mapped_column(Date, nullable=False)
    contact: Mapped[str] = mapped_column(String(20), nullable=True)
    safety_score: Mapped[float] = mapped_column(Float, default=100.0)   # 0–100
    status: Mapped[DriverStatus] = mapped_column(
        SAEnum(DriverStatus), nullable=False, default=DriverStatus.AVAILABLE
    )

    # Extra fields
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    address: Mapped[str] = mapped_column(String(300), nullable=True)
    notes: Mapped[str] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trips: Mapped[list["Trip"]] = relationship("Trip", back_populates="driver")

    @property
    def is_license_valid(self) -> bool:
        return self.license_expiry >= date.today()

    @property
    def is_dispatchable(self) -> bool:
        return self.status == DriverStatus.AVAILABLE and self.is_license_valid

    def __repr__(self):
        return f"<Driver {self.name} — {self.status}>"
