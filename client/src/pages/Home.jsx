import React, { useState } from "react";
import { Link } from "react-router-dom";
import VenueCard from "../components/VenueCard";
import {
  LayoutGrid,
  Coffee,
  Home as HomeIcon,
  MapPin,
  Filter,
  Star,
} from "lucide-react";

const Home = ({ venues }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState(0);

  const filteredVenues = venues.filter((venue) => {
    // 1. Filter by Category
    const matchesCategory = activeTab === "All" || venue.type === activeTab;

    // 2. Filter by Search
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      venue.name.toLowerCase().includes(searchLower) ||
      (venue.address &&
        venue.address.street.toLowerCase().includes(searchLower));

    // 3. Filter by Rating
    const matchesRating = venue.rating >= minRating;

    return matchesCategory && matchesSearch && matchesRating;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- LEFT SIDEBAR (Desktop Only) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10 top-16">
        <div className="p-6 space-y-8">
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
      </aside>

      {/* --- RIGHT MAIN CONTENT --- */}
      {/* Added overflow-x-hidden to prevent horizontal scroll */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 w-full overflow-x-hidden">
        {/* --- MOBILE CATEGORY FILTER (New: Only shows on Mobile) --- */}
        <div className="md:hidden flex space-x-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
          {["All", "PG", "Mess"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border ${
                activeTab === type
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {type === "All" ? "All Stays" : type}
            </button>
          ))}
        </div>

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-800 rounded-3xl p-6 md:p-12 mb-10 text-white relative overflow-hidden shadow-xl">
          {/* Decor Circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-2xl">
            <span className="bg-blue-500/30 text-blue-100 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Beta v1.0 • MSRIT Edition
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Find a safe home, <br /> not just a room.
            </h1>

            {/* RESPONSIVE SEARCH BAR */}
            <div className="bg-white p-2 rounded-xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center w-full max-w-md gap-2 sm:gap-0">
              <div className="flex items-center flex-1 px-2">
                <MapPin className="text-gray-400 min-w-[20px]" size={20} />
                <input
                  type="text"
                  placeholder="Search area..."
                  className="flex-1 p-2 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition w-full sm:w-auto">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex flex-wrap items-center">
            {activeTab === "All"
              ? "Top Recommendations"
              : `${activeTab} Listings`}
            <span className="ml-2 sm:ml-3 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full border border-gray-200">
              {filteredVenues.length} found
            </span>
            {minRating > 0 && (
              <span className="ml-2 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200 flex items-center">
                <Star size={10} className="fill-yellow-700 mr-1" /> {minRating}+
              </span>
            )}
          </h2>

          {/* Clear Filter Button (Visible if filters active) */}
          {(minRating > 0 || searchQuery) && (
            <button
              onClick={() => {
                setMinRating(0);
                setSearchQuery("");
              }}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* LISTINGS GRID */}
        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-20">
            {filteredVenues.map((venue) => (
              <Link
                to={`/venue/${venue._id}`}
                key={venue._id}
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
            <p className="text-gray-400 text-sm">Try adjusting your filters.</p>
            <button
              onClick={() => {
                setMinRating(0);
                setSearchQuery("");
              }}
              className="mt-4 text-blue-600 font-bold text-sm hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

// Sidebar Helper (Unchanged)
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
