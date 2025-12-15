import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  PlusSquare,
  ShieldAlert,
  Menu,
  X,
  ShieldCheckIcon,
} from "lucide-react";
import Home from "./pages/Home";
import VenueDetails from "./pages/VenueDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import { AuthProvider, useAuth } from "./context/AuthContext";
import VenueComparison from "./pages/VenueComparison";

// Helper Link Component (Desktop)
const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

// Helper Link Component (Mobile)
const MobileNavLink = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
        isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

// --- MAIN CONTENT WRAPPER ---
const MainContent = () => {
  const { user, logout } = useAuth();
  const location = useLocation(); // To detect page changes
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Venues Function
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/venues"); // Fetches all (PGs + Messes)
      const data = await response.json();
      if (data.isSuccess) {
        setVenues(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever user goes to Home "/"
  useEffect(() => {
    if (location.pathname === "/") {
      fetchVenues();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* LOGO */}
            <Link to="/" className="flex items-center group">
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2 group-hover:scale-105 transition-transform">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
                  Habitat-AI
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider leading-none mt-0.5">
                  MSRIT Edition
                </span>
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink
                to="/"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
              />

              {user && (
                <NavLink
                  to="/admin"
                  icon={<PlusSquare size={18} />}
                  label="Post Property"
                />
              )}

              {user && user.role === "admin" && (
                <NavLink
                  to={"/super-admin"}
                  icon={<ShieldCheckIcon />}
                  label={"Verify Venues"}
                />
              )}

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              {user ? (
                <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <User size={14} className="text-blue-700" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 hidden sm:block">
                      {user.email?.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition shadow-lg shadow-gray-200 hover:shadow-gray-300 transform hover:-translate-y-0.5">
                    <LogIn size={16} />
                    <span>Login</span>
                  </button>
                </Link>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 shadow-xl animate-fade-in-down w-full">
            <div className="space-y-2">
              <MobileNavLink
                to="/"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {user && (
                <MobileNavLink
                  to="/admin"
                  icon={<PlusSquare size={20} />}
                  label="Post Property"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}

              <div className="border-t border-gray-100 my-2 pt-2"></div>

              {user ? (
                <>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl mb-2">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-3">
                      <User size={16} className="text-blue-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">
                        Logged in as
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-3 rounded-xl text-base font-bold shadow-lg mt-2">
                    <LogIn size={20} />
                    <span>Login Account</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* CONTENT AREA */}
      <div className="flex-1">
        {loading && location.pathname === "/" ? (
          <div className="flex items-center justify-center h-full min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home venues={venues} />} />
            <Route
              path="/venue/:id"
              element={<VenueDetails venues={venues} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="/compare/:id" element={<VenueComparison />} />{" "}
          </Routes>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
