import { useState } from "react";
import { Link } from "react-router-dom";
import { useExpenses, useExpenseActions } from "../../hooks/useExpenses";
import { Search, Plus, Trash2 } from "lucide-react";

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { expenses, loading } = useExpenses({ search: searchQuery, category: categoryFilter });
  const { deleteExpense, actionLoading } = useExpenseActions();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      await deleteExpense(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Operating Expenses</h1>
          <p className="text-warm-500 text-sm mt-1">Track tolls, permits, lodging, and other miscellaneous costs.</p>
        </div>
        <Link 
          to="/expenses/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-warm-300 rounded-xl p-4 shadow-sm">
        <div className="flex gap-2">
           <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-warm-50 border border-warm-300 rounded-lg text-sm text-warm-700 outline-none"
           >
             <option value="all">All Categories</option>
             <option value="TOLLS">Tolls</option>
             <option value="PERMITS">Permits</option>
             <option value="LODGING">Lodging</option>
             <option value="MAINTENANCE">Maintenance</option>
             <option value="OTHER">Other</option>
           </select>
        </div>

        <div className="relative flex-1 md:max-w-md w-full">
          <Search className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search description or Trip ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-300 focus:border-warm-500 focus:bg-white focus:ring-2 focus:ring-warm-200 rounded-lg text-sm text-warm-600 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-warm-300 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-warm-50 border-b border-warm-200 text-warm-500 font-medium">
              <tr>
                <th className="px-6 py-4">ID & Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Vehicle ID</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-warm-100 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-500">
                    <div className="text-4xl mb-3">🧾</div>
                    <p>No expenses found.</p>
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-warm-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-warm-700 font-medium">{e.id}</div>
                      <div className="text-xs text-warm-500">{e.expense_date ? new Date(e.expense_date).toLocaleDateString() : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-warm-800 font-medium">{e.description}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 bg-warm-100 text-warm-700 text-xs rounded-full font-medium">{e.expense_type}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-warm-500">{e.vehicle_id || "-"}</td>
                    <td className="px-6 py-4 text-right font-bold text-warm-800">
                      ₹{e.amount ? e.amount.toLocaleString() : '0'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(e.id)}
                        disabled={actionLoading}
                        className="p-1.5 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
