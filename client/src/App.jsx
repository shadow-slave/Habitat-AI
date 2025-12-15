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
      "https://images.unsplash.com/photo-1522771753035-1a5b6562f3ba?auto=format&fit=crop&w=800&q=80",
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
  );
}

export default App;
