import { useNavigate } from "react-router-dom";
import { useUserActions } from "../../hooks/useUsers";
import UserForm from "../../components/admin/UserForm";
import { ArrowLeft } from "lucide-react";

export default function CreateUser() {
  const navigate = useNavigate();
  const { createUser, actionLoading } = useUserActions();

  const handleSubmit = async (data) => {
    const res = await createUser(data);
    if (res.success) {
      navigate("/users");
    } else {
      alert(res.message || "Failed to create user account");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/users")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Onboard New Employee</h1>
          <p className="text-warm-500 text-sm mt-1">Create a new system user and assign their access level.</p>
        </div>
      </div>

      <UserForm onSubmit={handleSubmit} loading={actionLoading} />
    </div>
  );
}
