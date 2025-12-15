// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link
import VenueCard from "../components/VenueCard";

const Home = ({ venues }) => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Discover Safe Stays 🛡️
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          // WRAP THE CARD IN A LINK
          <Link to={`/venue/${venue.id}`} key={venue.id}>
            <VenueCard {...venue} />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Home;
