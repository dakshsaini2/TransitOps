import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMaintenanceLogs, useMaintenanceActions } from "../../hooks/useMaintenance";
import { useVehicles } from "../../hooks/useVehicles";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const { logs, loading: mLoading } = useMaintenanceLogs({ status: activeTab, search: searchQuery });
  const { vehicles, loading: vLoading } = useVehicles();
  const { deleteLog, actionLoading } = useMaintenanceActions();

  const loading = mLoading || vLoading;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium">Completed</span>;
      case 'in-progress': return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-medium">In Progress</span>;
      case 'pending': return <span className="px-2.5 py-1 bg-warm-100 text-warm-700 border border-warm-300 rounded-md text-xs font-medium">Pending</span>;
      default: return null;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this maintenance log?")) {
      await deleteLog(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Maintenance Logs</h1>
          <p className="text-warm-500 text-sm mt-1">Track vehicle repairs, services, and associated costs.</p>
        </div>
        <Link 
          to="/maintenance/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" /> Log Maintenance
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-warm-300 rounded-xl p-4 shadow-sm">
        <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          <div className="flex gap-1">
            {[
              { id: "all", label: "All Logs" },
              { id: "pending", label: "Pending" },
              { id: "in-progress", label: "In Progress" },
              { id: "completed", label: "Completed" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                  ? "bg-warm-200 text-warm-800" 
                  : "text-warm-500 hover:text-warm-700 hover:bg-warm-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search descriptions, mechanics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-300 focus:border-warm-500 focus:bg-white focus:ring-2 focus:ring-warm-200 rounded-lg text-sm text-warm-600 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-warm-300 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-warm-50 border-b border-warm-200 text-warm-500 font-medium">
              <tr>
                <th className="px-6 py-4">ID & Date</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Mechanic</th>
                <th className="px-6 py-4">Cost</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-warm-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-warm-100 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-warm-500">
                    <div className="text-4xl mb-3">🧰</div>
                    <p>No maintenance logs found.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const vehicle = vehicles.find(v => v.id === log.vehicleId);
                  return (
                    <tr key={log.id} className="hover:bg-warm-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-warm-700 font-medium">{log.id}</div>
                        <div className="text-xs text-warm-500">{log.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        {vehicle ? (
                          <Link to={`/vehicles/${vehicle.id}`} className="font-mono font-bold text-notion-blue hover:underline">
                            {vehicle.number}
                          </Link>
                        ) : (
                          <span className="font-mono font-bold text-warm-700">{log.vehicleId}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-warm-800 font-medium line-clamp-1">{log.description}</div>
                        <div className="text-xs text-warm-500">{log.type}</div>
                      </td>
                      <td className="px-6 py-4 text-warm-600">{log.mechanic}</td>
                      <td className="px-6 py-4 font-medium text-warm-700">₹{log.cost.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/maintenance/${log.id}/edit`)}
                            className="p-1.5 text-warm-400 hover:text-notion-blue hover:bg-blue-50 rounded transition-colors"
                            title="Edit Log"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(log.id)}
                            disabled={actionLoading}
                            className="p-1.5 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title="Delete Log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
