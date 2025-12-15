import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  User,
  BadgeCheck,
  CheckCircle,
  Lock,
  MapPin,
  Wifi,
  Zap,
  Utensils,
  IndianRupee,
  Info,
  Phone,
} from "lucide-react";

const VenueDetails = ({ venues }) => {
  const { id } = useParams();
  const venue = venues.find((v) => v.id === parseInt(id));

  // --- MOCK REVIEWS DATA ---
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      user: "Rahul S.",
      rating: 5,
      text: "The generator backup is a lifesaver during exams. Highly recommend!",
      isVerified: true,
      date: "2 days ago",
    },
    {
      id: 2,
      user: "Ankit (Guest)",
      rating: 3,
      text: "Food is okay, but the wifi is spotty on the 3rd floor.",
      isVerified: false,
      date: "1 week ago",
    },
  ]);

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // CHECK LOGIN STATUS
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  if (!venue) return <div className="p-10 text-center">Venue not found</div>;

  const handleSubmit = () => {
    if (!review || rating === 0) {
      alert("Please select a rating and write a review!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const isMsrit = loggedInUser.email.toLowerCase().endsWith("@msrit.edu");
      const newReview = {
        id: reviewsList.length + 1,
        user: loggedInUser.email.split("@")[0] + (isMsrit ? " (Verified)" : ""),
        rating: rating,
        text: review,
        isVerified: isMsrit,
        date: "Just now",
      };

      setReviewsList([newReview, ...reviewsList]);
      setIsSubmitting(false);
      setSubmitted(true);
      setReview("");
      setRating(0);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in space-y-8">
      {/* 1. HERO HEADER */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative group">
        <div className="h-72 md:h-96 overflow-hidden relative">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 pt-20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                  {venue.name}
                </h1>
                <p className="text-gray-200 text-lg flex items-center">
                  <MapPin className="mr-2 text-blue-400" size={20} />
                  {venue.distance} from MSRIT Gate 10
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 text-white px-4 py-2 rounded-xl text-xl font-bold flex items-center shadow-lg">
                  {venue.rating} ★
                </div>
                <div className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium border border-blue-400">
                  {venue.type}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: INFO & DETAILS (Span 2) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* A. NEW DETAILS GRID */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Info className="mr-2 text-blue-600" /> Key Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={<IndianRupee />}
                label="Rent / Price"
                value={venue.price}
              />
              <DetailItem
                icon={<User />}
                label="Sharing Type"
                value={venue.sharing}
              />
              <DetailItem
                icon={<Utensils />}
                label="Food Available"
                value={venue.food}
              />
              <DetailItem
                icon={<Phone />}
                label="Contact Owner"
                value={venue.owner}
              />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="font-bold text-gray-700 mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100 flex items-center"
                  >
                    {idx % 2 === 0 ? (
                      <Wifi size={14} className="mr-2" />
                    ) : (
                      <Zap size={14} className="mr-2" />
                    )}
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-bold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {venue.description}
              </p>
            </div>
          </div>

          {/* B. AI SUMMARY */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6 md:p-8 rounded-2xl">
            <h3 className="text-indigo-900 font-bold text-lg mb-3 uppercase tracking-wide flex items-center">
              ✨ Gemini AI Verdict
            </h3>
            <p className="text-indigo-800 text-lg italic leading-relaxed font-serif">
              "{venue.aiSummary}"
            </p>
          </div>

          {/* C. REVIEWS LIST */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Recent Student Audits
            </h3>
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        rev.isVerified
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center">
                        {rev.user}
                        {rev.isVerified && (
                          <span className="ml-2 bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full flex items-center border border-blue-200 uppercase font-bold tracking-wider">
                            <BadgeCheck size={12} className="mr-1" /> Verified
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-400">{rev.date}</p>
                    </div>
                  </div>
                  <div className="flex bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-sm font-bold border border-yellow-100">
                    {rev.rating} ★
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed ml-13 pl-13">
                  {rev.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: SUBMIT AUDIT (Sticky) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              <ShieldCheck className="mr-2 text-blue-600" />
              Submit Audit
            </h2>

            {!loggedInUser ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="bg-white p-3 rounded-full shadow-sm w-fit mx-auto mb-4">
                  <Lock className="text-gray-400" size={24} />
                </div>
                <h3 className="text-gray-900 font-bold mb-2">Login Required</h3>
                <p className="text-gray-500 text-sm mb-6 px-4">
                  Only verified students can submit official safety audits.
                </p>
                <Link to="/login">
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition shadow-lg w-full">
                    Login Now
                  </button>
                </Link>
              </div>
            ) : submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-bounce-short">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800">
                  Audit Verified!
                </h3>
                <p className="text-green-600 text-sm mt-2">
                  Review added by{" "}
                  <span className="font-bold">{loggedInUser.email}</span>
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-gray-500 underline hover:text-gray-800"
                >
                  Submit another
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Safety Rating
                  </label>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setRating(num)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                          rating >= num
                            ? "bg-blue-600 text-white shadow-md transform scale-110"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Observation
                  </label>
                  <textarea
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                    rows="4"
                    placeholder={`Posting publicly as ${loggedInUser.email}...`}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1"
                  }`}
                >
                  {isSubmitting ? "Verifying..." : "Submit Official Audit"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Details Grid
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-gray-900 font-semibold text-sm md:text-base mt-0.5">
        {value || "Not available"}
      </p>
    </div>
  </div>
);

export default VenueDetails;
