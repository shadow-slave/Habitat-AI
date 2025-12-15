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
  Navigation,
  Layers,
  Star,
} from "lucide-react"; // <--- Make sure Star is imported

const VenueDetails = ({ venues }) => {
  const { id } = useParams();
  // Handle string IDs because Mongoose uses strings ("_id")
  const venue = venues.find((v) => v._id === id || v.id === parseInt(id));

  const [selectedImage, setSelectedImage] = useState(
    venue ? venue.images[0] : ""
  );
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      user: "Rahul S.",
      rating: 5,
      text: "Great generator backup!",
      isVerified: true,
      date: "2 days ago",
    },
    {
      id: 2,
      user: "Ankit (Guest)",
      rating: 3,
      text: "Food is okay, wifi spotty.",
      isVerified: false,
      date: "1 week ago",
    },
  ]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0); // This tracks the star count
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  if (!venue) return <div className="p-10 text-center">Venue not found</div>;

  const handleSubmit = () => {
    if (!review || rating === 0) return alert("Please add rating & review!");
    setIsSubmitting(true);
    setTimeout(() => {
      const isMsrit = loggedInUser?.email.toLowerCase().endsWith("@msrit.edu");
      setReviewsList([
        {
          id: Date.now(),
          user:
            loggedInUser.email.split("@")[0] + (isMsrit ? " (Verified)" : ""),
          rating,
          text: review,
          isVerified: isMsrit,
          date: "Just now",
        },
        ...reviewsList,
      ]);
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
            src={selectedImage}
            alt={venue.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 pt-20">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
              {venue.name}
            </h1>
            <p className="text-gray-200 text-lg flex items-center">
              <MapPin className="mr-2 text-blue-400" size={20} />
              {venue.distanceFromMSRIT} km from MSRIT
            </p>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        <div className="bg-white p-2 flex space-x-2 overflow-x-auto border-t border-gray-100">
          {venue.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                selectedImage === img
                  ? "ring-2 ring-blue-600 opacity-100"
                  : "opacity-60"
              }`}
            >
              <img
                src={img}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: INFO & MAP --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Details Grid */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Info className="mr-2 text-blue-600" /> Key Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={<IndianRupee />}
                label="Price Range"
                value={`₹${venue.cost.min} - ₹${venue.cost.max || "N/A"}`}
              />
              <DetailItem
                icon={<Phone />}
                label="Contact Owner"
                value={`${venue.ownerName} (${venue.contactNo})`}
              />
              <DetailItem
                icon={<Layers />}
                label="Sharing Types"
                value={venue.sharingTypes.join(", ")}
              />
              <DetailItem
                icon={<Utensils />}
                label="Food Types"
                value={venue.availableFoods.join(", ")}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-gray-700 mb-2">About this place</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {venue.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center">
                <Navigation className="mr-2 text-blue-600" size={20} /> Location
              </h3>
              <span className="text-xs text-gray-500">
                {venue.address.street}
              </span>
            </div>
            <div className="h-64 bg-gray-100 w-full relative">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${venue.address.latitude},${venue.address.longitude}&hl=es;z=14&output=embed`}
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6 md:p-8 rounded-2xl">
            <h3 className="text-indigo-900 font-bold text-lg mb-3 uppercase tracking-wide flex items-center">
              ✨ Gemini AI Verdict
            </h3>
            <p className="text-indigo-800 text-lg italic leading-relaxed font-serif">
              "{venue.aiSummary}"
            </p>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Recent Student Audits
            </h3>
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center">
                        {rev.user}{" "}
                        {rev.isVerified && (
                          <BadgeCheck
                            size={14}
                            className="text-blue-600 ml-1"
                          />
                        )}
                      </h4>
                      <p className="text-xs text-gray-400">{rev.date}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded font-bold text-sm">
                    {rev.rating} ★
                  </div>
                </div>
                <p className="text-gray-600">{rev.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: SUBMIT AUDIT --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              <ShieldCheck className="mr-2 text-blue-600" /> Submit Audit
            </h2>
            {!loggedInUser ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Lock className="text-gray-400 mx-auto mb-3" size={24} />
                <h3 className="font-bold text-gray-900">Login Required</h3>
                <Link to="/login">
                  <button className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold">
                    Login Now
                  </button>
                </Link>
              </div>
            ) : submitted ? (
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <CheckCircle
                  className="text-green-500 mx-auto mb-2"
                  size={32}
                />
                <h3 className="text-green-800 font-bold">Audit Verified!</h3>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm underline mt-2"
                >
                  Submit another
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* --- NEW STAR RATING INPUT --- */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Safety Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={32}
                          className={`${
                            rating >= star
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-100 text-gray-300"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-medium ml-1">
                    {rating === 0
                      ? "Select a rating"
                      : rating === 5
                      ? "Excellent"
                      : rating === 4
                      ? "Very Good"
                      : rating === 3
                      ? "Average"
                      : rating === 2
                      ? "Poor"
                      : "Terrible"}
                  </p>
                </div>

                <textarea
                  className="w-full border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows="3"
                  placeholder="Write your observation..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  {isSubmitting ? "Verifying..." : "Submit Audit"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase">{label}</p>
      <p className="text-gray-900 font-semibold text-sm mt-0.5">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default VenueDetails;
