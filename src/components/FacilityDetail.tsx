import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Facility, Department, Doctor } from '../types';
import { InteractiveMapPlaceholder } from './InteractiveMapPlaceholder';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Users,
  Layers,
  Calendar,
  Ticket,
  ChevronLeft,
  Navigation,
  Compass,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface Props {
  facility: Facility;
  onBack?: () => void;
}

export const FacilityDetail: React.FC<Props> = ({ facility, onBack }) => {
  const {
    calculateDistance,
    departments,
    doctors,
    appointmentSlots,
    feedbackList,
    setCurrentView,
    setSelectedDepartment,
    setSelectedDoctor,
    selectedFacilityIdsForComparison,
    toggleCompareFacility,
    generateVisitPlan
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'doctors' | 'feedback'>('overview');

  const distance = calculateDistance(facility.latitude, facility.longitude);
  const facilityDepts = departments.filter((d) => d.facility_id === facility.id);
  const facilityDoctors = doctors.filter((d) => d.facility_id === facility.id);
  const facilityReviews = feedbackList.filter((fb) => fb.facility_id === facility.id);
  const isCompared = selectedFacilityIdsForComparison.includes(facility.id);

  // Available slots for this facility
  const openSlots = appointmentSlots.filter(
    (s) => s.facility_id === facility.id && !s.is_booked
  );

  return (
    <div className="space-y-6">
      
      {/* Top Back and Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack ? onBack : () => setCurrentView('facilities')}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Back to Healthcare Facilities</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleCompareFacility(facility.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isCompared
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isCompared ? '✓ Added to Comparison' : '+ Compare Facility'}
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={facility.image}
            alt={facility.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                facility.status === 'open'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-amber-500/90 text-white'
              }`}
            >
              {facility.status === 'open' ? 'Open Now' : 'Limited Hours'}
            </span>

            {facility.is_emergency && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600/95 text-white flex items-center shadow-md">
                <ShieldCheck className="w-4 h-4 mr-1" />
                24/7 Emergency & Trauma Center
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-md flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>{distance} km away</span>
          </div>

          {/* Bottom Title & Quick stats */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
                  {facility.type === 'hospital' ? 'Multispecialty Hospital' : facility.type === 'clinic' ? 'Community Health Clinic' : 'Specialty Center'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {facility.name}
                </h1>
                <p className="text-sm text-slate-200 mt-1 flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{facility.address}</span>
                </p>
              </div>

              {/* Aggregated Feedback score widget */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-3 rounded-2xl flex items-center space-x-3 shrink-0">
                <div className="text-center">
                  <div className="flex items-center text-amber-300 font-extrabold text-xl">
                    <Star className="w-5 h-5 fill-amber-300 text-amber-300 mr-1" />
                    <span>{facility.rating_summary.overall}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 block">Verified Score</span>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="text-xs text-slate-300">
                  <p><strong>{facility.rating_summary.review_count}</strong> patient entries</p>
                  <p className="text-[11px] text-teal-300">{facility.rating_summary.staff}/5 Staff Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info & Action Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Working Hours:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{facility.opening_hours}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Contact Phone:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{facility.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Doctors Available:</span>
              <span className="font-semibold text-teal-700 mt-0.5 block">{facilityDoctors.length} On Duty</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Next Appointment:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {openSlots.length > 0 ? `Today, ${openSlots[0].time}` : 'Tomorrow, 10:00 AM'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                if (facilityDepts.length > 0) setSelectedDepartment(facilityDepts[0]);
                setCurrentView('token-view');
              }}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-teal-800 bg-teal-100 hover:bg-teal-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Get Digital Token</span>
            </button>

            <button
              onClick={() => {
                if (facilityDepts.length > 0) setSelectedDepartment(facilityDepts[0]);
                setCurrentView('book-appointment');
              }}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] flex items-center space-x-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-200 px-6 flex space-x-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Location
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'departments'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Departments ({facilityDepts.length})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'doctors'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Doctors on Duty ({facilityDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'feedback'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient Feedback ({facility.rating_summary.review_count})
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Location */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Live Queue Status & Services */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Queue Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Today's Digital Queue Status</h3>
                    <p className="text-xs text-slate-500">Live token counters across facility departments</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Live Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {facilityDepts.map((d) => (
                  <div key={d.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{d.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          {d.status}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Currently Serving:</span>
                          <span className="font-bold text-slate-900">Token #{d.serving_token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Issued Tokens:</span>
                          <span className="font-semibold text-slate-900">#{d.current_token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Est. Wait:</span>
                          <span className="font-bold text-teal-700">~{d.estimated_wait_minutes} mins</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDepartment(d);
                        setCurrentView('token-view');
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer"
                    >
                      Get Token
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency & Specialized Services */}
            {facility.emergency_services && facility.emergency_services.length > 0 && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6">
                <div className="flex items-center space-x-2 text-rose-900">
                  <ShieldCheck className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-base">Emergency & Trauma Capabilities</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                  {facility.emergency_services.map((srv) => (
                    <div key={srv} className="flex items-center space-x-2 text-xs font-medium text-rose-800">
                      <CheckCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Plan My Visit Shortcut */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-teal-950 text-base">Smart Visit Planner</h3>
                <p className="text-xs text-teal-800 mt-1 max-w-lg">
                  Calculate the recommended departure time, check-in window, and estimated consultation timeline based on your location and real-time waiting times.
                </p>
              </div>
              <button
                onClick={() => {
                  if (facilityDepts.length > 0) {
                    generateVisitPlan(facility.id, facilityDepts[0].id, facilityDoctors[0]?.id);
                    setCurrentView('visit-planner');
                  }
                }}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-colors shrink-0 cursor-pointer"
              >
                Plan My Visit Timeline
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Map & Directions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Navigation className="w-4 h-4 text-teal-600" />
                  <span>Facility Location</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">{distance} km from you</span>
              </div>

              {/* Map Simulator */}
              <InteractiveMapPlaceholder
                facilities={[facility]}
                selectedFacilityId={facility.id}
                height="h-64"
              />

              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900">{facility.name}</p>
                <p>{facility.address}</p>
                <p className="text-slate-400">Coordinates: {facility.latitude}, {facility.longitude}</p>
              </div>

              <a
                href={`https://maps.google.com/?q=${facility.latitude},${facility.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Open in External Navigation</span>
              </a>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilityDepts.map((dept) => {
            const deptDocs = doctors.filter((doc) => doc.department_id === dept.id);
            return (
              <div key={dept.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{dept.name}</h3>
                      <span className="text-xs font-medium text-slate-500">{deptDocs.length} Doctors Assigned</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                      {dept.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Currently Serving:</span>
                      <strong className="text-slate-900">Token #{dept.serving_token}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Latest Token Issued:</span>
                      <strong className="text-slate-900">Token #{dept.current_token}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Wait:</span>
                      <strong className="text-teal-700">~{dept.estimated_wait_minutes} minutes</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setCurrentView('token-view');
                    }}
                    className="py-2 rounded-xl text-xs font-semibold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                  >
                    Get Token
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setCurrentView('book-appointment');
                    }}
                    className="py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-xs transition-colors"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Doctors */}
      {activeTab === 'doctors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilityDoctors.map((doc) => {
            const dept = departments.find((d) => d.id === doc.department_id);
            return (
              <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-100"
                    />
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{doc.name}</h4>
                      <p className="text-xs font-medium text-teal-700">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-500">{dept?.name} • {doc.experience_years} yrs exp</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {doc.bio}
                  </p>

                  <div className="mt-3 py-2 px-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Available:</span>
                      <span className="font-medium text-slate-800">{doc.available_days.slice(0, 3).join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Next Slot:</span>
                      <strong className="text-teal-700">{doc.next_available_slot}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Consultation:</span>
                      <span className="font-medium text-slate-800">${doc.consultation_fee} (In-person / Video)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      if (dept) setSelectedDepartment(dept);
                      setCurrentView('book-appointment');
                    }}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-colors"
                  >
                    Book with {doc.name.split(' ')[1] || doc.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: Patient Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          
          {/* Aggregated Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 flex flex-col justify-center items-center text-center p-4 bg-teal-50/50 rounded-xl border border-teal-100">
              <span className="text-4xl font-extrabold text-slate-900">{facility.rating_summary.overall}</span>
              <div className="flex items-center text-amber-400 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(facility.rating_summary.overall)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Based on <strong>{facility.rating_summary.review_count}</strong> patient feedback entries
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Appointment Experience</span>
                <span className="font-bold text-slate-900">{facility.rating_summary.appointment} / 5</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(facility.rating_summary.appointment / 5) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600 font-medium">Waiting Experience</span>
                <span className="font-bold text-slate-900">{facility.rating_summary.waiting} / 5</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(facility.rating_summary.waiting / 5) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600 font-medium">Staff Attentiveness & Care</span>
                <span className="font-bold text-slate-900">{facility.rating_summary.staff} / 5</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(facility.rating_summary.staff / 5) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600 font-medium">Facility & Cleanliness</span>
                <span className="font-bold text-slate-900">{facility.rating_summary.facility} / 5</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(facility.rating_summary.facility / 5) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Stored Patient Reviews */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Verified Patient Visit Feedback</h3>
            {facilityReviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No individual comments recorded yet.</p>
            ) : (
              facilityReviews.map((fb) => (
                <div key={fb.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.overall_rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="font-bold text-slate-900">{fb.overall_rating}.0</span>
                      <span className="text-slate-400">• Verified Visit: {fb.visit_date}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Visit ID: {fb.visit_id}</span>
                  </div>

                  {fb.written_feedback && (
                    <p className="text-slate-700 italic leading-relaxed pt-1">
                      "{fb.written_feedback}"
                    </p>
                  )}

                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-500 border-t border-slate-100">
                    <span>Waiting: {fb.waiting_rating}/5</span>
                    <span>• Staff: {fb.staff_rating}/5</span>
                    <span>• Cleanliness: {fb.facility_rating}/5</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
