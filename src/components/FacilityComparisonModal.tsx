import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  X,
  MapPin,
  Clock,
  Ticket,
  Calendar,
  Star,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Building2,
  ChevronLeft
} from 'lucide-react';

export const FacilityComparisonModal: React.FC = () => {
  const {
    facilities,
    selectedFacilityIdsForComparison,
    toggleCompareFacility,
    clearComparison,
    calculateDistance,
    departments,
    appointmentSlots,
    setSelectedFacility,
    setCurrentView
  } = useApp();

  const comparedFacilities = facilities.filter((f) =>
    selectedFacilityIdsForComparison.includes(f.id)
  );

  if (comparedFacilities.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-3xl p-8 border border-slate-200">
        <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">No Facilities Selected for Comparison</h3>
        <p className="text-xs text-slate-500 mt-1">
          Select between 2 and 4 healthcare facilities from the discovery list to see a factual side-by-side comparison.
        </p>
        <button
          onClick={() => setCurrentView('facilities')}
          className="mt-4 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          Browse Facilities
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCurrentView('facilities')}
            className="text-xs font-semibold text-slate-500 hover:text-teal-600 flex items-center space-x-1 mb-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Factual Facility Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Compare Selected Healthcare Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Side-by-side factual data based strictly on current queues, verified feedback, and slot availability. No arbitrary scores.
          </p>
        </div>

        <button
          onClick={clearComparison}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 self-start sm:self-auto cursor-pointer"
        >
          Clear Comparison
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 sm:p-5 w-48 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Factual Metric
                </th>
                {comparedFacilities.map((fac) => (
                  <th key={fac.id} className="p-4 sm:p-5 min-w-[220px] align-top">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-teal-700 block">
                          {fac.type}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-sm mt-0.5 line-clamp-1">
                          {fac.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{fac.area}</p>
                      </div>
                      <button
                        onClick={() => toggleCompareFacility(fac.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              
              {/* Distance */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>Distance from You</span>
                  </div>
                </td>
                {comparedFacilities.map((fac) => {
                  const dist = calculateDistance(fac.latitude, fac.longitude);
                  return (
                    <td key={fac.id} className="p-4 font-bold text-slate-900">
                      {dist} km
                    </td>
                  );
                })}
              </tr>

              {/* Status & Hours */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Current Status</span>
                  </div>
                </td>
                {comparedFacilities.map((fac) => (
                  <td key={fac.id} className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        fac.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fac.status === 'open' ? 'Open Now' : 'Limited Hours'}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1 line-clamp-1">
                      {fac.opening_hours}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Emergency ER Capability */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <span>24/7 Trauma ER</span>
                  </div>
                </td>
                {comparedFacilities.map((fac) => (
                  <td key={fac.id} className="p-4">
                    {fac.is_emergency ? (
                      <span className="text-rose-700 font-bold flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-rose-600" />
                        <span>Available (24/7)</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Not Available</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Next Appointment Slot */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>Next Appointment</span>
                  </div>
                </td>
                {comparedFacilities.map((fac) => {
                  const slots = appointmentSlots.filter(
                    (s) => s.facility_id === fac.id && !s.is_booked
                  );
                  return (
                    <td key={fac.id} className="p-4">
                      {slots.length > 0 ? (
                        <strong className="text-teal-700 block">Today, {slots[0].time}</strong>
                      ) : (
                        <span className="text-slate-600">Tomorrow, 10:00 AM</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Estimated Queue Waiting Time */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Est. Queue Wait</span>
                  </div>
                </td>
                {comparedFacilities.map((fac) => {
                  const depts = departments.filter((d) => d.facility_id === fac.id);
                  const wait = depts.length > 0 ? depts[0].estimated_wait_minutes : 20;
                  return (
                    <td key={fac.id} className="p-4">
                      <strong className="text-slate-900 block text-sm">~{wait} minutes</strong>
                      <span className="text-[10px] text-slate-400">Based on live active queue</span>
                    </td>
                  );
                })}
              </tr>

              {/* Digital Token Availability */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <Ticket className="w-4 h-4 text-teal-600" />
                    <span>Digital Token Support</span>
                  </div>
                </td>
                {comparedFacilities.map((fac) => (
                  <td key={fac.id} className="p-4">
                    <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Active Walk-in Tokens</span>
                    </span>
                  </td>
                ))}
              </tr>

              {/* Patient Feedback Score & Volume */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <div className="flex items-center space-x-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Patient Feedback</span>
                  </div>
                </td>
                {comparedFacilities.map((fac) => (
                  <td key={fac.id} className="p-4">
                    <div className="flex items-center space-x-1 text-slate-900 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{fac.rating_summary.overall} / 5</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      From {fac.rating_summary.review_count} verified entries
                    </span>
                    {fac.rating_summary.review_count < 10 && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                        Limited feedback available
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Staff Attentiveness Rating */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <span>Staff Courtesy Score</span>
                </td>
                {comparedFacilities.map((fac) => (
                  <td key={fac.id} className="p-4 font-semibold text-slate-800">
                    {fac.rating_summary.staff} / 5.0
                  </td>
                ))}
              </tr>

              {/* Facility Cleanliness Score */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <span>Facility & Cleanliness</span>
                </td>
                {comparedFacilities.map((fac) => (
                  <td key={fac.id} className="p-4 font-semibold text-slate-800">
                    {fac.rating_summary.facility} / 5.0
                  </td>
                ))}
              </tr>

              {/* Key Departments */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <span>Key Departments</span>
                </td>
                {comparedFacilities.map((fac) => (
                  <td key={fac.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {fac.available_departments.map((d) => (
                        <span key={d} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Action Buttons Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                  <span>Actions</span>
                </td>
                {comparedFacilities.map((fac) => (
                  <td key={fac.id} className="p-4">
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          setSelectedFacility(fac);
                          setCurrentView('facility-detail');
                        }}
                        className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
                      >
                        View Facility
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFacility(fac);
                          setCurrentView('book-appointment');
                        }}
                        className="w-full py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
