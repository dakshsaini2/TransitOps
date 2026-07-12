import { useNavigate, useParams } from "react-router-dom";
import { useTrip, useTripActions } from "../../hooks/useTrips";
import TripForm from "../../components/trips/TripForm";
import { AlertTriangle } from "lucide-react";

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trip, loading: tripLoading, error } = useTrip(id);
  const { actionLoading, updateTrip } = useTripActions();

  const handleSubmit = async (data) => {
    const res = await updateTrip(id, data);
    if (res.success) {
      navigate(`/trips/${id}`);
    } else {
      alert(res.message || "Failed to update trip");
    }
  };

  if (tripLoading) {
    return <div className="text-center py-12 text-warm-500 animate-pulse">Loading trip details...</div>;
  }

  if (error || !trip) {
    return (
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-700">Trip Not Found</h3>
        <p className="text-sm text-red-600 mt-1">{error || "The trip you are trying to edit does not exist."}</p>
        <button onClick={() => navigate("/trips")} className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">
          Back to Trips
        </button>
      </div>
    );
  }

  // Only scheduled trips can be edited
  if (trip.status !== "scheduled") {
    return (
      <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-amber-700">Cannot Edit Trip</h3>
        <p className="text-sm text-amber-600 mt-1">This trip is already {trip.status}. You can only edit scheduled trips.</p>
        <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <TripForm 
        mode="edit" 
        initialData={trip}
        onSubmit={handleSubmit} 
        loading={actionLoading} 
      />
    </div>
  );
}
