import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "../../hooks/useVehicles";
import { useDrivers } from "../../hooks/useDrivers";

export default function FuelForm({ onSubmit, loading }) {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const { drivers } = useDrivers();
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    date: new Date().toISOString().split("T")[0],
    liters: "",
    cost: "",
    station: "",
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
          <label className="block text-sm font-medium text-warm-700 mb-1">Vehicle</label>
          <select
            required
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
          >
            <option value="" disabled>Select a vehicle</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.number} ({v.model})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Driver</label>
          <select
            required
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
          >
            <option value="" disabled>Select a driver</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
            ))}
          </select>
        </div>

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
          <label className="block text-sm font-medium text-warm-700 mb-1">Fuel Station</label>
          <input
            required
            type="text"
            name="station"
            placeholder="e.g. Indian Oil, Mumbai-Pune Hwy"
            value={formData.station}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Volume (Liters)</label>
          <input
            required
            type="number"
            step="0.01"
            name="liters"
            placeholder="0.00"
            value={formData.liters}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Total Cost (₹)</label>
          <input
            required
            type="number"
            name="cost"
            placeholder="0"
            value={formData.cost}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-warm-200">
        <button
          type="button"
          onClick={() => navigate("/fuel")}
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
          Log Fuel
        </button>
      </div>
    </form>
  );
}
