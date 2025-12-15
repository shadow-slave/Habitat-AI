import React, { useState } from "react";
import { Link } from "react-router-dom";
import VenueCard from "../components/VenueCard";
import {
  LayoutGrid,
  Coffee,
  Home as HomeIcon,
  Search,
  MapPin,
  Filter,
  Star,
} from "lucide-react";

const Home = ({ venues }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState(0); // <--- NEW STATE

  const filteredVenues = venues.filter((venue) => {
    const matchesCategory = activeTab === "All" || venue.type === activeTab;
    const matchesSearch = venue.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRating = venue.rating >= minRating; // <--- NEW LOGIC
    return matchesCategory && matchesSearch && matchesRating;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10 top-16">
        <div className="p-6 space-y-8">
          {/* Section 1: Categories */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Type of Stay
            </h2>
            <nav className="space-y-2">
              <SidebarItem
                icon={<LayoutGrid size={18} />}
                label="All Stays"
                isActive={activeTab === "All"}
                onClick={() => setActiveTab("All")}
              />
              <SidebarItem
                icon={<HomeIcon size={18} />}
                label="PG Hostels"
                isActive={activeTab === "PG"}
                onClick={() => setActiveTab("PG")}
              />
              <SidebarItem
                icon={<Coffee size={18} />}
                label="Student Mess"
                isActive={activeTab === "Mess"}
                onClick={() => setActiveTab("Mess")}
              />
            </nav>
          </div>

          {/* Section 2: Rating Filter (NEW) */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Minimum Rating
            </h2>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 0].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all outline-none ${
                    minRating === star
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center">
                    <Star
                      size={16}
                      className={`mr-2 ${
                        star === 0
                          ? "text-gray-400"
                          : "fill-yellow-400 text-yellow-400"
                      }`}
                    />
                    {star === 0 ? "Any Rating" : `${star}+ Stars`}
                  </div>
                  {minRating === star && (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Safety Stats Widget */}
        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-lg shadow-blue-200">
            <p className="text-xs font-medium opacity-80 mb-1">
              Live Safety Index
            </p>
            <h3 className="text-2xl font-bold">94.2%</h3>
            <p className="text-[10px] opacity-80 mt-1">
              Safe Zone (MSRIT Area)
            </p>
          </div>
        </div>
      </aside>

      {/* --- RIGHT MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-800 rounded-3xl p-8 md:p-12 mb-10 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

          <div className="relative z-10 max-w-2xl">
            <span className="bg-blue-500/30 text-blue-100 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Beta v1.0 • MSRIT Edition
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Find a safe home, <br /> not just a room.
            </h1>
            <div className="bg-white p-2 rounded-xl shadow-lg flex items-center max-w-md">
              <MapPin className="text-gray-400 ml-3" size={20} />
              <input
                type="text"
                placeholder="Search by area or PG name..."
                className="flex-1 p-3 outline-none text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* FILTER RESULTS HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            {activeTab === "All"
              ? "Top Recommendations"
              : `${activeTab} Listings`}
            <span className="ml-3 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full border border-gray-200">
              {filteredVenues.length} found
            </span>
            {minRating > 0 && (
              <span className="ml-2 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200 flex items-center">
                <Star size={10} className="fill-yellow-700 mr-1" /> {minRating}+
              </span>
            )}
          </h2>
        </div>

        {/* LISTINGS GRID */}
        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => (
              <Link
                to={`/venue/${venue.id}`}
                key={venue.id}
                className="block group"
              >
                <VenueCard {...venue} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-400">
              No matches found
            </h3>
            <p className="text-gray-400 text-sm">
              Try lowering the rating filter.
            </p>
            <button
              onClick={() => setMinRating(0)}
              className="mt-4 text-blue-600 font-bold text-sm hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

// Sidebar Helper Component (Same as before)
const SidebarItem = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none focus:outline-none ${
      isActive
        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Home;
