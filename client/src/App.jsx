import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VenueDetails from "./pages/VenueDetails";

// Keep your mockData here for now so it's accessible everywhere
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
    aiSummary: "Pros: Close to college. Cons: Spicy food.",
  },
  {
    id: 2,
    name: "Annapoorna Mess",
    type: "Mess",
    rating: 3.5,
    safetyScore: 2.9,
    distance: "1.2 km",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800",
    aiSummary: "Pros: Cheap. Cons: Hygiene issues.",
  },
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 px-6 py-4">
          <span className="text-2xl font-extrabold text-blue-600">
            Habitat-AI
          </span>
        </nav>

        <Routes>
          <Route path="/" element={<Home venues={mockData} />} />
          {/* This logic passes the specific venue data to the details page */}
          <Route
            path="/venue/:id"
            element={<VenueDetails venues={mockData} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
