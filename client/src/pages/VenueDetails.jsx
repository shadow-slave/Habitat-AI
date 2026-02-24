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
  Sparkles,
  Calendar,
  Leaf,
  Drumstick,
  ChefHat,
  Clock, // Added Clock icon for menu
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

  // Helper: Get food type icon & color
  const getFoodTypeInfo = () => {
    switch (venue.foodType) {
      case "Veg":
        return {
          icon: <Leaf size={18} className="text-green-600" />,
          color: "bg-green-50 text-green-800",
        };
      case "Non-Veg":
        return {
          icon: <Drumstick size={18} className="text-red-600" />,
          color: "bg-red-50 text-red-800",
        };
      case "Both":
        return {
          icon: <ChefHat size={18} className="text-amber-600" />,
          color: "bg-amber-50 text-amber-800",
        };
      default:
        return {
          icon: <Utensils size={18} />,
          color: "bg-gray-50 text-gray-800",
        };
    }
  };

  const foodTypeInfo = getFoodTypeInfo();

  // --- Date Formatting Helper ---
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  // --- MAP COORD & SETUP ---
  const defaultLat = 13.0306; // MSRIT Lat
  const defaultLng = 77.5649; // MSRIT Lng
  const currentLat = venue.address?.latitude || defaultLat;
  const currentLng = venue.address?.longitude || defaultLng;
  const showMap = !!(venue.address?.latitude && venue.address?.longitude);

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
            <div className="flex items-center mb-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white">
                {venue.name}
              </h1>
              {venue.type === "Mess" && (
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${foodTypeInfo.color} flex items-center`}
                >
                  {foodTypeInfo.icon}
                  <span className="ml-1">{venue.foodType || "Mess"}</span>
                </span>
              )}
            </div>
            <p className="text-gray-200 text-lg flex items-center">
              <MapPin className="mr-2 text-blue-400" size={20} />
              {venue.distanceFromMSRIT
                ? `${venue.distanceFromMSRIT} km from MSRIT`
                : "Location: " + (venue.address?.street || "N/A")}
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
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: INFO & MESS MENU & AI & REVIEWS --- */}
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
                value={`₹${venue.cost?.min || "N/A"} - ₹${
                  venue.cost?.max || "N/A"
                }`}
              />
              <DetailItem
                icon={<Phone />}
                label="Contact Owner"
                value={`${venue.ownerName || "N/A"} (${
                  venue.contactNo || "N/A"
                })`}
              />

              {/* --- FIX: PG ROOM TYPES --- */}
              {venue.type === "PG" && (
                <DetailItem
                  icon={<Layers />}
                  label="Room Types"
                  // Assuming availableRoomTypes is a comma-separated string if not an array
                  value={
                    (Array.isArray(venue.availableRoomTypes)
                      ? venue.availableRoomTypes.join(", ")
                      : venue.availableRoomTypes
                          ?.split(",")
                          .map((s) => s.trim())
                          .join(", ")) || "N/A"
                  }
                />
              )}

              {/* --- FIX: PG SHARING OPTIONS --- */}
              {venue.type === "PG" && (
                <DetailItem
                  icon={<User />}
                  label="Sharing Options"
                  // Assuming sharingTypes is a comma-separated string if not an array
                  value={
                    (Array.isArray(venue.sharingTypes)
                      ? venue.sharingTypes.join(", ")
                      : venue.sharingTypes
                          ?.split(",")
                          .map((s) => s.trim())
                          .join(", ")) || "N/A"
                  }
                />
              )}

              {venue.type === "Mess" && (
                <>
                  <DetailItem
                    icon={<Utensils />}
                    label="Meals Provided"
                    value={
                      [
                        venue.mealsProvided?.breakfast && "Breakfast",
                        venue.mealsProvided?.lunch && "Lunch",
                        venue.mealsProvided?.dinner && "Dinner",
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A"
                    }
                  />
                  <DetailItem
                    icon={foodTypeInfo.icon}
                    label="Food Type"
                    value={venue.foodType || "N/A"}
                  />
                </>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-gray-700 mb-2">About this place</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {venue.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* --- MAP LOCATION SECTION (OPENSTREETMAP) --- */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="mr-2 text-red-600" /> Exact Location
            </h3>

            <p className="text-gray-600 mb-4 font-medium">
              {venue.address?.street || "Address not available."}
            </p>

            <div className="h-96 w-full rounded-xl overflow-hidden border border-gray-300">
              {showMap ? (
                // OpenStreetMap embed URL using coordinates
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  // Using OpenStreetMap Embed URL (free, no key needed)
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    currentLng - 0.005
                  }%2C${currentLat - 0.005}%2C${currentLng + 0.005}%2C${
                    currentLat + 0.005
                  }&layer=mapnik&marker=${currentLat}%2C${currentLng}`}
                  allowFullScreen
                  title="Venue Location Map"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  <MapPin size={32} className="mr-2" />
                  Location coordinates are not available for embedding.
                </div>
              )}
            </div>

            {showMap && (
              <p className="mt-4 text-xs text-gray-500">
                Coordinates: Lat {venue.address?.latitude}, Lng{" "}
                {venue.address?.longitude}
                {/* Optional: Add a link to open in Google Maps for direction */}
                <a
                  href={`https://www.google.com/maps/embed/v1/place7{currentLat},${currentLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-2 font-medium"
                >
                  (View on Google Maps)
                </a>
              </p>
            )}
          </div>
          {/* --- END MAP LOCATION SECTION --- */}

          {/* --- MESS WEEKLY MENU (Conditional - IMPROVED UI) --- */}
          {venue.type === "Mess" &&
            venue.weeklyMenu &&
            venue.weeklyMenu.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="mr-2 text-green-600" /> Weekly Menu
                  Schedule
                </h3>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left font-semibold text-gray-700 w-24"
                        >
                          Day
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left font-semibold text-gray-700"
                        >
                          Breakfast
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left font-semibold text-gray-700"
                        >
                          Lunch
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left font-semibold text-gray-700"
                        >
                          Dinner
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {venue.weeklyMenu.map((day, idx) => (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            new Date().getDay() === (idx + 1) % 7
                              ? "bg-yellow-50 font-semibold"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                            {day.day}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {day.breakfast || (
                              <span className="text-gray-400 italic">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {day.lunch || (
                              <span className="text-gray-400 italic">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {day.dinner || (
                              <span className="text-gray-400 italic">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td
                          className="px-4 py-2 font-semibold text-gray-500 flex items-center text-xs"
                          colSpan="4"
                        >
                          <Clock size={14} className="mr-1" /> Typical timings:
                          8am | 1pm | 8pm (Verify with owner)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* --- AI SUMMARY SECTION --- */}
          {(venue.aiSummary || venue.generalSentiment) && (
            <div
              className={`border p-6 md:p-8 rounded-2xl relative overflow-hidden ${
                venue.generalSentiment === "Positive"
                  ? "bg-green-50 border-green-200"
                  : venue.generalSentiment === "Negative"
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
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

              <div className="absolute -right-6 -bottom-6 opacity-5 text-8xl pointer-events-none">
                🤖
              </div>
            </div>
          )}

          <Link to={`/compare/${venue._id}`}>
            <button className="w-full bg-indigo-50 border border-indigo-200 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-100 transition mt-4">
              Compare Nearby {venue.type}s
            </button>
          </Link>

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShieldCheck className="mr-2 text-blue-600" />
              Recent Student Audits ({reviewsList.length})
            </h3>

            {reviewsList.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 italic">
                  No audits yet. Be the first to submit one!
                </p>
              </div>
            ) : (
              reviewsList.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 text-white font-bold text-sm">
                        {(rev.userId?.name || "S")[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 flex items-center">
                          {rev.userId?.name || "Student"}
                          {rev.userId?.email
                            ?.toLowerCase()
                            .includes("msrit") && (
                            <BadgeCheck
                              size={16}
                              className="text-blue-600 ml-1"
                            />
                          )}
                          {
                            console.log("email check:", rev.userId?.email)
                          }
                        </h4>
                        {/* --- FIXED DATE FORMAT --- */}
                        <p className="text-xs text-gray-400 flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          {formatDate(rev.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded font-bold text-sm">
                        <Star size={14} className="fill-current mr-1" />
                        {rev.rating}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-1 ${
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
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {rev.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: SUBMIT AUDIT --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              <ShieldCheck className="mr-2 text-blue-600" /> Submit Audit
            </h2>

            {!user ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Lock className="text-gray-400 mx-auto mb-3" size={24} />
                <h3 className="font-bold text-gray-900">Login to Verify</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Only verified MSRIT students can submit audits.
                </p>
                <Link to="/login">
                  <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shadow">
                    Login with MSRIT Email
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
                <p className="text-green-600 text-sm mt-1">
                  Thank you for helping fellow students.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm underline mt-3 text-blue-600 hover:text-blue-800"
                >
                  Submit another audit
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Safety & Experience Rating
                  </label>
                  <div className="flex space-x-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          size={36}
                          className={`${
                            rating >= star
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-300"
                          } transition-all duration-200 hover:scale-110`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-1">
                    {rating === 0
                      ? "Select a rating"
                      : `${rating} star${rating > 1 ? "s" : ""}`}
                  </p>
                </div>

                <textarea
                  className="w-full border border-gray-200 p-4 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  rows="4"
                  placeholder={`Share your honest experience about ${venue.name}...\n• Safety\n• Cleanliness\n• Staff behavior\n• Value for money`}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !review.trim() || rating === 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-white transition shadow-lg ${
                    isSubmitting || !review.trim() || rating === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin mr-2 h-5 w-5" />
                      Verifying...
                    </span>
                  ) : (
                    "Submit Audit"
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  ✅ Verified by AI & admin team • 🔒 Anonymous submission
                </p>
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
    <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 flex-shrink-0 mt-0.5">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-gray-900 font-medium text-sm mt-0.5 break-words">
        {value || "—"}
      </p>
    </div>
  </div>
);

export default VenueDetails;
