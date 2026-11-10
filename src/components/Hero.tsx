import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Shield, Compass, Sparkles, Gamepad2 } from 'lucide-react';

interface HeroProps {
  onExploreMission: () => void;
  onOpenGame?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMission, onOpenGame }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF3F8]/50 via-[#F8F7F3] to-[#F8F7F3] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#17243A]/10">
      
      {/* Subtle decorative abstract organic curves in background */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-[#EAE5F5]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-40 w-80 h-80 rounded-full bg-[#5B8F8A]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Pre-Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-[#5B8F8A]"
        >
          <span>Student-Led Awareness Initiative</span>
          <span aria-hidden="true" className="text-[#687385]">·</span>
          <span>Delhi Technological University</span>
          <span aria-hidden="true" className="text-[#687385]">·</span>
          <span className="text-[#17243A]">From Silence to Awareness</span>
        </motion.div>

        {/* 2-Column Split: Impactful Narrative & Dignified Artwork */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Core Message and Direct Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#17243A] tracking-tight leading-[1.12] text-balance mb-6">
              Every Voice Deserves to Be Heard.
            </h1>

            <p className="text-lg sm:text-xl text-[#252B35]/90 font-normal leading-relaxed mb-8 max-w-2xl">
              Raising awareness, supporting survivors, and promoting dignity, equality, and justice for all. An independent student initiative dedicated to breaking the silence surrounding sexual violence.
            </p>

            {/* Prominent CTAs with Premium Button Styling */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <a
                href="#about"
                onClick={onExploreMission}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 whitespace-nowrap border border-[#17243A] cursor-pointer"
              >
                <span>Learn Our Mission</span>
                <ArrowRight className="w-4 h-4 text-[#EAE5F5]" />
              </a>

              <a
                href="#share-story"
                className="px-6 py-3.5 text-sm font-semibold text-[#17243A] bg-white hover:bg-[#EEF3F8] border border-[#17243A]/20 rounded-xl hover:border-[#17243A]/40 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#5B8F8A]" />
                <span>Share Your Story</span>
              </a>

              {onOpenGame && (
                <button
                  onClick={onOpenGame}
                  className="px-5 py-3.5 text-sm font-bold text-[#17243A] bg-[#EAE5F5] hover:bg-[#DDD5EE] border border-[#5B8F8A]/35 rounded-xl hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-2xs cursor-pointer group"
                  title="Play Aawaaz Run — A Peaceful Escape (2D Runner with Shreyansh & cute Doges)"
                >
                  <Gamepad2 className="w-4 h-4 text-[#5B8F8A] group-hover:rotate-12 transition-transform duration-200" />
                  <span>Take a Break 🎮</span>
                </button>
              )}

              <a
                href="#support"
                className="px-5 py-3.5 text-sm font-semibold text-[#5B8F8A] bg-[#5B8F8A]/10 hover:bg-[#5B8F8A]/20 border border-[#5B8F8A]/25 rounded-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Find Support</span>
              </a>
            </div>

            {/* Peaceful Escape Mini-game Notice */}
            {onOpenGame && (
              <div className="mb-8 p-3.5 bg-white/70 backdrop-blur-xs border border-[#17243A]/10 rounded-2xl flex items-center justify-between gap-3 text-xs text-[#252B35]/85">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B8F8A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B8F8A]"></span>
                  </span>
                  <span>
                    Need a calm moment? Play <strong>Aawaaz Run</strong> — 100% offline relaxing 2D runner with soothing ASMR audio.
                  </span>
                </div>
                <button
                  onClick={onOpenGame}
                  className="px-3 py-1 bg-[#17243A] hover:bg-[#252B35] text-white text-[11px] font-semibold rounded-lg shrink-0 cursor-pointer transition-colors"
                >
                  Play Game →
                </button>
              </div>
            )}

            {/* Key Ethical & Honest Guarantees */}
            <div className="pt-6 border-t border-[#17243A]/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#687385]">
              <div className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#5B8F8A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#17243A] block">All Genders Welcome</span>
                  Compassionate, stigma-free listening.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#5B8F8A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#17243A] block">Verified Verification</span>
                  Manual review with explicit publication consent.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#5B8F8A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#17243A] block">Student-Led Initiative</span>
                  Founded by Shreyansh Gupta (DTU) & Shorya Panchal (USICT).
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Visual Anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#17243A]/10 bg-white group">
              <img
                src="./assets/images/hero_peaceful_solidarity_1794063714650.jpg"
                alt="Aawaaz Setu — Solidarity and breaking silence together in warm dawn light"
                className="w-full h-auto object-cover max-h-[460px] transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-white/95 backdrop-blur-xs border-t border-[#17243A]/5 flex items-center justify-between text-xs text-[#687385]">
                <span className="font-medium text-[#17243A]">From Silence to Awareness</span>
                <span className="italic text-[#5B8F8A]">Every voice matters</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Secondary Overview Strip: Why Awareness Matters & Core Pillars */}
        <div className="mt-16 pt-12 border-t border-[#17243A]/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 bg-white rounded-2xl border border-[#17243A]/10 shadow-xs hover:border-[#5B8F8A]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] block mb-2">Pillar 01</span>
              <h3 className="font-serif text-xl font-bold text-[#17243A] mb-2.5">Why Awareness Matters</h3>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Silence normalizes violation, isolates survivors, and breeds fear. Clear, open, and fact-based education is the first essential step toward ending sexual violence and building campus safety.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-[#17243A]/10 shadow-xs hover:border-[#5B8F8A]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] block mb-2">Pillar 02</span>
              <h3 className="font-serif text-xl font-bold text-[#17243A] mb-2.5">Support for Every Voice</h3>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Trauma is not limited by gender, background, or identity. We firmly advocate for women, men, and LGBTQ+ survivors with equal empathy, constitutional dignity, and non-judgmental respect.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-[#17243A]/10 shadow-xs hover:border-[#5B8F8A]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] block mb-2">Pillar 03</span>
              <h3 className="font-serif text-xl font-bold text-[#17243A] mb-2.5">Fairness & Due Process</h3>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Advocacy and fairness strengthen one another. We champion responsible discourse, rejecting toxic sensationalism while upholding verified survivor support, legal safeguards, and due process.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
