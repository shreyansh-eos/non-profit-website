import React from 'react';
import { Story } from '../types';
import { X, ArrowLeft, ShieldCheck, Heart, PhoneCall, ExternalLink } from 'lucide-react';

interface StoryDetailModalProps {
  story: Story | null;
  onClose: () => void;
  onNavigateToSupport: () => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  onClose,
  onNavigateToSupport,
}) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17243A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-[#17243A]/10 relative my-8 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between border-b border-[#17243A]/10 pb-4 mb-6 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-[#252B35] hover:text-[#17243A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#5B8F8A]" />
            <span>Back to Stories</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-[#687385] hover:text-[#17243A] rounded-xl hover:bg-[#EEF3F8] transition-colors cursor-pointer"
            aria-label="Close story detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Story Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          
          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#687385]">
              <span className="font-semibold text-[#5B8F8A]">{story.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#17243A]">{story.authorName}</span>
              {story.creditPreference && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="italic text-[#687385]">{story.creditPreference}</span>
                </>
              )}
              {story.date && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{story.date}</span>
                </>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A] leading-tight">
              {story.title}
            </h2>
          </div>

          {/* Privacy Verification Badge */}
          <div className="flex items-center gap-2 text-xs text-[#5B8F8A] bg-[#EEF3F8] px-3.5 py-2 rounded-xl w-fit border border-[#5B8F8A]/20">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Reviewed with care · Identifying personal details sanitized</span>
          </div>

          {/* Body Content */}
          <div className="text-sm sm:text-base text-[#252B35]/90 leading-relaxed font-normal whitespace-pre-line space-y-4">
            {story.content}
          </div>

          {/* Dedicated Support Resources Callout inside Story View */}
          <div className="p-6 sm:p-7 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 space-y-4 mt-8">
            <div className="flex items-start gap-3.5">
              <Heart className="w-5 h-5 text-[#5B8F8A] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-base text-[#17243A] mb-1">
                  You Don't Have to Carry This Alone
                </h4>
                <p className="text-xs sm:text-sm text-[#252B35]/80 leading-relaxed">
                  Every experience deserves to be treated with dignity. If you need support, please explore our Find Support section or reach out to verified national helplines.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSupport();
                }}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs hover:-translate-y-0.5"
              >
                <span>Explore Support Resources</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#EAE5F5]" />
              </button>

              <a
                href="tel:112"
                className="px-4 py-2.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Emergency (112)</span>
              </a>

              <a
                href="tel:14416"
                className="px-4 py-2.5 text-xs font-semibold text-[#17243A] bg-[#EEF3F8] hover:bg-[#EAE5F5] rounded-xl transition-colors flex items-center gap-1.5 border border-[#17243A]/10"
              >
                <span>Tele-MANAS (14416)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="pt-4 mt-4 border-t border-[#17243A]/10 flex items-center justify-between shrink-0">
          <span className="text-xs text-[#687385]">Aawaaz Setu — Storytelling Archive</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#252B35] bg-[#EEF3F8] hover:bg-[#EAE5F5] rounded-xl transition-colors cursor-pointer border border-[#17243A]/10"
          >
            Close Story
          </button>
        </div>

      </div>
    </div>
  );
};
