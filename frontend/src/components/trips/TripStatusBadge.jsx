const STATUS_CONFIG = {
  scheduled: {
    label: "Scheduled",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
  },
  dispatched: {
    label: "Dispatched",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  "in-progress": {
    label: "In Progress",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500 animate-pulse-dot",
    border: "border-emerald-200",
  },
  completed: {
    label: "Completed",
    bg: "bg-warm-100",
    text: "text-warm-500",
    dot: "bg-warm-400",
    border: "border-warm-300",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
};

export default function TripStatusBadge({ status, size = "sm" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.scheduled;

  const sizeClasses =
    size === "lg"
      ? "px-3.5 py-1.5 text-sm"
      : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
