import enum
from datetime import datetime, date
from sqlalchemy import Float, Date, DateTime, ForeignKey, String, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ExpenseType(str, enum.Enum):
    TOLL = "Toll"
    MAINTENANCE = "Maintenance"
    PARKING = "Parking"
    FINE = "Fine"
    INSURANCE = "Insurance"
    REGISTRATION = "Registration"
    OTHER = "Other"


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Foreign key
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False, index=True)

    # Core fields from spec
    type: Mapped[ExpenseType] = mapped_column(SAEnum(ExpenseType), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    note: Mapped[str] = mapped_column(Text, nullable=True)

    # Extra context
    receipt_ref: Mapped[str] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationship
    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="expenses")

    def __repr__(self):
        return f"<Expense #{self.id} {self.type} ₹{self.amount} vehicle={self.vehicle_id}>"
