import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Building,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import axios from "axios"; // <--- Import Axios

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institution: "",
    occupation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // --- THE AXIOS CALL ---
      // Matches Backend: router.post("/", ...)
      const response = await axios.post("/api/auth", formData);

      if (response.data.isSuccess) {
        // Redirect to Login on success
        alert("Registration Successful! Please Login.");
        navigate("/login");
      }
    } catch (err) {
      // Handle Backend Errors (e.g., "User Already Exists")
      const errorMessage =
        err.response?.data?.message || err.message || "Registration Failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-slate-900">
      {/* Background Decor (Same as Login) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-white/5 p-8 pb-6 text-center border-b border-white/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-blue-200 text-xs mt-1">
            Join the trusted student community
          </p>
        </div>

        <div className="p-8 pt-6">
          {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-xs mb-6 border border-red-500/30 text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Name */}
            <InputGroup
              icon={<User />}
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            {/* 2. Email */}
            <InputGroup
              icon={<Mail />}
              name="email"
              type="email"
              placeholder="College Email (@msrit.edu)"
              value={formData.email}
              onChange={handleChange}
            />

            {/* 3. Password */}
            <InputGroup
              icon={<Lock />}
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            {/* 4. Row: Institution & Occupation */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                icon={<Building />}
                name="institution"
                placeholder="College (e.g. MSRIT)"
                value={formData.institution}
                onChange={handleChange}
              />

              {/* Occupation Dropdown Logic or Simple Input */}
              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-blue-300" />
                  </div>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-white placeholder-blue-300/50 text-xs appearance-none"
                  >
                    <option value="" className="text-gray-900">
                      Select Role
                    </option>
                    <option value="Student" className="text-gray-900">
                      Student
                    </option>
                    <option value="Faculty" className="text-gray-900">
                      Faculty
                    </option>
                    <option value="Alumni" className="text-gray-900">
                      Alumni
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full group relative flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white overflow-hidden transition-all ${
                loading
                  ? "bg-indigo-600/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30 mt-4"
              }`}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Register</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-blue-200">
              Already a member?{" "}
              <Link
                to="/login"
                className="font-bold text-white hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Inputs to keep code clean
const InputGroup = ({
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) => (
  <div className="group">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {React.cloneElement(icon, {
          className:
            "h-4 w-4 text-blue-300 group-focus-within:text-white transition-colors",
        })}
      </div>
      <input
        type={type}
        name={name}
        required
        className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-white placeholder-blue-300/50 transition-all hover:bg-white/10 text-xs"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default Register;
