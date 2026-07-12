import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTrips, useTripActions } from "../../hooks/useTrips";
import TripTable from "../../components/trips/TripTable";
import DispatchDialog from "../../components/trips/DispatchDialog";
import { Plus, Search } from "lucide-react";

const TABS = [
  { id: "all", label: "All Trips" },
  { id: "DRAFT", label: "Draft" },
  { id: "DISPATCHED", label: "Dispatched" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" },
];

export default function Trips() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Use debounce for search in a real app, but direct for mock
  const { trips, loading, refetch } = useTrips({ status: activeTab, search: searchQuery });
  const { actionLoading, dispatchTrip, completeTrip, cancelTrip } = useTripActions();

  // Dialog state
  const [dialogConfig, setDialogConfig] = useState({ open: false, type: null, trip: null });

  const handleAction = (action, trip) => {
    if (action === "view") navigate(`/trips/${trip.id}`);
    else if (action === "edit") navigate(`/trips/${trip.id}/edit`);
    else {
      setDialogConfig({ open: true, type: action, trip });
    }
  };

  const confirmAction = async () => {
    const { type, trip } = dialogConfig;
    let res;
    if (type === "dispatch") res = await dispatchTrip(trip.id);
    else if (type === "complete") res = await completeTrip(trip.id);
    else if (type === "cancel") res = await cancelTrip(trip.id);

    if (res?.success) {
      setDialogConfig({ open: false, type: null, trip: null });
      refetch();
    } else {
      alert(res?.message || "Action failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Trips</h1>
          <p className="text-warm-500 text-sm mt-1">Manage and track all fleet trips.</p>
        </div>
        <Link 
          to="/trips/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" />
          Create Trip
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-warm-300 rounded-xl p-4 shadow-sm">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          <div className="flex gap-1">
            {TABS.map(tab => (
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

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search trips..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-300 focus:border-warm-500 focus:bg-white focus:ring-2 focus:ring-warm-200 rounded-lg text-sm text-warm-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <TripTable trips={trips} loading={loading} onAction={handleAction} />

      {/* Dispatch/Action Dialog */}
      <DispatchDialog 
        open={dialogConfig.open}
        onClose={() => setDialogConfig({ open: false, type: null, trip: null })}
        onConfirm={confirmAction}
        trip={dialogConfig.trip}
        loading={actionLoading}
        title={
          dialogConfig.type === "dispatch" ? "Dispatch Trip" : 
          dialogConfig.type === "complete" ? "Complete Trip" : 
          "Cancel Trip"
        }
        message={
          dialogConfig.type === "dispatch" ? "Are you sure you want to dispatch this trip? This will notify the driver." : 
          dialogConfig.type === "complete" ? "Mark this trip as completed?" : 
          "Are you sure you want to cancel this trip? This action cannot be undone."
        }
        confirmLabel={
          dialogConfig.type === "dispatch" ? "Dispatch Now" : 
          dialogConfig.type === "complete" ? "Mark Completed" : 
          "Yes, Cancel"
        }
        confirmColor={
          dialogConfig.type === "dispatch" ? "bg-amber-600 hover:bg-amber-700" : 
          dialogConfig.type === "complete" ? "bg-emerald-600 hover:bg-emerald-700" : 
          "bg-red-600 hover:bg-red-700"
        }
      />
    </div>
  );
}
