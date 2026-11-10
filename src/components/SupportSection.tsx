import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { INITIAL_RESOURCES } from '../data/initialData';
import { Phone, ExternalLink, ShieldAlert, Clock, Globe2, Building, Calendar, Sparkles } from 'lucide-react';
import { ResourceCategory, SupportResource } from '../types';
import { SupportCardSkeleton } from './SkeletonLoaders';

interface SupportSectionProps {
  isLoading?: boolean;
}

export const SupportSection: React.FC<SupportSectionProps> = ({ isLoading: propLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoading, setFilterLoading] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (propLoading === undefined) {
      const timer = setTimeout(() => {
        setInternalLoading(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [propLoading]);

  const isLoading = propLoading !== undefined ? (propLoading || filterLoading) : (internalLoading || filterLoading);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setFilterLoading(true);
    setTimeout(() => {
      setFilterLoading(false);
    }, 300);
  };

  const categories: (string | ResourceCategory)[] = [
    'All',
    'Emergency Support',
    'Government Support',
    "Women's Support Organizations",
    'Support for Men',
    'Legal Awareness',
    'Mental Health Support',
    'Child Protection Resources',
  ];

  const filteredResources = INITIAL_RESOURCES.filter((res) => {
    const matchesCat =
      selectedCategory === 'All' || res.category === selectedCategory;
    const matchesQuery =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.typeOfSupport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.phone && res.phone.includes(searchQuery)) ||
      res.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <section id="support" className="py-20 sm:py-24 bg-white border-b border-[#17243A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Urgent Emergency Notice Box (Mandatory Requirement) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 p-6 sm:p-8 bg-[#17243A] text-white rounded-3xl shadow-sm border border-[#17243A]"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EAE5F5] block mb-1">
                  Immediate Emergency & Safety Notice
                </span>
                <p className="text-sm sm:text-base text-[#EEF3F8]/90 leading-relaxed font-normal max-w-3xl">
                  “Aawaaz Setu is an awareness initiative, not an emergency service, legal service, or professional counselling provider. If you are in immediate danger, contact local emergency services or a trusted person.”
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="tel:112"
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-2 shadow-2xs whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>Call Emergency (112)</span>
              </a>
              <a
                href="tel:1091"
                className="px-5 py-2.5 text-xs font-bold text-[#17243A] bg-[#EEF3F8] hover:bg-[#EAE5F5] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-2 shadow-2xs whitespace-nowrap border border-[#17243A]/10"
              >
                <Phone className="w-4 h-4 text-[#5B8F8A]" />
                <span>Women Helpline (1091)</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Section Header with Section 12 Headline & Supporting text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-3">
              <span>Verified Support Directory</span>
              <span aria-hidden="true" className="text-[#687385]">·</span>
              <span>Direct Professional Connectors</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243A] tracking-tight mb-4">
              You Don't Have to Navigate This Alone.
            </h2>
            <p className="text-base sm:text-lg text-[#252B35]/85 leading-relaxed">
              If you or someone you know needs assistance, established support organizations and official resources may be able to help. Aawaaz Setu acts as a connector to resources, not a replacement for professional support.
            </p>
          </div>

          <div className="lg:col-span-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, support type, or language..."
              className="w-full px-4 py-3 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
            />
          </div>
        </div>

        {/* Category Filters (Segmented Functional Buttons) */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#17243A] text-white shadow-xs'
                  : 'bg-[#F8F7F3] text-[#252B35] hover:bg-[#EEF3F8] border border-[#17243A]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Helplines Grid or Skeleton Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SupportCardSkeleton key={`support-skeleton-${n}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-300 shadow-2xs group"
            >
              <div>
                {/* Header metadata */}
                <div className="flex items-center justify-between text-xs text-[#687385] mb-3">
                  <span className="font-semibold text-[#5B8F8A]">{res.category}</span>
                  {res.isGovernment ? (
                    <span className="text-[10px] font-semibold text-[#17243A] bg-[#EEF3F8] px-2.5 py-0.5 rounded-md border border-[#17243A]/10">
                      Govt Service
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#5B8F8A] bg-white px-2.5 py-0.5 rounded-md border border-[#5B8F8A]/20">
                      Accredited NGO
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#17243A] mb-1.5 leading-snug group-hover:text-[#5B8F8A] transition-colors">
                  {res.name}
                </h3>

                <span className="text-xs font-medium text-[#687385] block mb-3">
                  Type: {res.typeOfSupport}
                </span>

                <p className="text-xs sm:text-sm text-[#252B35]/80 leading-relaxed mb-4 font-normal">
                  {res.description}
                </p>

                {/* Operating Details */}
                <div className="space-y-1.5 text-xs text-[#687385] mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#5B8F8A] shrink-0" />
                    <span>{res.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-3.5 h-3.5 text-[#5B8F8A] shrink-0" />
                    <span className="truncate">Languages: {res.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5B8F8A] pt-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Last verified: {res.lastVerifiedDate}</span>
                  </div>
                </div>
              </div>

              {/* Direct Clickable Actions */}
              <div className="pt-4 border-t border-[#17243A]/10 flex items-center gap-2">
                {res.phone && (
                  <a
                    href={`tel:${res.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 py-2.5 px-3 text-center text-xs font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap shadow-2xs border border-[#17243A]"
                    title={`Call helpline: ${res.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#EAE5F5]" />
                    <span>Call {res.phone}</span>
                  </a>
                )}

                {res.website && (
                  <a
                    href={res.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 text-xs font-semibold text-[#17243A] hover:text-[#5B8F8A] bg-white hover:bg-[#EEF3F8] border border-[#17243A]/15 rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5 shrink-0"
                    title={`Visit official website: ${res.website}`}
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#5B8F8A]" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Peaceful Visual Sanctuary Feature & Transparency Notice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-7 sm:p-8 bg-[#EEF3F8]/60 rounded-3xl border border-[#17243A]/10 shadow-2xs">
          <div className="lg:col-span-4 rounded-2xl overflow-hidden shadow-xs border border-[#17243A]/10 max-h-48">
            <img
              src="./assets/images/support_sanctuary_peace_1794063715762.jpg"
              alt="Peaceful sanctuary garden — Aawaaz Setu safe haven"
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="lg:col-span-8 flex items-start gap-4 text-xs text-[#252B35]/85 leading-relaxed">
            <Building className="w-5 h-5 text-[#5B8F8A] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#17243A] text-sm block mb-1">Resource Listing & Independence Notice:</span>
              "Aawaaz Setu is an independent awareness initiative. Listing an organization does not imply a formal partnership or endorsement." All organizations listed operate under their respective independent charters and protocols. If you represent an accredited support service and wish to update directory details, please reach out via our contact channels.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
