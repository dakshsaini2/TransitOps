import { useNavigate } from "react-router-dom";
import { useExpenseActions } from "../../hooks/useExpenses";
import ExpenseForm from "../../components/financial/ExpenseForm";
import { ArrowLeft } from "lucide-react";

export default function CreateExpense() {
  const navigate = useNavigate();
  const { createExpense, actionLoading } = useExpenseActions();

  const handleSubmit = async (data) => {
    const res = await createExpense(data);
    if (res.success) {
      navigate("/expenses");
    } else {
      alert(res.message || "Failed to log expense");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/expenses")} className="p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Log Operating Expense</h1>
          <p className="text-warm-500 text-sm mt-1">Record tolls, permits, and other miscellaneous trip costs.</p>
        </div>
      </div>

      <ExpenseForm onSubmit={handleSubmit} loading={actionLoading} />
    </div>
  );
}
