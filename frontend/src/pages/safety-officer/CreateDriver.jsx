import { useNavigate } from "react-router-dom";
import { useDriverActions } from "../../hooks/useDrivers";
import DriverForm from "../../components/drivers/DriverForm";
import { ArrowLeft } from "lucide-react";

export default function CreateDriver() {
  const navigate = useNavigate();
  const { createDriver, actionLoading } = useDriverActions();

  const handleSubmit = async (data) => {
    const res = await createDriver(data);
    if (res.success) {
      navigate("/drivers");
    } else {
      alert(res.message || "Failed to create driver profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/drivers")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Onboard New Driver</h1>
          <p className="text-warm-500 text-sm mt-1">Add a new driver to the platform roster.</p>
        </div>
      </div>

      <DriverForm onSubmit={handleSubmit} loading={actionLoading} />
    </div>
  );
}
