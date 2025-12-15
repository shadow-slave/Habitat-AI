import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building,
  User,
  MapPin,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  LayoutGrid,
  Crosshair,
  Loader,
  X,
  AlertCircle,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// --- Leaflet Imports ---
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Helper component to update the Leaflet map view when coordinates change
const MapUpdater = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom() < 14 ? 14 : map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};
// --- End Leaflet Helpers ---

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  // 'idle', 'searching', 'success', 'error'
  const [geocodingStatus, setGeocodingStatus] = useState(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "PG",
    ownerName: "",
    contactNo: "",
    minPrice: "",
    maxPrice: "",
    street: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  /* ---------- PG ---------- */
  const [roomTypes, setRoomTypes] = useState([]);
  const [sharingTypes, setSharingTypes] = useState([]);

  /* ---------- MESS ---------- */
  const [foodType, setFoodType] = useState("Veg");
  const [mealsProvided, setMealsProvided] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const [weeklyMenu, setWeeklyMenu] = useState([
    { day: "Monday", breakfast: "", lunch: "", dinner: "" },
    { day: "Tuesday", breakfast: "", lunch: "", dinner: "" },
    { day: "Wednesday", breakfast: "", lunch: "", dinner: "" },
    { day: "Thursday", breakfast: "", lunch: "", dinner: "" },
    { day: "Friday", breakfast: "", lunch: "", dinner: "" },
    { day: "Saturday", breakfast: "", lunch: "", dinner: "" },
    { day: "Sunday", breakfast: "", lunch: "", dinner: "" },
  ]);

  // Ref for the Debounce Timer
  const geocodeTimerRef = useRef(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  if (authLoading || !user) return null;

  // --- MISSING HELPER FUNCTION DEFINED HERE ---
  const toggleArrayValue = (value, setter, state) => {
    setter(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };
  // --- END HELPER ---

  // --- NOMINATIM GEOCODING LOGIC ---
  const geocodeAddress = useCallback(async (address) => {
    if (!address.trim() || address.length < 5) {
      setGeocodingStatus("idle");
      return;
    }

    setGeocodingStatus("searching");

    // Free Nominatim API (OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1&countrycodes=in`;

    try {
      const response = await axios.get(url);

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const lat = parseFloat(result.lat).toFixed(6);
        const lng = parseFloat(result.lon).toFixed(6);

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setGeocodingStatus("success");
      } else {
        setGeocodingStatus("error");
        setFormData((prev) => ({ ...prev, latitude: "", longitude: "" }));
      }
    } catch (e) {
      console.error("Geocoding failed:", e);
      setGeocodingStatus("error");
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "street") {
        if (geocodeTimerRef.current) {
          clearTimeout(geocodeTimerRef.current);
        }

        // Debounce geocoding for 500ms
        geocodeTimerRef.current = setTimeout(() => {
          geocodeAddress(value);
        }, 500);
      }
    },
    [geocodeAddress]
  );

  // --- EXISTING GPS FALLBACK LOGIC ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by this browser.");
      return;
    }

    setError("");
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((p) => ({
          ...p,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocationLoading(false);
        setGeocodingStatus("success");
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Location access denied. Please enter manually.");
        setLocationLoading(false);
        setGeocodingStatus("idle");
      }
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 10) {
      setError("Maximum 10 images allowed.");
      return;
    }
    setImageFiles((p) => [...p, ...files]);
    setPreviewImages((p) => [
      ...p,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    setError("");
  };

  const removeImage = (index) => {
    setImageFiles((p) => p.filter((_, i) => i !== index));
    setPreviewImages((p) => p.filter((_, i) => i !== index));
  };

  const handleMenuChange = (index, field, value) => {
    setWeeklyMenu((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim() || !formData.ownerName.trim()) {
      setError("Property name and owner name are required.");
      setLoading(false);
      return;
    }
    if (!imageFiles.length) {
      setError("At least one image is required.");
      setLoading(false);
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError(
        "Location coordinates are missing. Please use the address search or GPS fallback."
      );
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      imageFiles.forEach((f) => data.append("images", f));

      if (formData.type === "PG") {
        if (roomTypes.length === 0) {
          setError("Please select at least one room type.");
          setLoading(false);
          return;
        }
        data.append("availableRoomTypes", JSON.stringify(roomTypes));
        data.append("sharingTypes", JSON.stringify(sharingTypes));
      }

      if (formData.type === "Mess") {
        data.append("foodType", foodType);
        data.append("mealsProvided", JSON.stringify(mealsProvided));
        data.append("weeklyMenu", JSON.stringify(weeklyMenu));
      }

      const res = await axios.post("/api/venues", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.isSuccess) {
        setSubmitted(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || "Failed to create venue.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
          <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your property has been submitted successfully and is awaiting admin
            approval.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Set default coordinates for map if none are present (e.g., center of India or MSRIT)
  const defaultLat = 13.0306;
  const defaultLng = 77.5649;
  const currentLat = formData.latitude || defaultLat;
  const currentLng = formData.longitude || defaultLng;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <LayoutGrid className="mr-3 text-blue-600" size={32} />
            Add New Property
          </h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to list your property.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Section: Basic Info */}
          <section className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <Building className="mr-2 text-blue-600" size={24} />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., Green Valley PG"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Type
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="PG">PG / Hostel</option>
                    <option value="Mess">Mess / Canteen</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="ownerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Owner Name *
                </label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., Rajesh Kumar"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Number
                </label>
                <input
                  id="contactNo"
                  name="contactNo"
                  type="tel"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label
                  htmlFor="minPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Minimum Price (₹)
                </label>
                <input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  min="0"
                  value={formData.minPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., 5000"
                />
              </div>

              <div>
                <label
                  htmlFor="maxPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Maximum Price (₹)
                </label>
                <input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  min="0"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., 12000"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  placeholder="Briefly describe your property, amenities, rules, etc."
                />
              </div>
            </div>
          </section>

          {/* Section: Location (WITH MAP) */}
          <section className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <MapPin className="mr-2 text-green-600" size={24} />
              Location & Coordinates
            </h2>

            {/* Address Search Field */}
            <div className="mb-4">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address for Geocoding *
              </label>
              <div className="relative">
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Start typing the full address (e.g., 1st Main Road, Gokula Extension, Bengaluru)"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Type the address and pause. Coordinates will be auto-calculated.
              </p>
            </div>

            {/* Map Visualization */}
            <div className="mb-6 h-80 w-full rounded-lg shadow-inner overflow-hidden border border-gray-300">
              <MapContainer
                center={[currentLat, currentLng]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
                key={`${currentLat}-${currentLng}`} // Re-render if coords change
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {formData.latitude && formData.longitude && (
                  <>
                    <Marker position={[currentLat, currentLng]} />
                    <MapUpdater lat={currentLat} lng={currentLng} />
                  </>
                )}
              </MapContainer>
            </div>
            {/* End Map */}

            {/* Coordinates Display & GPS Fallback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
              {/* Geocoding Status Indicator */}
              <div className="flex flex-col justify-center">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center ${
                    geocodingStatus === "success"
                      ? "bg-green-200 text-green-800"
                      : geocodingStatus === "searching"
                      ? "bg-yellow-200 text-yellow-800"
                      : geocodingStatus === "error"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {geocodingStatus === "searching" && (
                    <Loader className="animate-spin h-3 w-3 mr-1" />
                  )}
                  {geocodingStatus === "searching"
                    ? "Searching..."
                    : geocodingStatus === "success"
                    ? "Address Found"
                    : geocodingStatus === "error"
                    ? "Address Not Found"
                    : "Awaiting Address"}
                </span>
              </div>

              {/* Latitude */}
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  value={formData.latitude}
                  readOnly
                  className="w-full px-4 py-3 border border-green-300 rounded-lg bg-white/70 text-gray-700"
                  placeholder="Auto-filled"
                />
              </div>

              {/* Longitude */}
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  value={formData.longitude}
                  readOnly
                  className="w-full px-4 py-3 border border-green-300 rounded-lg bg-white/70 text-gray-700"
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            {/* GPS Fallback */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locationLoading}
                className={`flex items-center mx-auto justify-center px-4 py-2.5 rounded-lg font-medium text-sm transition ${
                  locationLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                }`}
              >
                <Crosshair className="mr-2 h-5 w-5" />
                {locationLoading
                  ? "Detecting..."
                  : "Use Current GPS Location (Fallback)"}
              </button>
            </div>
          </section>

          {/* ... (Images, PG, Mess sections remain the same) ... */}

          {/* Section: Images */}
          <section className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <ImageIcon className="mr-2 text-blue-600" size={24} />
              Property Images
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-6">
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Click to upload images
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB. Max 10 images.
                </span>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ---------- PG ---------- */}
          {formData.type === "PG" && (
            <section className="p-6 sm:p-8 bg-blue-50">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
                <User className="mr-2 text-blue-600" size={24} />
                PG Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Available Room Types *
                  </h3>
                  <div className="space-y-2">
                    {["Single Room", "1BHK", "2BHK", "3BHK", "Studio"].map(
                      (r) => (
                        <label key={r} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={roomTypes.includes(r)}
                            onChange={() =>
                              toggleArrayValue(r, setRoomTypes, roomTypes)
                            }
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">{r}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Sharing Options
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Single Sharing",
                      "Double Sharing",
                      "Triple Sharing",
                      "Quad Sharing",
                    ].map((s) => (
                      <label key={s} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sharingTypes.includes(s)}
                          onChange={() =>
                            toggleArrayValue(s, setSharingTypes, sharingTypes)
                          }
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ---------- MESS ---------- */}
          {formData.type === "Mess" && (
            <section className="p-6 sm:p-8 bg-green-50">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
                <User className="mr-2 text-green-600" size={24} />
                Mess Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="foodType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Food Type
                  </label>
                  <div className="relative">
                    <select
                      id="foodType"
                      value={foodType}
                      onChange={(e) => setFoodType(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer"
                    >
                      <option value="Veg">Vegetarian</option>
                      <option value="Non-Veg">Non-Vegetarian</option>
                      <option value="Both">Both</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Meals Provided
                  </h3>
                  <div className="space-y-2">
                    {["breakfast", "lunch", "dinner"].map((m) => (
                      <label key={m} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={mealsProvided[m]}
                          onChange={() =>
                            setMealsProvided((p) => ({ ...p, [m]: !p[m] }))
                          }
                          className="h-4 w-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                        />
                        <span className="ml-2 capitalize text-gray-700">
                          {m}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-gray-700 mb-4">Weekly Menu</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Breakfast
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lunch
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dinner
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {weeklyMenu.map((day, i) => (
                        <tr key={day.day}>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                            {day.day}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={day.breakfast}
                              onChange={(e) =>
                                handleMenuChange(i, "breakfast", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                              placeholder="e.g., Poha, Tea"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={day.lunch}
                              onChange={(e) =>
                                handleMenuChange(i, "lunch", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                              placeholder="e.g., Dal, Rice, Roti"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={day.dinner}
                              onChange={(e) =>
                                handleMenuChange(i, "dinner", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                              placeholder="e.g., Paneer, Salad"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Submit Button */}
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2 h-5 w-5" />
                  Posting...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Post Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
