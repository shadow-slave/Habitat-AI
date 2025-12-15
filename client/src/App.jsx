<<<<<<< HEAD
import React from "react";
import VenueCard from "./components/VenueCard.jsx";

// 1. Mock Data (Simulates Database)
const mockData = [
  {
    id: 1,
    name: "Sai Balaji Luxury PG",
    type: "PG",
    rating: 4.2,
    safetyScore: 4.8,
    distance: "0.5 km",
    image:
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwOnnIdc3KCunwdnbYTmMxvIIHX3upy_RpakBQKZ-Fn_5HzyYwmlZ-ow8OU1uAcuyh99-onF3VrLS5R6RqDtkyC3vdwes5R-hUPnzT0SGvya1cgDWMLJVihjRakJ4KCjsJAPFYk=s1360-w1360-h1020-rw",
    aiSummary:
      "Pros: Very close to Gate 10, clean washrooms. Cons: Food is repetitive and spicy.",
  },
  {
    id: 2,
    name: "Annapoorna Mess",
    type: "Mess",
    rating: 3.5,
    safetyScore: 2.9,
    distance: "1.2 km",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    aiSummary:
      "Pros: Affordable rates. Cons: Hygiene concern reported in kitchen area last week.",
  },
  {
    id: 3,
    name: "Comfort Zolo Stay",
    type: "PG",
    rating: 4.5,
    safetyScore: 4.2,
    distance: "0.8 km",
    image:
      "https://images.unsplash.com/photo-1596276020587-8044fe049813?auto=format&fit=crop&w=800&q=80",
    aiSummary:
      "Pros: Generator backup available, CCTV on all floors. Cons: Strict curfew timings.",
  },
];

// 2. The Dashboard Layout
function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
                Habitat-AI
              </span>
              <span className="ml-3 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                MSRIT Edition
              </span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Login (Student)
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Discover Safe Stays 🛡️
          </h1>
          <p className="mt-2 text-gray-600">
            AI-audited reviews for PGs and Messes in Mathikere.
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockData.map((venue) => (
            <VenueCard key={venue.id} {...venue} />
          ))}
        </div>
      </main>
    </div>
=======
import React, { useState } from "react";
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
} from "lucide-react";
import Home from "./pages/Home";
import VenueDetails from "./pages/VenueDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";

// --- HELPER FOR DISTANCE ---
const MSRIT_LAT = 13.0306;
const MSRIT_LNG = 77.5649;

function calculateDistance(lat, lng) {
  const R = 6371;
  const dLat = (lat - MSRIT_LAT) * (Math.PI / 180);
  const dLon = (lng - MSRIT_LNG) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(MSRIT_LAT * (Math.PI / 180)) *
      Math.cos(lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

// --- MOCK DATA ---
const rawVenues = [
  {
    _id: "1",
    name: "Sai Balaji Luxury PG",
    ownerName: "Mr. Ramesh",
    type: "PG",
    contactNo: "9876543210",
    rating: 4.2,
    aiSummary: "Pros: Close to college. Cons: Spicy food.",
    address: {
      street: "4th Cross, Mathikere Extension",
      pincode: "560054",
      latitude: 13.0324,
      longitude: 77.5651,
    },
    images: [
      "https://images.unsplash.com/photo-1522771753035-1a5b6562f3ba?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=800",
    ],
    cost: { min: 8500, max: 12000, per: "Month" },
    availableFoods: ["North Indian", "South Indian"],
    availableRoomTypes: ["2BHK", "Single Room"],
    sharingTypes: ["Double", "Triple"],
    description:
      "Located right behind Gate 10. Newly constructed building with biometric entry and CCTV surveillance on all floors.",
  },
  {
    _id: "2",
    name: "Annapoorna Mess",
    ownerName: "Mrs. Lakshmi",
    type: "Mess",
    contactNo: "9123456780",
    rating: 3.5,
    aiSummary: "Pros: Cheap. Cons: Hygiene issues.",
    address: {
      street: "Main Market Road, Mathikere",
      pincode: "560054",
      latitude: 13.035,
      longitude: 77.56,
    },
    images: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800",
    ],
    cost: { min: 3000, max: 3500, per: "Month" },
    availableFoods: ["Andhra Style", "Pure Veg"],
    availableRoomTypes: [],
    sharingTypes: [],
    description:
      "Budget-friendly mess for students. Open for lunch and dinner only. Token system available.",
  },
];

const mockData = rawVenues.map((venue) => ({
  ...venue,
  distanceFromMSRIT: calculateDistance(
    venue.address.latitude,
    venue.address.longitude
  ),
}));

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

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <Router>
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

              {/* DESKTOP MENU (Hidden on Mobile) */}
              <div className="hidden md:flex items-center space-x-4">
                <NavLink
                  to="/"
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                />
                <NavLink
                  to="/admin"
                  icon={<PlusSquare size={18} />}
                  label="Post Property"
                />

                {/* Super Admin Link */}
                {user && user.email === "admin@habitat.ai" && (
                  <div className="ml-2">
                    <Link
                      to="/super-admin"
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
                    >
                      <ShieldAlert size={18} />
                      <span>Approvals</span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    </Link>
                  </div>
                )}

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {user ? (
                  <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <User size={14} className="text-blue-700" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 hidden sm:block">
                        {user.email.split("@")[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
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

              {/* MOBILE MENU BUTTON (Visible only on Mobile) */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  // FIXED: Changed 'p-6' to 'p-2' to fix alignment
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* --- MOBILE DROPDOWN MENU --- */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 shadow-xl animate-fade-in-down w-full">
              <div className="space-y-2">
                <MobileNavLink
                  to="/"
                  icon={<LayoutDashboard size={20} />}
                  label="Dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileNavLink
                  to="/admin"
                  icon={<PlusSquare size={20} />}
                  label="Post Property"
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Mobile Super Admin */}
                {user && user.email === "admin@habitat.ai" && (
                  <MobileNavLink
                    to="/super-admin"
                    icon={<ShieldAlert size={20} className="text-red-500" />}
                    label="Admin Approvals"
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
                      onClick={handleLogout}
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

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home venues={mockData} />} />
            <Route
              path="/venue/:id"
              element={<VenueDetails venues={mockData} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
          </Routes>
        </div>
      </div>
    </Router>
>>>>>>> origin/frontend
  );
}

export default App;
