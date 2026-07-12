import { useNavigate } from "react-router-dom";
import { useMaintenanceActions } from "../../hooks/useMaintenance";
import MaintenanceForm from "../../components/vehicles/MaintenanceForm";
import { ArrowLeft } from "lucide-react";

export default function CreateMaintenance() {
  const navigate = useNavigate();
  const { createLog, actionLoading } = useMaintenanceActions();

  const handleSubmit = async (data) => {
    const res = await createLog(data);
    if (res.success) {
      navigate("/maintenance");
    } else {
      alert(res.message || "Failed to log maintenance");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Log Maintenance</h1>
          <p className="text-warm-500 text-sm mt-1">Record a new service or repair for a vehicle.</p>
        </div>
      </div>

      <MaintenanceForm onSubmit={handleSubmit} loading={actionLoading} />
    </div>
  );
}
