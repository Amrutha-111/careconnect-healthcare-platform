import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmergencyBanner: React.FC = () => {
  const { setFilters, setCurrentView } = useApp();

  const handleFindEmergency = () => {
    setFilters((prev) => ({
      ...prev,
      emergencyOnly: true,
      openNowOnly: true,
      sortBy: 'distance'
    }));
    setCurrentView('facilities');
  };

  return (
    <div className="bg-gradient-to-r from-rose-50 via-rose-100 to-amber-50 border-b border-rose-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-rose-950">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-600/30">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-extrabold text-rose-900 tracking-wide uppercase mr-2">
              Medical Emergency Notice:
            </span>
            <span className="text-rose-800">
              If this is a medical emergency, contact your local emergency service (e.g. 911 / 112) or go to the nearest emergency department immediately. CareConnect does not provide medical diagnosis.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleFindEmergency}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 mr-1.5" />
            <span>Find Nearby Emergency Facility</span>
          </button>
          <a
            href="tel:911"
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 transition-colors"
          >
            <PhoneCall className="w-4 h-4 mr-1 text-rose-600" />
            <span>Call 911</span>
          </a>
        </div>
      </div>
    </div>
  );
};
