import { BarChart3, PieChart, Download, FileText } from "lucide-react";
import { useVehicles } from "../../hooks/useVehicles";

export default function Reports() {
  const { vehicles } = useVehicles();

  const total = vehicles.length || 1;
  const available = vehicles.filter(v => v.status === "available").length;
  const inUse = vehicles.filter(v => v.status === "in-use").length;
  const maintenance = vehicles.filter(v => v.status === "maintenance").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Fleet Reports</h1>
          <p className="text-warm-500 text-sm mt-1">Analytics and operational metrics.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-warm-300 hover:bg-warm-50 text-warm-700 text-sm font-medium rounded-lg transition-all shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Utilization Report */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-200 pb-4">
            <PieChart className="w-5 h-5 text-notion-blue" />
            <h2 className="text-lg font-semibold text-warm-700">Fleet Utilization</h2>
          </div>
          
          <div className="flex justify-between items-end h-48 pb-4 px-8 border-b border-warm-100">
            {/* Simple CSS bars */}
            <div className="w-16 bg-blue-100 rounded-t-sm relative flex flex-col justify-end items-center" style={{ height: `${(inUse/total)*100}%`, minHeight: '10%' }}>
               <div className="w-full bg-blue-500 rounded-t-sm absolute bottom-0 left-0" style={{ height: '100%' }}></div>
               <span className="absolute -top-6 text-sm font-bold text-warm-700">{inUse}</span>
            </div>
            <div className="w-16 bg-emerald-100 rounded-t-sm relative flex flex-col justify-end items-center" style={{ height: `${(available/total)*100}%`, minHeight: '10%' }}>
               <div className="w-full bg-emerald-500 rounded-t-sm absolute bottom-0 left-0" style={{ height: '100%' }}></div>
               <span className="absolute -top-6 text-sm font-bold text-warm-700">{available}</span>
            </div>
            <div className="w-16 bg-red-100 rounded-t-sm relative flex flex-col justify-end items-center" style={{ height: `${(maintenance/total)*100}%`, minHeight: '10%' }}>
               <div className="w-full bg-red-500 rounded-t-sm absolute bottom-0 left-0" style={{ height: '100%' }}></div>
               <span className="absolute -top-6 text-sm font-bold text-warm-700">{maintenance}</span>
            </div>
          </div>
          <div className="flex justify-between px-8 pt-4">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1"></div>
              <span className="text-xs font-medium text-warm-600 uppercase">In Use</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto mb-1"></div>
              <span className="text-xs font-medium text-warm-600 uppercase">Available</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1"></div>
              <span className="text-xs font-medium text-warm-600 uppercase">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Maintenance Cost (Placeholder) */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-200 pb-4">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-warm-700">Maintenance Costs</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
               <FileText className="w-8 h-8 text-warm-400" />
            </div>
            <h3 className="text-warm-700 font-medium mb-1">More charts coming soon</h3>
            <p className="text-sm text-warm-500 max-w-xs">Detailed historical breakdown of maintenance costs and fuel efficiency will be available here.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
