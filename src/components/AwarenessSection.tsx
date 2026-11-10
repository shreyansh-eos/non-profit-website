import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AWARENESS_TOPICS, MYTHS_AND_FACTS } from '../data/initialData';
import { BookOpen, Check, HelpCircle, ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react';

export const AwarenessSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topics' | 'myths'>('topics');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(AWARENESS_TOPICS[0].id);
  const [revealedFactId, setRevealedFactId] = useState<string | null>(MYTHS_AND_FACTS[0].id);

  return (
    <section id="awareness" className="py-20 sm:py-24 bg-[#F8F7F3] border-b border-[#17243A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-3">
            <span>Evidence-Based Education</span>
            <span aria-hidden="true" className="text-[#687385]">·</span>
            <span>Non-Graphic & Respectful</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243A] tracking-tight mb-4">
            Awareness & Understanding
          </h2>
          <p className="text-base sm:text-lg text-[#252B35]/85 leading-relaxed">
            Education is our strongest defense against violence and stigma. Explore our comprehensive awareness cards and examine deeply rooted myths to build safe, respectful campus and social cultures.
          </p>
        </motion.div>

        {/* Segmented Control for Tabs (Functional button controls, not static pills) */}
        <div className="flex items-center gap-2 p-1.5 bg-[#EEF3F8] rounded-2xl max-w-md mb-10 border border-[#17243A]/10 shadow-2xs">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'topics'
                ? 'bg-[#17243A] text-white shadow-xs'
                : 'text-[#252B35] hover:text-[#17243A]'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'topics' ? 'text-[#EAE5F5]' : 'text-[#5B8F8A]'}`} />
            <span>Educational Modules ({AWARENESS_TOPICS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('myths')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'myths'
                ? 'bg-[#17243A] text-white shadow-xs'
                : 'text-[#252B35] hover:text-[#17243A]'
            }`}
          >
            <HelpCircle className={`w-4 h-4 ${activeTab === 'myths' ? 'text-[#EAE5F5]' : 'text-[#5B8F8A]'}`} />
            <span>Myths vs Facts ({MYTHS_AND_FACTS.length})</span>
          </button>
        </div>

        {/* Tab 1: Educational Topics */}
        {activeTab === 'topics' && (
          <div className="space-y-4">
            {AWARENESS_TOPICS.map((topic, index) => {
              const isExpanded = expandedTopicId === topic.id;
              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-2xl border border-[#17243A]/10 shadow-xs overflow-hidden transition-all duration-200 hover:border-[#5B8F8A]/40"
                >
                  <button
                    onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#687385]/40 tabular-nums shrink-0">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17243A] mb-1">
                          {topic.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5B8F8A] font-medium">
                          {topic.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 p-2 text-[#687385] hover:text-[#17243A] rounded-xl hover:bg-[#EEF3F8] transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-7 sm:px-7 sm:pb-8 pt-0 border-t border-[#17243A]/5">
                      <div className="max-w-4xl space-y-5 pt-4">
                        <p className="text-base text-[#252B35]/90 leading-relaxed font-normal">
                          {topic.summary}
                        </p>

                        <div className="bg-[#F8F7F3] rounded-2xl p-5 sm:p-6 border border-[#17243A]/10 space-y-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#687385] block">
                            Key Principles & Insights
                          </span>
                          <ul className="space-y-2.5">
                            {topic.details.map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2.5 text-sm text-[#252B35]/85">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] shrink-0 mt-2" />
                                <span className="leading-relaxed">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Highlighted Takeaway */}
                        <div className="flex items-center gap-3 p-4 bg-[#EEF3F8] rounded-xl text-xs sm:text-sm text-[#17243A] font-medium border border-[#5B8F8A]/25">
                          <Sparkles className="w-4 h-4 text-[#5B8F8A] shrink-0" />
                          <span><strong>Core Takeaway:</strong> {topic.keyTakeaway}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Myths vs Facts Interactive Matrix */}
        {activeTab === 'myths' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 bg-[#EEF3F8] border border-[#5B8F8A]/30 rounded-2xl text-xs sm:text-sm text-[#252B35] leading-relaxed mb-6">
              <strong className="text-[#17243A]">Deconstructing Harmful Misconceptions:</strong> Cultural myths shift the burden of guilt from perpetrators onto victims. Click any card below to reveal the verified psychological and legal facts.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MYTHS_AND_FACTS.map((item, index) => {
                const isRevealed = revealedFactId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#17243A]/10 shadow-xs p-6 sm:p-7 flex flex-col justify-between hover:border-[#5B8F8A]/30 transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#687385] mb-3">
                        <span className="font-semibold uppercase tracking-wider text-[#5B8F8A]">{item.category}</span>
                        <span className="font-mono">Case 0{index + 1}</span>
                      </div>

                      {/* Myth Header */}
                      <div className="mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                          Common Misconception
                        </span>
                        <p className="font-serif text-base sm:text-lg font-semibold text-[#17243A] leading-snug">
                          "{item.myth}"
                        </p>
                      </div>

                      {/* Fact Reveal / Toggle */}
                      <div className="pt-4 border-t border-[#17243A]/5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B8F8A] block mb-1">
                          Verified Reality
                        </span>
                        <p className="text-sm font-semibold text-[#17243A] mb-3">
                          {item.fact}
                        </p>

                        {isRevealed ? (
                          <div className="mt-3 p-4 bg-[#F8F7F3] rounded-xl text-xs sm:text-sm text-[#252B35]/85 leading-relaxed border border-[#17243A]/10">
                            {item.explanation}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-[#17243A]/5 flex items-center justify-between">
                      <button
                        onClick={() => setRevealedFactId(isRevealed ? null : item.id)}
                        className="text-xs font-semibold text-[#5B8F8A] hover:text-[#17243A] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isRevealed ? 'Hide Detailed Context' : 'Read Full Context & Research'}</span>
                        {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      <Check className="w-4 h-4 text-[#5B8F8A]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
