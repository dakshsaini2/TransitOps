import { Link } from "react-router-dom";
import { useTrips } from "../../hooks/useTrips";
import { useVehicles } from "../../hooks/useVehicles";
import { useDrivers } from "../../hooks/useDrivers";
import TripStatusBadge from "../../components/trips/TripStatusBadge";
import { MapPin, Truck, Users, Activity, ChevronRight, Plus } from "lucide-react";

export default function Dashboard() {
  const { trips, loading: tripsLoading } = useTrips();
  const { vehicles, loading: vehiclesLoading } = useVehicles({ status: "available" });
  const { drivers, loading: driversLoading } = useDrivers({ status: "available" });

  const activeTripsCount = trips.filter(t => t.status === "in-progress" || t.status === "dispatched").length;
  const completedTodayCount = trips.filter(t => t.status === "completed" && t.scheduledDate === new Date().toISOString().split('T')[0]).length || trips.filter(t => t.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Dashboard</h1>
          <p className="text-warm-500 text-sm mt-1">Overview of your daily transport operations.</p>
        </div>
        <Link 
          to="/trips/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" />
          Create Trip
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Trips" 
          value={tripsLoading ? "..." : activeTripsCount} 
          icon={<MapPin className="w-5 h-5 text-emerald-600" />} 
          bg="bg-emerald-50"
          border="border-emerald-200"
        />
        <StatCard 
          title="Available Vehicles" 
          value={vehiclesLoading ? "..." : vehicles.length} 
          icon={<Truck className="w-5 h-5 text-notion-blue" />} 
          bg="bg-blue-50"
          border="border-blue-200"
        />
        <StatCard 
          title="Available Drivers" 
          value={driversLoading ? "..." : drivers.length} 
          icon={<Users className="w-5 h-5 text-amber-600" />} 
          bg="bg-amber-50"
          border="border-amber-200"
        />
        <StatCard 
          title="Completed Today" 
          value={tripsLoading ? "..." : completedTodayCount} 
          icon={<Activity className="w-5 h-5 text-purple-600" />} 
          bg="bg-purple-50"
          border="border-purple-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Timeline */}
        <div className="lg:col-span-2 bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-warm-200 pb-4">
            <h2 className="text-lg font-semibold text-warm-700">Today's Schedule</h2>
            <Link to="/trips" className="text-sm font-medium text-notion-blue hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-6">
            {tripsLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-warm-100 rounded-lg"></div>)}
              </div>
            ) : trips.length > 0 ? (
              trips.slice(0, 5).map((trip) => (
                <div key={trip.id} className="flex gap-4 relative group">
                   <div className="w-12 pt-1 text-right">
                     <div className="text-xs font-semibold text-warm-600">{trip.scheduledTime}</div>
                   </div>
                   <div className="flex flex-col items-center">
                     <div className="w-3 h-3 rounded-full bg-warm-300 border-2 border-white shadow-sm z-10 group-hover:bg-notion-blue transition-colors"></div>
                     <div className="w-px h-full bg-warm-200 my-1"></div>
                   </div>
                   <div className="flex-1 pb-6">
                     <Link to={`/trips/${trip.id}`} className="block bg-warm-50 hover:bg-warm-100 border border-warm-200 hover:border-warm-300 rounded-lg p-4 transition-all hover:-translate-y-0.5">
                       <div className="flex justify-between items-start mb-2">
                         <div className="font-medium text-warm-700">{trip.origin} → {trip.destination}</div>
                         <TripStatusBadge status={trip.status} />
                       </div>
                       <div className="flex items-center gap-4 text-xs text-warm-500">
                          {trip.vehicle && <span>Vehicle: {trip.vehicle.number}</span>}
                          {trip.driver && <span>Driver: {trip.driver.name}</span>}
                       </div>
                     </Link>
                   </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-warm-500 text-center py-4">No trips scheduled for today.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-warm-700 mb-6 border-b border-warm-200 pb-4">Recent Activity</h2>
          
          <div className="space-y-4">
             {/* Mock activity feed based on trips */}
             {!tripsLoading && trips.slice(0,4).map((trip, i) => (
               <div key={`activity-${i}`} className="flex gap-3 items-start">
                 <div className="w-2 h-2 rounded-full bg-warm-400 mt-1.5"></div>
                 <div>
                   <p className="text-sm text-warm-600">
                     Trip <Link to={`/trips/${trip.id}`} className="font-mono text-notion-blue hover:underline">{trip.id}</Link> 
                     {trip.status === 'completed' ? ' was completed.' : 
                      trip.status === 'in-progress' ? ' started journey.' : 
                      trip.status === 'dispatched' ? ' was dispatched.' : ' was scheduled.'}
                   </p>
                   <p className="text-xs text-warm-400 mt-0.5">
                     {trip.completedAt ? new Date(trip.completedAt).toLocaleTimeString() : 
                      trip.startedAt ? new Date(trip.startedAt).toLocaleTimeString() : 
                      trip.dispatchedAt ? new Date(trip.dispatchedAt).toLocaleTimeString() : 
                      new Date(trip.createdAt).toLocaleTimeString()}
                   </p>
                 </div>
               </div>
             ))}
             {tripsLoading && <div className="text-sm text-warm-500">Loading activity...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg, border }) {
  return (
    <div className={`bg-white border border-warm-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 -mt-6 -mr-6 rounded-full opacity-10 ${bg}`}></div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${bg} ${border} border flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-warm-500">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-warm-700 tracking-tight">
        {value}
      </div>
    </div>
  );
}
