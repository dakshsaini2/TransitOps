import { BarChart3, TrendingUp, TrendingDown, IndianRupee, FileText } from "lucide-react";
import { useFuelLogs } from "../../hooks/useFuel";
import { useExpenses } from "../../hooks/useExpenses";
import { useMaintenanceLogs } from "../../hooks/useMaintenance";

export default function Dashboard() {
  const { logs: fuelLogs, loading: fLoading } = useFuelLogs();
  const { expenses, loading: eLoading } = useExpenses();
  const { logs: maintenanceLogs, loading: mLoading } = useMaintenanceLogs();

  const loading = fLoading || eLoading || mLoading;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-warm-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="h-32 bg-warm-200 rounded-xl"></div>
          <div className="h-32 bg-warm-200 rounded-xl"></div>
          <div className="h-32 bg-warm-200 rounded-xl"></div>
          <div className="h-32 bg-warm-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + (curr.total_cost || 0), 0);
  const totalMaintenanceCost = maintenanceLogs.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalOtherExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = totalFuelCost + totalMaintenanceCost + totalOtherExpenses;

  // Mock revenue for demonstration
  const totalRevenue = 450000;
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Financial Overview</h1>
          <p className="text-warm-500 text-sm mt-1">Track revenue, expenses, and profitability.</p>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm">
          <h3 className="text-warm-500 text-sm font-medium mb-2">Total Revenue</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-warm-800">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" /> +12% vs last month
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm">
          <h3 className="text-warm-500 text-sm font-medium mb-2">Total Expenses</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-warm-800">₹{totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-red-600">
            <TrendingUp className="w-3.5 h-3.5" /> +5% vs last month
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm">
          <h3 className="text-warm-500 text-sm font-medium mb-2">Net Profit</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">₹{netProfit.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" /> +15% vs last month
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm">
          <h3 className="text-warm-500 text-sm font-medium mb-2">Fuel Cost (30d)</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">₹{totalFuelCost.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <TrendingDown className="w-3.5 h-3.5" /> -2% vs last month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-200 pb-4">
            <BarChart3 className="w-5 h-5 text-notion-blue" />
            <h2 className="text-lg font-semibold text-warm-700">Expense Breakdown</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-warm-700">Fuel & Energy</span>
                <span className="text-sm font-bold text-warm-800">₹{totalFuelCost.toLocaleString()}</span>
              </div>
              <div className="w-full bg-warm-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(totalFuelCost / totalExpenses) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-warm-700">Maintenance & Repairs</span>
                <span className="text-sm font-bold text-warm-800">₹{totalMaintenanceCost.toLocaleString()}</span>
              </div>
              <div className="w-full bg-warm-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(totalMaintenanceCost / totalExpenses) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-warm-700">Tolls, Permits & Misc</span>
                <span className="text-sm font-bold text-warm-800">₹{totalOtherExpenses.toLocaleString()}</span>
              </div>
              <div className="w-full bg-warm-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(totalOtherExpenses / totalExpenses) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-warm-200 pb-4">
            <FileText className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-warm-700">Recent Operational Expenses</h2>
          </div>

          <div className="space-y-3">
            {expenses.slice(0, 4).map(e => (
              <div key={e.id} className="flex justify-between items-center p-3 hover:bg-warm-50 rounded-lg border border-transparent hover:border-warm-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-warm-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-800">{e.description}</p>
                    <p className="text-xs text-warm-500">{e.expense_date ? new Date(e.expense_date).toLocaleDateString() : 'N/A'} • {e.expense_type}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-warm-800">
                  ₹{e.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
