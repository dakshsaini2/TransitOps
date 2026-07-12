import { useState } from "react";
import { Link } from "react-router-dom";
import { useFuelLogs, useFuelActions } from "../../hooks/useFuel";
import { useVehicles } from "../../hooks/useVehicles";
import { Search, Plus, Trash2 } from "lucide-react";

export default function FuelLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { logs, loading: fLoading } = useFuelLogs({ search: searchQuery });
  const { vehicles, loading: vLoading } = useVehicles();
  const { deleteLog, actionLoading } = useFuelActions();

  const loading = fLoading || vLoading;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fuel log?")) {
      await deleteLog(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Fuel & Energy Logs</h1>
          <p className="text-warm-500 text-sm mt-1">Track fleet fuel consumption and costs.</p>
        </div>
        <Link 
          to="/fuel/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" /> Add Fuel Log
        </Link>
      </div>

      <div className="flex items-center gap-2 bg-white border border-warm-300 rounded-xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search station or vehicle..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-300 focus:border-warm-500 focus:bg-white focus:ring-2 focus:ring-warm-200 rounded-lg text-sm text-warm-600 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-warm-300 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-warm-50 border-b border-warm-200 text-warm-500 font-medium">
              <tr>
                <th className="px-6 py-4">Log ID & Date</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Station</th>
                <th className="px-6 py-4 text-right">Volume</th>
                <th className="px-6 py-4 text-right">Total Cost</th>
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
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-warm-100 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-500">
                    <div className="text-4xl mb-3">⛽</div>
                    <p>No fuel logs found.</p>
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
                        <span className="font-mono font-bold text-warm-700">
                          {vehicle ? vehicle.number : log.vehicleId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-warm-800 font-medium">{log.station}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-warm-700">
                        {log.liters} L
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-warm-800">
                        ₹{log.cost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(log.id)}
                          disabled={actionLoading}
                          className="p-1.5 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
