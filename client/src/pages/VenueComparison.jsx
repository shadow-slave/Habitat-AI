import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Loader,
  MapPin,
  IndianRupee,
  Star,
  Utensils,
  Layers,
  X,
  Info,
  Calendar,
  User,
} from "lucide-react";

// Helper Component for Data Rows
const DataRow = ({ icon, label, values, rowType = "normal" }) => (
  <tr
    className={`border-t border-gray-100 ${
      rowType === "header" ? "bg-gray-50 font-bold" : "hover:bg-gray-50"
    }`}
  >
    <th className="sticky left-0 bg-white/90 backdrop-blur-sm px-4 py-3 text-left text-sm font-medium text-gray-700 min-w-[150px] flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </th>
    {values.map((value, index) => (
      <td
        key={index}
        className={`px-4 py-3 text-sm whitespace-nowrap ${
          rowType === "header" ? "text-gray-900" : "text-gray-600"
        }`}
      >
        {value || "—"}
      </td>
    ))}
  </tr>
);

const VenueComparison = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [primaryVenue, setPrimaryVenue] = useState(null);
  const [comparisonVenues, setComparisonVenues] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        // Call the new comparison endpoint
        const response = await axios.get(`/api/venues/compare/${id}`);

        if (response.data.isSuccess) {
          setPrimaryVenue(response.data.data.primary);
          setComparisonVenues(response.data.data.comparisons);
          setError(null);
        } else {
          setError("Failed to load comparison data.");
        }
      } catch (err) {
        console.error("Comparison Fetch Error:", err);
        setError("Could not load data. Ensure the venue exists.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl m-8">
        Error: {error}
      </div>
    );
  if (!primaryVenue)
    return (
      <div className="p-10 text-center">
        No venue data found for comparison.
      </div>
    );

  // Combine primary venue and comparisons into one array for easier mapping
  const allVenues = [primaryVenue, ...comparisonVenues];
  const isPG = primaryVenue.type === "PG";

  const getFoodTypeLabel = (venue) => {
    if (venue.type !== "Mess") return "N/A";
    return venue.foodType || "Unspecified";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center">
        Side-by-Side Comparison: {primaryVenue.name}
      </h1>
      <p className="text-gray-500 mb-8">
        Comparing similar nearby {primaryVenue.type} properties.
      </p>

      <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <DataRow
              rowType="header"
              icon={<Info size={18} />}
              label="Property Name"
              values={allVenues.map((v) => v.name)}
            />
          </thead>
          <tbody className="divide-y divide-gray-100">
            <DataRow
              icon={<MapPin size={18} />}
              label="Distance from MSRIT"
              values={allVenues.map((v) => `${v.distanceFromMSRIT} km`)}
            />
            <DataRow
              icon={<Star size={18} />}
              label="Avg. Rating"
              values={allVenues.map((v) => `${v.rating || "N/A"} / 5.0`)}
            />
            <DataRow
              icon={<IndianRupee size={18} />}
              label="Min Price (Monthly)"
              values={allVenues.map((v) => `₹${v.cost?.min || "N/A"}`)}
            />

            {/* PG SPECIFIC ROWS */}
            {isPG && (
              <DataRow
                icon={<Layers size={18} />}
                label="Room Types"
                values={allVenues.map(
                  (v) => v.availableRoomTypes?.join(", ") || "N/A"
                )}
              />
            )}
            {isPG && (
              <DataRow
                icon={<User size={18} />}
                label="Sharing Options"
                values={allVenues.map(
                  (v) => v.sharingTypes?.join(", ") || "N/A"
                )}
              />
            )}

            {/* MESS SPECIFIC ROWS */}
            {!isPG && (
              <DataRow
                icon={<Utensils size={18} />}
                label="Food Type"
                values={allVenues.map((v) => getFoodTypeLabel(v))}
              />
            )}
            {!isPG && (
              <DataRow
                icon={<Calendar size={18} />}
                label="Weekly Menu Length"
                values={allVenues.map((v) =>
                  v.weeklyMenu ? `${v.weeklyMenu.length} days` : "N/A"
                )}
              />
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Venue Details
      </button>
    </div>
  );
};

// Simple ChevronLeft icon for the button above (need to make sure it's imported)
const ChevronLeft = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export default VenueComparison;
