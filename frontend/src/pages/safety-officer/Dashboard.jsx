import { Link } from "react-router-dom";
import { useDrivers } from "../../hooks/useDrivers";
import { Shield, AlertTriangle, UserCheck, Star, ChevronRight, Activity } from "lucide-react";

export default function Dashboard() {
  const { drivers, loading } = useDrivers();

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

  const activeDrivers = drivers.filter(d => d.status === "on-trip").length;
  const availableDrivers = drivers.filter(d => d.status === "available").length;
  
  // Calculate average rating
  const avgRating = (drivers.reduce((acc, curr) => acc + curr.rating, 0) / (drivers.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Safety & Compliance</h1>
          <p className="text-warm-500 text-sm mt-1">Monitor driver safety, incidents, and ratings.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
             <UserCheck className="w-10 h-10 text-emerald-200" />
          </div>
          <div className="relative z-10">
            <h3 className="text-warm-500 text-sm font-medium">Available Drivers</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-warm-800">{availableDrivers}</span>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
             <Activity className="w-10 h-10 text-blue-200" />
          </div>
          <div className="relative z-10">
            <h3 className="text-warm-500 text-sm font-medium">Drivers on Trip</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-warm-800">{activeDrivers}</span>
              <span className="text-sm font-medium text-notion-blue bg-blue-50 px-2 py-0.5 rounded-full">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
             <Star className="w-10 h-10 text-amber-200" />
          </div>
          <div className="relative z-10">
            <h3 className="text-warm-500 text-sm font-medium">Average Rating</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-warm-800">{avgRating}</span>
              <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts & Incidents */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-warm-200 pb-4">
            <h2 className="text-lg font-semibold text-warm-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Active Incidents
            </h2>
            <Link to="/reports" className="text-sm font-medium text-notion-blue hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
             <p className="text-sm text-warm-500 text-center py-4">No active incidents reported today.</p>
          </div>
        </div>

        {/* Top Rated Drivers */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-warm-200 pb-4">
            <h2 className="text-lg font-semibold text-warm-700 flex items-center gap-2">
              <Shield className="w-5 h-5 text-notion-blue" /> Safety Leaders
            </h2>
            <Link to="/drivers" className="text-sm font-medium text-notion-blue hover:underline flex items-center">
              Driver Roster <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {drivers
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map(driver => (
                <Link key={driver.id} to={`/drivers/${driver.id}`} className="block group">
                  <div className="flex justify-between items-center p-3 hover:bg-warm-50 rounded-lg border border-transparent hover:border-warm-200 transition-all">
                    <div>
                      <h4 className="text-sm font-semibold text-warm-700 group-hover:text-notion-blue">{driver.name}</h4>
                      <p className="text-xs text-warm-500">{driver.id} • {driver.phone}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-sm font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {driver.rating}
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
