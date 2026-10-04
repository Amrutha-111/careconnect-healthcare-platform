export type UserRole = 'patient' | 'hospital_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  currentFacilityId?: string; // Assigned hospital ID for hospital admin
  assignedHospitalId?: string;
  isGoogleAuth?: boolean;
}

export interface RegisteredPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  hospitalId: string; // The single assigned hospital this admin manages
}

export type ActiveView =
  | 'signin'
  | 'register'
  | 'patient-dashboard'
  | 'home'
  | 'facilities'
  | 'facility-detail'
  | 'doctors'
  | 'departments'
  | 'book-appointment'
  | 'confirmation'
  | 'my-visits'
  | 'token-view'
  | 'visit-planner'
  | 'compare'
  | 'emergency'
  | 'admin-dashboard'
  | 'admin-select-hospital'
  | 'admin-appointments'
  | 'admin-patients'
  | 'admin-doctors'
  | 'admin-departments'
  | 'admin-queue'
  | 'admin-facility-status'
  | 'admin-feedback'
  | 'admin-settings';

export type FacilityStatus = 'open' | 'closed' | 'busy' | 'emergency' | 'temporarily_unavailable';

export interface FeedbackRatingSummary {
  overall: number;
  waiting: number;
  appointment: number;
  staff: number;
  facility: number;
  review_count: number;
}

export interface AppointmentSettings {
  slotDurationMinutes: number;
  advanceBookingDays: number;
  autoConfirm: boolean;
  workingDays: string[];
}

export interface QueueSettings {
  tokenPrefix: string;
  maxDailyTokens: number;
  allowOnlineTokens: boolean;
  isPaused: boolean;
}

export interface Facility {
  id: string; // hospitalId
  hospitalId?: string;
  name: string; // hospitalName
  hospitalName?: string;
  type: 'hospital' | 'clinic' | 'specialty_center';
  address: string;
  city: string;
  state: string;
  area: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  description: string;
  opening_hours: string;
  openingHours?: string;
  status: FacilityStatus;
  facilityStatus?: FacilityStatus;
  is_emergency: boolean;
  emergencyStatus?: boolean;
  emergency_services?: string[];
  services: string[];
  image: string;
  rating_summary: FeedbackRatingSummary;
  available_departments: string[];
  departments?: string[];
  appointmentSettings: AppointmentSettings;
  queueSettings: QueueSettings;
}

export type DepartmentStatus = 'available' | 'busy' | 'closed';

export interface Department {
  id: string;
  facility_id: string; // hospitalId
  name: string;
  description: string;
  status: DepartmentStatus;
  current_token: number;
  serving_token: number;
  tokens_remaining: number;
  avg_consult_minutes: number;
  estimated_wait_minutes: number;
}

export type ConsultationMode = 'in_person' | 'video' | 'both';
export type DoctorStatus = 'available' | 'on_break' | 'unavailable' | 'off_duty';

export interface Doctor {
  id: string;
  facility_id: string; // hospitalId
  department_id: string;
  name: string;
  specialization: string;
  experience_years: number;
  available_days: string[];
  consultation_mode: ConsultationMode;
  status: DoctorStatus;
  next_available_slot: string; // e.g. "Today, 10:30 AM"
  avatar: string;
  bio: string;
  consultation_fee: number;
  qualifications: string;
}

export interface AppointmentSlot {
  id: string;
  doctor_id: string;
  facility_id: string;
  department_id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  is_booked: boolean;
}

export type AppointmentStatus = 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';

export interface Appointment {
  id: string; // e.g. "CC-2026-10452"
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_phone: string;
  patient_gender?: string;
  reason?: string;
  facility_id: string; // hospitalId
  doctor_id: string;
  department_id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  token_number?: number;
  created_at: string;
}

export type TokenStatus = 'WAITING' | 'CALLED' | 'COMPLETED' | 'CANCELLED';

export interface DigitalToken {
  id: string;
  token_number: number;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  facility_id: string; // hospitalId
  department_id: string;
  doctor_id?: string;
  current_serving_at_creation: number;
  status: TokenStatus;
  created_at: string;
  estimated_wait_minutes: number;
}

export interface PatientFeedback {
  id: string;
  patient_id: string;
  patient_name?: string; // Anonymized when displayed to public
  facility_id: string; // hospitalId
  department_id: string;
  doctor_id?: string;
  visit_id: string;
  visit_date: string;
  overall_rating: number; // 1-5
  waiting_rating: number; // 1-5
  appointment_rating: number; // 1-5
  staff_rating: number; // 1-5
  facility_rating: number; // 1-5
  written_feedback?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type: 'info' | 'queue' | 'appointment' | 'alert';
}

export interface VisitPlan {
  facility_id: string;
  facility_name: string;
  department_name: string;
  doctor_name: string;
  appointment_time: string;
  recommended_arrival: string;
  estimated_wait_minutes: number;
  status: string;
  timeline: Array<{
    time: string;
    label: string;
    description: string;
    is_estimate?: boolean;
  }>;
}

export interface AIMatchedFacility {
  facility: Facility;
  department_name: string;
  distance_km: number;
  current_status: string;
  next_appointment: string;
  estimated_wait_minutes: number;
  token_available: boolean;
  feedback_summary: {
    overall: number;
    appointment: number;
    waiting: number;
    staff: number;
    facility: number;
    review_count: number;
    is_limited: boolean;
  };
  matching_reasons: string[];
  feedback_themes: {
    positive: string[];
    negative_or_mixed: string[];
  };
}

export interface AIRecommendationResponse {
  patient_request_summary: string;
  criteria_used: string;
  matched_facilities: AIMatchedFacility[];
  data_limitations: string;
  is_emergency_warning: boolean;
}

export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  appointmentCount: number;
  tokenCount: number;
  lastVisitDate?: string;
  latestDepartment?: string;
  latestDoctor?: string;
  latestStatus?: string;
  facility_id?: string;
}
