import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Story, StoryCategory } from '../types';
import { ShieldCheck, Lock, Heart, PlusCircle, Filter, BookOpen } from 'lucide-react';
import { StoryDetailModal } from './StoryDetailModal';
import { StoryCardSkeleton } from './SkeletonLoaders';

interface StorytellingSectionProps {
  stories: Story[];
  onOpenAdmin: () => void;
  onNavigateToShare: () => void;
  onNavigateToSupport: () => void;
  isLoading?: boolean;
}

export const StorytellingSection: React.FC<StorytellingSectionProps> = ({
  stories,
  onOpenAdmin,
  onNavigateToShare,
  onNavigateToSupport,
  isLoading: propLoading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeStoryModal, setActiveStoryModal] = useState<Story | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);

  // Perceived performance: fallback brief skeleton state if not controlled by parent prop
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

  // SECTION 11 REQUIREMENT: Only stories with the 'Published' status may appear publicly
  const publishedStories = stories.filter(
    (s) => s.status === 'Published' && s.consentGiven
  );

  const categories: (string | StoryCategory)[] = [
    'All',
    'Survivor Experiences',
    'Anonymous Stories',
    'Awareness Stories',
    'Personal Reflections',
    'Recovery and Support',
  ];

  const filteredStories =
    selectedCategory === 'All'
      ? publishedStories
      : publishedStories.filter((s) => s.category === selectedCategory);

  return (
    <section id="stories" className="py-20 sm:py-24 bg-[#F8F7F3] border-b border-[#17243A]/10">
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
            <span>Victim & Survivor Storytelling</span>
            <span aria-hidden="true" className="text-[#687385]">·</span>
            <span>Reviewed with Care</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243A] tracking-tight mb-4">
            Survivor Stories — Voices That Deserve to Be Heard.
          </h2>
          <p className="text-base sm:text-lg text-[#252B35]/85 leading-relaxed">
            Every submission displayed here was shared voluntarily with explicit consent and manually reviewed to ensure absolute protection of privacy and identity.
          </p>
        </motion.div>

        {/* Ethical Standards Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 p-4 sm:p-5 bg-white rounded-2xl border border-[#17243A]/10 text-xs text-[#252B35]/80 flex flex-wrap items-center justify-between gap-4 shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#5B8F8A] shrink-0" />
            <span>
              <strong className="text-[#17243A]">Editorial Integrity Policy:</strong> Zero automated publishing. Every entry is reviewed for safety, redaction of real names, and verified written consent.
            </span>
          </div>
          <button
            onClick={onOpenAdmin}
            className="text-[#687385] hover:text-[#17243A] transition-colors flex items-center gap-1.5 font-medium ml-auto cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Moderation Portal</span>
          </button>
        </motion.div>

        {/* Category Filter Buttons (Functional Segmented Buttons) */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <span className="text-xs font-semibold text-[#687385] mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#17243A] text-white shadow-xs'
                  : 'bg-white text-[#252B35] hover:bg-[#EEF3F8] border border-[#17243A]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Display Grid or Skeleton Loading or Respectful Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <StoryCardSkeleton key={`story-skeleton-${n}`} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredStories.length > 0 ? (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
              {filteredStories.map((story, index) => (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.08, 0.35),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl border border-[#17243A]/10 shadow-xs p-7 flex flex-col justify-between hover:border-[#5B8F8A]/40 hover:shadow-md transition-all duration-300"
                >
                  <div>
                    {/* Clean unboxed metadata with typographic separators (anti-slop rule) */}
                    <div className="flex items-center gap-2 text-xs text-[#687385] mb-4">
                      <span className="font-semibold text-[#5B8F8A]">{story.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{story.authorName || 'Anonymous Survivor'}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#17243A] mb-3 leading-snug">
                      {story.title}
                    </h3>

                    {/* Excerpt with line clamp */}
                    <p className="text-sm text-[#252B35]/85 leading-relaxed whitespace-pre-line mb-6 font-normal line-clamp-4">
                      "{story.excerpt || story.content.slice(0, 180) + '...'}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#17243A]/5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#687385]">
                      <span className="flex items-center gap-1.5 text-[#5B8F8A]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Privacy Sanitized</span>
                      </span>
                      <span>{story.date}</span>
                    </div>

                    {/* Prominent Read More button that opens StoryDetailModal */}
                    <button
                      onClick={() => setActiveStoryModal(story)}
                      className="w-full py-2.5 px-3 bg-[#EEF3F8] hover:bg-[#EAE5F5] text-[#17243A] text-xs font-semibold rounded-xl border border-[#17243A]/10 hover:border-[#5B8F8A]/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:translate-y-0"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#5B8F8A]" />
                      <span>Read Full Story</span>
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            /* Respectful Empty State with exact requested text in Section 11 */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-12 sm:p-16 bg-white rounded-3xl border border-[#17243A]/10 text-center max-w-2xl mx-auto shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3F8] text-[#5B8F8A] flex items-center justify-center mx-auto mb-4 border border-[#5B8F8A]/20">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#17243A] mb-3">
                Survivor Stories
              </h3>
              <p className="text-sm text-[#252B35]/80 leading-relaxed mb-6 font-normal">
                "Every story begins with a voice. Our storytelling section will feature voluntarily shared and carefully reviewed experiences when they are available."
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onNavigateToShare}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-4 h-4 text-[#EAE5F5]" />
                  <span>Share Your Story Anonymously</span>
                </button>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-4 py-2.5 text-xs font-semibold text-[#17243A] bg-[#EEF3F8] hover:bg-[#EAE5F5] rounded-xl transition-colors cursor-pointer border border-[#17243A]/10"
                  >
                    View All Categories
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}

      </div>

      {/* Accessible Story Detail Modal */}
      <StoryDetailModal
        story={activeStoryModal}
        onClose={() => setActiveStoryModal(null)}
        onNavigateToSupport={onNavigateToSupport}
      />
    </section>
  );
};
