import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, Star, Upload } from "lucide-react";

const VenueDetails = ({ venues }) => {
  const { id } = useParams();
  const venue = venues.find((v) => v.id === parseInt(id));
  const [review, setReview] = useState("");

  if (!venue) return <div>Venue not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 1. Header Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold flex items-center">
              <Star size={18} className="mr-1 fill-green-800" /> {venue.rating}
            </span>
          </div>

          {/* The AI Summary Block */}
          <div className="mt-6 bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
            <h3 className="text-indigo-900 font-bold text-lg mb-2 flex items-center">
              ✨ Gemini AI Summary
            </h3>
            <p className="text-indigo-800 italic">"{venue.aiSummary}"</p>
          </div>
        </div>
      </div>

      {/* 2. The Audit Form (Submission) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <ShieldCheck className="mr-2 text-blue-600" />
          Submit an Audit
        </h2>

        <div className="space-y-4">
          {/* Safety Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Rating (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 font-bold focus:bg-blue-600 focus:text-white transition"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Review
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="e.g. The water supply is irregular..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
          </div>

          {/* Photo Upload (Fake UI for Demo) */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-500">Upload Photo Evidence</p>
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            Submit Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
