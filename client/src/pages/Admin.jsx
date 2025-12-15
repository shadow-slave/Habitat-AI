import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  User,
  MapPin,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  LayoutGrid,
  Crosshair, // New Icon for Location
  Loader,
  X,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // New State for Location loading
  const [locationLoading, setLocationLoading] = useState(false);

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
    latitude: "", // New Field
    longitude: "", // New Field
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- NEW: GET CURRENT LOCATION ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        alert(
          "Unable to retrieve your location. Please allow location access."
        );
        setLocationLoading(false);
      }
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("ownerName", formData.ownerName);
      data.append("contactNo", formData.contactNo);
      data.append("minPrice", formData.minPrice);
      data.append("maxPrice", formData.maxPrice);
      data.append("street", formData.street);
      data.append("description", formData.description);

      // Send Coordinates
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      const response = await axios.post("/api/venues", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.isSuccess) {
        setSubmitted(true);
        setFormData({
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
        setImageFiles([]);
        setPreviewImages([]);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to create property. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full border border-gray-100 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Property Posted!
          </h2>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full mt-4"
          >
            Add Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
            <LayoutGrid className="mr-3 text-blue-600" /> Property Manager
          </h1>
          <p className="mt-2 text-gray-500">
            Posting as{" "}
            <span className="font-bold text-gray-800">{user.email}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* ... [Basic Info & Owner Sections remain unchanged] ... */}

          {/* Section 1: Basic Info */}
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Building className="mr-2 text-blue-500" size={20} /> Property
              Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Property Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. Sai Balaji Luxury PG"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  onChange={handleChange}
                >
                  <option value="PG">PG Hostel</option>
                  <option value="Mess">Student Mess</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                rows="3"
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Describe amenities..."
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Section 2: Owner & Price */}
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <User className="mr-2 text-blue-500" size={20} /> Ownership &
              Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. Mr. Ramesh"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. 9876543210"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="5000"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="12000"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location (UPDATED) */}
          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="mr-2 text-blue-500" size={20} /> Location &
              Media
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {/* STREET ADDRESS */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. 4th Cross, Gokula Extension"
                  onChange={handleChange}
                />
              </div>

              {/* COORDINATES INPUTS */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-blue-900 uppercase">
                    Map Coordinates
                  </label>

                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                  >
                    {locationLoading ? (
                      <Loader size={14} className="animate-spin" />
                    ) : (
                      <Crosshair size={14} />
                    )}
                    <span>
                      {locationLoading ? "Fetching..." : "Use My Location"}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      name="latitude"
                      placeholder="Latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="w-full bg-white border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="longitude"
                      placeholder="Longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="w-full bg-white border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-400 mt-2">
                  * Click the button to auto-fill your current location.
                </p>
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Upload Photos
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {previewImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                    >
                      <img
                        src={img}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition text-gray-400 hover:text-blue-500">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-xs font-bold">Add Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={loading || imageFiles.length === 0}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center ${
                loading || imageFiles.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
              }`}
            >
              {loading ? (
                "Uploading..."
              ) : (
                <>
                  <Plus size={18} className="mr-2" /> Post Property
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
