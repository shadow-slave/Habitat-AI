import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  User,
  MapPin,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  LayoutGrid,
  Lock,
  X,
} from "lucide-react";

const Admin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // State for Images
  const [images, setImages] = useState([]); // Stores the preview URLs

  const [formData, setFormData] = useState({
    name: "",
    type: "PG",
    ownerName: "",
    contactNo: "",
    minPrice: "",
    maxPrice: "",
    street: "",
    description: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- NEW: HANDLE MULTIPLE IMAGE UPLOAD ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Create temporary URLs for preview
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImageUrls]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  // 1. AUTH CHECK
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Restricted Access
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            You must be logged in to register a property on the Habitat-AI
            network.
          </p>
          <Link to="/login">
            <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg">
              Login to Continue
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full border border-gray-100 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Request Submitted
          </h2>
          <p className="text-gray-500 mb-8">
            "{formData.name}" has been sent to the Admin Panel for verification.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ ...formData, name: "" });
              setImages([]);
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full"
          >
            Add Another Property
          </button>
        </div>
      </div>
    );
  }

  // 3. MAIN FORM
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
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="12000"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location & Images */}
          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="mr-2 text-blue-500" size={20} /> Location &
              Media
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. 4th Cross, Gokula Extension"
                  onChange={handleChange}
                />
              </div>

              {/* --- IMAGE UPLOAD AREA --- */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Upload Photos
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((img, idx) => (
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

                  {/* Upload Button */}
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
                <p className="text-xs text-gray-400">
                  Supported: JPG, PNG. You can select multiple files.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={loading || images.length === 0}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center ${
                loading || images.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all"
              }`}
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Plus size={18} className="mr-2" /> Submit for Review
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
