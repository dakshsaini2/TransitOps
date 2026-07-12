import { useParams, useNavigate, Link } from "react-router-dom";
import { useMaintenanceLog, useMaintenanceActions } from "../../hooks/useMaintenance";
import { useVehicles } from "../../hooks/useVehicles";
import { ArrowLeft, Edit2, AlertTriangle, Wrench, CheckCircle, Clock, Trash2, Calendar, IndianRupee } from "lucide-react";

export default function MaintenanceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { log, loading: mLoading, error } = useMaintenanceLog(id);
  const { vehicles, loading: vLoading } = useVehicles();
  const { deleteLog, actionLoading } = useMaintenanceActions();

  if (mLoading || vLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-warm-200 rounded w-1/3"></div>
        <div className="h-96 bg-warm-200 rounded-xl"></div>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="max-w-4xl mx-auto bg-white border border-red-300 rounded-xl p-8 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-700">Record Not Found</h3>
        <p className="text-sm text-red-600 mt-1">{error || "The maintenance log does not exist."}</p>
        <button onClick={() => navigate("/maintenance")} className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">
          Back to Maintenance
        </button>
      </div>
    );
  }

  const vehicle = vehicles.find(v => v.id === log.vehicleId);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      const res = await deleteLog(log.id);
      if (res.success) {
        navigate("/maintenance");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-12 h-12 text-emerald-500" />;
      case 'in-progress': return <Wrench className="w-12 h-12 text-amber-500" />;
      default: return <Clock className="w-12 h-12 text-warm-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/maintenance")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight font-mono">Log {log.id}</h1>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link to={`/maintenance/${log.id}/edit`} className="px-4 py-2 bg-white border border-warm-300 text-warm-600 hover:bg-warm-50 text-sm font-medium rounded-lg flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </Link>
          <button 
            onClick={handleDelete}
            disabled={actionLoading}
            className="p-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-warm-300 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Status Info */}
        <div className="bg-warm-50 border-b md:border-b-0 md:border-r border-warm-200 p-8 flex flex-col items-center justify-center text-center md:w-64 shrink-0">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            {getStatusIcon(log.status)}
          </div>
          <h2 className="text-xl font-bold text-warm-800 capitalize mb-1">{log.status}</h2>
          <span className="text-sm font-medium px-3 py-1 bg-warm-200 text-warm-700 rounded-full">{log.type}</span>
        </div>

        {/* Right Side: Details */}
        <div className="p-8 flex-1">
          <h3 className="text-lg font-bold text-warm-700 mb-6">Service Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <span className="block text-xs font-semibold text-warm-400 uppercase tracking-wider mb-1">Vehicle</span>
              {vehicle ? (
                <Link to={`/vehicles/${vehicle.id}`} className="font-mono text-lg font-bold text-notion-blue hover:underline">
                  {vehicle.number}
                </Link>
              ) : (
                <span className="font-mono text-lg font-bold text-warm-700">{log.vehicleId}</span>
              )}
            </div>

            <div>
              <span className="block text-xs font-semibold text-warm-400 uppercase tracking-wider mb-1">Date</span>
              <div className="flex items-center gap-2 text-warm-800 font-medium">
                <Calendar className="w-4 h-4 text-warm-400" /> {log.date}
              </div>
            </div>

            <div className="sm:col-span-2">
              <span className="block text-xs font-semibold text-warm-400 uppercase tracking-wider mb-1">Description</span>
              <p className="text-warm-700 text-base">{log.description}</p>
            </div>

            <div>
              <span className="block text-xs font-semibold text-warm-400 uppercase tracking-wider mb-1">Mechanic / Workshop</span>
              <p className="text-warm-800 font-medium">{log.mechanic}</p>
            </div>

            <div>
              <span className="block text-xs font-semibold text-warm-400 uppercase tracking-wider mb-1">Total Cost</span>
              <div className="flex items-center gap-1 text-lg font-bold text-warm-800">
                 <IndianRupee className="w-4 h-4 text-warm-500" /> {log.cost.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
