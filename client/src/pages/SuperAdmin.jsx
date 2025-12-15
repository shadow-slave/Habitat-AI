import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  FileText,
  MapPin,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

const SuperAdmin = () => {
  // Mock Data: Listings waiting for approval
  const [pendingListings, setPendingListings] = useState([
    {
      id: 101,
      name: "Green View Residency",
      owner: "Mr. Suresh Kumar",
      type: "PG",
      address: "1st Main, Gokula",
      submitted: "2 hours ago",
      riskLevel: "Low", // Simulated AI Risk Check
    },
    {
      id: 102,
      name: "Happy Student Mess",
      owner: "Unknown",
      type: "Mess",
      address: "Near Gate 8",
      submitted: "5 hours ago",
      riskLevel: "High", // Simulated Risk
    },
  ]);

  const [approvedCount, setApprovedCount] = useState(142); // Fake total count

  const handleApprove = (id) => {
    // In real app: API call to update status
    setPendingListings(pendingListings.filter((item) => item.id !== id));
    setApprovedCount((prev) => prev + 1);
    alert("Listing Verified & Published to Live Site!");
  };

  const handleReject = (id) => {
    setPendingListings(pendingListings.filter((item) => item.id !== id));
    alert("Listing Rejected and Email sent to Owner.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Admin Control Center
            </h1>
            <p className="text-gray-500 mt-1">
              Verify incoming property requests
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200">
            <span className="block text-xs font-bold text-gray-400 uppercase">
              Live Listings
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {approvedCount}
            </span>
          </div>
        </div>

        {/* Pending List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
            <h3 className="font-bold text-gray-800 flex items-center">
              <ShieldAlert className="mr-2 text-orange-500" /> Pending Approvals
              <span className="ml-3 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                {pendingListings.length} waiting
              </span>
            </h3>
          </div>

          {pendingListings.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-200" />
              <p>All clear! No pending requests.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingListings.map((item) => (
                <div
                  key={item.id}
                  className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="text-lg font-bold text-gray-900 mr-3">
                        {item.name}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.type === "PG"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-orange-50 text-orange-600 border-orange-100"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:space-x-4">
                      <span className="flex items-center">
                        <UserIcon className="w-3 h-3 mr-1" /> {item.owner}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> {item.address}
                      </span>
                      <span className="text-gray-400">• {item.submitted}</span>
                    </div>
                  </div>

                  {/* Risk Badge (AI Feature) */}
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      item.riskLevel === "High"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-green-50 text-green-600 border-green-100"
                    }`}
                  >
                    {item.riskLevel} Risk
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition"
                    >
                      <XCircle size={16} className="mr-2" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition"
                    >
                      <CheckCircle size={16} className="mr-2" /> Verify &
                      Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Only authorized personnel with @msrit.edu admin privileges can
            access this page.
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple helper icon
const UserIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export default SuperAdmin;
