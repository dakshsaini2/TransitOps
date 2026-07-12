import { useParams, useNavigate, Link } from "react-router-dom";
import { useVehicle } from "../../hooks/useVehicles";
import { useMaintenanceLogs } from "../../hooks/useMaintenance";
import { ArrowLeft, Edit2, AlertTriangle, CheckCircle, Truck, Info, Wrench } from "lucide-react";

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicle, loading: vLoading, error } = useVehicle(id);
  const { logs, loading: mLoading } = useMaintenanceLogs({ vehicleId: id });

  if (vLoading || mLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-warm-200 rounded w-1/3"></div>
        <div className="h-64 bg-warm-200 rounded-xl"></div>
        <div className="h-64 bg-warm-200 rounded-xl"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-5xl mx-auto bg-white border border-red-300 rounded-xl p-8 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-700">Vehicle Not Found</h3>
        <p className="text-sm text-red-600 mt-1">{error || "The vehicle you are looking for does not exist."}</p>
        <button onClick={() => navigate("/vehicles")} className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">
          Back to Vehicles
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'available': return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Available</span>;
      case 'in-use': return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium flex items-center gap-1.5"><Truck className="w-4 h-4"/> In Use</span>;
      case 'maintenance': return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm font-medium flex items-center gap-1.5"><Wrench className="w-4 h-4"/> Maintenance</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/vehicles")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight font-mono">{vehicle.number}</h1>
          <p className="text-warm-500 text-sm mt-1">{vehicle.model} ({vehicle.year})</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {getStatusBadge(vehicle.status)}
          <div className="h-8 w-px bg-warm-200 mx-2"></div>
          <Link to={`/vehicles/${vehicle.id}/edit`} className="px-4 py-2 bg-white border border-warm-300 text-warm-600 hover:bg-warm-50 text-sm font-medium rounded-lg flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specs Card */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm lg:col-span-1 h-fit">
          <h2 className="text-lg font-semibold text-warm-700 flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-notion-blue" /> Specifications
          </h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500">Type</span>
              <span className="font-medium text-warm-800">{vehicle.type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500">Seating Capacity</span>
              <span className="font-medium text-warm-800">{vehicle.capacity} seats</span>
            </div>
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500">Fuel Type</span>
              <span className="font-medium text-warm-800">{vehicle.fuelType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500">Manufacturing Year</span>
              <span className="font-medium text-warm-800">{vehicle.year}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-warm-500">Last Service</span>
              <span className="font-medium text-warm-800">{vehicle.lastService || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-warm-700 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-500" /> Maintenance History
            </h2>
            <Link to={`/maintenance/new?vehicleId=${vehicle.id}`} className="text-sm font-medium text-notion-blue hover:underline">
              + Log Maintenance
            </Link>
          </div>
          
          {logs.length === 0 ? (
            <div className="text-center py-12 text-warm-500">
              <Wrench className="w-12 h-12 text-warm-300 mx-auto mb-3" />
              <p>No maintenance records found for this vehicle.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-warm-200 rounded-lg hover:border-warm-300 transition-colors">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          log.type === 'Repair' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-sm font-medium text-warm-700">{log.description}</span>
                      </div>
                      <span className="text-sm text-warm-500">{log.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-warm-500 mt-2">
                      <span>Mechanic: {log.mechanic}</span>
                      <span>Cost: ₹{log.cost.toLocaleString()}</span>
                      <span className={`font-medium ${
                        log.status === 'completed' ? 'text-emerald-600' : 
                        log.status === 'in-progress' ? 'text-amber-600' : 'text-warm-500'
                      }`}>
                        Status: {log.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
