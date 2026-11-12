import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Quote, Calendar, User, Tag, Sparkles, ChevronRight, X, ExternalLink, Image as ImageIcon } from 'lucide-react';

export interface HonourableMention {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  image_urls: string[];
  caption?: string;
  quote?: string;
  category: string;
  author_name?: string;
  published_at?: string;
  created_at?: string;
}

export const HonourableMentionsSection: React.FC = () => {
  const [mentions, setMentions] = useState<HonourableMention[]>([]);
  const [selectedMention, setSelectedMention] = useState<HonourableMention | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMentions = async () => {
    try {
      const res = await fetch('/api/honourable-mentions');
      if (res.ok) {
        const data = await res.json();
        setMentions(data);
      }
    } catch (e) {
      console.error('Failed to load honourable mentions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentions();
  }, []);

  if (loading && mentions.length === 0) {
    return null;
  }

  if (mentions.length === 0) {
    return null;
  }

  return (
    <section id="honourable-mentions" className="py-20 sm:py-24 bg-white border-b border-[#17243A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-3">
            <Award className="w-4 h-4 text-[#5B8F8A]" />
            <span>Campus Voices & Recognition</span>
            <span aria-hidden="true" className="text-[#687385]">·</span>
            <span>Honourable Mentions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243A] tracking-tight mb-4">
            Honourable Mentions
          </h2>
          <p className="text-base sm:text-lg text-[#252B35]/85 leading-relaxed">
            Spotlighting courageous voices, student initiatives, campus champions, and peer reflections that break silence and build safe communities.
          </p>
        </motion.div>

        {/* Mentions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mentions.map((item) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#5B8F8A]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Gallery or Hero Image */}
                {item.image_urls && item.image_urls.length > 0 && (
                  <div className="relative aspect-16/9 w-full bg-[#17243A]/5 overflow-hidden border-b border-[#17243A]/10">
                    <img
                      src={item.image_urls[0]}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-[#17243A]/85 backdrop-blur-md px-3 py-1 rounded-xl text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs">
                      <Tag className="w-3 h-3 text-[#5B8F8A]" />
                      <span>{item.category}</span>
                    </div>
                    {item.image_urls.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-[#17243A]/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-medium flex items-center gap-1 shadow-2xs">
                        <ImageIcon className="w-3 h-3 text-[#EAE5F5]" />
                        <span>+{item.image_urls.length - 1} photos</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-4">
                  {/* Category & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#687385]">
                    <span className="font-semibold text-[#5B8F8A] uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#5B8F8A]" />
                        <span>{new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A] leading-snug group-hover:text-[#5B8F8A] transition-colors">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs sm:text-sm text-[#5B8F8A] font-medium mt-1">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Pull Quote */}
                  {item.quote && (
                    <div className="p-4 rounded-2xl bg-[#EEF3F8] border-l-4 border-[#5B8F8A] text-xs sm:text-sm italic text-[#17243A] font-serif leading-relaxed">
                      {item.quote}
                    </div>
                  )}

                  {/* Content Excerpt */}
                  <p className="text-xs sm:text-sm text-[#252B35]/85 line-clamp-3 leading-relaxed font-normal">
                    {item.content}
                  </p>

                  {/* Caption / Image Description */}
                  {item.caption && (
                    <p className="text-[11px] text-[#687385] italic pt-1">
                      Photo: {item.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer: Author & Read More Button */}
              <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-[#17243A]/5 mt-4">
                <div className="text-xs text-[#687385] flex items-center gap-1.5 min-w-0">
                  <User className="w-3.5 h-3.5 text-[#5B8F8A] shrink-0" />
                  <span className="truncate">{item.author_name || 'Aawaaz Setu Team'}</span>
                </div>
                <button
                  onClick={() => setSelectedMention(item)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#17243A] text-[#17243A] hover:text-white border border-[#17243A]/15 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer shrink-0"
                >
                  <span>Read Story</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

      </div>

      {/* Read In-Full Detail Modal */}
      <AnimatePresence>
        {selectedMention && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 overflow-y-auto bg-[#17243A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#17243A]/20 overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="p-5 sm:p-6 bg-[#17243A] text-white flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#EAE5F5]">
                  <Award className="w-4 h-4 text-[#5B8F8A]" />
                  <span>Honourable Mention</span>
                  <span aria-hidden="true" className="text-white/40">·</span>
                  <span className="text-white/80">{selectedMention.category}</span>
                </div>
                <button
                  onClick={() => setSelectedMention(null)}
                  className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Image Gallery */}
                {selectedMention.image_urls && selectedMention.image_urls.length > 0 && (
                  <div className="space-y-3">
                    <div className="rounded-2xl overflow-hidden border border-[#17243A]/10 max-h-96">
                      <img
                        src={selectedMention.image_urls[0]}
                        alt={selectedMention.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {selectedMention.image_urls.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {selectedMention.image_urls.slice(1).map((img, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden border border-[#17243A]/10 aspect-16/9">
                            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedMention.caption && (
                      <p className="text-xs text-[#687385] italic">{selectedMention.caption}</p>
                    )}
                  </div>
                )}

                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A] leading-tight">
                    {selectedMention.title}
                  </h2>
                  {selectedMention.subtitle && (
                    <p className="text-sm font-semibold text-[#5B8F8A] mt-1.5">
                      {selectedMention.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#687385] mt-3 pt-3 border-t border-[#17243A]/10">
                    <span className="flex items-center gap-1.5 font-medium text-[#17243A]">
                      <User className="w-3.5 h-3.5 text-[#5B8F8A]" />
                      <span>{selectedMention.author_name || 'Aawaaz Setu Team'}</span>
                    </span>
                    {selectedMention.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5B8F8A]" />
                        <span>{new Date(selectedMention.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                    )}
                  </div>
                </div>

                {selectedMention.quote && (
                  <div className="p-5 rounded-2xl bg-[#EEF3F8] border-l-4 border-[#5B8F8A] text-sm sm:text-base italic text-[#17243A] font-serif leading-relaxed">
                    <Quote className="w-5 h-5 text-[#5B8F8A] mb-1 opacity-80" />
                    {selectedMention.quote}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-[#252B35] leading-relaxed whitespace-pre-line space-y-4 font-normal">
                  {selectedMention.content}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-[#F8F7F3] border-t border-[#17243A]/10 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-[#687385]">
                  Published by Aawaaz Setu Editorial Initiative
                </span>
                <button
                  onClick={() => setSelectedMention(null)}
                  className="px-5 py-2 rounded-xl bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
