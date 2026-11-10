import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { LEGAL_FRAMEWORKS, INITIAL_FAQS, AWARENESS_TOPICS, INITIAL_RESOURCES } from '../data/initialData';
import {
  Wind,
  ShieldCheck,
  Download,
  FileText,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Filter,
  Sparkles,
  Phone,
  ExternalLink,
  Globe2,
  Clock,
  X,
  HeartHandshake,
  Shield,
} from 'lucide-react';
import { ResourceCardSkeleton } from './SkeletonLoaders';
import { FaqAccordion } from './FaqAccordion';

export const ResourcesSection: React.FC = () => {
  // Box breathing interactive states
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Helpline & NGO Search state
  const [helplineSearch, setHelplineSearch] = useState('');
  const [helplineCategory, setHelplineCategory] = useState<string>('All');

  // Search and filter state for educational articles
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  const helplineCategories: string[] = [
    'All',
    'Emergency Support',
    'Government Support',
    "Women's Support Organizations",
    'Mental Health Support',
    'Legal Awareness',
    'Child Protection Resources',
    'Support for Men',
  ];

  const filteredHelplines = useMemo(() => {
    const query = helplineSearch.trim().toLowerCase();
    return INITIAL_RESOURCES.filter((res) => {
      const matchesCategory =
        helplineCategory === 'All' || res.category === helplineCategory;
      if (!query) return matchesCategory;

      const matchesQuery =
        res.name.toLowerCase().includes(query) ||
        res.category.toLowerCase().includes(query) ||
        res.typeOfSupport.toLowerCase().includes(query) ||
        res.description.toLowerCase().includes(query) ||
        (res.phone && res.phone.includes(query)) ||
        (res.tollFree && res.tollFree.includes(query)) ||
        res.languages.some((lang) => lang.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [helplineSearch, helplineCategory]);

  // Initial mount perceived performance skeleton timer
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  React.useEffect(() => {
    if (!breathingActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'Inhale') setBreathPhase('Hold');
          else if (breathPhase === 'Hold') setBreathPhase('Exhale');
          else if (breathPhase === 'Exhale') setBreathPhase('Rest');
          else setBreathPhase('Inhale');
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingActive, breathPhase]);

  const handleDownloadSafetyPlan = () => {
    const safetyPlanText = `AAWAAZ SETU — PERSONAL SAFETY & CRISIS CHECKLIST
Initiative: Aawaaz Setu (Every Voice Deserves to Be Heard)
Official Email: ProjectAawaazUni@gmail.com
----------------------------------------------------------------------
DISCLAIMER: Aawaaz Setu is an awareness initiative, not an emergency service.
In immediate danger, dial 112 (National Emergency Helpline) or 1091 (Women Helpline).

1. TRUSTED CONTACT NETWORK
[ ] Identify 2-3 trusted individuals (friend, sibling, mentor) who will answer in an emergency.
[ ] Establish an innocuous distress codeword or emoji with your trusted circle (e.g., "Need that textbook").
[ ] Keep local emergency contacts on your phone's speed dial / lock screen emergency medical card.

2. DIGITAL PRIVACY & EVIDENCE SAFETY
[ ] Take screenshots of threatening messages, social media harassment, or call logs immediately.
[ ] Store digital evidence on a secure, separate cloud drive (or email copies to a secondary trusted account).
[ ] Enable two-factor authentication (2FA) on your personal email and social media accounts.
[ ] Regularly review apps that have access to your location services.

3. PHYSICAL & CAMPUS SAFE HAVENS
[ ] Identify safe physical rooms on campus or near home (warden office, security desk, 24-hr cafe/library).
[ ] Know the contact and location of your university's Internal Complaints Committee (ICC) office.
[ ] Keep essential documents (ID, student card, emergency cash) easily accessible if you need to leave quickly.

4. HEALTH & FORENSIC MEDICAL CARE (IF ASSAULT HAS OCCURRED)
[ ] Seek medical care at the nearest government hospital as early as possible.
[ ] You have the right to free medical examination and treatment without requiring immediate police clearance.
[ ] If feasible, avoid bathing, combing hair, or changing clothing prior to medical examination to preserve DNA forensics.
[ ] Emergency contraception (within 72 hours) and Post-Exposure Prophylaxis (PEP for HIV) should be evaluated by medical staff.

5. LEGAL RIGHTS CHEAT-SHEET
- ZERO FIR: You can file an FIR at ANY police station, regardless of territorial jurisdiction.
- FREE LEGAL AID: Under NALSA (15100), women and vulnerable persons are entitled to free legal counsel.
- POSH ACT: Campus ICC must conduct time-bound, confidential proceedings with interim safety measures.

Issued in public awareness by Aawaaz Setu.`;

    const blob = new Blob([safetyPlanText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Aawaaz_Setu_Personal_Safety_Plan.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const topicFilters = [
    'All',
    'Consent & Boundaries',
    'Survivor Support',
    'Legal Rights',
    'Gender Equality',
    'Due Process',
  ];

  const filteredArticles = AWARENESS_TOPICS.filter((art) => {
    const matchesTopic = selectedTopic === 'All' || art.category === selectedTopic;
    const matchesQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesQuery;
  });

  const bystanderSteps = [
    {
      step: '01. Direct',
      title: 'Address the situation directly if safe',
      desc: 'If you feel physically safe, speak up clearly: "Hey, that\'s not okay," or "Are you uncomfortable?" Direct confrontation sets a firm social boundary.',
    },
    {
      step: '02. Distract',
      title: 'Create an innocent diversion',
      desc: 'De-escalate tension without overt conflict. Ask for directions, spill a napkin, or invite the targeted person to join you elsewhere ("Hey, we need you at the table!").',
    },
    {
      step: '03. Delegate',
      title: 'Seek assistance from authority',
      desc: 'Enlist campus security, a professor, event organizer, bartender, or friends nearby to intervene collectively.',
    },
    {
      step: '04. Delay',
      title: 'Check in with the survivor after',
      desc: 'Even if you couldn\'t intervene in the moment, support them immediately afterward: "I saw what happened. Are you okay? Do you need someone to sit with you?"',
    },
    {
      step: '05. Document',
      title: 'Record safely and ask permission',
      desc: 'If safe, write down dates, times, and statements. NEVER publish or circulate footage without the survivor’s explicit consent; hand it to them privately.',
    },
  ];

  return (
    <section id="resources" className="py-20 sm:py-24 bg-[#F8F7F3] border-b border-[#17243A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Section 13 Headline) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-3">
            <span>Actionable Knowledge & Support</span>
            <span aria-hidden="true" className="text-[#687385]">·</span>
            <span>Comprehensive Toolkits</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243A] tracking-tight mb-4">
            Knowledge, Awareness, and Support.
          </h2>
          <p className="text-base sm:text-lg text-[#252B35]/85 leading-relaxed">
            Practical knowledge reduces vulnerability and dispels shame. Search verified helplines and NGOs, explore educational guides, practice calming breathing exercises, and consult our FAQ archive.
          </p>
        </motion.div>

        {/* ========================================================= */}
        {/* QUICK HELPLINE & NGO SEARCH BAR                           */}
        {/* ========================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#17243A]/10 shadow-xs mb-16 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Helpline & NGO Directory Search</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
                Quick Helpline & NGO Finder
              </h3>
              <p className="text-xs sm:text-sm text-[#252B35]/80 mt-1">
                Search accredited crisis helplines, support NGOs, and government services across India by name or category.
              </p>
            </div>
            <span className="text-xs text-[#687385] font-semibold bg-[#F8F7F3] px-3.5 py-1.5 rounded-xl border border-[#17243A]/10 self-start md:self-auto shrink-0">
              {filteredHelplines.length} of {INITIAL_RESOURCES.length} {filteredHelplines.length === 1 ? 'organization' : 'organizations'}
            </span>
          </div>

          {/* Search Bar Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#687385] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={helplineSearch}
              onChange={(e) => setHelplineSearch(e.target.value)}
              placeholder="Search helplines or NGOs by name (e.g., SNEHA, NCW, 112, Childline, Tele-MANAS, Jagori) or category..."
              className="w-full pl-11 pr-10 py-3.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] placeholder-[#687385]/70"
            />
            {helplineSearch && (
              <button
                type="button"
                onClick={() => setHelplineSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#687385] hover:text-[#17243A] p-1 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#687385]">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter by Category:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {helplineCategories.map((cat) => (
                <button
                  key={`hl-cat-${cat}`}
                  type="button"
                  onClick={() => setHelplineCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    helplineCategory === cat
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'bg-[#F8F7F3] text-[#252B35] hover:bg-[#EEF3F8] border border-[#17243A]/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Display */}
          <div className="pt-2 border-t border-[#17243A]/5">
            {filteredHelplines.length === 0 ? (
              <div className="text-center py-10 px-4 bg-[#F8F7F3] rounded-2xl border border-dashed border-[#17243A]/20">
                <Search className="w-8 h-8 text-[#687385]/50 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#17243A]">No helplines or NGOs found</p>
                <p className="text-xs text-[#687385] max-w-md mx-auto mt-1 mb-4">
                  No organization matching "{helplineSearch}" was found in category "{helplineCategory}". Try clearing your search or keywords like "Emergency", "Women", "Legal", or "Mental".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setHelplineSearch('');
                    setHelplineCategory('All');
                  }}
                  className="px-4 py-2 bg-[#17243A] text-white text-xs font-semibold rounded-xl hover:bg-[#252B35] transition-all cursor-pointer shadow-2xs"
                >
                  Reset Search & View All Helplines
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredHelplines.map((res) => (
                  <div
                    key={`res-item-${res.id}`}
                    className="bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 p-5 sm:p-6 flex flex-col justify-between hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-200 shadow-2xs group"
                  >
                    <div>
                      {/* Category & Badge */}
                      <div className="flex items-center justify-between text-xs text-[#687385] mb-2.5">
                        <span className="font-semibold text-[#5B8F8A]">{res.category}</span>
                        {res.isGovernment ? (
                          <span className="text-[10px] font-semibold text-[#17243A] bg-[#EEF3F8] px-2 py-0.5 rounded-md border border-[#17243A]/10">
                            Govt Service
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-[#5B8F8A] bg-white px-2 py-0.5 rounded-md border border-[#5B8F8A]/20">
                            Accredited NGO
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-base font-bold text-[#17243A] mb-1 leading-snug group-hover:text-[#5B8F8A] transition-colors">
                        {res.name}
                      </h4>

                      <span className="text-[11px] font-medium text-[#687385] block mb-2">
                        Type: {res.typeOfSupport}
                      </span>

                      <p className="text-xs text-[#252B35]/80 leading-relaxed mb-4 line-clamp-3">
                        {res.description}
                      </p>

                      <div className="space-y-1 text-[11px] text-[#687385] mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#5B8F8A] shrink-0" />
                          <span>{res.hours}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Globe2 className="w-3 h-3 text-[#5B8F8A] shrink-0" />
                          <span className="truncate">Languages: {res.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-[#17243A]/10 flex items-center gap-2">
                      {res.phone && (
                        <a
                          href={`tel:${res.phone.replace(/[^0-9+]/g, '')}`}
                          className="flex-1 py-2 px-2.5 text-center text-xs font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-1.5 whitespace-nowrap shadow-2xs border border-[#17243A]"
                          title={`Call helpline: ${res.phone}`}
                        >
                          <Phone className="w-3 h-3 text-[#EAE5F5]" />
                          <span>Call {res.phone}</span>
                        </a>
                      )}
                      {res.website && (
                        <a
                          href={res.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-2 text-xs font-semibold text-[#17243A] hover:text-[#5B8F8A] bg-white hover:bg-[#EEF3F8] border border-[#17243A]/15 rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1 shrink-0"
                          title={`Visit official website: ${res.website}`}
                        >
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3 text-[#5B8F8A]" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Functional Search Bar & Category Filter Chips */}
        <div className="bg-white p-6 rounded-3xl border border-[#17243A]/10 shadow-xs mb-12 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#687385] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search awareness articles, legal concepts, bystander steps, or FAQs..."
              className="w-full pl-11 pr-4 py-3 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-[#687385] mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Topic Filter:</span>
            </span>
            {topicFilters.map((t) => (
              <button
                key={t}
                onClick={() => handleTopicChange(t)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-[#17243A] text-white shadow-2xs'
                    : 'bg-[#EEF3F8] text-[#252B35] hover:bg-[#EAE5F5] border border-[#17243A]/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Educational Articles Grid or Skeleton Screen */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-[#17243A] mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5B8F8A]" />
            <span>Awareness Articles {isLoading ? '' : `(${filteredArticles.length})`}</span>
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <ResourceCardSkeleton key={`resource-skeleton-${n}`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-[#17243A]/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-300 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#687385] mb-3">
                    <span className="font-semibold text-[#5B8F8A] uppercase tracking-wider">{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[#17243A] mb-2 leading-snug">
                    {art.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#252B35]/80 leading-relaxed mb-4 font-normal">
                    {art.summary}
                  </p>

                  <div className="p-3.5 bg-[#F8F7F3] rounded-xl border border-[#17243A]/10 text-xs text-[#252B35]/85 space-y-1.5 mb-4">
                    <span className="font-semibold text-[#17243A] block text-[11px] uppercase tracking-wider">
                      Key Takeaway:
                    </span>
                    <p>{art.keyTakeaway}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#17243A]/5 flex items-center justify-between text-[11px] text-[#5B8F8A] font-semibold">
                  <span>Educational Guide</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* 2-Column: Grounding Tool + Downloadable Safety Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Interactive Box Breathing Tool */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#17243A]/10 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5B8F8A]/15 text-[#5B8F8A] flex items-center justify-center border border-[#5B8F8A]/20">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17243A]">
                      Interactive Grounding Pacer (Box Breathing)
                    </h3>
                    <p className="text-xs text-[#687385]">
                      Clinically proven technique to regulate the nervous system during acute distress.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Breathing Pacer Circle */}
              <div className="py-8 flex flex-col items-center justify-center">
                <div
                  className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                    breathingActive
                      ? breathPhase === 'Inhale'
                        ? 'scale-110 bg-[#EEF3F8] border-4 border-[#5B8F8A]'
                        : breathPhase === 'Hold'
                        ? 'scale-110 bg-[#EAE5F5] border-4 border-[#17243A]'
                        : breathPhase === 'Exhale'
                        ? 'scale-90 bg-[#F8F7F3] border-4 border-[#5B8F8A]'
                        : 'scale-90 bg-white border-4 border-[#17243A]/20'
                      : 'bg-[#F8F7F3] border-2 border-dashed border-[#17243A]/20'
                  }`}
                >
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#17243A]">
                    {breathingActive ? breathPhase : 'Ready'}
                  </span>
                  {breathingActive && (
                    <span className="text-xs sm:text-sm font-mono text-[#5B8F8A] font-bold mt-1">
                      {secondsLeft}s
                    </span>
                  )}
                </div>

                <div className="mt-6 text-center text-xs text-[#252B35]/80 max-w-sm">
                  {breathingActive ? (
                    breathPhase === 'Inhale' ? 'Breathe in slowly through your nose...' :
                    breathPhase === 'Hold' ? 'Gently hold your breath, relaxing your shoulders...' :
                    breathPhase === 'Exhale' ? 'Exhale steadily through your mouth...' :
                    'Rest peacefully before the next cycle...'
                  ) : (
                    'Follow the rhythm: 4 seconds inhale, 4 seconds hold, 4 seconds exhale, 4 seconds rest.'
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#17243A]/10 flex items-center justify-center">
              <button
                onClick={() => {
                  setBreathingActive(!breathingActive);
                  setBreathPhase('Inhale');
                  setSecondsLeft(4);
                }}
                className={`px-6 py-3 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-xs ${
                  breathingActive
                    ? 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    : 'bg-[#17243A] text-white hover:bg-[#252B35] hover:-translate-y-0.5'
                }`}
              >
                {breathingActive ? 'Stop Pacer' : 'Start 4-4-4-4 Breathing Exercise'}
              </button>
            </div>
          </div>

          {/* Downloadable Safety Plan Card */}
          <div className="lg:col-span-5 bg-[#17243A] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between border border-[#17243A]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EAE5F5] mb-3">
                <FileText className="w-4 h-4 text-[#5B8F8A]" />
                <span>Printable Safety Kit</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3 text-white">
                Personal Emergency Safety Plan
              </h3>
              <p className="text-xs sm:text-sm text-[#EEF3F8]/85 leading-relaxed mb-6 font-normal">
                A structured, text-based checklist designed for students and young adults. Covers emergency contacts, code words, forensic preservation guidelines, and digital evidence protection.
              </p>

              <div className="space-y-2.5 text-xs text-[#EEF3F8]/80 mb-8">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A]" />
                  <span>Trusted contact network checklist</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A]" />
                  <span>Forensic evidence protection protocols</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A]" />
                  <span>Campus safe room identification steps</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A]" />
                  <span>Zero FIR rights plain-language sheet</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadSafetyPlan}
              className="w-full py-3.5 px-4 bg-[#5B8F8A] hover:bg-[#4d7d78] text-white font-bold text-xs rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#EAE5F5]" />
              <span>Download Safety Plan (.txt)</span>
            </button>
          </div>

        </div>

        {/* Frequently Asked Questions (FAQ Accordion - Section 13) */}
        <div className="mb-20">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] block mb-1">
              Common Inquiries & Guidance
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243A] mb-3 flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-[#5B8F8A]" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="text-sm sm:text-lg text-[#252B35]/80 leading-relaxed font-normal">
              Clear, transparent answers addressing survivor support, legal rights across India, and Aawaaz Setu's mission and editorial protocols.
            </p>
          </div>

          <FaqAccordion items={INITIAL_FAQS} />
        </div>

        {/* Active Bystander 5D Framework */}
        <div className="mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] block mb-1">
              Active Intervention
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#17243A] mb-2">
              The 5D Framework for Active Bystanders
            </h3>
            <p className="text-xs sm:text-sm text-[#252B35]/80">
              When you witness uncomfortable, coercive, or boundary-crossing behavior, you have safe options to intervene without escalating violence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bystanderSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-[#17243A]/10 p-5 shadow-xs flex flex-col justify-between hover:border-[#5B8F8A]/30 transition-all duration-200"
              >
                <div>
                  <span className="text-xs font-bold text-[#5B8F8A] block mb-1">
                    {item.step}
                  </span>
                  <h4 className="font-semibold text-sm text-[#17243A] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#252B35]/80 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Rights in India Plain Guide */}
        <div>
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] block mb-1">
              Legal Literacy
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#17243A] mb-2">
              Key Legal Frameworks in Plain Language
            </h3>
            <p className="text-xs sm:text-sm text-[#252B35]/80">
              Understanding legal protections dispels fear and ensures rights are exercised effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEGAL_FRAMEWORKS.map((law) => (
              <div
                key={law.title}
                className="bg-white rounded-2xl border border-[#17243A]/10 p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-[#5B8F8A]/30 transition-all duration-200"
              >
                <div>
                  <span className="text-[11px] font-semibold text-[#5B8F8A] uppercase tracking-wider block mb-1">
                    {law.authority}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#17243A] mb-2">
                    {law.title}
                  </h4>
                  <p className="text-xs text-[#252B35]/80 leading-relaxed mb-4 font-normal">
                    {law.summary}
                  </p>
                  <ul className="space-y-2 text-xs text-[#252B35]/80">
                    {law.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] shrink-0 mt-1.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
