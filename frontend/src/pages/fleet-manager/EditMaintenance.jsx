import { useParams, useNavigate } from "react-router-dom";
import { useMaintenanceLog, useMaintenanceActions } from "../../hooks/useMaintenance";
import MaintenanceForm from "../../components/vehicles/MaintenanceForm";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function EditMaintenance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { log, loading: fetchLoading, error } = useMaintenanceLog(id);
  const { updateLog, actionLoading } = useMaintenanceActions();

  const handleSubmit = async (data) => {
    const res = await updateLog(id, data);
    if (res.success) {
      navigate("/maintenance");
    } else {
      alert(res.message || "Failed to update log");
    }
  };

  if (fetchLoading) {
    return <div className="max-w-4xl mx-auto animate-pulse h-96 bg-warm-200 rounded-xl"></div>;
  }

  if (error || !log) {
    return (
      <div className="max-w-4xl mx-auto bg-white border border-red-300 rounded-xl p-8 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-700">Log Not Found</h3>
        <p className="text-sm text-red-600 mt-1">{error || "The maintenance record you are trying to edit does not exist."}</p>
        <button onClick={() => navigate("/maintenance")} className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">
          Back to Maintenance
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/maintenance")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Edit Maintenance Log</h1>
          <p className="text-warm-500 text-sm mt-1">Update details for {log.id}</p>
        </div>
      </div>

      <MaintenanceForm initialData={log} onSubmit={handleSubmit} loading={actionLoading} isEdit />
    </div>
  );
}
