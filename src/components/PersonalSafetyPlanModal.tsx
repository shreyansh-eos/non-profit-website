import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  Save,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Lock,
  Smartphone,
  Scale,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  Edit3,
  HeartHandshake,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  PersonalSafetyPlan,
  TrustedContact,
  SafePlace,
  SafetyChecklistItem
} from '../types';
import { DEFAULT_SAFETY_PLAN } from '../data/safetyPlanDefaults';

interface PersonalSafetyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanUpdated?: () => void;
}

export const PersonalSafetyPlanModal: React.FC<PersonalSafetyPlanModalProps> = ({
  isOpen,
  onClose,
  onPlanUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<
    'contacts' | 'places' | 'checklist' | 'codeword' | 'digital' | 'support' | 'notes' | 'summary'
  >('contacts');

  const [plan, setPlan] = useState<PersonalSafetyPlan>(() => {
    try {
      const stored = localStorage.getItem('aawaaz_setu_safety_plan');
      if (stored) {
        return { ...DEFAULT_SAFETY_PLAN, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to parse safety plan from localStorage', e);
    }
    return DEFAULT_SAFETY_PLAN;
  });

  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [customStepInput, setCustomStepInput] = useState('');

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const updatedPlan: PersonalSafetyPlan = {
        ...plan,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('aawaaz_setu_safety_plan', JSON.stringify(updatedPlan));
      setPlan(updatedPlan);
      setSavedNotification('Your Personal Safety Plan has been saved securely to your browser storage.');
      setTimeout(() => setSavedNotification(null), 4000);
      if (onPlanUpdated) onPlanUpdated();
    } catch (e) {
      console.error('Failed to save safety plan', e);
    }
  };

  const handleClearPlan = () => {
    try {
      localStorage.removeItem('aawaaz_setu_safety_plan');
      setPlan({
        ...DEFAULT_SAFETY_PLAN,
        trustedContacts: [],
        safePlaces: [],
        personalNotes: '',
        codeWord: {
          phrase: '',
          meaning: '',
          duressEmoji: '',
          instructionsForContact: '',
        },
      });
      setShowClearConfirm(false);
      setSavedNotification('All safety plan data has been cleared from this device.');
      setTimeout(() => setSavedNotification(null), 3500);
      if (onPlanUpdated) onPlanUpdated();
    } catch (e) {
      console.error('Failed to clear safety plan', e);
    }
  };

  const handlePrint = () => {
    // Switch to summary tab for complete unified printable view then trigger print
    setActiveTab('summary');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // --- Trusted Contacts helpers ---
  const handleAddContact = () => {
    const newContact: TrustedContact = {
      id: `tc-${Date.now()}`,
      name: '',
      relationship: '',
      phone: '',
      notes: '',
      knowsCodeWord: true,
      canHost: false,
    };
    setPlan({
      ...plan,
      trustedContacts: [...plan.trustedContacts, newContact],
    });
  };

  const handleUpdateContact = (id: string, updates: Partial<TrustedContact>) => {
    setPlan({
      ...plan,
      trustedContacts: plan.trustedContacts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  const handleRemoveContact = (id: string) => {
    setPlan({
      ...plan,
      trustedContacts: plan.trustedContacts.filter((c) => c.id !== id),
    });
  };

  // --- Safe Places helpers ---
  const handleAddSafePlace = () => {
    const newPlace: SafePlace = {
      id: `sp-${Date.now()}`,
      name: '',
      type: 'Campus',
      addressOrLocation: '',
      howToGetThere: '',
      contactPerson: '',
    };
    setPlan({
      ...plan,
      safePlaces: [...plan.safePlaces, newPlace],
    });
  };

  const handleUpdateSafePlace = (id: string, updates: Partial<SafePlace>) => {
    setPlan({
      ...plan,
      safePlaces: plan.safePlaces.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  const handleRemoveSafePlace = (id: string) => {
    setPlan({
      ...plan,
      safePlaces: plan.safePlaces.filter((p) => p.id !== id),
    });
  };

  // --- Checklist helpers ---
  const handleToggleChecklist = (id: string) => {
    setPlan({
      ...plan,
      emergencyChecklist: plan.emergencyChecklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  const handleAddCustomStep = () => {
    if (!customStepInput.trim()) return;
    const newItem: SafetyChecklistItem = {
      id: `chk-custom-${Date.now()}`,
      step: customStepInput.trim(),
      category: 'Immediate',
      completed: false,
    };
    setPlan({
      ...plan,
      emergencyChecklist: [...plan.emergencyChecklist, newItem],
    });
    setCustomStepInput('');
  };

  const handleRemoveChecklistStep = (id: string) => {
    setPlan({
      ...plan,
      emergencyChecklist: plan.emergencyChecklist.filter((item) => item.id !== id),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-plan-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#17243A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 safety-plan-modal-backdrop"
    >
      <div className="bg-[#F8F7F3] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-[#17243A]/20 overflow-hidden safety-plan-modal-content">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#17243A] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5B8F8A]/30 border border-[#5B8F8A]/40 flex items-center justify-center text-white">
              <Shield className="w-5 h-5 text-[#EAE5F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="safety-plan-title" className="font-serif text-lg sm:text-2xl font-bold tracking-tight">
                  Personal Emergency Safety Plan
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#5B8F8A]/25 border border-[#5B8F8A]/40 text-[#EAE5F5] text-[10px] font-semibold uppercase tracking-wider">
                  Private & Offline
                </span>
              </div>
              <p className="text-xs text-[#EEF3F8]/80 font-normal">
                Structured emergency support, trusted contacts, and evidence safeguards stored exclusively on your device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.replace('https://www.google.com')}
              title="Quickly exit to Google"
              className="hidden sm:inline-flex px-2.5 py-1 text-[11px] font-medium bg-[#252B35] hover:bg-rose-950 text-rose-200 border border-rose-400/30 rounded-lg transition-colors cursor-pointer"
            >
              Quick Exit
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#EEF3F8]/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Safety Plan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Local Privacy Guarantee Banner */}
        <div className="bg-[#EEF3F8] px-5 py-3 border-b border-[#17243A]/10 flex items-center justify-between gap-3 text-xs text-[#252B35] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5B8F8A] shrink-0" />
            <span>
              <strong>Zero Server Transmission:</strong> Everything you enter is stored privately on your local browser. No personal details, names, or notes leave this device.
            </span>
          </div>
          {plan.updatedAt && (
            <span className="text-[10px] text-[#687385] whitespace-nowrap hidden md:inline">
              Saved {new Date(plan.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Tab Navigation Segmented Bar */}
        <div className="bg-white border-b border-[#17243A]/10 px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 min-w-max text-xs font-semibold">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'contacts'
                  ? 'bg-[#17243A] text-white shadow-2xs'
                  : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
              }`}
            >
              <span>1. Contacts ({plan.trustedContacts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'places'
                  ? 'bg-[#17243A] text-white shadow-2xs'
                  : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
              }`}
            >
              <span>2. Safe Places ({plan.safePlaces.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-[#17243A] text-white shadow-2xs'
                  : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
              }`}
            >
              <span>3. Emergency Action</span>
            </button>
            <button
              onClick={() => setActiveTab('codeword')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'codeword'
                  ? 'bg-[#17243A] text-white shadow-2xs'
                  : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
              }`}
            >
              <span>4. Code Word</span>
            </button>
            <button
              onClick={() => setActiveTab('digital')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'digital'
                  ? 'bg-[#17243A] text-white shadow-2xs'
                  : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
              }`}
            >
              <span>5. Digital Safety</span>
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'support'
                  ? 'bg-[#17243A] text-white shadow-2xs'
                  : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
              }`}
            >
              <span>6. Support & Rights</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-[#17243A] text-white shadow-2xs'
                  : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
              }`}
            >
              <span>7. Personal Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-[#5B8F8A] text-white shadow-2xs'
                  : 'text-[#5B8F8A] hover:bg-[#5B8F8A]/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Plan (Print/View)</span>
            </button>
          </div>
        </div>

        {/* Saved Toast Notification */}
        {savedNotification && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 flex items-center justify-between shrink-0 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedNotification}</span>
            </div>
            <button
              onClick={() => setSavedNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* ========================================================= */}
          {/* TAB 1: TRUSTED CONTACTS                                   */}
          {/* ========================================================= */}
          {activeTab === 'contacts' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#17243A] flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#5B8F8A]" />
                    <span>Trusted Contacts Network</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#252B35]/80 font-normal">
                    People who will answer unconditionally during an emergency, can provide transportation, or know your confidential distress code word.
                  </p>
                </div>
                <button
                  onClick={handleAddContact}
                  className="px-3.5 py-2 bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trusted Contact</span>
                </button>
              </div>

              {plan.trustedContacts.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#17243A]/20">
                  <p className="text-xs text-[#687385] mb-3">No trusted contacts added yet.</p>
                  <button
                    onClick={handleAddContact}
                    className="px-4 py-2 bg-[#EEF3F8] text-[#17243A] text-xs font-semibold rounded-xl hover:bg-[#EAE5F5] cursor-pointer"
                  >
                    + Add Your First Contact
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.trustedContacts.map((contact, idx) => (
                    <div
                      key={contact.id}
                      className="p-4 sm:p-5 bg-white rounded-2xl border border-[#17243A]/10 shadow-2xs space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B8F8A]">
                          Contact #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveContact(contact.id)}
                          className="text-[#687385] hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div>
                          <label className="block text-[#687385] mb-1 font-medium">Name / Alias:</label>
                          <input
                            type="text"
                            value={contact.name}
                            onChange={(e) => handleUpdateContact(contact.id, { name: e.target.value })}
                            placeholder="e.g. Priya / Ananya (Roommate)"
                            className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[#687385] mb-1 font-medium">Relationship:</label>
                          <input
                            type="text"
                            value={contact.relationship}
                            onChange={(e) => handleUpdateContact(contact.id, { relationship: e.target.value })}
                            placeholder="e.g. College Friend / Sibling"
                            className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#687385] mb-1 font-medium">Phone / WhatsApp:</label>
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => handleUpdateContact(contact.id, { phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#687385] mb-1 font-medium">Role & Notes:</label>
                        <input
                          type="text"
                          value={contact.notes || ''}
                          onChange={(e) => handleUpdateContact(contact.id, { notes: e.target.value })}
                          placeholder="e.g. Has hostel spare key / can pick me up at DTU gate"
                          className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] text-xs"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#252B35]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={contact.knowsCodeWord ?? true}
                            onChange={(e) => handleUpdateContact(contact.id, { knowsCodeWord: e.target.checked })}
                            className="rounded text-[#5B8F8A] focus:ring-[#5B8F8A] border-[#17243A]/20"
                          />
                          <span>Knows my code word</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={contact.canHost ?? false}
                            onChange={(e) => handleUpdateContact(contact.id, { canHost: e.target.checked })}
                            className="rounded text-[#5B8F8A] focus:ring-[#5B8F8A] border-[#17243A]/20"
                          />
                          <span>Can host me safely</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SAFE PLACES                                        */}
          {/* ========================================================= */}
          {activeTab === 'places' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#17243A] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#5B8F8A]" />
                    <span>Safe Places & Havens</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#252B35]/80 font-normal">
                    Pre-determined physical locations where you can safely wait, lock yourself in, or seek immediate security intervention.
                  </p>
                </div>
                <button
                  onClick={handleAddSafePlace}
                  className="px-3.5 py-2 bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Safe Location</span>
                </button>
              </div>

              <div className="space-y-4">
                {plan.safePlaces.map((place, idx) => (
                  <div
                    key={place.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-[#17243A]/10 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B8F8A]">
                        Location #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveSafePlace(place.id)}
                        className="text-[#687385] hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                        title="Remove location"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[#687385] mb-1 font-medium">Safe Haven Name:</label>
                        <input
                          type="text"
                          value={place.name}
                          onChange={(e) => handleUpdateSafePlace(place.id, { name: e.target.value })}
                          placeholder="e.g. Campus Library 24-Hr Reading Hall / Security Gate 1"
                          className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[#687385] mb-1 font-medium">Location Type:</label>
                        <select
                          value={place.type}
                          onChange={(e) => handleUpdateSafePlace(place.id, { type: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] text-xs"
                        >
                          <option value="Campus">Campus / Academic</option>
                          <option value="Home">Home / Residence</option>
                          <option value="Friend / Family">Friend / Peer's Room</option>
                          <option value="Medical / Police">Hospital / Police Precinct</option>
                          <option value="Public / 24-7">24-Hr Public Cafe / Metro</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[#687385] mb-1 font-medium">Specific Address / Room / Landmark:</label>
                        <input
                          type="text"
                          value={place.addressOrLocation}
                          onChange={(e) => handleUpdateSafePlace(place.id, { addressOrLocation: e.target.value })}
                          placeholder="e.g. Block B, First Floor, next to Chief Warden office"
                          className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[#687385] mb-1 font-medium">How to Get There (Transit Option):</label>
                        <input
                          type="text"
                          value={place.howToGetThere || ''}
                          onChange={(e) => handleUpdateSafePlace(place.id, { howToGetThere: e.target.value })}
                          placeholder="e.g. Well-lit central path / Yellow Line Metro / Auto stand"
                          className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: EMERGENCY ACTION CHECKLIST                         */}
          {/* ========================================================= */}
          {activeTab === 'checklist' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#17243A] flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#5B8F8A]" />
                  <span>Immediate Crisis Action Checklist</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#252B35]/80 font-normal">
                  Step-by-step priority guidelines when you feel unsafe or after an incident. You can check off completed actions or add custom steps.
                </p>
              </div>

              <div className="space-y-2.5">
                {plan.emergencyChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      item.completed
                        ? 'bg-emerald-50/70 border-emerald-300/80 text-emerald-900'
                        : 'bg-white border-[#17243A]/10 text-[#252B35] hover:border-[#5B8F8A]/40'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-[#687385]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-medium ${item.completed ? 'line-through text-emerald-800/80' : 'text-[#17243A]'}`}>
                        {item.step}
                      </p>
                      <span className="text-[10px] text-[#687385] uppercase tracking-wider font-semibold">
                        {item.category} Action
                      </span>
                    </div>
                    {item.id.startsWith('chk-custom-') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveChecklistStep(item.id);
                        }}
                        className="text-[#687385] hover:text-rose-600 p-1"
                        title="Remove custom step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Custom Step */}
              <div className="p-4 bg-white rounded-2xl border border-[#17243A]/10 space-y-2">
                <label className="text-xs font-semibold text-[#17243A] block">
                  Add a Custom Personal Safety Step:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customStepInput}
                    onChange={(e) => setCustomStepInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomStep()}
                    placeholder="e.g. Call hostel warden directly at intercom #204"
                    className="flex-1 px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                  <button
                    onClick={handleAddCustomStep}
                    className="px-4 py-2 bg-[#17243A] text-white text-xs font-semibold rounded-xl hover:bg-[#252B35] cursor-pointer"
                  >
                    Add Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PRIVATE CODE WORD                                  */}
          {/* ========================================================= */}
          {activeTab === 'codeword' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#17243A] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#5B8F8A]" />
                  <span>Private Distress Code Word & Protocol</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#252B35]/80 font-normal">
                  An ordinary-sounding sentence or emoji that sounds completely innocent to an observer or aggressor, but secretly alerts your trusted person that you need immediate intervention.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 shadow-2xs space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1">
                    Your Secret Distress Phrase:
                  </label>
                  <input
                    type="text"
                    value={plan.codeWord.phrase}
                    onChange={(e) =>
                      setPlan({
                        ...plan,
                        codeWord: { ...plan.codeWord, phrase: e.target.value },
                      })
                    }
                    placeholder="e.g. Did you find that blue chemistry notebook?"
                    className="w-full px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm font-semibold text-[#17243A] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                  <span className="text-[11px] text-[#687385] mt-1 block">
                    Tip: Choose something casual that you might naturally text or say on a phone call.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1">
                      Secret Distress Emoji (Optional):
                    </label>
                    <input
                      type="text"
                      value={plan.codeWord.duressEmoji || ''}
                      onChange={(e) =>
                        setPlan({
                          ...plan,
                          codeWord: { ...plan.codeWord, duressEmoji: e.target.value },
                        })
                      }
                      placeholder="e.g. 🔴 or 🌧️"
                      className="w-full px-4 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1">
                      Code Meaning:
                    </label>
                    <input
                      type="text"
                      value={plan.codeWord.meaning}
                      onChange={(e) =>
                        setPlan({
                          ...plan,
                          codeWord: { ...plan.codeWord, meaning: e.target.value },
                        })
                      }
                      placeholder="e.g. Urgent exit required / Send cab to my live location"
                      className="w-full px-4 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1">
                    Exact Instructions for the Person Who Receives It:
                  </label>
                  <textarea
                    rows={3}
                    value={plan.codeWord.instructionsForContact}
                    onChange={(e) =>
                      setPlan({
                        ...plan,
                        codeWord: { ...plan.codeWord, instructionsForContact: e.target.value },
                      })
                    }
                    placeholder="e.g. If I send this code, call me within 60 seconds. Say you have an emergency and that I must come home immediately. If I don't answer, call 112 with my last known campus building."
                    className="w-full px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: DIGITAL SAFETY GUIDANCE                            */}
          {/* ========================================================= */}
          {activeTab === 'digital' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#17243A] flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#5B8F8A]" />
                  <span>Digital Safety, Evidence & Device Privacy</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#252B35]/80 font-normal">
                  Protocols for protecting your digital footprints, preserving evidence of stalking or cyber-harassment, and securing your accounts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#17243A]">
                    Digital Privacy Checklist
                  </h4>
                  <div className="space-y-2.5 text-xs text-[#252B35]">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plan.digitalSafety.locationSharingOff}
                        onChange={(e) =>
                          setPlan({
                            ...plan,
                            digitalSafety: {
                              ...plan.digitalSafety,
                              locationSharingOff: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-[#5B8F8A] mt-0.5"
                      />
                      <span>Check Google Maps, WhatsApp & Snapchat live location sharing and turn off any active shares.</span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plan.digitalSafety.passwordsUpdated}
                        onChange={(e) =>
                          setPlan({
                            ...plan,
                            digitalSafety: {
                              ...plan.digitalSafety,
                              passwordsUpdated: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-[#5B8F8A] mt-0.5"
                      />
                      <span>Update primary email, Instagram, and cloud account passwords; log out of all unknown devices.</span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plan.digitalSafety.twoFactorEnabled}
                        onChange={(e) =>
                          setPlan({
                            ...plan,
                            digitalSafety: {
                              ...plan.digitalSafety,
                              twoFactorEnabled: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-[#5B8F8A] mt-0.5"
                      />
                      <span>Enable Two-Factor Authentication (2FA) with an authenticator app (Google Authenticator) instead of SMS.</span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plan.digitalSafety.emergencySosConfigured}
                        onChange={(e) =>
                          setPlan({
                            ...plan,
                            digitalSafety: {
                              ...plan.digitalSafety,
                              emergencySosConfigured: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-[#5B8F8A] mt-0.5"
                      />
                      <span>Configure Emergency SOS on phone (auto-dials 112 & sends GPS coordinates to emergency contacts).</span>
                    </label>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#17243A]">
                    How to Safely Document Harassment
                  </h4>
                  <ul className="space-y-2 text-xs text-[#252B35]/85 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] mt-1.5 shrink-0" />
                      <span><strong>Full-Screen Screenshots:</strong> Always capture entire screens showing sender handles, phone numbers, date, and exact timestamps.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] mt-1.5 shrink-0" />
                      <span><strong>Export Full Chat Threads:</strong> Export entire WhatsApp conversations (with media) before the other party deletes or unsends messages.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] mt-1.5 shrink-0" />
                      <span><strong>Off-Device Backup:</strong> Store evidence screenshots in a secondary private Google Drive or email to a trusted third party.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] mt-1.5 shrink-0" />
                      <span><strong>Do Not Alter Files:</strong> Keep original image files without cropping or photo editing to preserve digital metadata for cyber cell inquiry.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: SUPPORT & REPORTING (VERIFIED INDIAN RESOURCES)     */}
          {/* ========================================================= */}
          {activeTab === 'support' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#17243A] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#5B8F8A]" />
                  <span>Verified Indian Emergency Contacts & Statutory Rights</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#252B35]/80 font-normal">
                  Direct official helplines and your inviolable legal protections under Indian jurisprudence.
                </p>
              </div>

              {/* Emergency Helplines Quick-Dial Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <a
                  href="tel:112"
                  className="p-3.5 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors flex items-center justify-between shadow-2xs group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">National Emergency</span>
                    <span className="font-serif text-base font-bold text-[#17243A]">112 (ERSS Police / Ambulance)</span>
                  </div>
                  <Phone className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="tel:1091"
                  className="p-3.5 bg-[#EEF3F8] hover:bg-[#EAE5F5] rounded-xl border border-[#17243A]/10 transition-colors flex items-center justify-between shadow-2xs group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8F8A] block">Women in Distress</span>
                    <span className="font-serif text-base font-bold text-[#17243A]">1091 (24/7 Police Dispatch)</span>
                  </div>
                  <Phone className="w-4 h-4 text-[#5B8F8A] group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="tel:181"
                  className="p-3.5 bg-[#EEF3F8] hover:bg-[#EAE5F5] rounded-xl border border-[#17243A]/10 transition-colors flex items-center justify-between shadow-2xs group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8F8A] block">Women Helpline (MWCD)</span>
                    <span className="font-serif text-base font-bold text-[#17243A]">181 (Crisis & Shelter)</span>
                  </div>
                  <Phone className="w-4 h-4 text-[#5B8F8A] group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="tel:14416"
                  className="p-3.5 bg-white hover:bg-[#F8F7F3] rounded-xl border border-[#17243A]/10 transition-colors flex items-center justify-between shadow-2xs group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8F8A] block">Mental Health Crisis</span>
                    <span className="font-serif text-base font-bold text-[#17243A]">14416 (Tele-MANAS Gov)</span>
                  </div>
                  <Phone className="w-4 h-4 text-[#5B8F8A] group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="tel:15100"
                  className="p-3.5 bg-white hover:bg-[#F8F7F3] rounded-xl border border-[#17243A]/10 transition-colors flex items-center justify-between shadow-2xs group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8F8A] block">Free Legal Aid</span>
                    <span className="font-serif text-base font-bold text-[#17243A]">15100 (NALSA Toll-Free)</span>
                  </div>
                  <Phone className="w-4 h-4 text-[#5B8F8A] group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="tel:1098"
                  className="p-3.5 bg-white hover:bg-[#F8F7F3] rounded-xl border border-[#17243A]/10 transition-colors flex items-center justify-between shadow-2xs group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8F8A] block">Child Protection & POCSO</span>
                    <span className="font-serif text-base font-bold text-[#17243A]">1098 (Childline 24/7)</span>
                  </div>
                  <Phone className="w-4 h-4 text-[#5B8F8A] group-hover:scale-110 transition-transform" />
                </a>
              </div>

              {/* Core Legal Rights Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 shadow-2xs space-y-2">
                  <h4 className="font-bold text-sm text-[#17243A] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#5B8F8A]" />
                    <span>Right to File a "Zero FIR"</span>
                  </h4>
                  <p className="text-xs text-[#252B35]/85 leading-relaxed font-normal">
                    Under Indian criminal law, <strong>ANY police station</strong> in India is legally obligated to register an FIR for a cognizable sexual offence, regardless of where the incident occurred. Police cannot refuse registration citing territorial jurisdiction; they must register the Zero FIR and subsequently transfer it.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 shadow-2xs space-y-2">
                  <h4 className="font-bold text-sm text-[#17243A] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#5B8F8A]" />
                    <span>Free Medical Aid & Treatment</span>
                  </h4>
                  <p className="text-xs text-[#252B35]/85 leading-relaxed font-normal">
                    Under Section 357C of the CrPC / criminal procedural codes, all public and private hospitals are mandated to provide <strong>immediate, free emergency medical treatment</strong> and forensic care to sexual violence survivors without requiring a prior police FIR.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: PERSONAL NOTES & EMERGENCY GO-BAG                   */}
          {/* ========================================================= */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#17243A] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#5B8F8A]" />
                  <span>Personal Notes & Emergency Bag</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#252B35]/80 font-normal">
                  Private reminders, specific boundaries, medical or allergy notes, emergency cash locations, and items to pack if you need to leave quickly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A]">
                    Private Safety Notes & Specific Preferences:
                  </label>
                  <textarea
                    rows={4}
                    value={plan.personalNotes}
                    onChange={(e) => setPlan({ ...plan, personalNotes: e.target.value })}
                    placeholder="e.g. Daily prescription medication is kept in top desk drawer. Keep ₹1000 cash separate in my wallet. If distressed, call Ananya first before contacting parents."
                    className="w-full px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A]">
                    Emergency Quick-Exit Bag Checklist:
                  </label>
                  <textarea
                    rows={3}
                    value={plan.emergencyBagItems}
                    onChange={(e) => setPlan({ ...plan, emergencyBagItems: e.target.value })}
                    placeholder="e.g. College ID card, Aadhar card, room spare key, phone charger, power bank, warm jacket, emergency cash."
                    className="w-full px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: FULL PLAN SUMMARY & PRINT VIEW                     */}
          {/* ========================================================= */}
          {activeTab === 'summary' && (
            <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#17243A]/15 shadow-sm">
              <div className="border-b border-[#17243A]/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B8F8A]">
                    Confidential Document
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#17243A]">
                    Personal Safety Plan — Summary
                  </h3>
                  <p className="text-xs text-[#687385]">
                    Initiative: Aawaaz Setu · Official Email: ProjectAawaazUni@gmail.com
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2 bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print This Plan</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="px-3 py-2 bg-[#EEF3F8] hover:bg-[#EAE5F5] text-[#17243A] text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Plan</span>
                  </button>
                </div>
              </div>

              {/* 1. Trusted Contacts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243A] border-b border-[#17243A]/10 pb-1">
                  1. Trusted Contacts Network
                </h4>
                {plan.trustedContacts.length === 0 ? (
                  <p className="text-xs text-[#687385] italic">No contacts entered yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {plan.trustedContacts.map((c) => (
                      <div key={c.id} className="p-3 bg-[#F8F7F3] rounded-xl border border-[#17243A]/10">
                        <div className="font-bold text-[#17243A]">{c.name || 'Unnamed Contact'}</div>
                        <div className="text-[11px] text-[#5B8F8A]">{c.relationship || 'Relationship not specified'}</div>
                        {c.phone && <div className="font-mono text-xs font-semibold text-[#17243A] mt-1">{c.phone}</div>}
                        {c.notes && <div className="text-[11px] text-[#687385] mt-1">{c.notes}</div>}
                        <div className="flex gap-2 text-[10px] text-[#252B35] mt-1.5 font-medium">
                          {c.knowsCodeWord && <span className="bg-white px-1.5 py-0.5 rounded border border-[#17243A]/10">Knows Code Word</span>}
                          {c.canHost && <span className="bg-white px-1.5 py-0.5 rounded border border-[#17243A]/10">Can Host Safely</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Safe Places */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243A] border-b border-[#17243A]/10 pb-1">
                  2. Safe Places & Havens
                </h4>
                {plan.safePlaces.length === 0 ? (
                  <p className="text-xs text-[#687385] italic">No safe places entered yet.</p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {plan.safePlaces.map((p) => (
                      <div key={p.id} className="p-3 bg-[#F8F7F3] rounded-xl border border-[#17243A]/10">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#17243A]">{p.name || 'Safe Location'}</span>
                          <span className="text-[10px] uppercase font-bold text-[#5B8F8A]">{p.type}</span>
                        </div>
                        {p.addressOrLocation && <div className="text-[11px] text-[#252B35] mt-0.5">{p.addressOrLocation}</div>}
                        {p.howToGetThere && <div className="text-[11px] text-[#687385] mt-0.5">Route: {p.howToGetThere}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Private Code Word */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243A] border-b border-[#17243A]/10 pb-1">
                  3. Secret Distress Code Word
                </h4>
                <div className="p-3 bg-[#F8F7F3] rounded-xl border border-[#17243A]/10 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#687385]">Code Phrase:</span>
                    <strong className="font-mono text-[#17243A] text-sm">
                      "{plan.codeWord.phrase || 'None set'}"
                    </strong>
                    {plan.codeWord.duressEmoji && (
                      <span className="text-base">{plan.codeWord.duressEmoji}</span>
                    )}
                  </div>
                  {plan.codeWord.meaning && (
                    <div><span className="text-[#687385]">Meaning:</span> {plan.codeWord.meaning}</div>
                  )}
                  {plan.codeWord.instructionsForContact && (
                    <div className="text-[11px] text-[#252B35]/80">
                      <strong>Contact Instructions:</strong> {plan.codeWord.instructionsForContact}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Action Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243A] border-b border-[#17243A]/10 pb-1">
                  4. Immediate Action Checklist
                </h4>
                <div className="space-y-1 text-xs">
                  {plan.emergencyChecklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 py-0.5">
                      <span className={item.completed ? 'text-emerald-600 font-bold' : 'text-[#687385]'}>
                        {item.completed ? '✓ [DONE]' : '○ [PENDING]'}
                      </span>
                      <span className={item.completed ? 'line-through text-[#687385]' : 'text-[#17243A]'}>
                        {item.step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Verified Helplines */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243A] border-b border-[#17243A]/10 pb-1">
                  5. National Emergency Numbers (India)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 bg-[#F8F7F3] rounded-lg">National Police/Medical: <strong>112</strong></div>
                  <div className="p-2 bg-[#F8F7F3] rounded-lg">Women Helpline: <strong>1091 / 181</strong></div>
                  <div className="p-2 bg-[#F8F7F3] rounded-lg">Tele-MANAS (Mental Health): <strong>14416</strong></div>
                  <div className="p-2 bg-[#F8F7F3] rounded-lg">NALSA Free Legal Aid: <strong>15100</strong></div>
                  <div className="p-2 bg-[#F8F7F3] rounded-lg">Childline (POCSO): <strong>1098</strong></div>
                  <div className="p-2 bg-[#F8F7F3] rounded-lg">Zero FIR: <strong>Any Station</strong></div>
                </div>
              </div>

              {/* 6. Notes & Emergency Bag */}
              {(plan.personalNotes || plan.emergencyBagItems) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243A] border-b border-[#17243A]/10 pb-1">
                    6. Personal Notes & Quick-Exit Bag
                  </h4>
                  {plan.personalNotes && (
                    <div className="p-3 bg-[#F8F7F3] rounded-xl text-xs text-[#252B35]">
                      <strong>Notes:</strong> {plan.personalNotes}
                    </div>
                  )}
                  {plan.emergencyBagItems && (
                    <div className="p-3 bg-[#F8F7F3] rounded-xl text-xs text-[#252B35]">
                      <strong>Go-Bag Items:</strong> {plan.emergencyBagItems}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Sticky Actions Toolbar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#17243A]/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 bg-[#5B8F8A] hover:bg-[#4d7d78] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
              title="Save My Plan to Local Device"
            >
              <Save className="w-4 h-4 text-[#EAE5F5]" />
              <span>Save My Plan</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'summary' ? 'contacts' : 'summary')}
              className="px-3.5 py-2.5 bg-[#EEF3F8] hover:bg-[#EAE5F5] text-[#17243A] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-[#17243A]/10"
              title="Toggle Edit / Review View"
            >
              {activeTab === 'summary' ? (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-[#5B8F8A]" />
                  <span>Edit Plan</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#5B8F8A]" />
                  <span>Review Plan</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-white hover:bg-[#F8F7F3] text-[#17243A] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-[#17243A]/20"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#5B8F8A]" />
              <span>Print Plan</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-xl border border-rose-200 text-xs">
                <span className="text-rose-800 text-[11px] font-semibold pl-1">Reset plan?</span>
                <button
                  onClick={handleClearPlan}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 text-[#687385] hover:text-[#17243A] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-2 text-[#687385] hover:text-rose-600 text-xs font-medium rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear all safety plan data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Plan</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
