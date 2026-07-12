import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "../../hooks/useVehicles";

export default function MaintenanceForm({ initialData = {}, onSubmit, loading, isEdit }) {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    type: "Repair",
    description: "",
    mechanic: "",
    date: new Date().toISOString().split("T")[0],
    cost: 0,
    status: "pending",
    ...initialData,
  });

  useEffect(() => {
    // If navigating from VehicleDetails with ?vehicleId=X
    const params = new URLSearchParams(window.location.search);
    const vehicleId = params.get("vehicleId");
    
    if (Object.keys(initialData).length > 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setFormData({ ...formData, ...initialData });
    } else if (vehicleId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, vehicleId }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" ? Number(value) : value,
    }));
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
          <label className="block text-sm font-medium text-warm-700 mb-1">Maintenance Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
          >
            <option value="Repair">Repair (Unplanned)</option>
            <option value="Scheduled">Scheduled (Routine)</option>
            <option value="Inspection">Inspection</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-warm-700 mb-1">Description</label>
          <textarea
            required
            name="description"
            rows="3"
            placeholder="Describe the issue or service performed..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Mechanic / Workshop</label>
          <input
            required
            type="text"
            name="mechanic"
            placeholder="e.g. Internal Workshop or Vendor Name"
            value={formData.mechanic}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
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
          <label className="block text-sm font-medium text-warm-700 mb-1">Cost (₹)</label>
          <input
            required
            type="number"
            name="cost"
            min="0"
            value={formData.cost}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
          >
            <option value="pending">Pending / Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-warm-200">
        <button
          type="button"
          onClick={() => navigate("/maintenance")}
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
          {isEdit ? "Save Changes" : "Log Maintenance"}
        </button>
      </div>
    </form>
  );
}
