import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, Star, Upload, CheckCircle } from "lucide-react";

const VenueDetails = ({ venues }) => {
  const { id } = useParams();
  const venue = venues.find((v) => v.id === parseInt(id));

  // State for the form
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!venue) return <div className="p-10 text-center">Venue not found</div>;

  const handleSubmit = () => {
    if (!review || rating === 0) {
      alert("Please select a rating and write a review!");
      return;
    }

    setIsSubmitting(true);

    // SIMULATE BACKEND DELAY (1.5 seconds)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setReview("");
      setRating(0);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      {/* 1. Header Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
        <div className="h-64 overflow-hidden relative">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-6 pt-20">
            <h1 className="text-3xl font-bold text-white mb-1">{venue.name}</h1>
            <p className="text-gray-200 text-sm flex items-center">
              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold mr-2">
                {venue.rating} ★
              </span>
              {venue.distance} from Campus
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* AI Summary Block */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg shadow-sm">
            <h3 className="text-indigo-900 font-bold text-sm mb-2 uppercase tracking-wide flex items-center">
              ✨ Gemini AI Summary
            </h3>
            <p className="text-indigo-800 text-sm italic leading-relaxed">
              "{venue.aiSummary}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. The Audit Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
          <ShieldCheck className="mr-2 text-blue-600" />
          Submit an Audit
        </h2>

        {submitted ? (
          // SUCCESS STATE
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-bounce-short">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800">
              Audit Verified!
            </h3>
            <p className="text-green-600">
              Your review has been added to the blockchain ledger.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm text-gray-500 underline hover:text-gray-800"
            >
              Submit another review
            </button>
          </div>
        ) : (
          // FORM STATE
          <div className="space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Safety Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      rating >= num
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-400 hover:bg-blue-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Detailed Observation
              </label>
              <textarea
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
                rows="3"
                placeholder="e.g. The CCTV at the entrance was not working..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>

            {/* Fake Upload Button */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition group">
              <Upload className="mx-auto h-10 w-10 text-gray-300 group-hover:text-blue-500 transition" />
              <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-700">
                Click to upload evidence (JPG/PNG)
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
                  Verifying Audit...
                </>
              ) : (
                "Submit Official Audit"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDetails;
