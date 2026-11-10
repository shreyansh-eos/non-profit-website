import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Search,
  X,
  HelpCircle,
  Shield,
  Scale,
  Sparkles,
  FileText,
  PhoneCall,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { FAQItem, FAQCategory } from '../types';

interface FaqAccordionProps {
  items: FAQItem[];
  className?: string;
  defaultCategory?: FAQCategory;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  className = '',
  defaultCategory = 'All',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  // Available Category filters
  const categories: { label: FAQCategory; icon: React.ElementType }[] = [
    { label: 'All', icon: HelpCircle },
    { label: 'Survivor Support', icon: Shield },
    { label: 'Legal Rights', icon: Scale },
    { label: "Aawaaz Setu's Mission", icon: Sparkles },
    { label: 'Story Submission', icon: FileText },
  ];

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesQuery =
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.highlight && item.highlight.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [items, selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Survivor Support':
        return 'text-[#5B8F8A] bg-[#5B8F8A]/10 border-[#5B8F8A]/20';
      case 'Legal Rights':
        return 'text-[#17243A] bg-[#EEF3F8] border-[#17243A]/15';
      case "Aawaaz Setu's Mission":
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      default:
        return 'text-[#687385] bg-stone-100 border-stone-200';
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Search and Category Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(({ label, icon: Icon }) => {
            const isSelected = selectedCategory === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setSelectedCategory(label);
                  // Auto expand the first item in the newly selected category
                  const firstInCat = items.find(
                    (it) => label === 'All' || it.category === label
                  );
                  if (firstInCat) setExpandedId(firstInCat.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#17243A] text-white shadow-xs'
                    : 'bg-white text-[#252B35]/80 hover:bg-[#EEF3F8] border border-[#17243A]/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#EAE5F5]' : 'text-[#5B8F8A]'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Minimal Search Input */}
        <div className="relative min-w-[240px] max-w-xs w-full">
          <Search className="w-4 h-4 text-[#687385] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#17243A]/15 text-xs text-[#252B35] placeholder-[#687385] focus:outline-hidden focus:border-[#5B8F8A] focus:ring-1 focus:ring-[#5B8F8A] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#687385] hover:text-[#17243A] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-[#5B8F8A]/40 shadow-sm ring-1 ring-[#5B8F8A]/20'
                    : 'border-[#17243A]/10 hover:border-[#17243A]/25 shadow-2xs'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
                    <span
                      className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border shrink-0 w-fit ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <h4
                      className={`font-serif text-base sm:text-lg font-bold transition-colors ${
                        isExpanded ? 'text-[#17243A]' : 'text-[#252B35]'
                      }`}
                    >
                      {item.question}
                    </h4>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isExpanded
                        ? 'bg-[#17243A] text-white rotate-180'
                        : 'bg-[#EEF3F8] text-[#17243A] hover:bg-[#EAE5F5]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Expandable Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-[#252B35]/85 leading-relaxed border-t border-[#17243A]/5 font-normal">
                        <p className="whitespace-pre-line">{item.answer}</p>

                        {/* Optional Key Highlight Callout */}
                        {item.highlight && (
                          <div className="mt-3.5 p-3 rounded-xl bg-[#EEF3F8]/70 border border-[#5B8F8A]/25 flex items-start gap-2 text-xs text-[#17243A]">
                            <CheckCircle2 className="w-4 h-4 text-[#5B8F8A] shrink-0 mt-0.5" />
                            <span className="font-medium">{item.highlight}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#17243A]/10 space-y-2">
            <HelpCircle className="w-6 h-6 text-[#687385] mx-auto opacity-60" />
            <h5 className="font-serif font-bold text-[#17243A] text-base">No Matching Questions Found</h5>
            <p className="text-xs text-[#687385] max-w-sm mx-auto">
              We couldn't find an answer matching "{searchQuery}". Try searching another keyword or reach out directly to our team.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 text-xs font-semibold text-[#5B8F8A] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Still Have Questions? Minimalist Prompt Card */}
      <div className="p-6 bg-[#EEF3F8]/60 rounded-2xl border border-[#17243A]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#17243A] text-white flex items-center justify-center shrink-0 shadow-xs">
            <PhoneCall className="w-4 h-4 text-[#EAE5F5]" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-bold text-[#17243A]">
              Have a question not addressed here?
            </h5>
            <p className="text-[11px] text-[#687385]">
              Reach out directly to the Aawaaz Setu initiative team or explore verified helplines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <a
            href="#contact"
            className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold transition-all shadow-xs"
          >
            Ask a Question
          </a>
          <a
            href="mailto:ProjectAawaazUni@gmail.com"
            className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl bg-white hover:bg-[#F8F7F3] border border-[#17243A]/15 text-[#17243A] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#5B8F8A]" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  );
};
