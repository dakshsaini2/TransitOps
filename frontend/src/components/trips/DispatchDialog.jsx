import { X, AlertTriangle } from "lucide-react";

export default function DispatchDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  trip,
  confirmLabel = "Confirm",
  confirmColor = "bg-warm-600 hover:bg-warm-800",
  loading = false,
}) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl border border-warm-300 shadow-[0_24px_64px_rgba(0,0,0,0.12)] w-full max-w-[440px] animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-warm-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <h3 className="text-base font-semibold text-warm-600 tracking-tight">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-warm-400 hover:text-warm-600 hover:bg-warm-100 transition-all duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-sm text-warm-500 leading-relaxed mb-4">
              {message}
            </p>

            {trip && (
              <div className="bg-warm-50 border border-warm-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-400">Trip ID</span>
                  <span className="font-medium text-warm-600 font-mono text-xs">
                    {trip.id}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-400">Route</span>
                  <span className="text-warm-600">
                    {trip.origin} → {trip.destination}
                  </span>
                </div>
                {trip.vehicle && (
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-400">Vehicle</span>
                    <span className="text-warm-600 font-mono text-xs">
                      {trip.vehicle.number}
                    </span>
                  </div>
                )}
                {trip.driver && (
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-400">Driver</span>
                    <span className="text-warm-600">{trip.driver.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-warm-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-warm-500 hover:text-warm-600 bg-white border border-warm-300 hover:border-warm-400 rounded-lg transition-all duration-150 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white ${confirmColor} rounded-lg transition-all duration-150 hover:-translate-y-px hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none flex items-center gap-2`}
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
