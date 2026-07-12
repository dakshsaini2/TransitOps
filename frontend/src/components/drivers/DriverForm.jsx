import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DriverForm({ initialData = {}, onSubmit, loading, isEdit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    license: "",
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
          <label className="block text-sm font-medium text-warm-700 mb-1">Full Name</label>
          <input
            required
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Phone Number</label>
          <input
            required
            type="text"
            name="phone"
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">License Number</label>
          <input
            required
            type="text"
            name="license"
            placeholder="e.g. MH12 20100012345"
            value={formData.license}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all font-mono uppercase"
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
              <option value="on-trip">On Trip</option>
              <option value="off-duty">Off Duty</option>
            </select>
          </div>
        )}
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-warm-200">
        <button
          type="button"
          onClick={() => navigate("/drivers")}
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
          {isEdit ? "Save Changes" : "Add Driver"}
        </button>
      </div>
    </form>
  );
}
