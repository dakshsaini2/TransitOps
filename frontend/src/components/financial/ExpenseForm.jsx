import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrips } from "../../hooks/useTrips";

export default function ExpenseForm({ onSubmit, loading }) {
  const navigate = useNavigate();
  const { trips } = useTrips();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Tolls",
    description: "",
    amount: "",
    tripId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-warm-300 rounded-xl shadow-sm p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Date</label>
          <input
            required
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
          >
            <option value="Tolls">Tolls</option>
            <option value="Permits">Permits</option>
            <option value="Food & Lodging">Food & Lodging</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-warm-700 mb-1">Description</label>
          <input
            required
            type="text"
            name="description"
            placeholder="e.g. Expressway Toll at Pune Hub"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Amount (₹)</label>
          <input
            required
            type="number"
            name="amount"
            placeholder="0"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Associated Trip (Optional)</label>
          <select
            name="tripId"
            value={formData.tripId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
          >
            <option value="">None</option>
            {trips.map(t => (
              <option key={t.id} value={t.id}>{t.id} - {t.origin} to {t.destination}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-warm-200">
        <button
          type="button"
          onClick={() => navigate("/expenses")}
          className="px-4 py-2 text-sm font-medium text-warm-600 hover:text-warm-800 bg-white border border-warm-300 rounded-lg hover:bg-warm-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm font-medium text-white bg-warm-600 hover:bg-warm-800 rounded-lg transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Log Expense
        </button>
      </div>
    </form>
  );
}
