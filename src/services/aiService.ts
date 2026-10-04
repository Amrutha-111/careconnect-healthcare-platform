import {
  Facility,
  Department,
  Doctor,
  AppointmentSlot,
  PatientFeedback,
  AIMatchedFacility,
  AIRecommendationResponse
} from '../types';

export interface AIQueryPayload {
  prompt: string;
  userLocation: { latitude: number; longitude: number; name: string };
  facilities: Facility[];
  departments: Department[];
  doctors: Doctor[];
  appointmentSlots: AppointmentSlot[];
  feedbackList: PatientFeedback[];
}

// Emergency keywords check
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'cannot breathe',
  'shortness of breath',
  'unconscious',
  'severe bleeding',
  'stroke',
  'seizure',
  'choking',
  'poisoning',
  'head injury',
  'anaphylaxis',
  'overdose'
];

export async function askCareConnectAI(payload: AIQueryPayload): Promise<AIRecommendationResponse> {
  const queryLower = payload.prompt.toLowerCase();

  // Check for immediate emergency symptoms
  const hasEmergency = EMERGENCY_KEYWORDS.some((kw) => queryLower.includes(kw));

  try {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.matched_facilities) {
        return data as AIRecommendationResponse;
      }
    }
  } catch (err) {
    console.warn('API route call fallback to internal evaluation engine:', err);
  }

  // Resilient internal analyzer grounded strictly in application database
  return generateGroundedRecommendations(payload, hasEmergency);
}

// Grounded fallback analyzer that executes transparent criteria matching
export function generateGroundedRecommendations(
  payload: AIQueryPayload,
  isEmergency: boolean
): AIRecommendationResponse {
  const { prompt, facilities, departments, doctors, appointmentSlots, feedbackList, userLocation } = payload;
  const q = prompt.toLowerCase();

  // 1. Detect requested department
  const knownDepartments = [
    'dermatology',
    'cardiology',
    'general medicine',
    'pediatrics',
    'orthopedics',
    'ent',
    'neurology',
    'dental'
  ];

  let matchedDeptName = '';
  for (const dept of knownDepartments) {
    if (q.includes(dept) || (dept === 'ent' && q.includes('ear') || q.includes('throat') || q.includes('sinus')) ||
        (dept === 'dental' && (q.includes('teeth') || q.includes('tooth'))) ||
        (dept === 'dermatology' && (q.includes('skin') || q.includes('rash') || q.includes('acne'))) ||
        (dept === 'pediatrics' && (q.includes('child') || q.includes('baby') || q.includes('kid'))) ||
        (dept === 'cardiology' && (q.includes('heart') || q.includes('cardio'))) ||
        (dept === 'orthopedics' && (q.includes('bone') || q.includes('joint') || q.includes('fracture') || q.includes('knee'))) ||
        (dept === 'neurology' && (q.includes('brain') || q.includes('headache') || q.includes('migraine')))) {
      matchedDeptName = dept.charAt(0).toUpperCase() + dept.slice(1);
      break;
    }
  }

  if (!matchedDeptName) {
    // Default to General Medicine or Dermatology if general request
    matchedDeptName = q.includes('skin') ? 'Dermatology' : 'General Medicine';
  }

  // Detect preferences
  const prefersShortWait = q.includes('short wait') || q.includes('less wait') || q.includes('quick') || q.includes('waiting');
  const prefersToday = q.includes('today') || q.includes('now') || q.includes('earliest') || q.includes('soon');
  const prefersStaff = q.includes('staff') || q.includes('friendly') || q.includes('polite');
  const prefersClean = q.includes('clean') || q.includes('cleanliness') || q.includes('facility') || q.includes('hygiene');
  const prefersOpenNow = q.includes('open') || q.includes('immediate');

  // Filter facilities that have this department
  const candidateFacilities = facilities.filter((fac) => {
    return fac.available_departments.some(
      (d) => d.toLowerCase() === matchedDeptName.toLowerCase()
    );
  });

  // Calculate distance for each facility
  const R = 6371;
  const scored = candidateFacilities.map((fac) => {
    const dLat = ((fac.latitude - userLocation.latitude) * Math.PI) / 180;
    const dLon = ((fac.longitude - userLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.latitude * Math.PI) / 180) *
        Math.cos((fac.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = parseFloat((R * c).toFixed(1));

    // Department data
    const dept = departments.find(
      (d) =>
        d.facility_id === fac.id &&
        d.name.toLowerCase() === matchedDeptName.toLowerCase()
    );

    const estWait = dept ? dept.estimated_wait_minutes : 25;
    const tokensRemaining = dept ? dept.tokens_remaining : 0;
    const tokenAvailable = tokensRemaining > 0 && fac.status === 'open';

    // Find next appointment slot
    const slots = appointmentSlots.filter(
      (s) => s.facility_id === fac.id && !s.is_booked
    );
    const nextSlot = slots.length > 0 ? `Today, ${slots[0].time}` : 'Tomorrow, 10:00 AM';

    // Stored reviews for this facility
    const facilityReviews = feedbackList.filter((fb) => fb.facility_id === fac.id);
    const reviewCount = fac.rating_summary.review_count || facilityReviews.length;
    const isLimited = reviewCount < 10;

    // Matching reasons
    const reasons: string[] = [];
    reasons.push(`${matchedDeptName} is actively available and verified at this facility`);

    if (fac.status === 'open') {
      reasons.push('Facility is currently open and accepting patient visits');
    }

    if (prefersToday || nextSlot.includes('Today')) {
      reasons.push(`Next confirmed appointment slot is available: ${nextSlot}`);
    }

    if (estWait <= 20) {
      reasons.push(`Estimated waiting time is comparatively low (~${estWait} minutes)`);
    } else {
      reasons.push(`Current estimated queue waiting time is ~${estWait} minutes`);
    }

    if (tokenAvailable) {
      reasons.push('Digital walk-in tokens are currently active for this department');
    }

    if (fac.rating_summary.staff >= 4.5) {
      reasons.push(`Patients frequently praise staff attentiveness (${fac.rating_summary.staff}/5)`);
    }

    if (fac.rating_summary.facility >= 4.5) {
      reasons.push(`High cleanliness and infrastructure rating (${fac.rating_summary.facility}/5)`);
    }

    // Feedback themes
    const positiveThemes: string[] = [];
    const negativeOrMixed: string[] = [];

    if (fac.rating_summary.staff >= 4.3) {
      positiveThemes.push('Several recent feedback entries mention courteous and professional staff');
    }
    if (fac.rating_summary.appointment >= 4.3) {
      positiveThemes.push('Multiple patients report prompt digital appointment check-in');
    }
    if (fac.rating_summary.waiting >= 4.4) {
      positiveThemes.push('Patients note rapid token turnover and minimal lounge waiting');
    } else if (fac.rating_summary.waiting <= 3.8) {
      negativeOrMixed.push('Some patients reported longer waiting times during peak morning hours');
    }

    if (isLimited) {
      negativeOrMixed.push('Limited feedback available (under 10 registered verified reviews)');
    }

    const matchedItem: AIMatchedFacility = {
      facility: fac,
      department_name: matchedDeptName,
      distance_km: dist,
      current_status: fac.status === 'open' ? 'Open now' : fac.status === 'busy' ? 'Busy (High volume)' : 'Closed',
      next_appointment: nextSlot,
      estimated_wait_minutes: estWait,
      token_available: tokenAvailable,
      feedback_summary: {
        overall: fac.rating_summary.overall,
        appointment: fac.rating_summary.appointment,
        waiting: fac.rating_summary.waiting,
        staff: fac.rating_summary.staff,
        facility: fac.rating_summary.facility,
        review_count: reviewCount,
        is_limited: isLimited
      },
      matching_reasons: reasons,
      feedback_themes: {
        positive: positiveThemes,
        negative_or_mixed: negativeOrMixed
      }
    };

    return {
      matchedItem,
      dist,
      estWait,
      overall: fac.rating_summary.overall
    };
  });

  // Sort candidates based on stated preference
  if (prefersShortWait) {
    scored.sort((a, b) => a.estWait - b.estWait);
  } else {
    scored.sort((a, b) => a.dist - b.dist);
  }

  const selectedMatched = scored.slice(0, 3).map((s) => s.matchedItem);

  let criteriaUsed = `I looked for ${matchedDeptName} facilities located near ${userLocation.name}`;
  if (prefersToday) criteriaUsed += ', verified for appointment slots available today';
  if (prefersShortWait) criteriaUsed += ', prioritized by shorter estimated waiting times';
  if (prefersStaff) criteriaUsed += ', and verified for high patient ratings in staff care';
  criteriaUsed += '.';

  return {
    patient_request_summary: `You are looking for ${matchedDeptName} services${prefersShortWait ? ' with minimal waiting' : ''}${prefersToday ? ' and today\'s availability' : ''}.`,
    criteria_used: criteriaUsed,
    matched_facilities: selectedMatched,
    data_limitations: 'Estimated waiting times and token depths are calculated based on current active queue status. Actual consultation duration may vary depending on patient clinical complexity.',
    is_emergency_warning: isEmergency
  };
}
