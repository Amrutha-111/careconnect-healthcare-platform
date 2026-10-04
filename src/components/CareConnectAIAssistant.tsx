import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { askCareConnectAI } from '../services/aiService';
import { AIMatchedFacility, AIRecommendationResponse } from '../types';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Star,
  Clock,
  MapPin,
  Calendar,
  Ticket,
  Scale,
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const CareConnectAIAssistant: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    initialAIPrompt,
    setInitialAIPrompt,
    facilities,
    departments,
    doctors,
    appointmentSlots,
    feedbackList,
    userLocation,
    setSelectedFacility,
    setSelectedDepartment,
    setCurrentView,
    toggleCompareFacility,
    selectedFacilityIdsForComparison
  } = useApp();

  const [prompt, setPrompt] = useState(initialAIPrompt || '');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIRecommendationResponse | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; data?: AIRecommendationResponse }>>([
    {
      role: 'assistant',
      text: 'Hi! I can help you compare nearby healthcare facilities based on availability, waiting time, services, and patient feedback. What are you looking for?'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync initial prompt if triggered from elsewhere
  useEffect(() => {
    if (initialAIPrompt) {
      setPrompt(initialAIPrompt);
      handleSendPrompt(initialAIPrompt);
      setInitialAIPrompt('');
    }
  }, [initialAIPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendPrompt = async (textToSend?: string) => {
    const queryText = textToSend || prompt;
    if (!queryText.trim() || loading) return;

    // Add user message
    const userMsg = { role: 'user' as const, text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const result = await askCareConnectAI({
        prompt: queryText,
        userLocation,
        facilities,
        departments,
        doctors,
        appointmentSlots,
        feedbackList
      });

      setResponse(result);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          text: result.criteria_used,
          data: result
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          text: 'Insufficient data available to complete this comparison query. Please try searching for a standard department such as Dermatology, Cardiology, or Pediatrics.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    setPrompt(preset);
    handleSendPrompt(preset);
  };

  if (!isAIAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden relative">
        
        {/* Assistant Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/60 border border-teal-400/40 flex items-center justify-center text-teal-200 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">CareConnect AI Assistant</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-200 border border-teal-400/30">
                  Data-Grounded
                </span>
              </div>
              <p className="text-xs text-teal-200/80">
                Transparent facility matching & verified review summarization
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-teal-50/80 border-b border-teal-100 px-6 py-2.5 flex items-center space-x-2 text-[11px] text-teal-900 shrink-0">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong>Medical Notice:</strong> CareConnect AI provides informational comparisons based on available facility data and patient feedback. It does not diagnose medical conditions or replace advice from a qualified healthcare professional.
          </span>
        </div>

        {/* Chat / Recommendation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-4 max-w-2xl ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Bubble Text */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/70'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Emergency Warning if triggered */}
                {msg.data?.is_emergency_warning && (
                  <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-950 text-xs space-y-2">
                    <div className="flex items-center space-x-2 font-bold text-rose-800">
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                      <span>URGENT MEDICAL SAFETY WARNING:</span>
                    </div>
                    <p className="leading-relaxed">
                      If you believe this may be an emergency or are experiencing acute symptoms (chest pain, severe trauma, shortness of breath), <strong>seek immediate medical assistance or contact your local emergency service (911 / 112)</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setIsAIAssistantOpen(false);
                        setCurrentView('emergency');
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs"
                    >
                      Find Nearest 24/7 Trauma Emergency Facility
                    </button>
                  </div>
                )}

                {/* Grounded Recommendation Cards */}
                {msg.data?.matched_facilities && msg.data.matched_facilities.length > 0 && (
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                      <span>Matches based on your stated preferences:</span>
                      <span>{msg.data.matched_facilities.length} Facilities Evaluated</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {msg.data.matched_facilities.map((match: AIMatchedFacility, cardIdx: number) => {
                        const isCompared = selectedFacilityIdsForComparison.includes(match.facility.id);

                        return (
                          <div
                            key={match.facility.id || cardIdx}
                            className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:border-teal-500 transition-all p-5 text-xs space-y-4"
                          >
                            {/* Card Top: Name, Dept, Distance, Status */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-extrabold text-base text-slate-900">
                                    {match.facility.name}
                                  </h3>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                    {match.department_name}
                                  </span>
                                </div>
                                <p className="text-slate-500 text-xs mt-0.5">{match.facility.address}</p>
                              </div>

                              <div className="flex items-center space-x-2 shrink-0">
                                <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800">
                                  {match.current_status}
                                </span>
                                <span className="bg-slate-100 px-2.5 py-1 rounded-full font-bold text-[11px] text-slate-700">
                                  {match.distance_km} km away
                                </span>
                              </div>
                            </div>

                            {/* Core Factual Metrics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Next Appointment</span>
                                <strong className="text-slate-900 block mt-0.5">{match.next_appointment}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimated Wait</span>
                                <strong className="text-teal-700 block mt-0.5">~{match.estimated_wait_minutes} mins</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Walk-in Token</span>
                                <strong className="text-slate-900 block mt-0.5">
                                  {match.token_available ? 'Available' : 'Queue full'}
                                </strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Verified Feedback</span>
                                <div className="flex items-center text-slate-900 font-bold mt-0.5">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                                  <span>{match.feedback_summary.overall} / 5</span>
                                  <span className="text-[10px] text-slate-400 ml-1">({match.feedback_summary.review_count})</span>
                                </div>
                              </div>
                            </div>

                            {/* Limited feedback notice if entries < 10 */}
                            {match.feedback_summary.is_limited && (
                              <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                Limited feedback available (under 10 registered verified reviews)
                              </div>
                            )}

                            {/* Why it matches patient's preferences */}
                            <div>
                              <span className="font-bold text-slate-900 text-xs block mb-1.5">
                                Why it matches your stated preferences:
                              </span>
                              <ul className="space-y-1">
                                {match.matching_reasons.map((r, rIdx) => (
                                  <li key={rIdx} className="flex items-start space-x-1.5 text-slate-700">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Feedback Themes (Positive & Mixed) */}
                            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                              <span className="font-bold text-slate-800 text-[11px] block">
                                Feedback Analysis ({match.feedback_summary.review_count} entries):
                              </span>
                              {match.feedback_themes.positive.map((t, tIdx) => (
                                <p key={tIdx} className="text-slate-600">
                                  • {t}
                                </p>
                              ))}
                              {match.feedback_themes.negative_or_mixed.map((m, mIdx) => (
                                <p key={mIdx} className="text-slate-500 italic">
                                  • {m}
                                </p>
                              ))}
                            </div>

                            {/* Transparent Action Buttons */}
                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                              <button
                                onClick={() => toggleCompareFacility(match.facility.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center space-x-1 cursor-pointer transition-colors ${
                                  isCompared
                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>{isCompared ? '✓ In Compare' : '+ Compare'}</span>
                              </button>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedFacility(match.facility);
                                    setIsAIAssistantOpen(false);
                                    setCurrentView('facility-detail');
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                >
                                  View Hospital
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedFacility(match.facility);
                                    const dept = departments.find(
                                      (d) => d.facility_id === match.facility.id && d.name.toLowerCase() === match.department_name.toLowerCase()
                                    );
                                    if (dept) setSelectedDepartment(dept);
                                    setIsAIAssistantOpen(false);
                                    setCurrentView('token-view');
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 cursor-pointer"
                                >
                                  Get Token
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedFacility(match.facility);
                                    const dept = departments.find(
                                      (d) => d.facility_id === match.facility.id && d.name.toLowerCase() === match.department_name.toLowerCase()
                                    );
                                    if (dept) setSelectedDepartment(dept);
                                    setIsAIAssistantOpen(false);
                                    setCurrentView('book-appointment');
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
                                >
                                  Book Appointment
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Data Limitations Disclaimer */}
                    {msg.data.data_limitations && (
                      <p className="text-[11px] text-slate-400 italic px-1">
                        Note: {msg.data.data_limitations}
                      </p>
                    )}

                    {/* Compare Shortcut button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setIsAIAssistantOpen(false);
                          setCurrentView('compare');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 flex items-center space-x-1.5"
                      >
                        <Scale className="w-4 h-4" />
                        <span>Compare Options in Detail</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3 text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center animate-spin">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Analyzing CareConnect facilities, live queues, and patient feedback...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto text-[11px] font-medium text-slate-600 shrink-0">
          <span className="text-slate-400 shrink-0">Try asking:</span>
          {[
            'Dermatology clinic with short wait today',
            'Cardiology clinic with high staff ratings',
            'Pediatrics appointment available this afternoon',
            'Dental clinic near me with token available'
          ].map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-400 hover:text-teal-700 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              "{preset}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I need a dermatology clinic near me with an appointment today and shorter wait..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
