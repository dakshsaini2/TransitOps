import { useNavigate } from "react-router-dom";
import { useFuelActions } from "../../hooks/useFuel";
import FuelForm from "../../components/financial/FuelForm";
import { ArrowLeft } from "lucide-react";

export default function CreateFuel() {
  const navigate = useNavigate();
  const { createLog, actionLoading } = useFuelActions();

  const handleSubmit = async (data) => {
    const res = await createLog(data);
    if (res.success) {
      navigate("/fuel");
    } else {
      alert(res.message || "Failed to log fuel");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/fuel")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Log Fuel Entry</h1>
          <p className="text-warm-500 text-sm mt-1">Record a new fuel transaction.</p>
        </div>
      </div>

      <FuelForm onSubmit={handleSubmit} loading={actionLoading} />
    </div>
  );
}
