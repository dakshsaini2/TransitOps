import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTrip, useTripActions } from "../../hooks/useTrips";
import TripStatusBadge from "../../components/trips/TripStatusBadge";
import DispatchDialog from "../../components/trips/DispatchDialog";
import { ArrowLeft, MapPin, Truck, User, Calendar, FileText, CheckCircle, Play, XCircle, Edit2 } from "lucide-react";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trip, loading, error, refetch } = useTrip(id);
  const { actionLoading, dispatchTrip, completeTrip, cancelTrip, startTrip } = useTripActions();
  
  const [dialogConfig, setDialogConfig] = useState({ open: false, type: null });

  if (loading) return <div className="text-center py-12 text-warm-500 animate-pulse">Loading trip details...</div>;
  if (error || !trip) return <div className="text-center py-12 text-red-500">Failed to load trip: {error}</div>;

  const confirmAction = async () => {
    const { type } = dialogConfig;
    let res;
    if (type === "dispatch") res = await dispatchTrip(trip.id);
    else if (type === "start") res = await startTrip(trip.id);
    else if (type === "complete") res = await completeTrip(trip.id);
    else if (type === "cancel") res = await cancelTrip(trip.id);

    if (res?.success) {
      setDialogConfig({ open: false, type: null });
      refetch();
    } else {
      alert(res?.message || "Action failed");
    }
  };

  // Timeline items based on dates
  const timeline = [
    { label: "Created", date: trip.createdAt, done: !!trip.createdAt },
    { label: "Scheduled", date: `${trip.scheduledDate}T${trip.scheduledTime}`, done: true },
    { label: "Dispatched", date: trip.dispatchedAt, done: !!trip.dispatchedAt },
    { label: "Started", date: trip.startedAt, done: !!trip.startedAt },
    { label: trip.status === "cancelled" ? "Cancelled" : "Completed", date: trip.completedAt, done: !!trip.completedAt || trip.status === "cancelled", isError: trip.status === "cancelled" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/trips")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Trip {trip.id}</h1>
            <TripStatusBadge status={trip.status} size="lg" />
          </div>
          <p className="text-warm-500 text-sm mt-0.5">{trip.origin} → {trip.destination}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {trip.status === "scheduled" && (
            <>
              <Link to={`/trips/${trip.id}/edit`} className="px-4 py-2 bg-white border border-warm-300 text-warm-600 hover:bg-warm-50 text-sm font-medium rounded-lg flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit
              </Link>
              <button onClick={() => setDialogConfig({ open: true, type: "dispatch" })} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2">
                <Play className="w-4 h-4" /> Dispatch
              </button>
            </>
          )}
          {trip.status === "dispatched" && (
            <button onClick={() => setDialogConfig({ open: true, type: "start" })} className="px-4 py-2 bg-notion-blue hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2">
              <Play className="w-4 h-4" /> Start Journey
            </button>
          )}
          {trip.status === "in-progress" && (
            <button onClick={() => setDialogConfig({ open: true, type: "complete" })} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Complete Trip
            </button>
          )}
          {!["completed", "cancelled"].includes(trip.status) && (
            <button onClick={() => setDialogConfig({ open: true, type: "cancel" })} className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-semibold text-warm-700 border-b border-warm-200 pb-3">Trip Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-warm-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-warm-400 font-medium uppercase tracking-wider mb-1">Route</div>
                    <div className="text-sm font-medium text-warm-700">{trip.origin}</div>
                    <div className="text-sm font-medium text-warm-700 mt-1">↓ {trip.destination}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-warm-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-warm-400 font-medium uppercase tracking-wider mb-1">Schedule</div>
                    <div className="text-sm text-warm-700">{trip.scheduledDate}</div>
                    <div className="text-sm text-warm-600">{trip.scheduledTime}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Truck className="w-5 h-5 text-warm-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-warm-400 font-medium uppercase tracking-wider mb-1">Vehicle</div>
                    {trip.vehicle ? (
                      <>
                        <div className="text-sm font-mono text-warm-700">{trip.vehicle.number}</div>
                        <div className="text-xs text-warm-500 mt-0.5">{trip.vehicle.type}</div>
                      </>
                    ) : <span className="text-sm text-warm-400 italic">Unassigned</span>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <User className="w-5 h-5 text-warm-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-warm-400 font-medium uppercase tracking-wider mb-1">Driver</div>
                    {trip.driver ? (
                      <>
                        <div className="text-sm font-medium text-warm-700">{trip.driver.name}</div>
                        <div className="text-xs text-warm-500 mt-0.5">{trip.driver.phone}</div>
                      </>
                    ) : <span className="text-sm text-warm-400 italic">Unassigned</span>}
                  </div>
                </div>
              </div>
            </div>

            {trip.notes && (
              <div className="pt-4 border-t border-warm-100 flex gap-3">
                 <FileText className="w-5 h-5 text-warm-400 shrink-0 mt-0.5" />
                 <div>
                    <div className="text-xs text-warm-400 font-medium uppercase tracking-wider mb-1">Notes</div>
                    <p className="text-sm text-warm-600 leading-relaxed">{trip.notes}</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Timeline */}
        <div className="space-y-6">
          <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-warm-700 border-b border-warm-200 pb-3 mb-5">Timeline</h3>
            
            <div className="space-y-6 ml-2">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4 relative">
                  {/* Line connecting dots */}
                  {index !== timeline.length - 1 && (
                    <div className={`absolute top-5 left-1.5 w-px h-full ${item.done ? 'bg-notion-blue' : 'bg-warm-200'}`}></div>
                  )}
                  {/* Dot */}
                  <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 border-2 ${
                    item.done && !item.isError ? 'bg-notion-blue border-notion-blue' : 
                    item.isError ? 'bg-red-500 border-red-500' :
                    'bg-white border-warm-300'
                  }`}></div>
                  <div>
                    <div className={`text-sm font-medium ${
                      item.done && !item.isError ? 'text-warm-700' : 
                      item.isError ? 'text-red-600' :
                      'text-warm-400'
                    }`}>{item.label}</div>
                    {item.date && (
                       <div className="text-xs text-warm-500 mt-1">
                         {new Date(item.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DispatchDialog 
        open={dialogConfig.open}
        onClose={() => setDialogConfig({ open: false, type: null })}
        onConfirm={confirmAction}
        trip={trip}
        loading={actionLoading}
        title={
          dialogConfig.type === "dispatch" ? "Dispatch Trip" : 
          dialogConfig.type === "start" ? "Start Journey" :
          dialogConfig.type === "complete" ? "Complete Trip" : 
          "Cancel Trip"
        }
        message={
          dialogConfig.type === "dispatch" ? "Dispatch this trip to the assigned driver?" : 
          dialogConfig.type === "start" ? "Mark this trip as in-progress?" :
          dialogConfig.type === "complete" ? "Mark this trip as completed?" : 
          "Cancel this trip? This action cannot be undone."
        }
        confirmLabel={
          dialogConfig.type === "dispatch" ? "Dispatch Now" : 
          dialogConfig.type === "start" ? "Start Now" :
          dialogConfig.type === "complete" ? "Mark Completed" : 
          "Yes, Cancel"
        }
        confirmColor={
          dialogConfig.type === "dispatch" ? "bg-amber-600" : 
          dialogConfig.type === "start" ? "bg-notion-blue" :
          dialogConfig.type === "complete" ? "bg-emerald-600" : 
          "bg-red-600"
        }
      />
    </div>
  );
}
