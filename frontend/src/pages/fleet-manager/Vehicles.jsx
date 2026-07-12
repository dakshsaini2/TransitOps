import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVehicles, useVehicleActions } from "../../hooks/useVehicles";
import { Search, Plus, Edit2, Eye, Trash2 } from "lucide-react";

export default function Vehicles() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const { vehicles, loading } = useVehicles({ status: activeTab, search: searchQuery });
  const { deleteVehicle, actionLoading } = useVehicleActions();

  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'AVAILABLE': return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium">Available</span>;
      case 'ON_TRIP': return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">On Trip</span>;
      case 'IN_SHOP': return <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium">In Shop</span>;
      case 'RETIRED': return <span className="px-2.5 py-1 bg-warm-100 text-warm-600 border border-warm-300 rounded-md text-xs font-medium">Retired</span>;
      default: return null;
    }
  };

  const handleDelete = async (id, number) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${number}? This action cannot be undone.`)) {
      await deleteVehicle(id);
      window.location.reload(); // Simple refresh for mock data sync
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Fleet Management</h1>
          <p className="text-warm-500 text-sm mt-1">Manage vehicles, specs, and status.</p>
        </div>
        <Link 
          to="/vehicles/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-warm-300 rounded-xl p-4 shadow-sm">
        <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          <div className="flex gap-1">
            {[
              { id: "all", label: "All Vehicles" },
              { id: "AVAILABLE", label: "Available" },
              { id: "ON_TRIP", label: "On Trip" },
              { id: "IN_SHOP", label: "In Shop" },
              { id: "RETIRED", label: "Retired" }
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
              placeholder="Search by number or model..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-300 focus:border-warm-500 focus:bg-white focus:ring-2 focus:ring-warm-200 rounded-lg text-sm text-warm-600 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-warm-300 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-warm-50 border-b border-warm-200 text-warm-500 font-medium">
              <tr>
                <th className="px-6 py-4">Vehicle Number</th>
                <th className="px-6 py-4">Model & Type</th>
                <th className="px-6 py-4">Capacity (kg)</th>
                <th className="px-6 py-4">Odometer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-warm-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-warm-100 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-500">
                    <div className="text-4xl mb-3">🚐</div>
                    <p>No vehicles found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-warm-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-warm-700">{v.registration_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-warm-800">{v.vehicle_name} - {v.model}</div>
                      <div className="text-xs text-warm-500">{v.vehicle_type}</div>
                    </td>
                    <td className="px-6 py-4 text-warm-600">{v.max_load_capacity} kg</td>
                    <td className="px-6 py-4 text-warm-600">{v.odometer} km</td>
                    <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/vehicles/${v.id}`)}
                          className="p-1.5 text-warm-400 hover:text-notion-blue hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/vehicles/${v.id}/edit`)}
                          className="p-1.5 text-warm-400 hover:text-notion-blue hover:bg-blue-50 rounded transition-colors"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(v.id, v.number)}
                          disabled={actionLoading}
                          className="p-1.5 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
