import { Download, PieChart, TrendingUp, IndianRupee } from "lucide-react";
import { useExpenses } from "../../hooks/useExpenses";
import { useFuelLogs } from "../../hooks/useFuel";
import { useMaintenanceLogs } from "../../hooks/useMaintenance";

export default function Reports() {
  const { logs: fuelLogs } = useFuelLogs();
  const { expenses } = useExpenses();
  const { logs: maintenanceLogs } = useMaintenanceLogs();

  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + curr.cost, 0);
  const totalMaintenanceCost = maintenanceLogs.reduce((acc, curr) => acc + curr.cost, 0);
  const totalOtherExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalExpenses = totalFuelCost + totalMaintenanceCost + totalOtherExpenses || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Financial Reports</h1>
          <p className="text-warm-500 text-sm mt-1">Deep dive into company expenditures and profit margins.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-warm-300 hover:bg-warm-50 text-warm-700 text-sm font-medium rounded-lg transition-all shadow-sm">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Expense Distribution */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-200 pb-4">
            <PieChart className="w-5 h-5 text-notion-blue" />
            <h2 className="text-lg font-semibold text-warm-700">Expense Distribution</h2>
          </div>
          
          <div className="flex justify-between items-end h-48 pb-4 px-8 border-b border-warm-100">
            {/* Simple CSS bars */}
            <div className="w-20 bg-amber-100 rounded-t-sm relative flex flex-col justify-end items-center" style={{ height: `${(totalFuelCost/totalExpenses)*100}%`, minHeight: '10%' }}>
               <div className="w-full bg-amber-500 rounded-t-sm absolute bottom-0 left-0" style={{ height: '100%' }}></div>
            </div>
            <div className="w-20 bg-red-100 rounded-t-sm relative flex flex-col justify-end items-center" style={{ height: `${(totalMaintenanceCost/totalExpenses)*100}%`, minHeight: '10%' }}>
               <div className="w-full bg-red-500 rounded-t-sm absolute bottom-0 left-0" style={{ height: '100%' }}></div>
            </div>
            <div className="w-20 bg-blue-100 rounded-t-sm relative flex flex-col justify-end items-center" style={{ height: `${(totalOtherExpenses/totalExpenses)*100}%`, minHeight: '10%' }}>
               <div className="w-full bg-blue-500 rounded-t-sm absolute bottom-0 left-0" style={{ height: '100%' }}></div>
            </div>
          </div>
          <div className="flex justify-between px-8 pt-4">
            <div className="text-center">
              <span className="text-xs font-bold text-amber-600 block">{((totalFuelCost/totalExpenses)*100).toFixed(0)}%</span>
              <span className="text-xs font-medium text-warm-600 uppercase">Fuel</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-red-600 block">{((totalMaintenanceCost/totalExpenses)*100).toFixed(0)}%</span>
              <span className="text-xs font-medium text-warm-600 uppercase">Repairs</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-blue-600 block">{((totalOtherExpenses/totalExpenses)*100).toFixed(0)}%</span>
              <span className="text-xs font-medium text-warm-600 uppercase">Other</span>
            </div>
          </div>
        </div>

        {/* Profitability Trend (Placeholder) */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-200 pb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-warm-700">Profitability Trend</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
               <IndianRupee className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-warm-700 font-medium mb-1">Q3 Data Pending</h3>
            <p className="text-sm text-warm-500 max-w-xs">Historical profitability charts and P&L statements will be available once Q3 reconciliation is complete.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
