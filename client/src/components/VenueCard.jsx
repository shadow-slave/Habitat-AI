import React from "react";
import { MapPin, ShieldCheck, Star, Zap } from "lucide-react";
// Make sure you ran: npm install lucide-react

const VenueCard = ({
  name,
  type,
  rating,
  safetyScore,
  distance,
  image,
  aiSummary,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 max-w-sm">
      {/* Image Header */}
      <div className="h-48 relative">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm">
          {type}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {name}
          </h3>
          <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-bold border border-green-200">
            <Star size={14} className="mr-1 fill-green-700" /> {rating}
          </div>
        </div>

        <p className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1" /> {distance} from MSRIT
        </p>

        {/* Feature 1: Safety Audit Display */}
        <div className="mb-4">
          <div
            className={`flex items-center w-fit px-3 py-1.5 rounded-lg text-xs font-bold ${
              safetyScore >= 4
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <ShieldCheck size={16} className="mr-2" />
            Safety Score: {safetyScore}/5
          </div>
        </div>

        {/* Feature 2: AI Summary (The "Wow" Factor) */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <h4 className="flex items-center text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
            <Zap size={12} className="mr-1 text-amber-500 fill-amber-500" />
            Gemini AI Summary
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            "{aiSummary}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
