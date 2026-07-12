import { ShieldAlert, Download } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Safety Reports</h1>
          <p className="text-warm-500 text-sm mt-1">Review incidents and driver performance metrics.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-warm-300 hover:bg-warm-50 text-warm-700 text-sm font-medium rounded-lg transition-all shadow-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="bg-white border border-warm-300 rounded-xl p-12 shadow-sm text-center">
        <ShieldAlert className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-warm-700 mb-2">Zero Major Incidents</h2>
        <p className="text-warm-500 max-w-md mx-auto">
          The fleet has operated safely with no major incidents in the last 30 days. Full incident analytics will appear here when available.
        </p>
      </div>
    </div>
  );
}
