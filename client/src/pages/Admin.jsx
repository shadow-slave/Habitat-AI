import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for redirection
import {
  Building,
  User,
  MapPin,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  LayoutGrid,
  Lock,
  ShieldAlert,
} from "lucide-react";

const Admin = () => {
  // 1. AUTH CHECK: Grab user from storage
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  // --- SCENARIO 1: USER NOT LOGGED IN ---
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
            network. This ensures accountability and trust.
          </p>

          <Link to="/login">
            <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg transform hover:-translate-y-0.5">
              Login to Continue
            </button>
          </Link>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- SCENARIO 2: SUBMITTED SUCCESS ---
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
            You will be notified once it goes live.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ ...formData, name: "" });
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full"
          >
            Add Another Property
          </button>
        </div>
      </div>
    );
  }

  // --- SCENARIO 3: MAIN FORM (LOGGED IN) ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
                placeholder="Describe amenities, distance from college, etc..."
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

              {/* Fake Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700">
                  Click to upload property photos
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  SVG, PNG, JPG or GIF (Max. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center ${
                loading
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
