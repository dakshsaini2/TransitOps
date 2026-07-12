import { useState } from "react";
import { useVehicles } from "../../hooks/useVehicles";
import { Search } from "lucide-react";

export default function Vehicles() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { vehicles, loading } = useVehicles({ status: activeTab, search: searchQuery });

  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'AVAILABLE': return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">Available</span>;
      case 'ON_TRIP': return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">On Trip</span>;
      case 'IN_SHOP': return <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">In Shop</span>;
      case 'RETIRED': return <span className="px-2 py-0.5 bg-warm-100 text-warm-600 border border-warm-300 rounded-full text-xs font-medium">Retired</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Vehicles</h1>
        <p className="text-warm-500 text-sm mt-1">View fleet vehicles and their current status.</p>
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

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search vehicles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-300 focus:border-warm-500 focus:bg-white focus:ring-2 focus:ring-warm-200 rounded-lg text-sm text-warm-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
           {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-48 bg-warm-100 rounded-xl"></div>)}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white border border-warm-300 rounded-xl p-12 text-center shadow-sm">
          <div className="text-warm-400 mb-2 text-4xl">🚐</div>
          <h3 className="text-lg font-medium text-warm-600 mb-1">No vehicles found</h3>
          <p className="text-sm text-warm-500">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-mono text-lg font-bold text-warm-700 tracking-tight">{v.registration_number}</h3>
                   <p className="text-xs text-warm-500 mt-0.5">{v.vehicle_name} - {v.model}</p>
                 </div>
                 {getStatusBadge(v.status)}
              </div>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-warm-100 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-400">Type</span>
                  <span className="font-medium text-warm-600">{v.vehicle_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-400">Capacity</span>
                  <span className="font-medium text-warm-600">{v.max_load_capacity} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-400">Odometer</span>
                  <span className="font-medium text-warm-600">{v.odometer} km</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
