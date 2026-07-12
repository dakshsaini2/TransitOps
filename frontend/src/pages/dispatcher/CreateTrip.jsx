import { useNavigate } from "react-router-dom";
import { useTripActions } from "../../hooks/useTrips";
import TripForm from "../../components/trips/TripForm";

export default function CreateTrip() {
  const navigate = useNavigate();
  const { actionLoading, createTrip } = useTripActions();

  const handleSubmit = async (data) => {
    const res = await createTrip(data);
    if (res.success) {
      navigate("/trips");
    } else {
      alert(res.message || "Failed to create trip");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <TripForm 
        mode="create" 
        onSubmit={handleSubmit} 
        loading={actionLoading} 
      />
    </div>
  );
}
