import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

// Dashboards
import DispatcherDashboard from "../../pages/dispatcher/Dashboard";
import FleetManagerDashboard from "../../pages/fleet-manager/Dashboard";
import SafetyDashboard from "../../pages/safety-officer/Dashboard";
import FinancialDashboard from "../../pages/financial-analyst/Dashboard";
import AdminDashboard from "../../pages/admin/Dashboard";

// Vehicles
import DispatcherVehicles from "../../pages/dispatcher/Vehicles";
import FleetVehicles from "../../pages/fleet-manager/Vehicles";

// Drivers
import DispatcherDrivers from "../../pages/dispatcher/Drivers";
import SafetyDrivers from "../../pages/safety-officer/Drivers";

// Maintenance
import MaintenanceList from "../../pages/fleet-manager/Maintenance";

// Reports
import FleetReports from "../../pages/fleet-manager/Reports";
import SafetyReports from "../../pages/safety-officer/Reports";
import FinancialReports from "../../pages/financial-analyst/Reports";

// Admin Only
import AdminUsers from "../../pages/admin/Users";
import AdminSettings from "../../pages/admin/Settings";

export default function RoleRouter({ path }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;

  const { role } = user;

  if (path === "dashboard") {
    if (role === "Admin") return <AdminDashboard />;
    if (role === "Dispatcher") return <DispatcherDashboard />;
    if (role === "Fleet Manager") return <FleetManagerDashboard />;
    if (role === "Safety Officer") return <SafetyDashboard />;
    if (role === "Financial Analyst") return <FinancialDashboard />;
    return <div className="p-8 text-center text-warm-500">Dashboard for {role} is under construction.</div>;
  }

  if (path === "vehicles") {
    if (role === "Dispatcher") return <DispatcherVehicles />;
    if (role === "Fleet Manager") return <FleetVehicles />;
    return <Navigate to="/dashboard" />;
  }

  if (path === "drivers") {
    if (role === "Dispatcher") return <DispatcherDrivers />;
    if (role === "Safety Officer") return <SafetyDrivers />;
    return <Navigate to="/dashboard" />;
  }

  if (path === "maintenance") {
    if (role === "Fleet Manager") return <MaintenanceList />;
    return <Navigate to="/dashboard" />;
  }

  if (path === "reports") {
    if (role === "Fleet Manager") return <FleetReports />;
    if (role === "Safety Officer") return <SafetyReports />;
    if (role === "Financial Analyst") return <FinancialReports />;
    return <div className="p-8 text-center text-warm-500">Reports for {role} are under construction.</div>;
  }

  if (path === "users") {
    if (role === "Admin") return <AdminUsers />;
    return <Navigate to="/dashboard" />;
  }

  if (path === "settings") {
    if (role === "Admin") return <AdminSettings />;
    return <Navigate to="/dashboard" />;
  }

  return <div>Not Found for Role {role}</div>;
}
