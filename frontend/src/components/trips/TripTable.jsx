import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Eye, Edit2, Play, CheckCircle, XCircle } from "lucide-react";
import TripStatusBadge from "./TripStatusBadge";
import { useState, useRef, useEffect } from "react";

function ActionMenu({ trip, onAction }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1 rounded text-warm-400 hover:text-warm-600 hover:bg-warm-100 transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-warm-200 rounded-lg shadow-lg z-10 py-1 animate-scale-in origin-top-right">
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("view", trip); }}
            className="w-full text-left px-4 py-2 text-sm text-warm-600 hover:bg-warm-50 flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-warm-400" /> View Details
          </button>
          
          {trip.status?.toUpperCase() === "DRAFT" && (
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("edit", trip); }}
              className="w-full text-left px-4 py-2 text-sm text-warm-600 hover:bg-warm-50 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4 text-warm-400" /> Edit Trip
            </button>
          )}

          {trip.status?.toUpperCase() === "DRAFT" && (
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("dispatch", trip); }}
              className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-500" /> Dispatch
            </button>
          )}

          {trip.status?.toUpperCase() === "DISPATCHED" && (
             <button
               onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("complete", trip); }}
               className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
             >
               <CheckCircle className="w-4 h-4 text-emerald-500" /> Complete
             </button>
          )}

          {!["COMPLETED", "CANCELLED"].includes(trip.status?.toUpperCase()) && (
             <button
               onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("cancel", trip); }}
               className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-warm-100 mt-1 pt-1"
             >
               <XCircle className="w-4 h-4 text-red-500" /> Cancel Trip
             </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TripTable({ trips, loading, onAction }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white border border-warm-300 rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div className="h-12 bg-warm-100 border-b border-warm-300" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 border-b border-warm-200 px-6 flex items-center">
            <div className="h-4 bg-warm-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <div className="bg-white border border-warm-300 rounded-xl p-12 text-center shadow-sm">
        <div className="text-warm-400 mb-2 text-4xl">🚐</div>
        <h3 className="text-lg font-medium text-warm-600 mb-1">No trips found</h3>
        <p className="text-sm text-warm-500">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  const handleRowClick = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  return (
    <div className="bg-white border border-warm-300 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-warm-100/50 border-b border-warm-300 text-xs font-semibold text-warm-500 uppercase tracking-wider">
            <th className="px-6 py-3">Trip ID</th>
            <th className="px-6 py-3">Route</th>
            <th className="px-6 py-3">Scheduled Time</th>
            <th className="px-6 py-3">Vehicle</th>
            <th className="px-6 py-3">Driver</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-200">
          {trips.map((trip) => (
            <tr 
              key={trip.id} 
              onClick={() => handleRowClick(trip.id)}
              className="hover:bg-warm-50 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4">
                <span className="font-mono text-xs font-medium text-warm-600">{trip.trip_number || trip.id}</span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-warm-700">{trip.source} → {trip.destination}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-warm-600">{trip.departure_time ? new Date(trip.departure_time).toLocaleDateString() : "TBD"}</div>
                <div className="text-xs text-warm-400">{trip.departure_time ? new Date(trip.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</div>
              </td>
              <td className="px-6 py-4">
                {trip.vehicle ? (
                  <div className="text-sm font-mono text-warm-600">{trip.vehicle.registration_number || `ID: ${trip.vehicle_id}`}</div>
                ) : (
                  <span className="text-xs text-warm-400 italic">ID: {trip.vehicle_id}</span>
                )}
              </td>
              <td className="px-6 py-4">
                {trip.driver ? (
                   <div className="text-sm text-warm-600">{trip.driver.full_name || `ID: ${trip.driver_id}`}</div>
                ) : (
                   <span className="text-xs text-warm-400 italic">ID: {trip.driver_id}</span>
                )}
              </td>
              <td className="px-6 py-4">
                <TripStatusBadge status={trip.status} />
              </td>
              <td className="px-4 py-4 text-right">
                <ActionMenu trip={trip} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
