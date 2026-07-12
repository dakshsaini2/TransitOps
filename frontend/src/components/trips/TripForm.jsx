import { useState, useEffect } from "react";
import { useVehicles } from "../../hooks/useVehicles";
import { useDrivers } from "../../hooks/useDrivers";

export default function TripForm({
  mode = "create",
  initialData = null,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    scheduledDate: "",
    scheduledTime: "",
    vehicleId: "",
    driverId: "",
    notes: "",
  });

  const { vehicles, loading: loadingVehicles } = useVehicles({ status: "available" });
  const { drivers, loading: loadingDrivers } = useDrivers({ status: "available" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        origin: initialData.origin || "",
        destination: initialData.destination || "",
        scheduledDate: initialData.scheduledDate || "",
        scheduledTime: initialData.scheduledTime || "",
        vehicleId: initialData.vehicle?.id || "",
        driverId: initialData.driver?.id || "",
        notes: initialData.notes || "",
      });
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
    <form onSubmit={handleSubmit} className="bg-white border border-warm-300 rounded-xl shadow-sm p-6 max-w-3xl mx-auto space-y-6">
      <div className="border-b border-warm-200 pb-4">
        <h2 className="text-xl font-semibold text-warm-600 tracking-tight">
          {mode === "create" ? "Create New Trip" : "Edit Trip"}
        </h2>
        <p className="text-sm text-warm-500 mt-1">
          {mode === "create"
            ? "Enter route details and assign a vehicle and driver."
            : "Update route or assignments for this scheduled trip."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Route Details */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-warm-600 uppercase tracking-wider">Route Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1">Origin *</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
                placeholder="E.g., Pune"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1">Destination *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
                placeholder="E.g., Mumbai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1">Scheduled Date *</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1">Scheduled Time *</label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-warm-600 uppercase tracking-wider">Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1">Assign Vehicle</label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
              >
                <option value="">Select a vehicle (Optional)</option>
                {loadingVehicles ? (
                  <option disabled>Loading...</option>
                ) : (
                  vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.number} - {v.type} ({v.capacity} seats)
                    </option>
                  ))
                )}
                {/* Ensure initial selected vehicle is shown even if no longer 'available' */}
                {initialData?.vehicle && !vehicles.find(v => v.id === initialData.vehicle.id) && (
                   <option value={initialData.vehicle.id}>
                     {initialData.vehicle.number} - {initialData.vehicle.type} (Current)
                   </option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1">Assign Driver</label>
              <select
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
              >
                <option value="">Select a driver (Optional)</option>
                {loadingDrivers ? (
                  <option disabled>Loading...</option>
                ) : (
                  drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.rating}★)
                    </option>
                  ))
                )}
                 {/* Ensure initial selected driver is shown even if no longer 'available' */}
                 {initialData?.driver && !drivers.find(d => d.id === initialData.driver.id) && (
                   <option value={initialData.driver.id}>
                     {initialData.driver.name} (Current)
                   </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-warm-600 uppercase tracking-wider">Additional Info</h3>
          <div>
            <label className="block text-sm font-medium text-warm-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all resize-none"
              placeholder="Any special instructions for this trip..."
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-warm-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-warm-500 hover:text-warm-600 bg-white border border-warm-300 hover:border-warm-400 rounded-lg transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-warm-600 hover:bg-warm-800 rounded-lg transition-all duration-150 hover:-translate-y-px hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none flex items-center gap-2"
        >
          {loading && (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {mode === "create" ? "Create Trip" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
