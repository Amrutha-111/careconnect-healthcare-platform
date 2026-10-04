import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  X,
  MessageSquare
} from 'lucide-react';

interface Props {
  appointment: Appointment;
  onClose: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ appointment, onClose }) => {
  const { facilities, departments, submitFeedback } = useApp();

  const [overall, setOverall] = useState<number>(5);
  const [waiting, setWaiting] = useState<number>(4);
  const [appointmentRating, setAppointmentRating] = useState<number>(5);
  const [staffRating, setStaffRating] = useState<number>(5);
  const [facilityRating, setFacilityRating] = useState<number>(5);
  const [writtenFeedback, setWrittenFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const fac = facilities.find((f) => f.id === appointment.facility_id);
  const dept = departments.find((d) => d.id === appointment.department_id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitFeedback({
      patient_id: appointment.patient_id,
      patient_name: appointment.patient_name,
      facility_id: appointment.facility_id,
      department_id: appointment.department_id,
      visit_id: appointment.id,
      visit_date: appointment.date,
      overall_rating: overall,
      waiting_rating: waiting,
      appointment_rating: appointmentRating,
      staff_rating: staffRating,
      facility_rating: facilityRating,
      written_feedback: writtenFeedback.trim() || undefined
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const renderStars = (value: number, setter: (val: number) => void) => {
    return (
      <div className="flex items-center space-x-1 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-500">
              Your ratings have been verified and added to the hospital's aggregated patient score.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                Post-Visit Patient Review
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Rate Your Visit Experience
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Help other patients choose suitable care facilities based on authentic experiences.
              </p>
            </div>

            {/* Visit Details Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{fac?.name}</span>
                <span className="text-slate-500">{dept?.name} • Visit: {appointment.date}</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">{appointment.id}</span>
            </div>

            {/* Rating categories */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Overall Experience</span>
                  <span className="text-[10px] text-slate-400">General satisfaction</span>
                </div>
                {renderStars(overall, setOverall)}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Waiting Experience</span>
                  <span className="text-[10px] text-slate-400">Queue & token wait time</span>
                </div>
                {renderStars(waiting, setWaiting)}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Appointment Experience</span>
                  <span className="text-[10px] text-slate-400">Consultation quality & punctuality</span>
                </div>
                {renderStars(appointmentRating, setAppointmentRating)}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Staff Friendliness & Care</span>
                  <span className="text-[10px] text-slate-400">Front desk & nurse courtesy</span>
                </div>
                {renderStars(staffRating, setStaffRating)}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Facility & Cleanliness</span>
                  <span className="text-[10px] text-slate-400">Lounge hygiene & amenities</span>
                </div>
                {renderStars(facilityRating, setFacilityRating)}
              </div>
            </div>

            {/* Written comment */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Written Feedback (Optional)
              </label>
              <textarea
                rows={3}
                value={writtenFeedback}
                onChange={(e) => setWrittenFeedback(e.target.value)}
                placeholder="Share your experience (e.g. staff helpfulness, waiting time notes). Do not include personal medical details."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Your feedback will be anonymized when aggregated for public transparent reviews.
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 cursor-pointer"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
