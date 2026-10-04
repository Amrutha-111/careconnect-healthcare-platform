import {
  Facility,
  Department,
  Doctor,
  AppointmentSlot,
  PatientFeedback,
  DigitalToken,
  Appointment,
  NotificationItem
} from '../types';

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    hospitalId: 'fac-1',
    name: 'CityCare Multi-Speciality Hospital',
    hospitalName: 'CityCare Multi-Speciality Hospital',
    type: 'hospital',
    address: '104 Healthcare Boulevard, Central District',
    area: 'Central District',
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7749,
    longitude: -122.4194,
    phone: '+1 (555) 234-8901',
    email: 'info@citycarehealth.org',
    description: 'Premier tertiary healthcare center with advanced emergency trauma, digital queue management, robotic surgery, and comprehensive multispecialty departments.',
    opening_hours: '24 Hours Open (Emergency & Inpatient) / OPD: 08:00 AM - 08:00 PM',
    openingHours: '24 Hours Open (Emergency & Inpatient) / OPD: 08:00 AM - 08:00 PM',
    status: 'open',
    facilityStatus: 'open',
    is_emergency: true,
    emergencyStatus: true,
    emergency_services: ['24/7 Level 1 Trauma', 'Cardiac Cath Lab', 'Emergency Ambulance Dispatch', 'Critical Care ICU'],
    services: ['24/7 Trauma Emergency', 'Inpatient Care', 'Outpatient OPD', 'Cath Lab', 'Pathology Lab', 'Pharmacy', 'Digital Tokens'],
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating_summary: {
      overall: 4.5,
      waiting: 4.1,
      appointment: 4.6,
      staff: 4.7,
      facility: 4.8,
      review_count: 86
    },
    available_departments: ['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'ENT', 'Neurology'],
    departments: ['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'ENT', 'Neurology'],
    appointmentSettings: {
      slotDurationMinutes: 15,
      advanceBookingDays: 14,
      autoConfirm: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    queueSettings: {
      tokenPrefix: 'CC-',
      maxDailyTokens: 120,
      allowOnlineTokens: true,
      isPaused: false
    }
  },
  {
    id: 'fac-2',
    hospitalId: 'fac-2',
    name: 'Apollo Hospital',
    hospitalName: 'Apollo Hospital',
    type: 'hospital',
    address: '250 Apollo Way, North Heights',
    area: 'North Heights',
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7937,
    longitude: -122.4089,
    phone: '+1 (555) 456-7890',
    email: 'contact@apollohospital.org',
    description: 'Internationally accredited super-speciality hospital known for clinical excellence, organ transplant centers, oncology wings, and quick outpatient consultation.',
    opening_hours: '24 Hours Emergency / OPD: 08:30 AM - 07:30 PM',
    openingHours: '24 Hours Emergency / OPD: 08:30 AM - 07:30 PM',
    status: 'open',
    facilityStatus: 'open',
    is_emergency: true,
    emergencyStatus: true,
    emergency_services: ['24/7 Stroke & Trauma Care', 'Pediatric Urgent Care', 'Burn Care Wing', 'Cardiac ICU'],
    services: ['24/7 Emergency Care', 'Specialist OPD', 'Digital Queue Tokens', 'Blood Bank', 'Advanced MRI/CT', 'Pharmacy'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating_summary: {
      overall: 4.7,
      waiting: 4.5,
      appointment: 4.8,
      staff: 4.9,
      facility: 4.7,
      review_count: 114
    },
    available_departments: ['Cardiology', 'General Medicine', 'Dermatology', 'Pediatrics', 'Dental', 'Orthopedics'],
    departments: ['Cardiology', 'General Medicine', 'Dermatology', 'Pediatrics', 'Dental', 'Orthopedics'],
    appointmentSettings: {
      slotDurationMinutes: 15,
      advanceBookingDays: 14,
      autoConfirm: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    queueSettings: {
      tokenPrefix: 'AP-',
      maxDailyTokens: 150,
      allowOnlineTokens: true,
      isPaused: false
    }
  },
  {
    id: 'fac-3',
    hospitalId: 'fac-3',
    name: 'Sunshine Hospital',
    hospitalName: 'Sunshine Hospital',
    type: 'hospital',
    address: '420 Sunshine Avenue, West Parklands',
    area: 'West Parklands',
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7695,
    longitude: -122.4467,
    phone: '+1 (555) 678-1234',
    email: 'care@sunshinehospital.com',
    description: 'State-of-the-art community and multispeciality hospital with premier orthopedics, cardiology, pediatric wards, and modern patient lounges.',
    opening_hours: '24 Hours Open / OPD: 09:00 AM - 08:00 PM',
    openingHours: '24 Hours Open / OPD: 09:00 AM - 08:00 PM',
    status: 'open',
    facilityStatus: 'open',
    is_emergency: true,
    emergencyStatus: true,
    emergency_services: ['24/7 Emergency Wing', 'Ambulance Hotline', 'Joint Trauma Care'],
    services: ['24/7 Emergency Care', 'Joint Replacement Center', 'Outpatient OPD', 'Digital Tokens', 'Diagnostics Lab'],
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    rating_summary: {
      overall: 4.6,
      waiting: 4.3,
      appointment: 4.7,
      staff: 4.8,
      facility: 4.6,
      review_count: 72
    },
    available_departments: ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Dermatology'],
    departments: ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Dermatology'],
    appointmentSettings: {
      slotDurationMinutes: 20,
      advanceBookingDays: 10,
      autoConfirm: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    queueSettings: {
      tokenPrefix: 'SH-',
      maxDailyTokens: 100,
      allowOnlineTokens: true,
      isPaused: false
    }
  },
  {
    id: 'fac-4',
    hospitalId: 'fac-4',
    name: 'KIMS Hospital',
    hospitalName: 'KIMS Hospital',
    type: 'hospital',
    address: '88 Harbor Boulevard, Bayside Point',
    area: 'Bayside Point',
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.8012,
    longitude: -122.4255,
    phone: '+1 (555) 890-2345',
    email: 'desk@kimshospital.org',
    description: 'Renowned institute of medical sciences featuring specialized oncology, dermatology, general surgery, and rapid emergency intervention units.',
    opening_hours: '24 Hours Emergency / OPD: 08:00 AM - 07:00 PM',
    openingHours: '24 Hours Emergency / OPD: 08:00 AM - 07:00 PM',
    status: 'open',
    facilityStatus: 'open',
    is_emergency: true,
    emergencyStatus: true,
    emergency_services: ['24/7 Emergency & ICU', 'Acute Stroke Care', 'Cardiac Emergency'],
    services: ['24/7 Emergency', 'Daycare Surgery', 'Clinical OPD', 'Pathology', 'Pharmacy', 'Digital Queue'],
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    rating_summary: {
      overall: 4.4,
      waiting: 4.2,
      appointment: 4.5,
      staff: 4.6,
      facility: 4.4,
      review_count: 58
    },
    available_departments: ['General Medicine', 'Dermatology', 'Cardiology', 'ENT', 'Pediatrics'],
    departments: ['General Medicine', 'Dermatology', 'Cardiology', 'ENT', 'Pediatrics'],
    appointmentSettings: {
      slotDurationMinutes: 15,
      advanceBookingDays: 14,
      autoConfirm: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    queueSettings: {
      tokenPrefix: 'KIMS-',
      maxDailyTokens: 110,
      allowOnlineTokens: true,
      isPaused: false
    }
  },
  {
    id: 'fac-5',
    hospitalId: 'fac-5',
    name: 'Continental Hospital',
    hospitalName: 'Continental Hospital',
    type: 'hospital',
    address: '330 Continental Plaza, Tech Park District',
    area: 'Tech Park District',
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7812,
    longitude: -122.3921,
    phone: '+1 (555) 345-6789',
    email: 'info@continentalhospital.com',
    description: 'Advanced tertiary healthcare facility built with global standards, cutting-edge neurosurgery suites, cardiology cath labs, and digitized patient management.',
    opening_hours: '24 Hours Open / OPD: 08:30 AM - 08:30 PM',
    openingHours: '24 Hours Open / OPD: 08:30 AM - 08:30 PM',
    status: 'open',
    facilityStatus: 'open',
    is_emergency: true,
    emergencyStatus: true,
    emergency_services: ['24/7 Level 1 Trauma Care', 'Neurotrauma Response', 'Emergency Pediatric Unit'],
    services: ['24/7 Trauma Emergency', 'Neuroscience Center', 'Cardiology', 'Outpatient OPD', 'Tokens & Online Queue'],
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    rating_summary: {
      overall: 4.6,
      waiting: 4.4,
      appointment: 4.7,
      staff: 4.8,
      facility: 4.9,
      review_count: 94
    },
    available_departments: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine', 'Pediatrics'],
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine', 'Pediatrics'],
    appointmentSettings: {
      slotDurationMinutes: 15,
      advanceBookingDays: 14,
      autoConfirm: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    queueSettings: {
      tokenPrefix: 'CH-',
      maxDailyTokens: 130,
      allowOnlineTokens: true,
      isPaused: false
    }
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  // 1. CityCare Multi-Speciality Hospital (fac-1)
  {
    id: 'dept-1-cardio',
    facility_id: 'fac-1',
    name: 'Cardiology',
    description: 'Comprehensive adult & pediatric heart care, echocardiography, ECG, and catheterization laboratory.',
    status: 'available',
    current_token: 24,
    serving_token: 18,
    tokens_remaining: 12,
    avg_consult_minutes: 8,
    estimated_wait_minutes: 35
  },
  {
    id: 'dept-1-derma',
    facility_id: 'fac-1',
    name: 'Dermatology',
    description: 'Clinical skin treatments, acne management, allergy patching, and minor cutaneous procedures.',
    status: 'available',
    current_token: 47,
    serving_token: 42,
    tokens_remaining: 15,
    avg_consult_minutes: 5,
    estimated_wait_minutes: 25
  },
  {
    id: 'dept-1-genmed',
    facility_id: 'fac-1',
    name: 'General Medicine',
    description: 'Internal medicine, routine health checkups, chronic disease management, and primary consultations.',
    status: 'available',
    current_token: 62,
    serving_token: 58,
    tokens_remaining: 20,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 24
  },
  {
    id: 'dept-1-ped',
    facility_id: 'fac-1',
    name: 'Pediatrics',
    description: 'Child health, immunization, growth tracking, and pediatric acute care.',
    status: 'available',
    current_token: 31,
    serving_token: 28,
    tokens_remaining: 14,
    avg_consult_minutes: 7,
    estimated_wait_minutes: 21
  },
  {
    id: 'dept-1-ortho',
    facility_id: 'fac-1',
    name: 'Orthopedics',
    description: 'Bone, joint, sports injury, fracture management, and musculoskeletal therapy.',
    status: 'available',
    current_token: 19,
    serving_token: 15,
    tokens_remaining: 8,
    avg_consult_minutes: 10,
    estimated_wait_minutes: 40
  },
  {
    id: 'dept-1-ent',
    facility_id: 'fac-1',
    name: 'ENT',
    description: 'Ear, nose, throat, audiology, sinus care, and vocal cord evaluation.',
    status: 'available',
    current_token: 15,
    serving_token: 12,
    tokens_remaining: 10,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 18
  },
  {
    id: 'dept-1-neuro',
    facility_id: 'fac-1',
    name: 'Neurology',
    description: 'Brain, nerve, migraine, epilepsy, and neuro-diagnostic consultation.',
    status: 'available',
    current_token: 11,
    serving_token: 9,
    tokens_remaining: 6,
    avg_consult_minutes: 12,
    estimated_wait_minutes: 24
  },

  // 2. Apollo Hospital (fac-2)
  {
    id: 'dept-2-cardio',
    facility_id: 'fac-2',
    name: 'Cardiology',
    description: 'Super-specialized cardiology, interventional stent management, and 24/7 cardiac monitoring.',
    status: 'available',
    current_token: 32,
    serving_token: 27,
    tokens_remaining: 12,
    avg_consult_minutes: 8,
    estimated_wait_minutes: 40
  },
  {
    id: 'dept-2-derma',
    facility_id: 'fac-2',
    name: 'Dermatology',
    description: 'Cosmetic & clinical dermatology, eczema, psoriasis, and skin diagnostics.',
    status: 'available',
    current_token: 16,
    serving_token: 14,
    tokens_remaining: 10,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 12
  },
  {
    id: 'dept-2-genmed',
    facility_id: 'fac-2',
    name: 'General Medicine',
    description: 'Family health, blood pressure checkups, diabetes consultations, and acute viral care.',
    status: 'available',
    current_token: 29,
    serving_token: 26,
    tokens_remaining: 18,
    avg_consult_minutes: 5,
    estimated_wait_minutes: 15
  },
  {
    id: 'dept-2-ped',
    facility_id: 'fac-2',
    name: 'Pediatrics',
    description: 'Well-child visits, developmental screening, and pediatric vaccinations.',
    status: 'available',
    current_token: 14,
    serving_token: 12,
    tokens_remaining: 8,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 12
  },
  {
    id: 'dept-2-dental',
    facility_id: 'fac-2',
    name: 'Dental',
    description: 'General dentistry, cleanings, root canal therapy, and cavity restorations.',
    status: 'available',
    current_token: 8,
    serving_token: 6,
    tokens_remaining: 6,
    avg_consult_minutes: 15,
    estimated_wait_minutes: 30
  },
  {
    id: 'dept-2-ortho',
    facility_id: 'fac-2',
    name: 'Orthopedics',
    description: 'Bone fractures, ligament tears, minimally invasive arthroscopy, and spine rehabilitation.',
    status: 'available',
    current_token: 21,
    serving_token: 17,
    tokens_remaining: 9,
    avg_consult_minutes: 9,
    estimated_wait_minutes: 36
  },

  // 3. Sunshine Hospital (fac-3)
  {
    id: 'dept-3-cardio',
    facility_id: 'fac-3',
    name: 'Cardiology',
    description: 'Preventive cardiology, hypertension control, ECG, and non-invasive cardiac evaluation.',
    status: 'available',
    current_token: 34,
    serving_token: 28,
    tokens_remaining: 10,
    avg_consult_minutes: 8,
    estimated_wait_minutes: 48
  },
  {
    id: 'dept-3-ortho',
    facility_id: 'fac-3',
    name: 'Orthopedics',
    description: 'Spine, knee arthroscopy, joint replacement consultations, and cast care.',
    status: 'available',
    current_token: 27,
    serving_token: 22,
    tokens_remaining: 11,
    avg_consult_minutes: 9,
    estimated_wait_minutes: 45
  },
  {
    id: 'dept-3-genmed',
    facility_id: 'fac-3',
    name: 'General Medicine',
    description: 'Primary medical consultations, annual wellness assessments, and chronic fever triage.',
    status: 'available',
    current_token: 40,
    serving_token: 36,
    tokens_remaining: 16,
    avg_consult_minutes: 5,
    estimated_wait_minutes: 20
  },
  {
    id: 'dept-3-ped',
    facility_id: 'fac-3',
    name: 'Pediatrics',
    description: 'Pediatric care, acute respiratory infections, immunization, and growth monitoring.',
    status: 'available',
    current_token: 18,
    serving_token: 15,
    tokens_remaining: 8,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 18
  },
  {
    id: 'dept-3-derma',
    facility_id: 'fac-3',
    name: 'Dermatology',
    description: 'Skin health, contact dermatitis, acne care, and diagnostic dermoscopy.',
    status: 'available',
    current_token: 15,
    serving_token: 12,
    tokens_remaining: 7,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 18
  },

  // 4. KIMS Hospital (fac-4)
  {
    id: 'dept-4-genmed',
    facility_id: 'fac-4',
    name: 'General Medicine',
    description: 'Walk-in urgent consultations, minor illnesses, sutures, and prescription renewals.',
    status: 'available',
    current_token: 38,
    serving_token: 35,
    tokens_remaining: 25,
    avg_consult_minutes: 4,
    estimated_wait_minutes: 12
  },
  {
    id: 'dept-4-derma',
    facility_id: 'fac-4',
    name: 'Dermatology',
    description: 'Rapid access skin clinic, rash evaluation, mole scans, and wound healing.',
    status: 'available',
    current_token: 12,
    serving_token: 10,
    tokens_remaining: 14,
    avg_consult_minutes: 5,
    estimated_wait_minutes: 10
  },
  {
    id: 'dept-4-cardio',
    facility_id: 'fac-4',
    name: 'Cardiology',
    description: 'Clinical cardiology, vascular diagnostics, and cholesterol management clinic.',
    status: 'available',
    current_token: 20,
    serving_token: 16,
    tokens_remaining: 10,
    avg_consult_minutes: 7,
    estimated_wait_minutes: 28
  },
  {
    id: 'dept-4-ent',
    facility_id: 'fac-4',
    name: 'ENT',
    description: 'Ear, nose, throat screening, audiology checkups, and allergy care.',
    status: 'available',
    current_token: 14,
    serving_token: 11,
    tokens_remaining: 9,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 18
  },
  {
    id: 'dept-4-ped',
    facility_id: 'fac-4',
    name: 'Pediatrics',
    description: 'General pediatric consultations, infant feeding guidance, and vaccinations.',
    status: 'available',
    current_token: 16,
    serving_token: 13,
    tokens_remaining: 8,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 18
  },

  // 5. Continental Hospital (fac-5)
  {
    id: 'dept-5-cardio',
    facility_id: 'fac-5',
    name: 'Cardiology',
    description: 'Adult cardiology, Holter monitoring, stress tests, and lipid clinic.',
    status: 'available',
    current_token: 22,
    serving_token: 19,
    tokens_remaining: 9,
    avg_consult_minutes: 8,
    estimated_wait_minutes: 24
  },
  {
    id: 'dept-5-neuro',
    facility_id: 'fac-5',
    name: 'Neurology',
    description: 'Specialist stroke recovery, epilepsy clinics, neuropathy, and nerve conduction studies.',
    status: 'available',
    current_token: 15,
    serving_token: 12,
    tokens_remaining: 8,
    avg_consult_minutes: 11,
    estimated_wait_minutes: 33
  },
  {
    id: 'dept-5-ortho',
    facility_id: 'fac-5',
    name: 'Orthopedics',
    description: 'Comprehensive joint reconstruction, trauma care, and sports physical therapy.',
    status: 'available',
    current_token: 18,
    serving_token: 14,
    tokens_remaining: 9,
    avg_consult_minutes: 9,
    estimated_wait_minutes: 36
  },
  {
    id: 'dept-5-genmed',
    facility_id: 'fac-5',
    name: 'General Medicine',
    description: 'Senior internists offering diagnostic workups, preventive health, and metabolic health.',
    status: 'available',
    current_token: 33,
    serving_token: 29,
    tokens_remaining: 15,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 24
  },
  {
    id: 'dept-5-ped',
    facility_id: 'fac-5',
    name: 'Pediatrics',
    description: 'Pediatric infectious disease, pediatric asthma management, and newborn care.',
    status: 'available',
    current_token: 18,
    serving_token: 15,
    tokens_remaining: 12,
    avg_consult_minutes: 6,
    estimated_wait_minutes: 18
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  // 1. CityCare Hospital Doctors (fac-1)
  {
    id: 'doc-1',
    facility_id: 'fac-1',
    department_id: 'dept-1-cardio',
    name: 'Dr. Ananya Rao',
    specialization: 'Consultant Interventional Cardiologist',
    experience_years: 14,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 11:30 AM',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    bio: 'Board-certified cardiologist specializing in preventive cardiology, lipid disorders, and ischemic heart disease with over a decade of clinical care.',
    consultation_fee: 45,
    qualifications: 'MD, DM (Cardiology), FACC'
  },
  {
    id: 'doc-2',
    facility_id: 'fac-1',
    department_id: 'dept-1-derma',
    name: 'Dr. Marcus Vance',
    specialization: 'Senior Dermatologist & Dermatosurgeon',
    experience_years: 11,
    available_days: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    consultation_mode: 'in_person',
    status: 'available',
    next_available_slot: 'Today, 10:30 AM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in clinical dermatology, inflammatory skin conditions, acne management, and precision laser dermatology.',
    consultation_fee: 40,
    qualifications: 'MD (Dermatology), FAAD'
  },
  {
    id: 'doc-3',
    facility_id: 'fac-1',
    department_id: 'dept-1-genmed',
    name: 'Dr. Ravi Sharma',
    specialization: 'Senior Consultant Physician',
    experience_years: 15,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 10:00 AM',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    bio: 'Highly experienced general physician focusing on adult internal medicine, hypertension, diabetes care, and acute viral consultations.',
    consultation_fee: 35,
    qualifications: 'MBBS, MD (General Medicine)'
  },
  {
    id: 'doc-4',
    facility_id: 'fac-1',
    department_id: 'dept-1-ped',
    name: 'Dr. David Chen',
    specialization: 'Consultant Pediatrician',
    experience_years: 12,
    available_days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    consultation_mode: 'in_person',
    status: 'available',
    next_available_slot: 'Today, 02:00 PM',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    bio: 'Passionate about infant nutrition, childhood asthma management, developmental growth milestones, and pediatric acute care.',
    consultation_fee: 38,
    qualifications: 'MD (Pediatrics), FAAP'
  },
  {
    id: 'doc-5',
    facility_id: 'fac-1',
    department_id: 'dept-1-ortho',
    name: 'Dr. Robert Hayes',
    specialization: 'Orthopedic & Joint Surgeon',
    experience_years: 16,
    available_days: ['Tuesday', 'Wednesday', 'Friday'],
    consultation_mode: 'in_person',
    status: 'available',
    next_available_slot: 'Today, 03:15 PM',
    avatar: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
    bio: 'Renowned orthopedic surgeon specializing in knee and hip preservation, arthroscopic surgery, and sports trauma management.',
    consultation_fee: 55,
    qualifications: 'MS (Orthopedics), MCh, FRCS'
  },
  {
    id: 'doc-6',
    facility_id: 'fac-1',
    department_id: 'dept-1-ent',
    name: 'Dr. Priya Patel',
    specialization: 'ENT & Head-Neck Specialist',
    experience_years: 8,
    available_days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 11:00 AM',
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in sinus endoscopy, allergic rhinitis, middle ear disorders, pediatric hearing assessments, and vocal fatigue.',
    consultation_fee: 35,
    qualifications: 'MS (ENT), DLO'
  },

  // 2. Apollo Hospital Doctors (fac-2)
  {
    id: 'doc-7',
    facility_id: 'fac-2',
    department_id: 'dept-2-cardio',
    name: 'Dr. Arjun Kapoor',
    specialization: 'Senior Interventional Cardiologist',
    experience_years: 17,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 10:30 AM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    bio: 'Fellow of the American College of Cardiology with extensive experience in coronary interventions and complex cardiac rehabilitation.',
    consultation_fee: 50,
    qualifications: 'MD, DM (Cardiology), FSCAI'
  },
  {
    id: 'doc-8',
    facility_id: 'fac-2',
    department_id: 'dept-2-derma',
    name: 'Dr. Elena Rostova',
    specialization: 'Consultant Dermatologist',
    experience_years: 10,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 10:15 AM',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    bio: 'Known for gentle, patient-centered skin consultations, eczema treatments, and non-invasive dermatological procedures.',
    consultation_fee: 35,
    qualifications: 'MD (Dermatology)'
  },
  {
    id: 'doc-9',
    facility_id: 'fac-2',
    department_id: 'dept-2-genmed',
    name: 'Dr. Michael Chang',
    specialization: 'Family Medicine Physician',
    experience_years: 13,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 09:45 AM',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    bio: 'Comprehensive family physician with focus on preventive care, geriatric health, and lifestyle medicine.',
    consultation_fee: 30,
    qualifications: 'MD (Family Medicine)'
  },
  {
    id: 'doc-10',
    facility_id: 'fac-2',
    department_id: 'dept-2-dental',
    name: 'Dr. Sophia Martinez',
    specialization: 'Dental Surgeon & Implantologist',
    experience_years: 8,
    available_days: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    consultation_mode: 'in_person',
    status: 'available',
    next_available_slot: 'Today, 01:30 PM',
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=400&q=80',
    bio: 'Gentle, modern dentistry focusing on pain-free restorative care, aesthetic tooth restorations, and dental hygiene education.',
    consultation_fee: 32,
    qualifications: 'BDS, MDS (Prosthodontics)'
  },
  {
    id: 'doc-10b',
    facility_id: 'fac-2',
    department_id: 'dept-2-ortho',
    name: 'Dr. Tariq Khan',
    specialization: 'Joint Replacement & Spine Consultant',
    experience_years: 14,
    available_days: ['Tuesday', 'Thursday', 'Friday'],
    consultation_mode: 'in_person',
    status: 'available',
    next_available_slot: 'Today, 02:15 PM',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    bio: 'Expert in sports injuries, robotic knee reconstruction, and minimally invasive spinal interventions.',
    consultation_fee: 45,
    qualifications: 'MS (Ortho), MCh'
  },

  // 3. Sunshine Hospital Doctors (fac-3)
  {
    id: 'doc-11',
    facility_id: 'fac-3',
    department_id: 'dept-3-cardio',
    name: 'Dr. Maya Sundaram',
    specialization: 'Senior Cardiologist & Heart Specialist',
    experience_years: 16,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 04:00 PM',
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=400&q=80',
    bio: 'Extensive background in non-invasive cardiac evaluation, lipid management, echocardiography, and hypertension control at Sunshine Hospital.',
    consultation_fee: 50,
    qualifications: 'MD, DM (Cardiology), FESC'
  },
  {
    id: 'doc-12',
    facility_id: 'fac-3',
    department_id: 'dept-3-ortho',
    name: 'Dr. Vikram Reddy',
    specialization: 'Senior Orthopedic Surgeon',
    experience_years: 14,
    available_days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultation_mode: 'in_person',
    status: 'available',
    next_available_slot: 'Today, 02:45 PM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in arthroscopic knee repairs, sports ligament reconstructions, and spinal posture alignment.',
    consultation_fee: 45,
    qualifications: 'MS (Ortho), Fellowship in Sports Medicine'
  },
  {
    id: 'doc-12b',
    facility_id: 'fac-3',
    department_id: 'dept-3-genmed',
    name: 'Dr. Suresh Menon',
    specialization: 'Consultant Physician',
    experience_years: 12,
    available_days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 11:15 AM',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    bio: 'Primary care clinician focused on holistic health checks, chronic lifestyle disorders, and diabetic foot management.',
    consultation_fee: 32,
    qualifications: 'MBBS, MD (Medicine)'
  },
  {
    id: 'doc-12c',
    facility_id: 'fac-3',
    department_id: 'dept-3-ped',
    name: 'Dr. Anita Desai',
    specialization: 'Chief Pediatrician',
    experience_years: 11,
    available_days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    consultation_mode: 'in_person',
    status: 'available',
    next_available_slot: 'Today, 03:30 PM',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    bio: 'Dedicated child health practitioner focusing on neonatal care, childhood allergies, and adolescent wellness.',
    consultation_fee: 38,
    qualifications: 'MD (Pediatrics), DCH'
  },

  // 4. KIMS Hospital Doctors (fac-4)
  {
    id: 'doc-13',
    facility_id: 'fac-4',
    department_id: 'dept-4-derma',
    name: 'Dr. Sunita Rao',
    specialization: 'Senior Dermatologist',
    experience_years: 9,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 11:15 AM',
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=400&q=80',
    bio: 'Dedicated to fast, reliable skin triage, acute allergic reactions, contact dermatitis, and pediatric rashes.',
    consultation_fee: 30,
    qualifications: 'MD (Dermatology)'
  },
  {
    id: 'doc-14',
    facility_id: 'fac-4',
    department_id: 'dept-4-genmed',
    name: 'Dr. Nathan Drake',
    specialization: 'Urgent Care Physician',
    experience_years: 8,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 10:10 AM',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    bio: 'Experienced in acute primary evaluations, minor wound repair, respiratory infections, and rapid diagnostic interpretation.',
    consultation_fee: 28,
    qualifications: 'MBBS, MRCGP'
  },
  {
    id: 'doc-14b',
    facility_id: 'fac-4',
    department_id: 'dept-4-cardio',
    name: 'Dr. Kiran Verma',
    specialization: 'Consultant Cardiologist',
    experience_years: 13,
    available_days: ['Tuesday', 'Thursday', 'Friday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 02:00 PM',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in preventative cardiovascular care, Holter telemetry, and post-angioplasty recovery.',
    consultation_fee: 40,
    qualifications: 'MD (Med), DM (Cardio)'
  },

  // 5. Continental Hospital Doctors (fac-5)
  {
    id: 'doc-15',
    facility_id: 'fac-5',
    department_id: 'dept-5-cardio',
    name: 'Dr. Linda Morales',
    specialization: 'Cardiovascular Physician',
    experience_years: 14,
    available_days: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 03:30 PM',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    bio: 'Specializing in non-invasive cardiac imaging, heart failure management, and vascular risk assessment at Continental Hospital.',
    consultation_fee: 42,
    qualifications: 'MD, FACC'
  },
  {
    id: 'doc-16',
    facility_id: 'fac-5',
    department_id: 'dept-5-neuro',
    name: 'Dr. James Wilson',
    specialization: 'Senior Consultant Neurologist',
    experience_years: 18,
    available_days: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    consultation_mode: 'both',
    status: 'available',
    next_available_slot: 'Today, 01:15 PM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    bio: 'Leading neurologist focusing on acute stroke protocol, epilepsy diagnosis, movement disorders, and neuro-rehabilitation.',
    consultation_fee: 55,
    qualifications: 'MD, DM (Neurology), FAAN'
  },
  {
    id: 'doc-16b',
    facility_id: 'fac-5',
    department_id: 'dept-5-ortho',
    name: 'Dr. Tariq Al-Mansoor',
    specialization: 'Orthopedic Spine & Trauma Surgeon',
    experience_years: 15,
    available_days: ['Monday', 'Thursday', 'Friday'],
    consultation_mode: 'in_person',
    status: 'available',
    next_available_slot: 'Today, 04:30 PM',
    avatar: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
    bio: 'Expert in complex pelvic trauma, degenerative spine decompression, and joint preservation surgery.',
    consultation_fee: 50,
    qualifications: 'MS (Ortho), FRCS'
  }
];

export const INITIAL_APPOINTMENT_SLOTS: AppointmentSlot[] = [
  // CityCare slots
  { id: 'slot-1', doctor_id: 'doc-1', facility_id: 'fac-1', department_id: 'dept-1-cardio', date: '2026-10-05', time: '11:30 AM', is_booked: true },
  { id: 'slot-2', doctor_id: 'doc-1', facility_id: 'fac-1', department_id: 'dept-1-cardio', date: '2026-10-05', time: '12:00 PM', is_booked: false },
  { id: 'slot-3', doctor_id: 'doc-2', facility_id: 'fac-1', department_id: 'dept-1-derma', date: '2026-10-05', time: '10:30 AM', is_booked: false },
  { id: 'slot-4', doctor_id: 'doc-3', facility_id: 'fac-1', department_id: 'dept-1-genmed', date: '2026-10-05', time: '10:00 AM', is_booked: false },
  { id: 'slot-5', doctor_id: 'doc-3', facility_id: 'fac-1', department_id: 'dept-1-genmed', date: '2026-10-05', time: '10:30 AM', is_booked: false },
  { id: 'slot-6', doctor_id: 'doc-4', facility_id: 'fac-1', department_id: 'dept-1-ped', date: '2026-10-05', time: '02:00 PM', is_booked: false },

  // Apollo Hospital slots
  { id: 'slot-7', doctor_id: 'doc-7', facility_id: 'fac-2', department_id: 'dept-2-cardio', date: '2026-10-05', time: '10:30 AM', is_booked: false },
  { id: 'slot-8', doctor_id: 'doc-8', facility_id: 'fac-2', department_id: 'dept-2-derma', date: '2026-10-05', time: '10:15 AM', is_booked: false },
  { id: 'slot-9', doctor_id: 'doc-9', facility_id: 'fac-2', department_id: 'dept-2-genmed', date: '2026-10-05', time: '09:45 AM', is_booked: false },

  // Sunshine Hospital slots
  { id: 'slot-10', doctor_id: 'doc-11', facility_id: 'fac-3', department_id: 'dept-3-cardio', date: '2026-10-05', time: '04:00 PM', is_booked: false },
  { id: 'slot-11', doctor_id: 'doc-12', facility_id: 'fac-3', department_id: 'dept-3-ortho', date: '2026-10-05', time: '02:45 PM', is_booked: false },
  { id: 'slot-12', doctor_id: 'doc-12b', facility_id: 'fac-3', department_id: 'dept-3-genmed', date: '2026-10-05', time: '11:15 AM', is_booked: false },

  // KIMS Hospital slots
  { id: 'slot-13', doctor_id: 'doc-13', facility_id: 'fac-4', department_id: 'dept-4-derma', date: '2026-10-05', time: '11:15 AM', is_booked: false },
  { id: 'slot-14', doctor_id: 'doc-14', facility_id: 'fac-4', department_id: 'dept-4-genmed', date: '2026-10-05', time: '10:10 AM', is_booked: false },

  // Continental Hospital slots
  { id: 'slot-15', doctor_id: 'doc-15', facility_id: 'fac-5', department_id: 'dept-5-cardio', date: '2026-10-05', time: '03:30 PM', is_booked: false },
  { id: 'slot-16', doctor_id: 'doc-16', facility_id: 'fac-5', department_id: 'dept-5-neuro', date: '2026-10-05', time: '01:15 PM', is_booked: false }
];

export const INITIAL_FEEDBACK: PatientFeedback[] = [
  // CityCare Hospital Feedback
  {
    id: 'fb-1',
    patient_id: 'pt-101',
    facility_id: 'fac-1',
    department_id: 'dept-1-cardio',
    visit_id: 'CC-2026-10021',
    visit_date: '2026-09-28',
    overall_rating: 5,
    waiting_rating: 4,
    appointment_rating: 5,
    staff_rating: 5,
    facility_rating: 5,
    written_feedback: 'Outstanding experience with Dr. Ananya Rao. The digital queue board in the waiting lounge showed exact wait times so I was never left wondering.',
    created_at: '2026-09-28T14:30:00Z'
  },
  {
    id: 'fb-2',
    patient_id: 'pt-102',
    facility_id: 'fac-1',
    department_id: 'dept-1-derma',
    visit_id: 'CC-2026-10114',
    visit_date: '2026-09-29',
    overall_rating: 4,
    waiting_rating: 3,
    appointment_rating: 4,
    staff_rating: 5,
    facility_rating: 4,
    written_feedback: 'Dermatology consultation was very helpful. Slight delay due to an emergency patient, but the nursing staff kept us well informed.',
    created_at: '2026-09-29T11:20:00Z'
  },

  // Apollo Hospital Feedback
  {
    id: 'fb-3',
    patient_id: 'pt-103',
    facility_id: 'fac-2',
    department_id: 'dept-2-cardio',
    visit_id: 'AP-2026-10240',
    visit_date: '2026-09-30',
    overall_rating: 5,
    waiting_rating: 5,
    appointment_rating: 5,
    staff_rating: 5,
    facility_rating: 5,
    written_feedback: 'Super clean and organized. Dr. Arjun Kapoor took time to explain diagnostic results clearly. Token system worked seamlessly.',
    created_at: '2026-09-30T16:00:00Z'
  },

  // Sunshine Hospital Feedback
  {
    id: 'fb-4',
    patient_id: 'pt-104',
    facility_id: 'fac-3',
    department_id: 'dept-3-ortho',
    visit_id: 'SH-2026-10300',
    visit_date: '2026-10-01',
    overall_rating: 5,
    waiting_rating: 4,
    appointment_rating: 5,
    staff_rating: 5,
    facility_rating: 5,
    written_feedback: 'Dr. Vikram Reddy treated my knee ligament injury with great expertise. Very pleased with Sunshine Hospital facilities and nurse care.',
    created_at: '2026-10-01T15:15:00Z'
  },

  // KIMS Hospital Feedback
  {
    id: 'fb-5',
    patient_id: 'pt-105',
    facility_id: 'fac-4',
    department_id: 'dept-4-genmed',
    visit_id: 'KM-2026-10360',
    visit_date: '2026-10-02',
    overall_rating: 4,
    waiting_rating: 5,
    appointment_rating: 4,
    staff_rating: 4,
    facility_rating: 4,
    written_feedback: 'Fast walk-in triage and token issuance. Was seen by Dr. Nathan Drake within 12 minutes.',
    created_at: '2026-10-02T16:30:00Z'
  },

  // Continental Hospital Feedback
  {
    id: 'fb-6',
    patient_id: 'pt-106',
    facility_id: 'fac-5',
    department_id: 'dept-5-neuro',
    visit_id: 'CH-2026-10390',
    visit_date: '2026-10-03',
    overall_rating: 5,
    waiting_rating: 5,
    appointment_rating: 5,
    staff_rating: 5,
    facility_rating: 5,
    written_feedback: 'Exceptional neurology department. Modern diagnostic tech, calm environment, and friendly hospital desk staff.',
    created_at: '2026-10-03T11:00:00Z'
  }
];

export const INITIAL_USER_APPOINTMENTS: Appointment[] = [
  // Appointment at CityCare (fac-1)
  {
    id: 'CC-2026-10452',
    patient_id: 'patient-demo-1',
    patient_name: 'John Doe',
    patient_age: 34,
    patient_phone: '+1 (555) 345-9876',
    patient_gender: 'Male',
    reason: 'Annual heart wellness check and cholesterol review',
    facility_id: 'fac-1',
    doctor_id: 'doc-1',
    department_id: 'dept-1-cardio',
    date: '2026-10-05',
    time: '11:30 AM',
    status: 'confirmed',
    created_at: '2026-10-03T09:15:00Z'
  },
  // Appointment at Sunshine Hospital (fac-3)
  {
    id: 'SH-2026-10499',
    patient_id: 'patient-demo-1',
    patient_name: 'John Doe',
    patient_age: 34,
    patient_phone: '+1 (555) 345-9876',
    patient_gender: 'Male',
    reason: 'Knee joint checkup after sports run',
    facility_id: 'fac-3',
    doctor_id: 'doc-12',
    department_id: 'dept-3-ortho',
    date: '2026-10-08',
    time: '02:45 PM',
    status: 'confirmed',
    created_at: '2026-10-03T10:30:00Z'
  },
  // Past Appointment at Apollo Hospital (fac-2)
  {
    id: 'AP-2026-10380',
    patient_id: 'patient-demo-1',
    patient_name: 'John Doe',
    patient_age: 34,
    patient_phone: '+1 (555) 345-9876',
    patient_gender: 'Male',
    reason: 'Routine dental clean and fluoride polish',
    facility_id: 'fac-2',
    doctor_id: 'doc-10',
    department_id: 'dept-2-dental',
    date: '2026-09-25',
    time: '01:30 PM',
    status: 'completed',
    created_at: '2026-09-23T11:00:00Z'
  }
];

export const INITIAL_USER_TOKENS: DigitalToken[] = [
  {
    id: 'tok-2026-47',
    token_number: 47,
    patient_id: 'patient-demo-1',
    patient_name: 'John Doe',
    patient_phone: '+1 (555) 345-9876',
    facility_id: 'fac-1',
    department_id: 'dept-1-derma',
    doctor_id: 'doc-2',
    current_serving_at_creation: 42,
    status: 'WAITING',
    created_at: '2026-10-03T10:05:00Z',
    estimated_wait_minutes: 25
  },
  {
    id: 'tok-2026-28',
    token_number: 28,
    patient_id: 'patient-demo-1',
    patient_name: 'John Doe',
    patient_phone: '+1 (555) 345-9876',
    facility_id: 'fac-3',
    department_id: 'dept-3-ortho',
    doctor_id: 'doc-12',
    current_serving_at_creation: 22,
    status: 'WAITING',
    created_at: '2026-10-03T11:15:00Z',
    estimated_wait_minutes: 45
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'patient-demo-1',
    title: 'Appointment Confirmed',
    message: 'Your appointment CC-2026-10452 with Dr. Ananya Rao is confirmed for 05 Oct 2026, 11:30 AM at CityCare Hospital.',
    read: false,
    created_at: '2026-10-03T09:15:00Z',
    type: 'appointment'
  },
  {
    id: 'notif-2',
    user_id: 'patient-demo-1',
    title: 'Digital Token Issued',
    message: 'Your Token #47 has been generated for Dermatology at CityCare Hospital. Estimated wait is ~25 minutes.',
    read: false,
    created_at: '2026-10-03T10:05:00Z',
    type: 'queue'
  }
];
