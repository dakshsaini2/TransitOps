import { Users, Server, Shield, Activity, Settings } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { users, loading } = useUsers();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-warm-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="h-32 bg-warm-200 rounded-xl"></div>
          <div className="h-32 bg-warm-200 rounded-xl"></div>
          <div className="h-32 bg-warm-200 rounded-xl"></div>
          <div className="h-32 bg-warm-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter(u => u.is_active).length;
  const adminCount = users.filter(u => u.role === "ADMIN").length;
  const dispatchCount = users.filter(u => u.role === "DISPATCHER").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">System Administration</h1>
          <p className="text-warm-500 text-sm mt-1">Manage global settings, user roles, and platform health.</p>
        </div>
        <Link 
          to="/settings"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-warm-300 hover:bg-warm-50 text-warm-700 text-sm font-medium rounded-lg transition-all shadow-sm"
        >
          <Settings className="w-4 h-4" /> Global Settings
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-warm-500 text-sm font-medium">Total Registered Users</h3>
            <Users className="w-5 h-5 text-notion-blue" />
          </div>
          <span className="text-2xl font-bold text-warm-800">{users.length}</span>
          <div className="text-xs text-warm-500 mt-2">{activeUsers} active accounts</div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-warm-500 text-sm font-medium">Administrators</h3>
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-warm-800">{adminCount}</span>
          <div className="text-xs text-warm-500 mt-2">Full platform access</div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-warm-500 text-sm font-medium">Active Dispatchers</h3>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-warm-800">{dispatchCount}</span>
          <div className="text-xs text-warm-500 mt-2">Managing current trips</div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-5 shadow-sm bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-400 text-sm font-medium">System Status</h3>
            <Server className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-white">Online</span>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            All systems operational
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-warm-700 mb-6 border-b border-warm-200 pb-4">Role Distribution</h2>
          <div className="space-y-4">
            {["ADMIN", "DISPATCHER", "FLEET_MANAGER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"].map(role => {
               const count = users.filter(u => u.role === role).length;
               const percentage = users.length > 0 ? ((count / users.length) * 100).toFixed(0) : 0;
               const displayRole = role.replace('_', ' ');
               return (
                 <div key={role}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-medium text-warm-700 capitalize">{displayRole.toLowerCase()}</span>
                      <span className="text-sm font-medium text-warm-500">{count} users</span>
                    </div>
                    <div className="w-full bg-warm-100 rounded-full h-2">
                      <div className="bg-notion-blue h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                 </div>
               )
            })}
          </div>
        </div>

        <div className="bg-white border border-warm-300 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-warm-700 mb-6 border-b border-warm-200 pb-4">Recent Audit Logs</h2>
          <div className="space-y-4">
             <p className="text-sm text-warm-500 text-center py-8 border border-dashed border-warm-200 rounded-lg">
                Audit logging service is currently starting up...
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
