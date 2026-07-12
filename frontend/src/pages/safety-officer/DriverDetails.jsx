import { useParams, useNavigate, Link } from "react-router-dom";
import { useDriver, useDriverActions } from "../../hooks/useDrivers";
import { ArrowLeft, Edit2, AlertTriangle, UserCheck, Star, Trash2, Phone, FileText } from "lucide-react";

export default function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { driver, loading, error } = useDriver(id);
  const { deleteDriver, actionLoading } = useDriverActions();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-warm-200 rounded w-1/3"></div>
        <div className="h-64 bg-warm-200 rounded-xl"></div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="max-w-5xl mx-auto bg-white border border-red-300 rounded-xl p-8 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-700">Driver Not Found</h3>
        <p className="text-sm text-red-600 mt-1">{error || "The driver profile does not exist."}</p>
        <button onClick={() => navigate("/drivers")} className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">
          Back to Drivers
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this driver profile?")) {
      const res = await deleteDriver(driver.id);
      if (res.success) navigate("/drivers");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'available': return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-medium flex items-center gap-1.5"><UserCheck className="w-4 h-4"/> Available</span>;
      case 'on-trip': return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium flex items-center gap-1.5">On Trip</span>;
      case 'off-duty': return <span className="px-3 py-1 bg-warm-100 text-warm-700 border border-warm-300 rounded-full text-sm font-medium flex items-center gap-1.5">Off Duty</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/drivers")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">{driver.name}</h1>
          <p className="text-warm-500 text-sm mt-1 font-mono">{driver.id}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {getStatusBadge(driver.status)}
          <div className="h-8 w-px bg-warm-200 mx-2"></div>
          <Link to={`/drivers/${driver.id}/edit`} className="px-4 py-2 bg-white border border-warm-300 text-warm-600 hover:bg-warm-50 text-sm font-medium rounded-lg flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </Link>
          <button 
            onClick={handleDelete}
            disabled={actionLoading}
            className="p-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm lg:col-span-1 h-fit">
          <div className="flex flex-col items-center justify-center border-b border-warm-100 pb-6 mb-6">
            <div className="w-24 h-24 bg-warm-100 rounded-full flex items-center justify-center text-warm-400 mb-4">
               <UserCheck className="w-10 h-10" />
            </div>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
               <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {driver.rating} Rating
            </div>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500 flex items-center gap-2"><Phone className="w-4 h-4"/> Phone</span>
              <span className="font-medium text-warm-800">{driver.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500 flex items-center gap-2"><FileText className="w-4 h-4"/> License</span>
              <span className="font-medium text-warm-800 font-mono uppercase">{driver.license}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-warm-700 flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-notion-blue" /> Training & Compliance
          </h2>
          <div className="text-center py-12 text-warm-500 border border-dashed border-warm-200 rounded-lg">
             <p>No recent compliance documents uploaded.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
