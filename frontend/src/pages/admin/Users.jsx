import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUsers, useUserActions } from "../../hooks/useUsers";
import { Search, Plus, Edit2, Trash2, UserCog } from "lucide-react";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const navigate = useNavigate();
  
  const { users, loading } = useUsers({ search: searchQuery, role: roleFilter });
  const { deleteUser, actionLoading } = useUserActions();

  const getStatusBadge = (isActive) => {
    if (isActive) return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium">Active</span>;
    return <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium">Suspended</span>;
  };

  const getRoleBadge = (role) => {
    let colorClass = "bg-warm-100 text-warm-700";
    if (role === "ADMIN") colorClass = "bg-amber-100 text-amber-800 font-bold";
    if (role === "DISPATCHER") colorClass = "bg-blue-50 text-blue-700";
    if (role === "FLEET_MANAGER") colorClass = "bg-purple-50 text-purple-700";
    if (role === "SAFETY_OFFICER") colorClass = "bg-emerald-50 text-emerald-700";
    if (role === "FINANCIAL_ANALYST") colorClass = "bg-teal-50 text-teal-700";
    
    const displayRole = role ? role.replace('_', ' ') : 'Unknown';
    return <span className={`px-2 py-1 text-xs rounded border border-black/5 ${colorClass}`}>{displayRole}</span>;
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user ${name}? This cannot be undone.`)) {
      await deleteUser(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">User Management</h1>
          <p className="text-warm-500 text-sm mt-1">Add, edit, and control system access for all staff.</p>
        </div>
        <Link 
          to="/users/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" /> Add User
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-warm-300 rounded-xl p-4 shadow-sm">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
           <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-warm-50 border border-warm-300 rounded-lg text-sm text-warm-700 outline-none min-w-[150px]"
           >
             <option value="all">All Roles</option>
             <option value="ADMIN">Admin</option>
             <option value="DISPATCHER">Dispatcher</option>
             <option value="FLEET_MANAGER">Fleet Manager</option>
             <option value="SAFETY_OFFICER">Safety Officer</option>
             <option value="FINANCIAL_ANALYST">Financial Analyst</option>
           </select>
        </div>

        <div className="relative flex-1 md:max-w-md w-full">
          <Search className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search name, email, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-warm-50 border border-warm-300 focus:border-warm-500 focus:bg-white focus:ring-2 focus:ring-warm-200 rounded-lg text-sm text-warm-600 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-warm-300 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-warm-50 border-b border-warm-200 text-warm-500 font-medium">
              <tr>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-warm-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-warm-100 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-warm-100 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-warm-500">
                    <div className="text-4xl mb-3 flex justify-center"><UserCog className="w-12 h-12 text-warm-300" /></div>
                    <p>No users found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-warm-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-warm-700">{u.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-warm-800">{u.full_name}</div>
                      <div className="text-xs text-warm-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                       {getRoleBadge(u.role)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(u.is_active)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/users/${u.id}/edit`)}
                          className="p-1.5 text-warm-400 hover:text-notion-blue hover:bg-blue-50 rounded transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id, u.full_name)}
                          disabled={actionLoading}
                          className="p-1.5 text-warm-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
