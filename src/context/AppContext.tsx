import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Facility,
  Department,
  Doctor,
  AppointmentSlot,
  Appointment,
  DigitalToken,
  PatientFeedback,
  NotificationItem,
  UserRole,
  User,
  VisitPlan,
  DepartmentStatus,
  FacilityStatus,
  DoctorStatus,
  AppointmentStatus,
  ActiveView,
  PatientRecord,
  RegisteredPatient,
  AdminAccount
} from '../types';
import {
  INITIAL_FACILITIES,
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENT_SLOTS,
  INITIAL_FEEDBACK,
  INITIAL_USER_APPOINTMENTS,
  INITIAL_USER_TOKENS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

export interface UserLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export const LOCATION_PRESETS: UserLocation[] = [
  { name: 'Central District (Downtown)', latitude: 37.7749, longitude: -122.4194 },
  { name: 'West Parklands', latitude: 37.7695, longitude: -122.4467 },
  { name: 'North Heights', latitude: 37.7937, longitude: -122.4089 },
  { name: 'Bayside Point', latitude: 37.8012, longitude: -122.4255 },
  { name: 'Tech Park District', latitude: 37.7812, longitude: -122.3921 }
];

export interface SearchFilterState {
  query: string;
  locationArea: string;
  department: string;
  maxDistance: number; // in km
  openNowOnly: boolean;
  doctorAvailableOnly: boolean;
  appointmentAvailableOnly: boolean;
  tokenAvailableOnly: boolean;
  emergencyOnly: boolean;
  sortBy: 'distance' | 'earliest_appointment' | 'shortest_wait';
}

const DEFAULT_ADMIN_ACCOUNTS: Record<string, AdminAccount> = {
  'admin@citycare.com': {
    id: 'adm-citycare',
    email: 'admin@citycare.com',
    name: 'Dr. Evelyn Cross (CityCare Admin)',
    hospitalId: 'fac-1'
  },
  'admin@apollo.com': {
    id: 'adm-apollo',
    email: 'admin@apollo.com',
    name: 'Dr. Suresh Reddy (Apollo Admin)',
    hospitalId: 'fac-2'
  },
  'admin@sunshine.com': {
    id: 'adm-sunshine',
    email: 'admin@sunshine.com',
    name: 'Dr. Neha Sharma (Sunshine Admin)',
    hospitalId: 'fac-3'
  },
  'admin@kims.com': {
    id: 'adm-kims',
    email: 'admin@kims.com',
    name: 'Dr. Rajesh Rao (KIMS Admin)',
    hospitalId: 'fac-4'
  },
  'admin@continental.com': {
    id: 'adm-continental',
    email: 'admin@continental.com',
    name: 'Dr. Tariq Wilson (Continental Admin)',
    hospitalId: 'fac-5'
  }
};

const DEFAULT_REGISTERED_PATIENTS: RegisteredPatient[] = [
  {
    id: 'patient-demo-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 345-9876',
    createdAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'patient-test-1',
    name: 'Test Patient',
    email: 'test@gmail.com',
    phone: '+1 (555) 123-4567',
    createdAt: '2026-10-02T10:00:00Z'
  }
];

interface AppContextType {
  // Authentication & Role
  isAuthenticated: boolean;
  authRole: UserRole | null;
  currentUser: User | null;
  login: (role: UserRole, email: string, name?: string) => void;
  logout: () => void;
  loginWithGoogle: (role: UserRole) => void;
  registerPatient: (name: string, email: string, phone: string, password?: string) => { success: boolean; error?: string };
  registeredPatients: RegisteredPatient[];
  adminAccounts: Record<string, AdminAccount>;

  // View Routing
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  navigateTo: (view: ActiveView) => void;

  // Entities
  facilities: Facility[];
  departments: Department[];
  doctors: Doctor[];
  appointmentSlots: AppointmentSlot[];
  appointments: Appointment[];
  tokens: DigitalToken[];
  feedbackList: PatientFeedback[];
  notifications: NotificationItem[];
  patientsList: PatientRecord[];

  // Admin Facility Assignment & Management
  activeAdminFacilityId: string;
  setActiveAdminFacilityId: (id: string) => void;
  assignAdminHospital: (hospitalId: string) => void;
  updateHospitalSettings: (settings: Partial<Facility>) => void;

  // Selection & Active Hospital
  selectedFacility: Facility | null;
  setSelectedFacility: (facility: Facility | null) => void;
  selectHospital: (facilityId: string) => void;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  selectedDepartment: Department | null;
  setSelectedDepartment: (dept: Department | null) => void;
  lastConfirmedAppointment: Appointment | null;
  setLastConfirmedAppointment: (app: Appointment | null) => void;
  activeTokenForView: DigitalToken | null;
  setActiveTokenForView: (token: DigitalToken | null) => void;
  visitPlanData: VisitPlan | null;
  setVisitPlanData: (plan: VisitPlan | null) => void;

  // Comparison
  selectedFacilityIdsForComparison: string[];
  toggleCompareFacility: (facilityId: string) => void;
  clearComparison: () => void;

  // Location
  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;
  useCurrentDeviceLocation: () => void;
  calculateDistance: (lat: number, lon: number) => number;

  // Filters
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  resetFilters: () => void;

  // Patient Actions
  bookAppointment: (data: {
    facilityId: string;
    departmentId: string;
    doctorId: string;
    date: string;
    time: string;
    patientName: string;
    patientAge: number;
    patientPhone: string;
    patientGender?: string;
    reason?: string;
  }) => Appointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;

  generateToken: (facilityId: string, departmentId: string, doctorId?: string) => DigitalToken;
  cancelToken: (id: string) => void;

  submitFeedback: (feedback: Omit<PatientFeedback, 'id' | 'created_at'>) => void;
  generateVisitPlan: (facilityId: string, departmentId: string, doctorId?: string, appointmentTime?: string) => VisitPlan;

  // Admin Actions (Strictly Scoped to Admin's Assigned Hospital)
  callNextToken: (departmentId: string) => void;
  skipToken: (departmentId: string) => void;
  completeToken: (departmentId: string) => void;
  resetQueue: (departmentId: string) => void;
  updateDepartmentStatus: (departmentId: string, status: DepartmentStatus) => void;
  updateFacilityStatus: (facilityId: string, status: FacilityStatus) => void;
  toggleDoctorAvailability: (doctorId: string) => void;
  setDoctorStatus: (doctorId: string, status: DoctorStatus) => void;
  addDoctor: (doc: Omit<Doctor, 'id'>) => void;
  editDoctor: (doc: Doctor) => void;
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  editDepartment: (dept: Department) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;

  // Accessibility
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  simpleLanguage: boolean;
  setSimpleLanguage: (val: boolean) => void;

  // AI Assistant Modal
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  initialAIPrompt: string;
  setInitialAIPrompt: (prompt: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Haversine formula to compute distance in km
function computeHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

const DEFAULT_FILTERS: SearchFilterState = {
  query: '',
  locationArea: '',
  department: '',
  maxDistance: 25,
  openNowOnly: false,
  doctorAvailableOnly: false,
  appointmentAvailableOnly: false,
  tokenAvailableOnly: false,
  emergencyOnly: false,
  sortBy: 'distance'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication session persistence (First screen MUST be sign-in when app is opened)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('careconnect_auth_logged_in') === 'true';
  });

  const [authRole, setAuthRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('careconnect_role') as UserRole) || null;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('careconnect_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Registered Patients List for Case-Insensitive Duplicate Account Prevention
  const [registeredPatients, setRegisteredPatients] = useState<RegisteredPatient[]>(() => {
    const saved = localStorage.getItem('careconnect_registered_patients');
    return saved ? JSON.parse(saved) : DEFAULT_REGISTERED_PATIENTS;
  });

  // Admin Accounts Map for Assigned Hospital Mapping & Preserving
  const [adminAccounts, setAdminAccounts] = useState<Record<string, AdminAccount>>(() => {
    const saved = localStorage.getItem('careconnect_admin_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_ACCOUNTS;
  });

  // Active Admin Assigned Facility
  const [activeAdminFacilityId, setActiveAdminFacilityIdState] = useState<string>(() => {
    const saved = localStorage.getItem('careconnect_admin_facility_id');
    return saved || 'fac-1';
  });

  // Current view defaults to 'signin' if not authenticated!
  const [currentView, setCurrentViewState] = useState<ActiveView>(() => {
    const savedAuth = localStorage.getItem('careconnect_auth_logged_in') === 'true';
    const savedRole = localStorage.getItem('careconnect_role');
    if (!savedAuth) return 'signin';
    return savedRole === 'hospital_admin' ? 'admin-dashboard' : 'patient-dashboard';
  });

  // Entities with persistence
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem('careconnect_facilities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure citycare and apollo are present if older localstorage had older data
        if (parsed.length > 0 && parsed[0].name.includes('CityCare')) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_FACILITIES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('careconnect_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('careconnect_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlot[]>(() => {
    const saved = localStorage.getItem('careconnect_slots');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENT_SLOTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('careconnect_appointments');
    return saved ? JSON.parse(saved) : INITIAL_USER_APPOINTMENTS;
  });

  const [tokens, setTokens] = useState<DigitalToken[]>(() => {
    const saved = localStorage.getItem('careconnect_tokens');
    return saved ? JSON.parse(saved) : INITIAL_USER_TOKENS;
  });

  const [feedbackList, setFeedbackList] = useState<PatientFeedback[]>(() => {
    const saved = localStorage.getItem('careconnect_feedback');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('careconnect_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Selected State
  const [selectedFacility, setSelectedFacilityState] = useState<Facility | null>(() => {
    return facilities[0] || INITIAL_FACILITIES[0];
  });

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [lastConfirmedAppointment, setLastConfirmedAppointment] = useState<Appointment | null>(null);
  const [activeTokenForView, setActiveTokenForView] = useState<DigitalToken | null>(null);
  const [visitPlanData, setVisitPlanData] = useState<VisitPlan | null>(null);

  // Comparison List
  const [selectedFacilityIdsForComparison, setSelectedFacilityIdsForComparison] = useState<string[]>([]);

  // User Location
  const [userLocation, setUserLocation] = useState<UserLocation>(LOCATION_PRESETS[0]);

  // Search Filters
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);

  // Accessibility State
  const [largeText, setLargeText] = useState<boolean>(() => {
    return localStorage.getItem('careconnect_large_text') === 'true';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('careconnect_high_contrast') === 'true';
  });
  const [simpleLanguage, setSimpleLanguage] = useState<boolean>(() => {
    return localStorage.getItem('careconnect_simple_lang') === 'true';
  });

  // AI Assistant Modal
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [initialAIPrompt, setInitialAIPrompt] = useState('');

  // Persist auth and role
  useEffect(() => {
    localStorage.setItem('careconnect_auth_logged_in', String(isAuthenticated));
    if (authRole) localStorage.setItem('careconnect_role', authRole);
    else localStorage.removeItem('careconnect_role');
    if (currentUser) localStorage.setItem('careconnect_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('careconnect_current_user');
  }, [isAuthenticated, authRole, currentUser]);

  useEffect(() => {
    localStorage.setItem('careconnect_registered_patients', JSON.stringify(registeredPatients));
  }, [registeredPatients]);

  useEffect(() => {
    localStorage.setItem('careconnect_admin_accounts', JSON.stringify(adminAccounts));
  }, [adminAccounts]);

  useEffect(() => {
    localStorage.setItem('careconnect_admin_facility_id', activeAdminFacilityId);
  }, [activeAdminFacilityId]);

  // Persist entities
  useEffect(() => {
    localStorage.setItem('careconnect_facilities', JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem('careconnect_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('careconnect_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('careconnect_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('careconnect_tokens', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('careconnect_feedback', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('careconnect_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('careconnect_large_text', String(largeText));
    if (largeText) document.documentElement.classList.add('large-text');
    else document.documentElement.classList.remove('large-text');
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem('careconnect_high_contrast', String(highContrast));
    if (highContrast) document.documentElement.classList.add('high-contrast');
    else document.documentElement.classList.remove('high-contrast');
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('careconnect_simple_lang', String(simpleLanguage));
  }, [simpleLanguage]);

  // Active Admin Facility Setter with synchronization
  const setActiveAdminFacilityId = (id: string) => {
    setActiveAdminFacilityIdState(id);
    if (currentUser && currentUser.role === 'hospital_admin') {
      const updatedUser = { ...currentUser, currentFacilityId: id, assignedHospitalId: id };
      setCurrentUser(updatedUser);
      // Also update adminAccounts for this email
      const normEmail = currentUser.email.toLowerCase().trim();
      const updatedAccounts = {
        ...adminAccounts,
        [normEmail]: {
          id: currentUser.id,
          email: normEmail,
          name: currentUser.name,
          hospitalId: id
        }
      };
      setAdminAccounts(updatedAccounts);
    }
  };

  const setSelectedFacility = (fac: Facility | null) => {
    setSelectedFacilityState(fac);
  };

  // Explicit hospital selection helper for patient
  const selectHospital = (facilityId: string) => {
    const fac = facilities.find((f) => f.id === facilityId) || facilities[0];
    setSelectedFacilityState(fac);
    const firstDept = departments.find((d) => d.facility_id === facilityId);
    if (firstDept) setSelectedDepartment(firstDept);
    setSelectedDoctor(null);
  };

  // Protected View Navigation with Role Guarding
  const navigateTo = (view: ActiveView) => {
    if (!isAuthenticated && view !== 'signin' && view !== 'register') {
      setCurrentViewState('signin');
      return;
    }

    const isAdminView = view.startsWith('admin-');
    if (authRole === 'patient' && isAdminView) {
      // Access restricted for patient
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        user_id: currentUser?.id || 'patient-1',
        title: 'Access Restricted',
        message: 'Hospital Administrator credentials are required to view hospital management consoles.',
        read: false,
        created_at: new Date().toISOString(),
        type: 'alert'
      };
      setNotifications((prev) => [notif, ...prev]);
      setCurrentViewState('patient-dashboard');
      return;
    }

    setCurrentViewState(view);
  };

  const setCurrentView = (view: ActiveView) => {
    navigateTo(view);
  };

  // Patient Registration with Case-Insensitive Email Deduplication (TEST 1)
  const registerPatient = (
    name: string,
    email: string,
    phone: string,
    password?: string
  ): { success: boolean; error?: string } => {
    const normalizedEmail = email.toLowerCase().trim();

    // Case-insensitive duplicate check
    const existing = registeredPatients.find(
      (p) => p.email.toLowerCase().trim() === normalizedEmail
    );

    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists.'
      };
    }

    const newPatient: RegisteredPatient = {
      id: `patient-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      createdAt: new Date().toISOString()
    };

    const updatedPatients = [...registeredPatients, newPatient];
    setRegisteredPatients(updatedPatients);

    const newUser: User = {
      id: newPatient.id,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      role: 'patient'
    };

    setIsAuthenticated(true);
    setAuthRole('patient');
    setCurrentUser(newUser);
    setCurrentViewState('patient-dashboard');

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: newUser.id,
      title: 'Patient Account Created',
      message: `Account created successfully for ${name}. Explore nearby healthcare facilities or ask CareConnect AI.`,
      read: false,
      created_at: new Date().toISOString(),
      type: 'info'
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true };
  };

  // Authentication Handlers
  const login = (role: UserRole, email: string, name?: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    setIsAuthenticated(true);
    setAuthRole(role);

    if (role === 'hospital_admin') {
      const savedAccounts = { ...adminAccounts };
      let assignedHosp = savedAccounts[normalizedEmail]?.hospitalId;

      // Smart domain/keyword preset matching if not previously recorded
      if (!assignedHosp) {
        if (normalizedEmail.includes('citycare')) assignedHosp = 'fac-1';
        else if (normalizedEmail.includes('apollo')) assignedHosp = 'fac-2';
        else if (normalizedEmail.includes('sunshine')) assignedHosp = 'fac-3';
        else if (normalizedEmail.includes('kims')) assignedHosp = 'fac-4';
        else if (normalizedEmail.includes('continental')) assignedHosp = 'fac-5';
      }

      const assignedFac = assignedHosp ? facilities.find((f) => f.id === assignedHosp) : null;
      const adminName =
        name ||
        (assignedFac
          ? `Dr. Administrator (${assignedFac.name})`
          : 'Hospital Administrator');

      const adminUser: User = {
        id: `admin-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: adminName,
        email: normalizedEmail,
        phone: '+1 (555) 019-2831',
        role: 'hospital_admin',
        currentFacilityId: assignedHosp || undefined,
        assignedHospitalId: assignedHosp || undefined
      };

      setCurrentUser(adminUser);

      if (assignedHosp) {
        setActiveAdminFacilityIdState(assignedHosp);
        // Persist mapping
        savedAccounts[normalizedEmail] = {
          id: adminUser.id,
          email: normalizedEmail,
          name: adminUser.name,
          hospitalId: assignedHosp
        };
        setAdminAccounts(savedAccounts);
        setCurrentViewState('admin-dashboard');

        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          user_id: adminUser.id,
          title: 'Hospital Admin Console',
          message: `Logged in to manage ${assignedFac?.name}. Operations restricted to your assigned facility.`,
          read: false,
          created_at: new Date().toISOString(),
          type: 'info'
        };
        setNotifications((prev) => [notif, ...prev]);
      } else {
        // Unassigned admin: show professional Select Hospital screen (Requirement 11)
        setCurrentViewState('admin-select-hospital');
      }
    } else {
      // Patient Login
      const matched = registeredPatients.find(
        (p) => p.email.toLowerCase().trim() === normalizedEmail
      );

      const patientUser: User = {
        id: matched?.id || `patient-${Date.now()}`,
        name:
          name ||
          matched?.name ||
          (normalizedEmail.includes('john')
            ? 'John Doe'
            : normalizedEmail.split('@')[0]),
        email: normalizedEmail,
        phone: matched?.phone || '+1 (555) 345-9876',
        role: 'patient'
      };

      if (!matched) {
        const updated = [
          ...registeredPatients,
          {
            id: patientUser.id,
            name: patientUser.name,
            email: normalizedEmail,
            phone: patientUser.phone,
            createdAt: new Date().toISOString()
          }
        ];
        setRegisteredPatients(updated);
      }

      setCurrentUser(patientUser);
      setCurrentViewState('patient-dashboard');

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        user_id: patientUser.id,
        title: 'Welcome to CareConnect',
        message: `Welcome back, ${patientUser.name}. Find healthcare facilities, track real-time queues, and schedule appointments.`,
        read: false,
        created_at: new Date().toISOString(),
        type: 'info'
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Google Sign-In Demo Mode (Requirement 5)
  const loginWithGoogle = (role: UserRole) => {
    const googleEmail = 'amruthachadarampu1@gmail.com';
    if (role === 'hospital_admin') {
      login('hospital_admin', googleEmail, 'Amrutha C (Admin)');
    } else {
      login('patient', googleEmail, 'Amrutha C (Google Verified)');
    }
  };

  // Assign Admin Hospital (Requirement 11)
  const assignAdminHospital = (hospitalId: string) => {
    setActiveAdminFacilityIdState(hospitalId);
    const fac = facilities.find((f) => f.id === hospitalId);
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        currentFacilityId: hospitalId,
        assignedHospitalId: hospitalId,
        name: fac ? `Administrator (${fac.name})` : currentUser.name
      };
      setCurrentUser(updatedUser);

      const normEmail = currentUser.email.toLowerCase().trim();
      const updatedAccounts = {
        ...adminAccounts,
        [normEmail]: {
          id: currentUser.id,
          email: normEmail,
          name: updatedUser.name,
          hospitalId
        }
      };
      setAdminAccounts(updatedAccounts);
    }
    setCurrentViewState('admin-dashboard');
  };

  // Logout (TEST 9 & TEST 10)
  const logout = () => {
    setIsAuthenticated(false);
    setAuthRole(null);
    setCurrentUser(null);
    localStorage.removeItem('careconnect_auth_logged_in');
    localStorage.removeItem('careconnect_role');
    localStorage.removeItem('careconnect_current_user');
    setCurrentViewState('signin');
  };

  // Device Location
  const useCurrentDeviceLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            name: 'Current Device GPS Location',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        () => {
          setUserLocation(LOCATION_PRESETS[1]);
        }
      );
    } else {
      setUserLocation(LOCATION_PRESETS[1]);
    }
  };

  const calculateDistance = (lat: number, lon: number): number => {
    return computeHaversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      lat,
      lon
    );
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Toggle Facility Comparison
  const toggleCompareFacility = (facilityId: string) => {
    setSelectedFacilityIdsForComparison((prev) => {
      if (prev.includes(facilityId)) {
        return prev.filter((id) => id !== facilityId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, facilityId];
    });
  };

  const clearComparison = () => {
    setSelectedFacilityIdsForComparison([]);
  };

  // Patient Booking Action (TEST 4)
  const bookAppointment = (data: {
    facilityId: string;
    departmentId: string;
    doctorId: string;
    date: string;
    time: string;
    patientName: string;
    patientAge: number;
    patientPhone: string;
    patientGender?: string;
    reason?: string;
  }): Appointment => {
    const newAppointment: Appointment = {
      id: `CC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      patient_id: currentUser?.id || `patient-demo-1`,
      patient_name: data.patientName,
      patient_age: data.patientAge,
      patient_phone: data.patientPhone,
      patient_gender: data.patientGender || 'Not Specified',
      reason: data.reason || 'General Health Consultation',
      facility_id: data.facilityId,
      doctor_id: data.doctorId,
      department_id: data.departmentId,
      date: data.date,
      time: data.time,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Mark slot as booked if exists
    setAppointmentSlots((prev) =>
      prev.map((s) => {
        if (
          s.facility_id === data.facilityId &&
          s.doctor_id === data.doctorId &&
          s.date === data.date &&
          s.time === data.time
        ) {
          return { ...s, is_booked: true };
        }
        return s;
      })
    );

    // Notify user
    const fac = facilities.find((f) => f.id === data.facilityId);
    const doc = doctors.find((d) => d.id === data.doctorId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: currentUser?.id || 'patient-demo-1',
      title: 'Appointment Scheduled',
      message: `Your visit with ${doc?.name || 'Doctor'} at ${fac?.name || 'Facility'} on ${data.date} at ${data.time} has been confirmed.`,
      read: false,
      created_at: new Date().toISOString(),
      type: 'appointment'
    };
    setNotifications((prev) => [notif, ...prev]);

    setLastConfirmedAppointment(newAppointment);
    setCurrentViewState('confirmation');
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, date: newDate, time: newTime, status: 'rescheduled' } : a
      )
    );
  };

  // Generate Digital Queue Token
  const generateToken = (
    facilityId: string,
    departmentId: string,
    doctorId?: string
  ): DigitalToken => {
    const dept = departments.find((d) => d.id === departmentId);
    const tokenNumber = (dept ? dept.current_token : 40) + 1;
    const serving = dept ? dept.serving_token : 30;
    const peopleAhead = Math.max(0, tokenNumber - serving - 1);
    const waitTime = peopleAhead * (dept ? dept.avg_consult_minutes : 8);

    const newToken: DigitalToken = {
      id: `tok-${Date.now()}`,
      token_number: tokenNumber,
      patient_id: currentUser?.id || 'patient-demo-1',
      patient_name: currentUser?.name || 'John Doe',
      patient_phone: currentUser?.phone || '+1 (555) 345-9876',
      facility_id: facilityId,
      department_id: departmentId,
      doctor_id: doctorId,
      current_serving_at_creation: serving,
      status: 'WAITING',
      created_at: new Date().toISOString(),
      estimated_wait_minutes: waitTime
    };

    setTokens((prev) => [newToken, ...prev]);

    // Increment current token on department
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === departmentId) {
          return {
            ...d,
            current_token: tokenNumber,
            tokens_remaining: Math.max(0, d.tokens_remaining + 1)
          };
        }
        return d;
      })
    );

    const fac = facilities.find((f) => f.id === facilityId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: currentUser?.id || 'patient-demo-1',
      title: `Token #${tokenNumber} Generated`,
      message: `Your queue token #${tokenNumber} for ${dept?.name} at ${fac?.name} has been issued. Current serving is #${serving}.`,
      read: false,
      created_at: new Date().toISOString(),
      type: 'queue'
    };
    setNotifications((prev) => [notif, ...prev]);

    setActiveTokenForView(newToken);
    return newToken;
  };

  const cancelToken = (id: string) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'CANCELLED' } : t))
    );
  };

  // Submit Feedback & dynamically recalculate facility ratings
  const submitFeedback = (feedbackData: Omit<PatientFeedback, 'id' | 'created_at'>) => {
    const newFeedback: PatientFeedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const updatedFeedbackList = [newFeedback, ...feedbackList];
    setFeedbackList(updatedFeedbackList);

    const facilityReviews = updatedFeedbackList.filter(
      (f) => f.facility_id === feedbackData.facility_id
    );

    if (facilityReviews.length > 0) {
      const count = facilityReviews.length;
      const avgOverall =
        facilityReviews.reduce((sum, item) => sum + item.overall_rating, 0) / count;
      const avgWaiting =
        facilityReviews.reduce((sum, item) => sum + item.waiting_rating, 0) / count;
      const avgAppt =
        facilityReviews.reduce((sum, item) => sum + item.appointment_rating, 0) / count;
      const avgStaff =
        facilityReviews.reduce((sum, item) => sum + item.staff_rating, 0) / count;
      const avgFacility =
        facilityReviews.reduce((sum, item) => sum + item.facility_rating, 0) / count;

      setFacilities((prev) =>
        prev.map((fac) => {
          if (fac.id === feedbackData.facility_id) {
            return {
              ...fac,
              rating_summary: {
                overall: parseFloat(avgOverall.toFixed(1)),
                waiting: parseFloat(avgWaiting.toFixed(1)),
                appointment: parseFloat(avgAppt.toFixed(1)),
                staff: parseFloat(avgStaff.toFixed(1)),
                facility: parseFloat(avgFacility.toFixed(1)),
                review_count: count
              }
            };
          }
          return fac;
        })
      );
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: currentUser?.id || 'patient-demo-1',
      title: 'Feedback Recorded',
      message: 'Thank you for submitting your verified visit feedback. This directly improves facility transparency for other patients.',
      read: false,
      created_at: new Date().toISOString(),
      type: 'info'
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Smart Visit Planner
  const generateVisitPlan = (
    facilityId: string,
    departmentId: string,
    doctorId?: string,
    appointmentTime: string = '10:30 AM'
  ): VisitPlan => {
    const fac = facilities.find((f) => f.id === facilityId) || facilities[0];
    const dept = departments.find((d) => d.id === departmentId) || departments[0];
    const doc = doctors.find((d) => d.id === doctorId) || doctors[0];

    const dist = calculateDistance(fac.latitude, fac.longitude);
    const estTransitMin = Math.max(10, Math.round(dist * 3.5));
    const waitTime = dept.estimated_wait_minutes || 20;

    const [timeStr, period] = appointmentTime.split(' ');
    const [hours, minutes] = timeStr.split(':').map(Number);
    const apptMinutes = (hours % 12) * 60 + minutes + (period === 'PM' ? 12 * 60 : 0);

    const arrivalMin = apptMinutes - 15;
    const departMin = arrivalMin - estTransitMin;
    const completionMin = apptMinutes + 30;

    const formatMinutesToTime = (totalMin: number) => {
      let h = Math.floor(totalMin / 60) % 24;
      const m = totalMin % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${m < 10 ? '0' : ''}${m} ${ampm}`;
    };

    const plan: VisitPlan = {
      facility_id: fac.id,
      facility_name: fac.name,
      department_name: dept.name,
      doctor_name: doc.name,
      appointment_time: appointmentTime,
      recommended_arrival: formatMinutesToTime(arrivalMin),
      estimated_wait_minutes: waitTime,
      status: fac.status === 'open' ? 'Available' : 'Limited Hours',
      timeline: [
        {
          time: formatMinutesToTime(departMin),
          label: 'Depart from Your Location',
          description: `Estimated ~${estTransitMin} min travel time based on your location (${dist} km).`,
          is_estimate: true
        },
        {
          time: formatMinutesToTime(arrivalMin),
          label: 'Arrive at Facility',
          description: 'Arrive 15 minutes before slot for security desk & digital kiosk sign-in.',
          is_estimate: false
        },
        {
          time: formatMinutesToTime(arrivalMin + 5),
          label: 'Registration & Token Verification',
          description: 'Show your digital token or appointment ID at the counter.',
          is_estimate: false
        },
        {
          time: appointmentTime,
          label: 'Consultation with Doctor',
          description: `Consultation with ${doc.name} in ${dept.name} suite.`,
          is_estimate: false
        },
        {
          time: formatMinutesToTime(completionMin),
          label: 'Expected Completion & Pharmacy',
          description: 'Prescription counseling, follow-up scheduling, and exit.',
          is_estimate: true
        }
      ]
    };

    setVisitPlanData(plan);
    return plan;
  };

  // ==========================================
  // HOSPITAL ADMIN MUTATORS (TEST 6, 7, 8)
  // Strict Scope: ONLY activeAdminFacilityId
  // ==========================================

  const callNextToken = (departmentId: string) => {
    const targetDept = departments.find((d) => d.id === departmentId);
    // Security check: must match admin's hospital
    if (authRole === 'hospital_admin' && targetDept && targetDept.facility_id !== activeAdminFacilityId) {
      console.warn('Unauthorized: Cannot modify other hospital queues');
      return;
    }

    let nextNum = 0;
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === departmentId) {
          nextNum = dept.serving_token + 1;
          const remainingTokens = Math.max(0, dept.tokens_remaining - 1);
          const wait = Math.max(0, (dept.current_token - nextNum) * dept.avg_consult_minutes);
          return {
            ...dept,
            serving_token: nextNum,
            tokens_remaining: remainingTokens,
            estimated_wait_minutes: wait
          };
        }
        return dept;
      })
    );

    // Update matching token to CALLED status
    setTokens((prev) =>
      prev.map((t) => {
        if (t.department_id === departmentId && t.token_number === nextNum) {
          return { ...t, status: 'CALLED' };
        }
        return t;
      })
    );

    const dept = departments.find((d) => d.id === departmentId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: currentUser?.id || 'patient-demo-1',
      title: `Token #${nextNum} Called!`,
      message: `Token #${nextNum} is now being served in ${dept?.name || 'Department'}. Please proceed to Consultation Room.`,
      read: false,
      created_at: new Date().toISOString(),
      type: 'queue'
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const skipToken = (departmentId: string) => {
    const targetDept = departments.find((d) => d.id === departmentId);
    if (authRole === 'hospital_admin' && targetDept && targetDept.facility_id !== activeAdminFacilityId) {
      return;
    }
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === departmentId) {
          const nextNum = dept.serving_token + 1;
          return { ...dept, serving_token: nextNum };
        }
        return dept;
      })
    );
  };

  const completeToken = (departmentId: string) => {
    const targetDept = departments.find((d) => d.id === departmentId);
    if (authRole === 'hospital_admin' && targetDept && targetDept.facility_id !== activeAdminFacilityId) {
      return;
    }
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === departmentId) {
          const nextServing = dept.serving_token + 1;
          return { ...dept, serving_token: nextServing };
        }
        return dept;
      })
    );
  };

  const resetQueue = (departmentId: string) => {
    const targetDept = departments.find((d) => d.id === departmentId);
    if (authRole === 'hospital_admin' && targetDept && targetDept.facility_id !== activeAdminFacilityId) {
      return;
    }
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === departmentId) {
          return { ...dept, current_token: 0, serving_token: 0, tokens_remaining: 50 };
        }
        return dept;
      })
    );
  };

  const updateDepartmentStatus = (departmentId: string, status: DepartmentStatus) => {
    const targetDept = departments.find((d) => d.id === departmentId);
    if (authRole === 'hospital_admin' && targetDept && targetDept.facility_id !== activeAdminFacilityId) {
      return;
    }
    setDepartments((prev) =>
      prev.map((dept) => (dept.id === departmentId ? { ...dept, status } : dept))
    );
  };

  const updateFacilityStatus = (facilityId: string, status: FacilityStatus) => {
    if (authRole === 'hospital_admin' && facilityId !== activeAdminFacilityId) {
      console.warn('Unauthorized: Cannot modify other hospital status');
      return;
    }
    setFacilities((prev) =>
      prev.map((fac) => (fac.id === facilityId ? { ...fac, status, facilityStatus: status } : fac))
    );
  };

  const toggleDoctorAvailability = (doctorId: string) => {
    const targetDoc = doctors.find((d) => d.id === doctorId);
    if (authRole === 'hospital_admin' && targetDoc && targetDoc.facility_id !== activeAdminFacilityId) {
      console.warn('Unauthorized: Cannot modify doctors of other hospitals');
      return;
    }
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId) {
          const newStatus = doc.status === 'available' ? 'unavailable' : 'available';
          return { ...doc, status: newStatus };
        }
        return doc;
      })
    );
  };

  const setDoctorStatus = (doctorId: string, status: DoctorStatus) => {
    const targetDoc = doctors.find((d) => d.id === doctorId);
    if (authRole === 'hospital_admin' && targetDoc && targetDoc.facility_id !== activeAdminFacilityId) {
      return;
    }
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, status } : doc))
    );
  };

  const addDoctor = (doc: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doc,
      facility_id: activeAdminFacilityId, // Always enforce active hospital
      id: `doc-${Date.now()}`
    };
    setDoctors((prev) => [newDoc, ...prev]);
  };

  const editDoctor = (doc: Doctor) => {
    if (authRole === 'hospital_admin' && doc.facility_id !== activeAdminFacilityId) {
      return;
    }
    setDoctors((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
  };

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...dept,
      facility_id: activeAdminFacilityId, // Always enforce active hospital
      id: `dept-${Date.now()}`
    };
    setDepartments((prev) => [newDept, ...prev]);
  };

  const editDepartment = (dept: Department) => {
    if (authRole === 'hospital_admin' && dept.facility_id !== activeAdminFacilityId) {
      return;
    }
    setDepartments((prev) => prev.map((d) => (d.id === dept.id ? dept : d)));
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    const targetAppt = appointments.find((a) => a.id === id);
    if (authRole === 'hospital_admin' && targetAppt && targetAppt.facility_id !== activeAdminFacilityId) {
      console.warn('Unauthorized: Cannot modify appointments of other hospitals');
      return;
    }
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const updateHospitalSettings = (settings: Partial<Facility>) => {
    if (authRole !== 'hospital_admin' || !activeAdminFacilityId) return;
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === activeAdminFacilityId) {
          return {
            ...f,
            ...settings,
            name: settings.name || f.name,
            hospitalName: settings.name || f.name,
            address: settings.address || f.address,
            phone: settings.phone || f.phone,
            email: settings.email || f.email,
            opening_hours: settings.opening_hours || f.opening_hours,
            openingHours: settings.opening_hours || f.opening_hours,
            status: settings.status || f.status,
            facilityStatus: settings.status || f.status,
            is_emergency: settings.is_emergency !== undefined ? settings.is_emergency : f.is_emergency,
            emergencyStatus: settings.is_emergency !== undefined ? settings.is_emergency : f.is_emergency,
            appointmentSettings: {
              ...f.appointmentSettings,
              ...(settings.appointmentSettings || {})
            },
            queueSettings: {
              ...f.queueSettings,
              ...(settings.queueSettings || {})
            }
          };
        }
        return f;
      })
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Patient Records Aggregator for Hospital Admin (Requirement 18)
  const patientsList: PatientRecord[] = useMemo(() => {
    const scopedAppointments = appointments.filter(
      (a) => a.facility_id === activeAdminFacilityId
    );
    const scopedTokens = tokens.filter(
      (t) => t.facility_id === activeAdminFacilityId
    );

    const map = new Map<string, PatientRecord>();

    scopedAppointments.forEach((appt) => {
      const existing = map.get(appt.patient_name) || {
        id: appt.patient_id,
        name: appt.patient_name,
        phone: appt.patient_phone,
        appointmentCount: 0,
        tokenCount: 0,
        lastVisitDate: appt.date,
        latestDepartment: departments.find((d) => d.id === appt.department_id)?.name,
        latestDoctor: doctors.find((d) => d.id === appt.doctor_id)?.name,
        latestStatus: appt.status,
        facility_id: activeAdminFacilityId
      };
      existing.appointmentCount += 1;
      map.set(appt.patient_name, existing);
    });

    scopedTokens.forEach((tok) => {
      const existing = map.get(tok.patient_name) || {
        id: tok.patient_id,
        name: tok.patient_name,
        phone: tok.patient_phone,
        appointmentCount: 0,
        tokenCount: 0,
        lastVisitDate: new Date(tok.created_at).toLocaleDateString(),
        latestDepartment: departments.find((d) => d.id === tok.department_id)?.name,
        latestStatus: tok.status,
        facility_id: activeAdminFacilityId
      };
      existing.tokenCount += 1;
      map.set(tok.patient_name, existing);
    });

    return Array.from(map.values());
  }, [appointments, tokens, activeAdminFacilityId, departments, doctors]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        authRole,
        currentUser,
        login,
        logout,
        loginWithGoogle,
        registerPatient,
        registeredPatients,
        adminAccounts,
        currentView,
        setCurrentView,
        navigateTo,
        facilities,
        departments,
        doctors,
        appointmentSlots,
        appointments,
        tokens,
        feedbackList,
        notifications,
        patientsList,
        activeAdminFacilityId,
        setActiveAdminFacilityId,
        assignAdminHospital,
        updateHospitalSettings,
        selectedFacility,
        setSelectedFacility,
        selectHospital,
        selectedDoctor,
        setSelectedDoctor,
        selectedDepartment,
        setSelectedDepartment,
        lastConfirmedAppointment,
        setLastConfirmedAppointment,
        activeTokenForView,
        setActiveTokenForView,
        visitPlanData,
        setVisitPlanData,
        selectedFacilityIdsForComparison,
        toggleCompareFacility,
        clearComparison,
        userLocation,
        setUserLocation,
        useCurrentDeviceLocation,
        calculateDistance,
        filters,
        setFilters,
        resetFilters,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        generateToken,
        cancelToken,
        submitFeedback,
        generateVisitPlan,
        callNextToken,
        skipToken,
        completeToken,
        resetQueue,
        updateDepartmentStatus,
        updateFacilityStatus,
        toggleDoctorAvailability,
        setDoctorStatus,
        addDoctor,
        editDoctor,
        addDepartment,
        editDepartment,
        updateAppointmentStatus,
        markNotificationAsRead,
        clearAllNotifications,
        unreadNotificationsCount,
        largeText,
        setLargeText,
        highContrast,
        setHighContrast,
        simpleLanguage,
        setSimpleLanguage,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        initialAIPrompt,
        setInitialAIPrompt
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
