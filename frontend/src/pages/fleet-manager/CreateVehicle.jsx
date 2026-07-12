import { useNavigate } from "react-router-dom";
import { useVehicleActions } from "../../hooks/useVehicles";
import VehicleForm from "../../components/vehicles/VehicleForm";
import { ArrowLeft } from "lucide-react";

export default function CreateVehicle() {
  const navigate = useNavigate();
  const { createVehicle, actionLoading } = useVehicleActions();

  const handleSubmit = async (data) => {
    const res = await createVehicle(data);
    if (res.success) {
      navigate("/vehicles");
    } else {
      alert(res.message || "Failed to create vehicle");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/vehicles")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Add New Vehicle</h1>
          <p className="text-warm-500 text-sm mt-1">Register a new vehicle into the fleet.</p>
        </div>
      </div>

      <VehicleForm onSubmit={handleSubmit} loading={actionLoading} />
    </div>
  );
}
