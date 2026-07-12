from datetime import datetime, date
from sqlalchemy import Float, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Foreign keys
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False, index=True)
    trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id"), nullable=True, index=True)

    # Core fields from spec
    liters: Mapped[float] = mapped_column(Float, nullable=False)
    cost: Mapped[float] = mapped_column(Float, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)

    # Extra context
    odometer_at_fill: Mapped[float] = mapped_column(Float, nullable=True)   # km reading at fill
    fuel_station: Mapped[str] = mapped_column(String(200), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="fuel_logs")
    trip: Mapped["Trip"] = relationship("Trip", back_populates="fuel_logs")

    @property
    def cost_per_liter(self) -> float:
        return self.cost / self.liters if self.liters else 0.0

    def __repr__(self):
        return f"<FuelLog #{self.id} vehicle={self.vehicle_id} {self.liters}L @ {self.cost}>"
