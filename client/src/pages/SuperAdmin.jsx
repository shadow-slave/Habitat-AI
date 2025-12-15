import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  MapPin,
  ShieldAlert,
  Loader,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const SuperAdmin = () => {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedCount, setApprovedCount] = useState(0);

  // =============================
  // FETCH PENDING VENUES
  // =============================
  const fetchPendingListings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/venues/verify");

      if (res.data.isSuccess) {
        const mapped = res.data.venues.map((v) => ({
          id: v._id,
          name: v.name,
          owner: v.ownerName || "N/A",
          type: v.type,
          address: v.address?.street || "N/A",
          submitted: new Date(v.createdAt).toLocaleString(),
          rating: v.rating || 0,
        }));

        setPendingListings(mapped);
      }

      // mock count – replace later
      setApprovedCount(pendingListings?.length);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingListings();
  }, []);

  // =============================
  // APPROVE
  // =============================
  const handleApprove = async (e, id) => {
    e.stopPropagation();

    try {
      await axios.post(`/api/venues/verify/${id}`);
      setPendingListings((prev) => prev.filter((v) => v.id !== id));
      setApprovedCount((c) => c + 1);
      alert("Venue verified & published");
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  };

  // =============================
  // REJECT
  // =============================
  const handleReject = async (e, id) => {
    e.stopPropagation();

    try {
      await axios.delete(`/api/venues/verify/${id}`);
      setPendingListings((prev) => prev.filter((v) => v.id !== id));
      alert("Venue rejected");
    } catch (err) {
      console.error(err);
      alert("Rejection failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Admin Control Center
            </h1>
            <p className="text-gray-500 mt-1">
              Verify incoming venue submissions
            </p>
          </div>

          <div className="bg-white px-6 py-3 rounded-xl shadow border">
            <span className="block text-xs font-bold text-gray-400 uppercase">
              Live Listings
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {approvedCount}
            </span>
          </div>
        </div>

        {/* PENDING LIST */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-blue-50">
            <h3 className="font-bold text-gray-800 flex items-center">
              <ShieldAlert className="mr-2 text-orange-500" />
              Pending Approvals
              <span className="ml-3 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                {pendingListings.length} waiting
              </span>
            </h3>
          </div>

          {/* STATES */}
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <Loader className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-600" />
              Fetching pending requests...
            </div>
          ) : pendingListings.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-200" />
              All clear. No pending requests.
            </div>
          ) : (
            <div className="divide-y">
              {pendingListings.map((item) => (
                <div
                  key={item.id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50"
                >
                  {/* INFO */}
                  <Link
                    to={`/venue/${item.id}`}
                    className="flex-1 cursor-pointer"
                  >
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

                    <div className="text-sm text-gray-500 flex flex-wrap gap-4">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {item.owner}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.address}
                      </span>
                      <span className="text-gray-400">• {item.submitted}</span>
                    </div>
                  </Link>

                  {/* ACTIONS */}
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleReject(e, item.id)}
                      className="flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </button>

                    <button
                      onClick={(e) => handleApprove(e, item.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Verify & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Restricted to authorized MSRIT administrators
        </p>
      </div>
    </div>
  );
};

export default SuperAdmin;
