import { Link } from "react-router-dom";
import { useVehicles } from "../../hooks/useVehicles";
import { useMaintenanceLogs } from "../../hooks/useMaintenance";
import { Truck, Wrench, AlertTriangle, CheckCircle, ChevronRight, Activity, Plus } from "lucide-react";

export default function Dashboard() {
  const { vehicles, loading: vLoading } = useVehicles();
  const { logs, loading: mLoading } = useMaintenanceLogs();

  const loading = vLoading || mLoading;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-warm-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="h-32 bg-warm-200 rounded-xl"></div>
          <div className="h-32 bg-warm-200 rounded-xl"></div>
          <div className="h-32 bg-warm-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const activeVehicles = vehicles.filter(v => v.status === "in-use").length;
  const availableVehicles = vehicles.filter(v => v.status === "available").length;
  const maintenanceVehicles = vehicles.filter(v => v.status === "maintenance").length;
  
  const pendingMaintenance = logs.filter(l => l.status === "pending" || l.status === "in-progress").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Fleet Overview</h1>
          <p className="text-warm-500 text-sm mt-1">Monitor your vehicles, maintenance, and fleet health.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/vehicles/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-warm-300 hover:bg-warm-50 text-warm-700 text-sm font-medium rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </Link>
          <Link 
            to="/maintenance/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
          >
            <Wrench className="w-4 h-4" /> Log Maintenance
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
             <CheckCircle className="w-10 h-10 text-emerald-200" />
          </div>
          <div className="relative z-10">
            <h3 className="text-warm-500 text-sm font-medium">Available Vehicles</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-warm-800">{availableVehicles}</span>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
             <Activity className="w-10 h-10 text-blue-200" />
          </div>
          <div className="relative z-10">
            <h3 className="text-warm-500 text-sm font-medium">Active on Trips</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-warm-800">{activeVehicles}</span>
              <span className="text-sm font-medium text-notion-blue bg-blue-50 px-2 py-0.5 rounded-full">Dispatched</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
             <AlertTriangle className="w-10 h-10 text-red-200" />
          </div>
          <div className="relative z-10">
            <h3 className="text-warm-500 text-sm font-medium">In Maintenance</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-warm-800">{maintenanceVehicles}</span>
              <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{pendingMaintenance} tasks</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicles Needing Attention */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-warm-200 pb-4">
            <h2 className="text-lg font-semibold text-warm-700 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" /> Needs Attention
            </h2>
            <Link to="/vehicles" className="text-sm font-medium text-notion-blue hover:underline flex items-center">
              View Fleet <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {vehicles.filter(v => v.status === "maintenance").length === 0 ? (
              <p className="text-sm text-warm-500 text-center py-4">All vehicles are healthy.</p>
            ) : (
              vehicles.filter(v => v.status === "maintenance").map(v => (
                <div key={v.id} className="flex justify-between items-center p-3 hover:bg-warm-50 rounded-lg border border-warm-100 transition-colors">
                  <div>
                    <div className="font-mono font-semibold text-warm-700">{v.number}</div>
                    <div className="text-xs text-warm-500">{v.model} ({v.year})</div>
                  </div>
                  <Link to={`/maintenance/new?vehicleId=${v.id}`} className="text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-100 transition-colors">
                    Log Issue
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Maintenance */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-warm-200 pb-4">
            <h2 className="text-lg font-semibold text-warm-700 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-notion-blue" /> Recent Maintenance
            </h2>
            <Link to="/maintenance" className="text-sm font-medium text-notion-blue hover:underline flex items-center">
              View Log <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {logs.slice(0, 4).map(log => {
              const vehicle = vehicles.find(v => v.id === log.vehicleId);
              return (
                <Link key={log.id} to={`/maintenance/${log.id}`} className="block group">
                  <div className="flex gap-4 p-3 hover:bg-warm-50 rounded-lg border border-transparent hover:border-warm-200 transition-all">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      log.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                      log.status === 'in-progress' ? 'bg-amber-100 text-amber-600' : 'bg-warm-200 text-warm-500'
                    }`}>
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="text-sm font-semibold text-warm-700 group-hover:text-notion-blue truncate">
                          {vehicle ? vehicle.number : log.vehicleId}
                        </h4>
                        <span className="text-xs text-warm-400 whitespace-nowrap ml-2">{log.date}</span>
                      </div>
                      <p className="text-xs text-warm-500 truncate">{log.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
