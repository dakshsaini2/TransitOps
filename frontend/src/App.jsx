import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import RoleRouter from "./components/layout/RoleRouter";

// Dispatcher Module
import Trips from "./pages/dispatcher/Trips";
import CreateTrip from "./pages/dispatcher/CreateTrip";
import EditTrip from "./pages/dispatcher/EditTrip";
import TripDetails from "./pages/dispatcher/TripDetails";
import Profile from "./pages/dispatcher/Profile"; // Profile is currently shared

// Fleet Manager Module
import CreateVehicle from "./pages/fleet-manager/CreateVehicle";
import EditVehicle from "./pages/fleet-manager/EditVehicle";
import VehicleDetails from "./pages/fleet-manager/VehicleDetails";
import CreateMaintenance from "./pages/fleet-manager/CreateMaintenance";
import EditMaintenance from "./pages/fleet-manager/EditMaintenance";
import MaintenanceDetails from "./pages/fleet-manager/MaintenanceDetails";

// Safety Officer Module
import CreateDriver from "./pages/safety-officer/CreateDriver";
import EditDriver from "./pages/safety-officer/EditDriver";
import DriverDetails from "./pages/safety-officer/DriverDetails";

// Financial Analyst Module
import FuelLogs from "./pages/financial-analyst/FuelLogs";
import CreateFuel from "./pages/financial-analyst/CreateFuel";
import Expenses from "./pages/financial-analyst/Expenses";
import CreateExpense from "./pages/financial-analyst/CreateExpense";

// Admin Module
import CreateUser from "./pages/admin/CreateUser";
import EditUser from "./pages/admin/EditUser";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected App Routes */}
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<RoleRouter path="dashboard" />} />
            
            {/* Dispatcher Paths */}
            <Route path="trips" element={<Trips />} />
            <Route path="trips/new" element={<CreateTrip />} />
            <Route path="trips/:id" element={<TripDetails />} />
            <Route path="trips/:id/edit" element={<EditTrip />} />
            
            {/* Role-based shared routes */}
            <Route path="vehicles" element={<RoleRouter path="vehicles" />} />
            <Route path="drivers" element={<RoleRouter path="drivers" />} />
            <Route path="maintenance" element={<RoleRouter path="maintenance" />} />
            <Route path="reports" element={<RoleRouter path="reports" />} />
            <Route path="users" element={<RoleRouter path="users" />} />
            <Route path="settings" element={<RoleRouter path="settings" />} />

            {/* Financial Analyst Exclusive Paths */}
            <Route path="fuel" element={<FuelLogs />} />
            <Route path="fuel/new" element={<CreateFuel />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="expenses/new" element={<CreateExpense />} />

            {/* Fleet Manager Specific Paths */}
            <Route path="vehicles/new" element={<CreateVehicle />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
            <Route path="vehicles/:id/edit" element={<EditVehicle />} />
            <Route path="maintenance/new" element={<CreateMaintenance />} />
            <Route path="maintenance/:id" element={<MaintenanceDetails />} />
            <Route path="maintenance/:id/edit" element={<EditMaintenance />} />

            {/* Safety Officer Specific Paths */}
            <Route path="drivers/new" element={<CreateDriver />} />
            <Route path="drivers/:id" element={<DriverDetails />} />
            <Route path="drivers/:id/edit" element={<EditDriver />} />

            {/* Admin Specific Paths */}
            <Route path="users/new" element={<CreateUser />} />
            <Route path="users/:id/edit" element={<EditUser />} />

            {/* Shared Profile */}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
