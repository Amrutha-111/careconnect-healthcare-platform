import React, { useState } from 'react';
import { Facility } from '../types';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Compass, Layers, Info, Check, ShieldAlert } from 'lucide-react';

interface MapProps {
  facilities: Facility[];
  selectedFacilityId?: string;
  onSelectFacility?: (facility: Facility) => void;
  height?: string;
}

export const InteractiveMapPlaceholder: React.FC<MapProps> = ({
  facilities,
  selectedFacilityId,
  onSelectFacility,
  height = 'h-80 sm:h-96'
}) => {
  const { userLocation, calculateDistance, useCurrentDeviceLocation } = useApp();
  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null);

  // Map coordinates projection helper
  // Base center near downtown SF coordinates: lat: 37.7749, lon: -122.4194
  // We'll normalize coordinates to percentage positions inside SVG viewBox 0 0 1000 600
  const centerLat = userLocation.latitude || 37.7749;
  const centerLon = userLocation.longitude || -122.4194;
  const scale = 3200; // coordinate scaling

  const project = (lat: number, lon: number) => {
    const x = 500 + (lon - centerLon) * scale;
    const y = 300 - (lat - centerLat) * scale * 1.25;
    return {
      x: Math.max(40, Math.min(960, x)),
      y: Math.max(40, Math.min(560, y))
    };
  };

  const userPoint = { x: 500, y: 300 };

  return (
    <div className={`relative w-full ${height} bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner select-none`}>
      {/* SVG Vector Map Rendering */}
      <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="userGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Map Background with dark tech blueprint style */}
        <rect width="1000" height="600" fill="#0f172a" />
        <rect width="1000" height="600" fill="url(#grid)" />

        {/* Stylized city avenues & water body representations */}
        <path
          d="M 0 120 Q 300 240 600 180 T 1000 220"
          fill="none"
          stroke="#1e3a5f"
          strokeWidth="18"
          opacity="0.4"
        />
        <path
          d="M 150 0 Q 220 300 320 600"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          strokeDasharray="4 4"
        />
        <path
          d="M 750 0 Q 680 300 620 600"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          strokeDasharray="4 4"
        />
        <path
          d="M 0 350 L 1000 350"
          fill="none"
          stroke="#334155"
          strokeWidth="6"
        />
        <path
          d="M 0 480 Q 500 450 1000 520"
          fill="none"
          stroke="#1e3a5f"
          strokeWidth="12"
          opacity="0.3"
        />

        {/* Distance Range Circles from User Location */}
        <circle cx={userPoint.x} cy={userPoint.y} r="120" fill="none" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
        <text x={userPoint.x + 125} y={userPoint.y + 4} fill="#5eead4" fontSize="11" opacity="0.6" fontFamily="sans-serif">2 km radius</text>

        <circle cx={userPoint.x} cy={userPoint.y} r="220" fill="none" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
        <text x={userPoint.x + 225} y={userPoint.y + 4} fill="#5eead4" fontSize="11" opacity="0.6" fontFamily="sans-serif">5 km radius</text>

        {/* User Location Pulse and Pin */}
        <circle cx={userPoint.x} cy={userPoint.y} r="35" fill="url(#userGlow)" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx={userPoint.x} cy={userPoint.y} r="9" fill="#0d9488" stroke="#ffffff" strokeWidth="3" />
        <text x={userPoint.x} y={userPoint.y - 16} textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12" fontFamily="sans-serif">
          You are here
        </text>

        {/* Facility Markers */}
        {facilities.map((fac) => {
          const pt = project(fac.latitude, fac.longitude);
          const isSelected = selectedFacilityId === fac.id;
          const isHovered = hoveredFacility?.id === fac.id;
          const isEmerg = fac.is_emergency;

          return (
            <g
              key={fac.id}
              className="cursor-pointer transition-transform duration-200"
              onClick={() => onSelectFacility && onSelectFacility(fac)}
              onMouseEnter={() => setHoveredFacility(fac)}
              onMouseLeave={() => setHoveredFacility(null)}
              transform={`translate(${pt.x}, ${pt.y})`}
            >
              {/* Connector line to user when selected */}
              {isSelected && (
                <line
                  x1={0}
                  y1={0}
                  x2={userPoint.x - pt.x}
                  y2={userPoint.y - pt.y}
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
              )}

              {/* Marker Halo */}
              <circle
                r={isSelected || isHovered ? 22 : 16}
                fill={isEmerg ? '#e11d48' : '#0f766e'}
                opacity={isSelected || isHovered ? 0.35 : 0.2}
              />

              {/* Pin Base */}
              <circle
                r={isSelected || isHovered ? 12 : 9}
                fill={isEmerg ? '#f43f5e' : isSelected ? '#14b8a6' : '#2dd4bf'}
                stroke="#ffffff"
                strokeWidth="2.5"
              />

              {/* Pin Icon Label */}
              <text
                y={22}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize={isSelected || isHovered ? "11" : "10"}
                fontWeight={isSelected ? "bold" : "600"}
                className="drop-shadow-md select-none pointer-events-none"
              >
                {fac.name.length > 20 ? fac.name.slice(0, 18) + '...' : fac.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Map Controls */}
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center space-x-2">
        <Navigation className="w-3.5 h-3.5 text-teal-400" />
        <span>Centered near: <strong className="text-white">{userLocation.name}</strong></span>
      </div>

      <div className="absolute top-3 right-3 flex items-center space-x-2">
        <button
          onClick={useCurrentDeviceLocation}
          className="bg-slate-800/90 hover:bg-slate-700 text-white p-2 rounded-xl border border-slate-700 text-xs shadow-md transition-all flex items-center space-x-1.5"
          title="Recenter on My Location"
        >
          <Compass className="w-4 h-4 text-teal-400" />
          <span className="hidden sm:inline">Recenter GPS</span>
        </button>
      </div>

      {/* Legend / Info Strip */}
      <div className="absolute bottom-3 left-3 flex items-center space-x-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
          <span>Hospital/Clinic</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>24/7 Trauma ER</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 ring-2 ring-white" />
          <span>You</span>
        </div>
      </div>

      {/* Popover on Hover */}
      {hoveredFacility && (
        <div className="absolute top-12 right-3 max-w-xs bg-white text-slate-900 rounded-xl shadow-2xl p-3 border border-slate-200 text-xs z-30 animate-in fade-in">
          <div className="flex items-start justify-between">
            <span className="font-bold text-slate-900 text-sm line-clamp-1">{hoveredFacility.name}</span>
            {hoveredFacility.is_emergency && (
              <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                24/7 ER
              </span>
            )}
          </div>
          <p className="text-slate-500 mt-0.5">{hoveredFacility.address}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 font-medium">
            <span className="text-teal-700 font-semibold">
              {calculateDistance(hoveredFacility.latitude, hoveredFacility.longitude)} km away
            </span>
            <span className="text-slate-600">
              {hoveredFacility.rating_summary.overall} ★ ({hoveredFacility.rating_summary.review_count})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
