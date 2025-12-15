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
} from "lucide-react";
import Home from "./pages/Home";
import VenueDetails from "./pages/VenueDetails";
import Login from "./pages/Login";
// src/App.jsx - REPLACE THE mockData CONSTANT WITH THIS:

const mockData = [
  {
    id: 1,
    name: "Sai Balaji Luxury PG",
    type: "PG",
    gender: "Gents",
    rating: 4.2,
    safetyScore: 4.8,
    distance: "0.5 km",
    price: "₹8,500/mo",
    foodType: "Veg & Non-Veg",
    amenities: ["High-Speed Wifi", "Power Backup", "Washing Machine", "Biometric Entry", "CCTV"],
    contact: "+91 98765 43210",
    image: "https://images.unsplash.com/photo-1522771753035-1a5b6562f3ba?auto=format&fit=crop&w=800",
    aiSummary: "Pros: Very close to Gate 10. Cons: Food is repetitive and spicy.",
  },
  {
    id: 2,
    name: "Annapoorna Mess",
    type: "Mess",
    gender: "Unisex",
    rating: 3.5,
    safetyScore: 2.9,
    distance: "1.2 km",
    price: "₹3,000/mo",
    foodType: "Pure Veg",
    amenities: ["RO Water", "Daily Cleaning", "Breakfast & Dinner"],
    contact: "+91 91234 56789",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800",
    aiSummary: "Pros: Cheap and unlimited rice. Cons: Hygiene issues in kitchen.",
  },
  {
    id: 3,
    name: "Zolo Stays (MSRIT)",
    type: "PG",
    gender: "Ladies",
    rating: 4.7,
    safetyScore: 4.9,
    distance: "0.8 km",
    price: "₹12,000/mo",
    foodType: "North Indian",
    amenities: ["AC Rooms", "Refrigerator", "Lift", "Security Guard", "Gym"],
    contact: "+91 99887 77665",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800",
    aiSummary: "Pros: Extremely safe and clean. Cons: Strict curfew timings.",
  },
];
// Helper component to highlight active links
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

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
        {/* --- PRO NAVBAR (Glassmorphism Effect) --- */}
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* 1. LOGO (Links to Home) */}
              <Link to="/" className="flex items-center group ">
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

              {/* 2. NAVIGATION LINKS */}
              <div className="flex items-center space-x-4">
                {/* Dashboard Button */}
                <NavLink
                  to="/"
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                />

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {/* Auth Section */}
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
            </div>
          </div>
        </nav>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home venues={mockData} />} />
            <Route
              path="/venue/:id"
              element={<VenueDetails venues={mockData} />}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
