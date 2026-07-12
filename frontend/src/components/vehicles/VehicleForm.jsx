import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VehicleForm({ initialData = {}, onSubmit, loading, isEdit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    number: "",
    model: "",
    year: new Date().getFullYear(),
    type: "Bus",
    capacity: 40,
    fuelType: "Diesel",
    status: "available",
    ...initialData,
  });

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" || name === "year" ? Number(value) : value,
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
          <label className="block text-sm font-medium text-warm-700 mb-1">Registration Number</label>
          <input
            required
            type="text"
            name="number"
            placeholder="e.g. MH-12-AB-1234"
            value={formData.number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all font-mono uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Model / Make</label>
          <input
            required
            type="text"
            name="model"
            placeholder="e.g. Tata Starbus"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Vehicle Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
          >
            <option value="Bus">Bus</option>
            <option value="Mini Bus">Mini Bus</option>
            <option value="Van">Van</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Seating Capacity</label>
          <input
            required
            type="number"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Fuel Type</label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
          >
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Manufacturing Year</label>
          <input
            required
            type="number"
            name="year"
            min="2000"
            max={new Date().getFullYear()}
            value={formData.year}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all bg-white"
            >
              <option value="available">Available</option>
              <option value="in-use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        )}
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-warm-200">
        <button
          type="button"
          onClick={() => navigate("/vehicles")}
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
          {isEdit ? "Save Changes" : "Add Vehicle"}
        </button>
      </div>
    </form>
  );
}
