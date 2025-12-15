import React from "react";
import { MapPin, ShieldCheck, Star, Zap, IndianRupee } from "lucide-react";

const VenueCard = ({
  name,
  type,
  rating,
  safetyScore,
  distanceFromMSRIT, // Changed from 'distance'
  images,
  cost, // New Object
  aiSummary,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 max-w-sm group h-full flex flex-col">
      {/* Image Header */}
      <div className="h-48 relative overflow-hidden">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm">
          {type}
        </span>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded flex items-center backdrop-blur-sm">
          <IndianRupee size={10} className="mr-0.5" />
          {cost.min.toLocaleString()} / {cost.per}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {name}
          </h3>
          <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-bold border border-green-200">
            <Star size={14} className="mr-1 fill-green-700" /> {rating}
          </div>
        </div>

        <p className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1" /> {distanceFromMSRIT} km from
          MSRIT
        </p>

        {/* Feature 2: AI Summary */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-auto">
          <h4 className="flex items-center text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
            <Zap size={12} className="mr-1 text-amber-500 fill-amber-500" />
            Gemini AI Summary
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-2">
            "{aiSummary}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
