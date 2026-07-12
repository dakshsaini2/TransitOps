import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDrivers, useDriverActions } from "../../hooks/useDrivers";
import { Search, Plus, Edit2, Eye, Trash2, Star } from "lucide-react";

export default function Drivers() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const { drivers, loading } = useDrivers({ status: activeTab, search: searchQuery });
  const { deleteDriver, actionLoading } = useDriverActions();

  const getStatusBadge = (status) => {
    switch(status) {
      case 'available': return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium">Available</span>;
      case 'on-trip': return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">On Trip</span>;
      case 'off-duty': return <span className="px-2.5 py-1 bg-warm-100 text-warm-700 border border-warm-300 rounded-md text-xs font-medium">Off Duty</span>;
      default: return null;
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete driver ${name}?`)) {
      await deleteDriver(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Driver Management</h1>
          <p className="text-warm-500 text-sm mt-1">Manage driver profiles and compliance.</p>
        </div>
        <Link 
          to="/drivers/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" /> Add Driver
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-warm-300 rounded-xl p-4 shadow-sm">
        <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          <div className="flex gap-1">
            {[
              { id: "all", label: "All Drivers" },
              { id: "available", label: "Available" },
              { id: "on-trip", label: "On Trip" },
              { id: "off-duty", label: "Off Duty" }
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
              placeholder="Search name or license..." 
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
                <th className="px-6 py-4">Driver ID</th>
                <th className="px-6 py-4">Name & Phone</th>
                <th className="px-6 py-4">License</th>
                <th className="px-6 py-4">Safety Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-warm-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-warm-100 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-500">
                    <div className="text-4xl mb-3">🧑‍✈️</div>
                    <p>No drivers found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-warm-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-warm-700">{d.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-warm-800">{d.name}</div>
                      <div className="text-xs text-warm-500">{d.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-warm-600">{d.license}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-medium text-warm-700">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {d.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(d.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/drivers/${d.id}`)}
                          className="p-1.5 text-warm-400 hover:text-notion-blue hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/drivers/${d.id}/edit`)}
                          className="p-1.5 text-warm-400 hover:text-notion-blue hover:bg-blue-50 rounded transition-colors"
                          title="Edit Driver"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(d.id, d.name)}
                          disabled={actionLoading}
                          className="p-1.5 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete Driver"
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
