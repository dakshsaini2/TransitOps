import { useState } from "react";
import { useDrivers } from "../../hooks/useDrivers";
import { Search, Phone, Star } from "lucide-react";

export default function Drivers() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { drivers, loading } = useDrivers({ status: activeTab, search: searchQuery });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'available': return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">Available</span>;
      case 'on-trip': return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">On Trip</span>;
      case 'off-duty': return <span className="px-2 py-0.5 bg-warm-100 text-warm-600 border border-warm-300 rounded-full text-xs font-medium">Off Duty</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Drivers</h1>
        <p className="text-warm-500 text-sm mt-1">View driver directory and availability.</p>
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

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search drivers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-300 focus:border-warm-500 focus:bg-white focus:ring-2 focus:ring-warm-200 rounded-lg text-sm text-warm-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
           {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-warm-100 rounded-xl"></div>)}
        </div>
      ) : drivers.length === 0 ? (
        <div className="bg-white border border-warm-300 rounded-xl p-12 text-center shadow-sm">
          <div className="text-warm-400 mb-2 text-4xl">👨‍✈️</div>
          <h3 className="text-lg font-medium text-warm-600 mb-1">No drivers found</h3>
          <p className="text-sm text-warm-500">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {drivers.map(d => (
            <div key={d.id} className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warm-100 border border-warm-200 flex items-center justify-center text-warm-600 font-bold">
                       {d.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-warm-700">{d.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-warm-500">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {d.rating}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(d.status)}
                </div>
                
                <div className="space-y-1.5 text-sm mt-4">
                  <div className="flex items-center gap-2 text-warm-600">
                    <Phone className="w-4 h-4 text-warm-400" /> {d.phone}
                  </div>
                  <div className="flex justify-between items-center text-xs mt-2">
                    <span className="text-warm-400">License:</span>
                    <span className="font-mono text-warm-600">{d.license}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
