import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react"; // Added Icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // SIMULATE LOGIC (Same as before)
    setTimeout(() => {
      const isMsrit = email.toLowerCase().endsWith("@msrit.edu");
      const role = isMsrit ? "Student (Verified)" : "Student (Guest)";

      localStorage.setItem("user", JSON.stringify({ email, role }));

      setLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-slate-900">
      {/* --- BACKGROUND DECORATION (Glowing Orbs) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- GLASSMORMISM CARD --- */}
      <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-white/5 p-8 pb-6 text-center border-b border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-blue-200 text-sm mt-2">
            Sign in to verify your MSRIT credentials
          </p>
        </div>

        <div className="p-8 pt-6">
          {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm mb-6 border border-red-500/30 text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="group">
              <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">
                College Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-white placeholder-blue-300/50 transition-all hover:bg-white/10"
                  placeholder="name@msrit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-white placeholder-blue-300/50 transition-all hover:bg-white/10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full group relative flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white overflow-hidden transition-all ${
                loading
                  ? "bg-indigo-600/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Secure Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-blue-300/60">
              Note: Guest login allowed for non-MSRIT users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
