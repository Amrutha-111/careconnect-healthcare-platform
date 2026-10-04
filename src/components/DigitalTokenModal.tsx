import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Ticket,
  Clock,
  Users,
  Building2,
  Layers,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  BellRing,
  Navigation,
  ChevronLeft
} from 'lucide-react';

export const DigitalTokenModal: React.FC = () => {
  const {
    facilities,
    departments,
    doctors,
    tokens,
    selectedFacility,
    selectedDepartment,
    selectedDoctor,
    generateToken,
    activeTokenForView,
    setActiveTokenForView,
    setCurrentView,
    generateVisitPlan
  } = useApp();

  const [chosenFacilityId, setChosenFacilityId] = useState(
    selectedFacility?.id || facilities[0]?.id || ''
  );
  const [chosenDeptId, setChosenDeptId] = useState(
    selectedDepartment?.id || ''
  );

  const availableDepts = departments.filter((d) => d.facility_id === chosenFacilityId);

  useEffect(() => {
    if (availableDepts.length > 0 && (!chosenDeptId || !availableDepts.some((d) => d.id === chosenDeptId))) {
      setChosenDeptId(availableDepts[0].id);
    }
  }, [chosenFacilityId]);

  const activeToken = activeTokenForView || (tokens.length > 0 ? tokens[0] : null);

  const handleGenerate = () => {
    if (!chosenFacilityId || !chosenDeptId) return;
    const token = generateToken(chosenFacilityId, chosenDeptId);
    setActiveTokenForView(token);
  };

  const curFacility = facilities.find((f) => f.id === (activeToken ? activeToken.facility_id : chosenFacilityId));
  const curDept = departments.find((d) => d.id === (activeToken ? activeToken.department_id : chosenDeptId));
  const servingToken = curDept ? curDept.serving_token : 42;
  const userTokenNum = activeToken ? activeToken.token_number : (curDept ? curDept.current_token + 1 : 47);
  const peopleAhead = Math.max(0, userTokenNum - servingToken - 1);
  const estWait = peopleAhead * (curDept?.avg_consult_minutes || 6);

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('facilities')}
          className="text-xs font-semibold text-slate-500 hover:text-teal-600 flex items-center space-x-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </button>

        <button
          onClick={() => setCurrentView('my-visits')}
          className="text-xs font-bold text-teal-700 hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>View All My Tokens</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Digital Token Display Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500" />

        <div className="text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>Smart Live Queue Token</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Digital Token Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Real-time digital queue pass. Your position automatically updates as the hospital admin calls each patient.
          </p>
        </div>

        {/* If user already has an active token */}
        {activeToken ? (
          <div className="mt-8 space-y-6">
            
            {/* Big Token Number Ticket Presentation */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div>
                  <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-widest block">
                    {curFacility?.name}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{curDept?.name} Suite</h3>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                    activeToken.status === 'CALLED'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : activeToken.status === 'COMPLETED'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {activeToken.status === 'CALLED' ? 'NOW CALLED' : activeToken.status}
                </span>
              </div>

              {/* Numbers Grid */}
              <div className="py-6 grid grid-cols-2 gap-4 text-center divide-x divide-slate-700/60">
                <div>
                  <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
                    Currently Serving
                  </span>
                  <span className="font-mono text-4xl sm:text-5xl font-black text-amber-300 mt-1 block">
                    #{servingToken}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">At consultation desk</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
                    Your Token Number
                  </span>
                  <span className="font-mono text-4xl sm:text-5xl font-black text-teal-300 mt-1 block">
                    #{activeToken.token_number}
                  </span>
                  <span className="text-[11px] text-teal-400 mt-1 block">Issued to you</span>
                </div>
              </div>

              {/* Live Status Indicators */}
              <div className="bg-slate-800/80 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs border border-slate-700">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">People Ahead:</span>
                    <strong className="text-white text-sm">
                      {activeToken.status === 'CALLED' ? '0 (Your turn!)' : `${peopleAhead} patients`}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Estimated Wait:</span>
                    <strong className="text-teal-300 text-sm">
                      {activeToken.status === 'CALLED' ? 'Immediate entry' : `~${estWait} minutes`}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Live Alert Note */}
              {activeToken.status === 'CALLED' ? (
                <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center space-x-2 animate-bounce">
                  <BellRing className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>
                    <strong>Your token is now being served!</strong> Please enter Room 102 immediately.
                  </span>
                </div>
              ) : peopleAhead <= 3 ? (
                <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center space-x-2">
                  <BellRing className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>
                    <strong>Queue Alert:</strong> Only {peopleAhead} patients are ahead of you. Please stay close to the consultation lounge.
                  </span>
                </div>
              ) : (
                <div className="mt-4 p-2.5 text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Queue updates automatically via hospital console</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  if (curFacility && curDept) {
                    generateVisitPlan(curFacility.id, curDept.id);
                    setCurrentView('visit-planner');
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Calculate Arrival Timeline</span>
              </button>

              <button
                onClick={() => setCurrentView('my-visits')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>View in My Visits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* Generate Token Form */
          <div className="mt-8 space-y-5">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Select Hospital or Clinic:
                </label>
                <select
                  value={chosenFacilityId}
                  onChange={(e) => setChosenFacilityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium"
                >
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Select Department:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableDepts.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setChosenDeptId(d.id)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                        chosenDeptId === d.id
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold">{d.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Serving: #{d.serving_token} | Wait: ~{d.estimated_wait_minutes}m
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleGenerate}
                className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center space-x-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Issue My Digital Token Now</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
