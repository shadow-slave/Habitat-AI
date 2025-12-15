import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  User,
  BadgeCheck,
  CheckCircle,
  Lock,
  MapPin,
  Utensils,
  IndianRupee,
  Info,
  Phone,
  Layers,
  Star,
  Loader,
  Sparkles, // Added Sparkles icon for AI section
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const VenueDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsList, setReviewsList] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- FETCH DETAILS ---
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await axios.get(`/api/venues/${id}`);
        if (response.data.isSuccess) {
          const data = response.data.data;
          setVenue(data);
          setReviewsList(data.reviews || []);
          if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch venue details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenueDetails();
  }, [id]);

  // --- SUBMIT REVIEW ---
  const handleSubmit = async () => {
    if (!review || rating === 0) return alert("Please add rating & review!");
    if (!user) return alert("You must be logged in to review.");

    setIsSubmitting(true);

    try {
      const payload = {
        venueId: id,
        description: review,
        rating: rating,
        userId: user._id || user.id,
      };

      const response = await axios.post("/api/venues/review", payload);

      if (response.status === 201) {
        const newReview = response.data.data;
        setReviewsList([newReview, ...reviewsList]);
        setSubmitted(true);
        setReview("");
        setRating(0);

        // Optimistically update sentiment if needed, though usually requires refresh
      }
    } catch (error) {
      console.error("Review failed:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (!venue) return <div className="p-10 text-center">Venue not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in space-y-8">
      {/* 1. HERO HEADER */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative group">
        <div className="h-72 md:h-96 overflow-hidden relative">
          <img
            src={
              selectedImage ||
              "https://via.placeholder.com/800x400?text=No+Image"
            }
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
              {venue.distanceFromMSRIT || "N/A"} km from MSRIT
            </p>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {venue.images && venue.images.length > 1 && (
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
        )}
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
                value={`₹${venue.cost?.min} - ₹${venue.cost?.max || "N/A"}`}
              />
              <DetailItem
                icon={<Phone />}
                label="Contact Owner"
                value={`${venue.ownerName} (${venue.contactNo})`}
              />
              <DetailItem
                icon={<Layers />}
                label="Sharing Types"
                value={venue.sharingTypes?.join(", ") || "N/A"}
              />
              <DetailItem
                icon={<Utensils />}
                label="Food Types"
                value={venue.availableFoods?.join(", ") || "N/A"}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-gray-700 mb-2">About this place</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {venue.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* --- NEW AI SUMMARY SECTION --- */}
          {(venue.aiSummary || venue.generalSentiment) && (
            <div
              className={`border p-6 md:p-8 rounded-2xl relative overflow-hidden ${
                venue.generalSentiment === "Positive"
                  ? "bg-green-50 border-green-100"
                  : venue.generalSentiment === "Negative"
                  ? "bg-red-50 border-red-100"
                  : "bg-blue-50 border-blue-100"
              }`}
            >
              <div className="relative z-10">
                <h3
                  className={`font-bold text-lg mb-3 uppercase tracking-wide flex items-center ${
                    venue.generalSentiment === "Positive"
                      ? "text-green-800"
                      : venue.generalSentiment === "Negative"
                      ? "text-red-800"
                      : "text-blue-800"
                  }`}
                >
                  <Sparkles size={20} className="mr-2" /> Gemini AI Verdict
                </h3>

                {/* Display the Generated Text Summary */}
                {venue.aiSummary ? (
                  <p className="text-gray-800 italic font-medium leading-relaxed">
                    "{venue.aiSummary}"
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Based on student reviews, the overall sentiment is{" "}
                    <strong>{venue.generalSentiment}</strong>.
                  </p>
                )}
              </div>

              {/* Background Decor */}
              <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl rotate-12 select-none pointer-events-none">
                🤖
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Recent Student Audits ({reviewsList.length})
            </h3>

            {reviewsList.length === 0 ? (
              <p className="text-gray-500 italic">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviewsList.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <User size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 flex items-center">
                          {rev.userId?.name || "Student"}
                          {rev.userId?.email?.includes("msrit") && (
                            <BadgeCheck
                              size={14}
                              className="text-blue-600 ml-1"
                            />
                          )}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded font-bold text-sm mb-1">
                        {rev.rating} ★
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          rev.sentiment === "Positive"
                            ? "bg-green-100 text-green-700"
                            : rev.sentiment === "Negative"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {rev.sentiment}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{rev.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: SUBMIT AUDIT --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              <ShieldCheck className="mr-2 text-blue-600" /> Submit Audit
            </h2>

            {!user ? (
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
                {/* --- STAR RATING --- */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Safety Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={32}
                          className={`${
                            rating >= star
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-100 text-gray-300"
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
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
