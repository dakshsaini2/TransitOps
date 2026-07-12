import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Map, 
  Truck, 
  Users, 
  UserCircle, 
  Bell, 
  Search, 
  Menu,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Map, label: "Trips", path: "/trips" },
  { icon: Truck, label: "Vehicles", path: "/vehicles" },
  { icon: Users, label: "Drivers", path: "/drivers" },
];

export default function DispatcherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    
    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-warm-100 flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-warm-300 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-warm-200">
          <div className="flex items-center gap-2 font-semibold text-[1.05rem] tracking-tight text-warm-700 cursor-pointer" onClick={() => navigate("/")}>
            <span className="w-7 h-7 bg-warm-600 rounded text-white flex items-center justify-center text-xs font-bold">T</span>
            TransitOps
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">
            Dispatcher
          </div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? "bg-notion-blue/10 text-notion-blue" 
                  : "text-warm-600 hover:bg-warm-100 hover:text-warm-800"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-warm-200 space-y-1">
           <NavLink
              to="/profile"
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? "bg-notion-blue/10 text-notion-blue" 
                  : "text-warm-600 hover:bg-warm-100 hover:text-warm-800"
                }
              `}
            >
              <UserCircle className="w-5 h-5" />
              Profile
            </NavLink>
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-warm-300 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-warm-500 hover:text-warm-700 hover:bg-warm-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-warm-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-9 pr-4 py-1.5 bg-warm-100 border border-transparent focus:border-warm-300 focus:bg-white rounded-lg text-sm text-warm-600 outline-none transition-all w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <button className="relative p-2 text-warm-500 hover:text-warm-700 hover:bg-warm-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-6 w-px bg-warm-300 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-warm-700 leading-tight">Alex Carter</div>
                <div className="text-xs text-warm-500">Dispatcher</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-notion-blue to-notion-purple flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer" onClick={() => navigate("/profile")}>
                AC
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
