import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  School,
  Quote,
  Mail,
  Camera,
  Heart,
  Cpu,
  Briefcase,
  UserCheck,
  Linkedin,
  ExternalLink,
  Shield,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  // Toggle between Founder (Shreyansh), Managing Director (Paritosh), Co-Founder (Shorya), and HR Manager (Anubhav)
  const [activeLeader, setActiveLeader] = useState<'shreyansh' | 'paritosh' | 'shorya' | 'anubhav'>('shreyansh');

  // Support toggling between the 2 founder photographs for Shreyansh
  const [selectedShreyanshPhoto, setSelectedShreyanshPhoto] = useState<'formal' | 'campus'>('formal');

  const shreyanshPhotos = {
    formal: {
      src: './assets/aistudio/image_93510b04.png',
      title: 'Formal Portrait',
      alt: 'Shreyansh Gupta — Founder of Aawaaz Setu in formal navy suit at the National Crafts & Heritage Atrium',
    },
    campus: {
      src: './assets/aistudio/image_635a89a6.png',
      title: 'Student Life',
      alt: 'Shreyansh Gupta — Student & Founder of Aawaaz Setu',
    },
  };

  return (
    <section id="about" className="py-20 sm:py-24 bg-white border-b border-[#17243A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-3">
            <span>Our Origins & Purpose</span>
            <span aria-hidden="true" className="text-[#687385]">·</span>
            <span>Independent Student Initiative</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243A] tracking-tight mb-4">
            About Aawaaz Setu
          </h2>
          <p className="text-base sm:text-lg text-[#252B35]/85 leading-relaxed">
            Aawaaz Setu was founded by DTU student <strong className="text-[#17243A] font-semibold">Shreyansh Gupta</strong> and co-founded by USICT student <strong className="text-[#17243A] font-semibold">Shorya Panchal</strong> with HR & volunteer coordination led by SRCC student <strong className="text-[#17243A] font-semibold">Anubhav Gupta</strong>. Together, our mission is to challenge silence and societal stigma, support mental health and emotional well-being, provide an empathetic space where people can learn and be heard, and stand beside survivors of all genders.
          </p>
        </motion.div>

        {/* 2-Column Story & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-[#252B35]/90 leading-relaxed"
          >
            <p className="text-lg text-[#17243A] font-medium leading-relaxed font-serif italic border-l-2 border-[#5B8F8A] pl-4">
              "When silence surrounds sensitive realities, myths thrive and survivors are left isolated. We started Aawaaz Setu from within university halls because awareness cannot wait for someone else to begin it."
            </p>

            <p>
              Navigating university environments revealed a persistent, painful pattern: instances of sexual violence, boundary violations, and mental health struggles often go unaddressed not because people do not care, but because fear, shame, and societal judgment silence the conversation before it even begins.
            </p>

            <p>
              Aawaaz Setu emerged to bridge this gap. We believe that true awareness must be grounded in compassion, intellectual honesty, and universal respect. We do not judge, we do not sensationalize, and we never dismiss an individual's lived reality based on their gender or circumstance.
            </p>

            {/* Our Vision Statement Callout */}
            <div className="p-6 bg-[#EEF3F8]/70 rounded-2xl border border-[#17243A]/10 mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] block mb-1.5">Our Vision</span>
              <p className="font-serif text-xl text-[#17243A] font-semibold italic leading-snug">
                "A society where every person is treated with dignity and compassion, and where awareness replaces silence and misinformation."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[#17243A]/10 bg-[#F8F7F3] group">
              <img
                src="./assets/images/about_community_support_1794063715770.jpg"
                alt="Compassionate listening and gentle voice light — Aawaaz Setu"
                className="w-full h-auto object-cover max-h-[440px] transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 text-xs text-[#687385] bg-white border-t border-[#17243A]/5 flex items-center justify-between">
                <span>The Power of Listening</span>
                <span className="font-semibold text-[#17243A]">Aawaaz Setu Mission</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* LEADERSHIP SECTION: FOUNDER, CO-FOUNDER & HR LEAD                         */}
        {/* ========================================================================= */}
        <motion.div
          id="founder"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 p-6 sm:p-10 lg:p-12 bg-linear-to-br from-[#F8F7F3] via-white to-[#EEF3F8]/60 rounded-3xl border border-[#17243A]/15 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Decorative Background Accent */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#5B8F8A]/5 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#17243A]/5 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 space-y-8">
            
            {/* Top Selector Bar to Switch Between Core Team Members */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#17243A]/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-1">
                  <span>Student Leadership & Team</span>
                  <span aria-hidden="true" className="text-[#687385]">·</span>
                  <span>Voices Behind Aawaaz Setu</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
                  Meet the Leadership & Team
                </h3>
              </div>

              {/* 4 Leader Switcher Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#EEF3F8] p-1.5 rounded-2xl border border-[#17243A]/10">
                <button
                  type="button"
                  onClick={() => setActiveLeader('shreyansh')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    activeLeader === 'shreyansh'
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'text-[#252B35]/80 hover:text-[#17243A] hover:bg-white/60'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20 shrink-0">
                    <img
                      src="./assets/aistudio/image_93510b04.png"
                      alt="Shreyansh Gupta"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span>Shreyansh Gupta · Founder</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLeader('paritosh')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    activeLeader === 'paritosh'
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'text-[#252B35]/80 hover:text-[#17243A] hover:bg-white/60'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20 shrink-0">
                    <img
                      src="./assets/aistudio/WhatsApp_Image_2026-11-11_at_8.16.12_PM_2ff73539.jpeg"
                      alt="Paritosh Rana"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span>Paritosh Rana · Managing Director</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLeader('shorya')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    activeLeader === 'shorya'
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'text-[#252B35]/80 hover:text-[#17243A] hover:bg-white/60'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20 shrink-0">
                    <img
                      src="./assets/aistudio/image_1cf77474.png"
                      alt="Shorya Panchal"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span>Shorya Panchal · Co-Founder</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLeader('anubhav')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    activeLeader === 'anubhav'
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'text-[#252B35]/80 hover:text-[#17243A] hover:bg-white/60'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20 shrink-0">
                    <img
                      src="./assets/aistudio/image_d4766d2a.png"
                      alt="Anubhav Gupta"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span>Anubhav Gupta · HR & Volunteers</span>
                </button>
              </div>
            </div>

            {/* Profile Content with Smooth Animation */}
            <AnimatePresence mode="wait">
              {activeLeader === 'shreyansh' ? (
                /* ========================================================= */
                /* 1. SHREYANSH GUPTA — FOUNDER PROFILE                      */
                /* ========================================================= */
                <motion.div
                  key="shreyansh"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
                >
                  {/* Left Column: Founder Portrait */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-md bg-white p-3 sm:p-4 rounded-3xl border border-[#17243A]/10 shadow-md">
                      
                      {/* Photo Container */}
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#17243A]/5 border border-[#17243A]/10 group">
                        <img
                          src={shreyanshPhotos[selectedShreyanshPhoto].src}
                          alt={shreyanshPhotos[selectedShreyanshPhoto].alt}
                          className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-[1.02]"
                          loading="eager"
                        />

                        {/* Photo Switcher Overlay Controls */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#17243A]/85 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-xs">
                          <button
                            type="button"
                            onClick={() => setSelectedShreyanshPhoto('formal')}
                            title="View Formal Portrait"
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                              selectedShreyanshPhoto === 'formal'
                                ? 'bg-[#5B8F8A] text-white shadow-2xs font-semibold'
                                : 'text-[#EEF3F8]/80 hover:text-white'
                            }`}
                          >
                            Formal
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedShreyanshPhoto('campus')}
                            title="View Campus Photo"
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                              selectedShreyanshPhoto === 'campus'
                                ? 'bg-[#5B8F8A] text-white shadow-2xs font-semibold'
                                : 'text-[#EEF3F8]/80 hover:text-white'
                            }`}
                          >
                            Campus
                          </button>
                        </div>

                        {/* Bottom Image Overlay Tag */}
                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-[#17243A]/90 via-[#17243A]/50 to-transparent p-4 text-white flex items-end justify-between">
                          <div>
                            <p className="text-sm font-semibold tracking-wide">Shreyansh Gupta</p>
                            <p className="text-[11px] text-[#EAE5F5]">Delhi Technological University</p>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Caption Below the Image */}
                      <div className="pt-3.5 pb-1 text-center">
                        <p className="text-xs font-semibold text-[#17243A] tracking-tight">
                          Shreyansh Gupta | Founder, Aawaaz Setu
                        </p>
                        <p className="text-[11px] text-[#687385] mt-0.5">
                          Student · Mechanical Engineering, DTU
                        </p>
                      </div>
                    </div>

                    {/* Education Credentials Badges */}
                    <div className="w-full max-w-md mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#17243A]/10 flex items-center gap-2 text-[#252B35] shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#17243A] flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4 text-[#5B8F8A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] text-[#17243A] truncate">DTU, Delhi</p>
                          <p className="text-[10px] text-[#687385] truncate">B.Tech Mechanical Engg.</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#17243A]/10 flex items-center gap-2 text-[#252B35] shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#17243A] flex items-center justify-center shrink-0">
                          <School className="w-4 h-4 text-[#5B8F8A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] text-[#17243A] truncate">KV Janakpuri</p>
                          <p className="text-[10px] text-[#687385] truncate">School Education</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Founder Narrative */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17243A] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                        <Quote className="w-3 h-3 text-[#5B8F8A]" />
                        <span>FOUNDER — AAWAAZ SETU</span>
                      </span>
                      <span className="text-xs font-semibold text-[#5B8F8A]">
                        DTU Student Leadership
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243A] tracking-tight">
                        Meet the Founder: Shreyansh Gupta
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5B8F8A] font-medium mt-1">
                        B.Tech Student, Mechanical Engineering · Delhi Technological University (DTU)
                      </p>
                    </div>

                    <div className="space-y-3.5 text-sm sm:text-base text-[#252B35]/90 leading-relaxed font-normal">
                      <p>
                        “Hello, I’m <strong className="text-[#17243A] font-semibold">Shreyansh Gupta</strong>, a Mechanical Engineering student at Delhi Technological University (DTU), Delhi. I completed my school education at Kendriya Vidyalaya, Janakpuri.”
                      </p>
                      <p>
                        “Aawaaz Setu began with a vision to create a society where no survivor feels unheard, ignored, or alone. I believe that awareness, empathy, dignity, and the courage to speak up can help bring meaningful change.”
                      </p>
                      <p>
                        “Through Aawaaz Setu, my goal is to spread awareness about sexual violence, provide a platform for anonymous voices and survivor stories, encourage understanding and respect, and connect people with credible support resources.”
                      </p>
                      <p>
                        “My long-term vision is to grow Aawaaz Setu into a meaningful awareness initiative that helps raise the voices of those who have been silenced and promotes a safer, more empathetic, and inclusive society for everyone.”
                      </p>
                    </div>

                    {/* Pull Quote Box */}
                    <div className="p-5 sm:p-6 bg-[#17243A] text-white rounded-2xl shadow-xs border border-white/10 relative">
                      <Quote className="w-6 h-6 text-[#5B8F8A] mb-2 opacity-80" />
                      <p className="font-serif italic text-base sm:text-lg text-[#F8F7F3] leading-relaxed">
                        “Aawaaz Setu is not just a website. It is a vision of connecting silence with support, awareness with action, and unheard voices with hope.”
                      </p>
                      <p className="text-xs text-[#EAE5F5] font-semibold mt-3 text-right">
                        — Shreyansh Gupta, Founder
                      </p>
                    </div>

                    {/* Connect with the Founder Section */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#EEF3F8]/90 border border-[#17243A]/15 shadow-2xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17243A] flex items-center gap-1.5">
                          <Linkedin className="w-4 h-4 text-[#0077B5]" />
                          <span>Connect with the Founder</span>
                        </span>
                        <span className="text-[11px] font-semibold text-[#5B8F8A] bg-white px-2.5 py-0.5 rounded-full border border-[#5B8F8A]/20">
                          Founder & DTU Mechanical Engineering
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-[#17243A]">
                        Shreyansh Gupta
                      </h4>
                      <p className="text-xs text-[#5B8F8A] font-medium -mt-2">
                        Founder of Aawaaz Setu | DTU Mechanical Engineering Student
                      </p>

                      <p className="text-xs sm:text-sm text-[#252B35]/90 leading-relaxed font-normal">
                        Aawaaz Setu was founded with a vision to raise awareness, amplify voices, challenge stigma, and promote a more supportive society. Connect with me on LinkedIn to follow my journey, learn about our initiatives, and stay updated on our mission.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <a
                          href="https://www.linkedin.com/in/aawaaz-setu-889b5b449"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#005f93] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer border border-[#0077B5]"
                          title="Official Aawaaz Setu LinkedIn Account"
                        >
                          <Linkedin className="w-3.5 h-3.5 fill-current" />
                          <span>Connect on LinkedIn (Aawaaz Setu)</span>
                          <ExternalLink className="w-3 h-3 text-white/80" />
                        </a>

                        <a
                          href="https://www.linkedin.com/in/shreyansh-gupta-b85ab833b"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#EEF3F8] text-[#0077B5] text-xs font-semibold shadow-2xs hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer border border-[#0077B5]/30"
                          title="Follow Founder Shreyansh Gupta on LinkedIn"
                        >
                          <Linkedin className="w-3.5 h-3.5 fill-current" />
                          <span>Founder's LinkedIn</span>
                          <ExternalLink className="w-3 h-3 text-[#0077B5]" />
                        </a>

                        <a
                          href="#contact"
                          className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#17243A] hover:text-white text-[#17243A] text-xs font-semibold shadow-2xs hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer border border-[#17243A]/15"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#5B8F8A]" />
                          <span>Contact Directly</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setActiveLeader('paritosh')}
                          className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/80 text-[#687385] hover:text-[#17243A] text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <span>Meet Managing Director Paritosh</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : activeLeader === 'paritosh' ? (
                /* ========================================================= */
                /* 2. PARITOSH RANA — MANAGING DIRECTOR PROFILE              */
                /* ========================================================= */
                <motion.div
                  key="paritosh"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
                >
                  {/* Left Column: Managing Director Portrait */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-md bg-white p-3 sm:p-4 rounded-3xl border border-[#17243A]/10 shadow-md">
                      
                      {/* Photo Container */}
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#17243A]/5 border border-[#17243A]/10 group">
                        <img
                          src="./assets/aistudio/WhatsApp_Image_2026-11-11_at_8.16.12_PM_2ff73539.jpeg"
                          alt="Paritosh Rana — Managing Director of Aawaaz Setu"
                          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-[1.02]"
                          loading="eager"
                        />

                        {/* Managing Director Badge Overlay */}
                        <div className="absolute top-3 right-3 bg-[#17243A]/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shadow-xs text-white text-[11px] font-semibold flex items-center gap-1.5">
                          <Shield className="w-3 h-3 text-[#5B8F8A]" />
                          <span>Managing Director</span>
                        </div>

                        {/* Bottom Image Overlay Tag */}
                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-[#17243A]/90 via-[#17243A]/50 to-transparent p-4 text-white flex items-end justify-between">
                          <div>
                            <p className="text-sm font-semibold tracking-wide">Paritosh Rana</p>
                            <p className="text-[11px] text-[#EAE5F5]">Operations & Strategic Leadership</p>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                            <Shield className="w-3.5 h-3.5 text-[#5B8F8A]" />
                          </div>
                        </div>
                      </div>

                      {/* Caption Below the Image */}
                      <div className="pt-3.5 pb-1 text-center">
                        <p className="text-xs font-semibold text-[#17243A] tracking-tight">
                          Paritosh Rana | Managing Director, Aawaaz Setu
                        </p>
                        <p className="text-[11px] text-[#687385] mt-0.5">
                          Leadership, Operational Discipline & Due Process
                        </p>
                      </div>
                    </div>

                    {/* Operational Credentials Badges */}
                    <div className="w-full max-w-md mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#17243A]/10 flex items-center gap-2 text-[#252B35] shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#17243A] flex items-center justify-center shrink-0">
                          <Shield className="w-4 h-4 text-[#5B8F8A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] text-[#17243A] truncate">Operations Lead</p>
                          <p className="text-[10px] text-[#687385] truncate">Strategic Direction</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#17243A]/10 flex items-center gap-2 text-[#252B35] shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#17243A] flex items-center justify-center shrink-0">
                          <Briefcase className="w-4 h-4 text-[#5B8F8A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] text-[#17243A] truncate">Due Process</p>
                          <p className="text-[10px] text-[#687385] truncate">Campaign Scaling</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Managing Director Narrative */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17243A] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                        <Shield className="w-3 h-3 text-[#5B8F8A]" />
                        <span>MANAGING DIRECTOR — AAWAAZ SETU</span>
                      </span>
                      <span className="text-xs font-semibold text-[#5B8F8A]">
                        Executive Leadership & Strategic Operations
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243A] tracking-tight">
                        Meet the Managing Director: Paritosh Rana
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5B8F8A] font-medium mt-1">
                        Managing Director, Aawaaz Setu
                      </p>
                    </div>

                    <div className="space-y-3.5 text-sm sm:text-base text-[#252B35]/90 leading-relaxed font-normal">
                      <p>
                        “Hello, I’m <strong className="text-[#17243A] font-semibold">Paritosh Rana</strong>, the Managing Director of Aawaaz Setu. My journey taught me that true leadership is defined by the responsibility we take for the safety and dignity of those around us.”
                      </p>
                      <p>
                        “At Aawaaz Setu, my mission is to channel that same sense of duty into breaking the silence surrounding sexual violence and mental health struggles.”
                      </p>
                      <p>
                        “By combining structured operational discipline with deep empathy, I work alongside our student leadership team to scale our campus campaigns, champion due process, and ensure that no survivor ever has to navigate their healing journey alone.”
                      </p>
                    </div>

                    {/* Pull Quote Box */}
                    <div className="p-5 sm:p-6 bg-[#17243A] text-white rounded-2xl shadow-xs border border-white/10 relative">
                      <Quote className="w-6 h-6 text-[#5B8F8A] mb-2 opacity-80" />
                      <p className="font-serif italic text-base sm:text-lg leading-relaxed text-[#F8F7F3]">
                        “Courage is the bridge between silence and solidarity. Our duty at Aawaaz Setu is to make sure that bridge never breaks.”
                      </p>
                      <p className="text-xs text-[#5B8F8A] font-medium mt-3">
                        — Paritosh Rana, Managing Director
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href="#contact"
                        className="px-5 py-2.5 rounded-xl bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer border border-[#17243A]"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#EAE5F5]" />
                        <span>Connect With Paritosh</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setActiveLeader('shorya')}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#EEF3F8] text-[#17243A] text-xs font-semibold border border-[#17243A]/15 hover:border-[#5B8F8A]/40 shadow-2xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Meet Co-Founder Shorya</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : activeLeader === 'shorya' ? (
                /* ========================================================= */
                /* 3. SHORYA PANCHAL — CO-FOUNDER PROFILE                    */
                /* ========================================================= */
                <motion.div
                  key="shorya"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
                >
                  {/* Left Column: Co-Founder Portrait */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-md bg-white p-3 sm:p-4 rounded-3xl border border-[#17243A]/10 shadow-md">
                      
                      {/* Photo Container */}
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#17243A]/5 border border-[#17243A]/10 group">
                        <img
                          src="./assets/aistudio/image_1cf77474.png"
                          alt="Shorya Panchal — Co-Founder of Aawaaz Setu in formal black suit"
                          className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-[1.02]"
                          loading="eager"
                        />

                        {/* Co-Founder Badge Overlay */}
                        <div className="absolute top-3 right-3 bg-[#17243A]/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shadow-xs text-white text-[11px] font-semibold flex items-center gap-1.5">
                          <Heart className="w-3 h-3 text-[#5B8F8A]" />
                          <span>Mental Health Lead</span>
                        </div>

                        {/* Bottom Image Overlay Tag */}
                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-[#17243A]/90 via-[#17243A]/50 to-transparent p-4 text-white flex items-end justify-between">
                          <div>
                            <p className="text-sm font-semibold tracking-wide">Shorya Panchal</p>
                            <p className="text-[11px] text-[#EAE5F5]">USICT (GGSIPU), Dwarka</p>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Caption Below the Image */}
                      <div className="pt-3.5 pb-1 text-center">
                        <p className="text-xs font-semibold text-[#17243A] tracking-tight">
                          Shorya Panchal | Co-Founder, Aawaaz Setu
                        </p>
                        <p className="text-[11px] text-[#687385] mt-0.5">
                          Student · B.Tech ECE, USICT (GGSIPU), Dwarka
                        </p>
                      </div>
                    </div>

                    {/* Education Credentials Badges */}
                    <div className="w-full max-w-md mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#17243A]/10 flex items-center gap-2 text-[#252B35] shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#17243A] flex items-center justify-center shrink-0">
                          <Cpu className="w-4 h-4 text-[#5B8F8A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] text-[#17243A] truncate">USICT, Dwarka</p>
                          <p className="text-[10px] text-[#687385] truncate">B.Tech ECE (GGSIPU)</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#17243A]/10 flex items-center gap-2 text-[#252B35] shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#17243A] flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4 text-[#5B8F8A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] text-[#17243A] truncate">Mental Health</p>
                          <p className="text-[10px] text-[#687385] truncate">Advocacy & Support</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Co-Founder Narrative */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17243A] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                        <Quote className="w-3 h-3 text-[#5B8F8A]" />
                        <span>CO-FOUNDER — AAWAAZ SETU</span>
                      </span>
                      <span className="text-xs font-semibold text-[#5B8F8A]">
                        USICT Student Leadership
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243A] tracking-tight">
                        Meet the Co-Founder: Shorya Panchal
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5B8F8A] font-medium mt-1">
                        B.Tech ECE Student · University School of Information, Communication and Technology (USICT), GGSIPU, Dwarka
                      </p>
                    </div>

                    <div className="space-y-3.5 text-sm sm:text-base text-[#252B35]/90 leading-relaxed font-normal">
                      <p>
                        “Hello, I’m <strong className="text-[#17243A] font-semibold">Shorya Panchal</strong>, Co-Founder of Aawaaz Setu and a great friend and partner with Shreyansh Gupta. I am pursuing my B.Tech in Electronics & Communication Engineering (ECE) from USICT (GGSIPU), Dwarka.”
                      </p>
                      <p>
                        “Our initiative was born from the conviction that mental health and emotional well-being should never be neglected. Aawaaz Setu helps people who are suffering from mental health issues, boundary violations, and emotional distress.”
                      </p>
                      <p>
                        “I am deeply passionate about mental health awareness, emotional well-being, and social impact. Working towards building a compassionate community where every individual feels heard, valued, and supported.”
                      </p>
                      <p>
                        “Through Aawaaz Setu, we are creating a trusted sanctuary that bridges silence with solidarity, de-stigmatizes psychological struggles, and ensures that credible support is accessible to all students and community members.”
                      </p>
                    </div>

                    {/* Pull Quote Box */}
                    <div className="p-5 sm:p-6 bg-[#17243A] text-white rounded-2xl shadow-xs border border-white/10 relative">
                      <Quote className="w-6 h-6 text-[#5B8F8A] mb-2 opacity-80" />
                      <p className="font-serif italic text-base sm:text-lg text-[#F8F7F3] leading-relaxed">
                        “Working towards building a compassionate community where every individual feels heard, valued, and supported.”
                      </p>
                      <p className="text-xs text-[#EAE5F5] font-semibold mt-3 text-right">
                        — Shorya Panchal, Co-Founder
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href="#contact"
                        className="px-5 py-2.5 rounded-xl bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer border border-[#17243A]"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#EAE5F5]" />
                        <span>Connect With Shorya</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setActiveLeader('anubhav')}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#EEF3F8] text-[#17243A] text-xs font-semibold border border-[#17243A]/15 hover:border-[#5B8F8A]/40 shadow-2xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Meet HR Manager Anubhav</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ========================================================= */
                /* 3. ANUBHAV GUPTA — HR MANAGER & VOLUNTEER LEAD            */
                /* ========================================================= */
                <motion.div
                  key="anubhav"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
                >
                  {/* Left Column: HR Manager Portrait */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-md bg-white p-3 sm:p-4 rounded-3xl border border-[#17243A]/10 shadow-md">
                      
                      {/* Photo Container */}
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#17243A]/5 border border-[#17243A]/10 group">
                        <img
                          src="./assets/aistudio/image_d4766d2a.png"
                          alt="Anubhav Gupta — Human Resources Manager & Volunteer Lead at Aawaaz Setu"
                          className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-[1.02]"
                          loading="eager"
                        />

                        {/* HR Lead Badge Overlay */}
                        <div className="absolute top-3 right-3 bg-[#17243A]/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shadow-xs text-white text-[11px] font-semibold flex items-center gap-1.5">
                          <UserCheck className="w-3 h-3 text-[#5B8F8A]" />
                          <span>HR & Volunteers</span>
                        </div>

                        {/* Bottom Image Overlay Tag */}
                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-[#17243A]/90 via-[#17243A]/50 to-transparent p-4 text-white flex items-end justify-between">
                          <div>
                            <p className="text-sm font-semibold tracking-wide">Anubhav Gupta</p>
                            <p className="text-[11px] text-[#EAE5F5]">SRCC, University of Delhi</p>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Caption Below the Image */}
                      <div className="pt-3.5 pb-1 text-center">
                        <p className="text-xs font-semibold text-[#17243A] tracking-tight">
                          Anubhav Gupta | HR Manager, Aawaaz Setu
                        </p>
                        <p className="text-[11px] text-[#687385] mt-0.5">
                          Student · B.Com. (Hons.), SRCC, University of Delhi
                        </p>
                      </div>
                    </div>

                    {/* Education Credentials Badges */}
                    <div className="w-full max-w-md mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#17243A]/10 flex items-center gap-2 text-[#252B35] shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#17243A] flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4 text-[#5B8F8A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] text-[#17243A] truncate">SRCC, DU</p>
                          <p className="text-[10px] text-[#687385] truncate">B.Com. (Honours)</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#17243A]/10 flex items-center gap-2 text-[#252B35] shadow-2xs">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#17243A] flex items-center justify-center shrink-0">
                          <School className="w-4 h-4 text-[#5B8F8A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] text-[#17243A] truncate">KV Janakpuri</p>
                          <p className="text-[10px] text-[#687385] truncate">School Education</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: HR Manager Narrative */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17243A] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                        <Briefcase className="w-3 h-3 text-[#5B8F8A]" />
                        <span>HUMAN RESOURCES MANAGER — AAWAAZ SETU</span>
                      </span>
                      <span className="text-xs font-semibold text-[#5B8F8A]">
                        SRCC Student Leadership
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243A] tracking-tight">
                        Meet Anubhav Gupta: HR Manager
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5B8F8A] font-medium mt-1">
                        B.Com. (Honours) Student · Shri Ram College of Commerce (SRCC), University of Delhi
                      </p>
                    </div>

                    <div className="space-y-3.5 text-sm sm:text-base text-[#252B35]/90 leading-relaxed font-normal">
                      <p>
                        “Hello, I’m <strong className="text-[#17243A] font-semibold">Anubhav Gupta</strong>, pursuing B.Com. (Honours) at Shri Ram College of Commerce (SRCC), University of Delhi. I completed my schooling at Kendriya Vidyalaya, Janakpuri.”
                      </p>
                      <p>
                        “Serving as the Human Resources Manager in Aawaaz Setu, I am committed to contributing to the organisation's development and fostering effective, supportive coordination among all its members.”
                      </p>
                      <p>
                        “I actively lead the onboarding, orientation, and engagement of new volunteers, ensuring that every student and passionate advocate joining our mission has clear guidance, meaningful responsibilities, and a welcoming environment.”
                      </p>
                      <p>
                        “I look forward to gaining valuable experience in people management while contributing towards the organisation's broader social objectives—helping people suffering from mental health issues and creating an empathetic community where every voice matters.”
                      </p>
                    </div>

                    {/* Pull Quote Box */}
                    <div className="p-5 sm:p-6 bg-[#17243A] text-white rounded-2xl shadow-xs border border-white/10 relative">
                      <Quote className="w-6 h-6 text-[#5B8F8A] mb-2 opacity-80" />
                      <p className="font-serif italic text-base sm:text-lg text-[#F8F7F3] leading-relaxed">
                        “Fostering effective coordination, empowering volunteers, and contributing towards the organisation's broader social objectives.”
                      </p>
                      <p className="text-xs text-[#EAE5F5] font-semibold mt-3 text-right">
                        — Anubhav Gupta, Human Resources Manager
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href="#contact"
                        className="px-5 py-2.5 rounded-xl bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer border border-[#17243A]"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#EAE5F5]" />
                        <span>Join as a Volunteer</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setActiveLeader('shreyansh')}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#EEF3F8] text-[#17243A] text-xs font-semibold border border-[#17243A]/15 hover:border-[#5B8F8A]/40 shadow-2xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Meet Founder Shreyansh</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom 4-Card Snapshot: Complete Leadership Team Together */}
            <div className="pt-6 border-t border-[#17243A]/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#687385] block mb-3">
                Leadership & Coordination Team Overview
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Shreyansh Card */}
                <div
                  onClick={() => setActiveLeader('shreyansh')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    activeLeader === 'shreyansh'
                      ? 'bg-white border-[#5B8F8A] shadow-xs ring-1 ring-[#5B8F8A]/30'
                      : 'bg-white/60 border-[#17243A]/10 hover:bg-white hover:border-[#17243A]/25'
                  }`}
                >
                  <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#17243A]/5 border border-[#17243A]/10 shrink-0">
                    <img
                      src="./assets/aistudio/image_93510b04.png"
                      alt="Shreyansh Gupta"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-[#17243A] text-sm truncate">
                        Shreyansh Gupta
                      </h4>
                      <span className="text-[9px] font-bold uppercase text-[#5B8F8A] bg-[#EEF3F8] px-1.5 py-0.5 rounded-md">
                        Founder
                      </span>
                    </div>
                    <p className="text-xs text-[#252B35]/80 truncate">B.Tech Mechanical Engg.</p>
                    <p className="text-[10px] text-[#687385] truncate">DTU, Delhi</p>
                  </div>
                </div>

                {/* Paritosh Card */}
                <div
                  onClick={() => setActiveLeader('paritosh')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    activeLeader === 'paritosh'
                      ? 'bg-white border-[#5B8F8A] shadow-xs ring-1 ring-[#5B8F8A]/30'
                      : 'bg-white/60 border-[#17243A]/10 hover:bg-white hover:border-[#17243A]/25'
                  }`}
                >
                  <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#17243A]/5 border border-[#17243A]/10 shrink-0">
                    <img
                      src="./assets/aistudio/WhatsApp_Image_2026-11-11_at_8.16.12_PM_2ff73539.jpeg"
                      alt="Paritosh Rana"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-[#17243A] text-sm truncate">
                        Paritosh Rana
                      </h4>
                      <span className="text-[9px] font-bold uppercase text-[#5B8F8A] bg-[#EEF3F8] px-1.5 py-0.5 rounded-md">
                        Managing Director
                      </span>
                    </div>
                    <p className="text-xs text-[#252B35]/80 truncate">Operations & Due Process</p>
                    <p className="text-[10px] text-[#687385] truncate">Strategic Leadership</p>
                  </div>
                </div>

                {/* Shorya Card */}
                <div
                  onClick={() => setActiveLeader('shorya')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    activeLeader === 'shorya'
                      ? 'bg-white border-[#5B8F8A] shadow-xs ring-1 ring-[#5B8F8A]/30'
                      : 'bg-white/60 border-[#17243A]/10 hover:bg-white hover:border-[#17243A]/25'
                  }`}
                >
                  <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#17243A]/5 border border-[#17243A]/10 shrink-0">
                    <img
                      src="./assets/aistudio/image_1cf77474.png"
                      alt="Shorya Panchal"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-[#17243A] text-sm truncate">
                        Shorya Panchal
                      </h4>
                      <span className="text-[9px] font-bold uppercase text-[#5B8F8A] bg-[#EEF3F8] px-1.5 py-0.5 rounded-md">
                        Co-Founder
                      </span>
                    </div>
                    <p className="text-xs text-[#252B35]/80 truncate">B.Tech ECE</p>
                    <p className="text-[10px] text-[#687385] truncate">USICT (GGSIPU), Dwarka</p>
                  </div>
                </div>

                {/* Anubhav Card */}
                <div
                  onClick={() => setActiveLeader('anubhav')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    activeLeader === 'anubhav'
                      ? 'bg-white border-[#5B8F8A] shadow-xs ring-1 ring-[#5B8F8A]/30'
                      : 'bg-white/60 border-[#17243A]/10 hover:bg-white hover:border-[#17243A]/25'
                  }`}
                >
                  <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#17243A]/5 border border-[#17243A]/10 shrink-0">
                    <img
                      src="./assets/aistudio/image_d4766d2a.png"
                      alt="Anubhav Gupta"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-[#17243A] text-sm truncate">
                        Anubhav Gupta
                      </h4>
                      <span className="text-[9px] font-bold uppercase text-[#5B8F8A] bg-[#EEF3F8] px-1.5 py-0.5 rounded-md">
                        HR & Volunteer
                      </span>
                    </div>
                    <p className="text-xs text-[#252B35]/80 truncate">B.Com. (Honours)</p>
                    <p className="text-[10px] text-[#687385] truncate">SRCC, University of Delhi</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </motion.div>

        {/* Mission Objectives Breakdown */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-[#17243A] mb-6">
            Our Core Mission
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#5B8F8A] mb-3" />
              <h4 className="font-semibold text-[#17243A] mb-2 text-base">Spread Awareness About Sexual Violence & Mental Health</h4>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Provide clear, non-graphic educational frameworks to identify coercion, harassment, and boundary violations across digital and physical spaces, coupled with emotional grounding resources.
              </p>
            </div>

            <div className="p-6 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#5B8F8A] mb-3" />
              <h4 className="font-semibold text-[#17243A] mb-2 text-base">Promote Dignity & Support for All Genders</h4>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Ensure every survivor—women, men, and non-binary individuals—receives respectful, stigma-free affirmation without mockery or bias.
              </p>
            </div>

            <div className="p-6 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#5B8F8A] mb-3" />
              <h4 className="font-semibold text-[#17243A] mb-2 text-base">Encourage Responsible Discussion</h4>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Replace sensationalism and taboo with constructive peer dialogues, compassionate listening, and evidence-based education.
              </p>
            </div>

            <div className="p-6 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#5B8F8A] mb-3" />
              <h4 className="font-semibold text-[#17243A] mb-2 text-base">Promote Fairness, Equality & Due Process</h4>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Stand for justice that respects fundamental rights, fair institutional inquiries, and constitutional safeguards alongside survivor protection.
              </p>
            </div>

            <div className="p-6 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#5B8F8A] mb-3" />
              <h4 className="font-semibold text-[#17243A] mb-2 text-base">Connect with Established Support & Mental Health Care</h4>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Direct individuals to verified government helplines, experienced non-profits, legal aid authorities, and accredited psychological counselors.
              </p>
            </div>

            <div className="p-6 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 hover:border-[#5B8F8A]/40 hover:shadow-xs transition-all duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#5B8F8A] mb-3" />
              <h4 className="font-semibold text-[#17243A] mb-2 text-base">Foster Student Advocacy & Volunteer Mobilization</h4>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
                Empower college campuses across Delhi-NCR (DTU, USICT, SRCC, DU) and beyond to lead active bystander interventions and cultivate supportive communities.
              </p>
            </div>

          </div>
        </div>

        {/* Section: "Our Journey Ahead" (Future Aspirations) */}
        <div className="p-8 sm:p-10 bg-[#17243A] text-white rounded-3xl shadow-sm mb-12 border border-[#17243A]">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EAE5F5] mb-3">
              <Sparkles className="w-4 h-4 text-[#5B8F8A]" />
              <span>Future Road & Aspirations</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-4 text-white">
              Our Journey Ahead
            </h3>
            <p className="text-[#EEF3F8]/90 text-sm sm:text-base leading-relaxed mb-8">
              Aawaaz Setu is at its beginning. As a grassroots student initiative, we look forward to growing responsibly. Our future goals are aspirations that guide our ongoing efforts:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="border-t border-white/15 pt-5">
                <BookOpen className="w-5 h-5 text-[#5B8F8A] mb-2.5" />
                <h4 className="font-semibold text-white mb-1.5 text-base">Campus Awareness & Mental Health Campaigns</h4>
                <p className="text-[#EEF3F8]/80 text-xs leading-relaxed font-normal">
                  Future plans to conduct workshops, educational poster drives, and consent seminars across university campuses like DTU, USICT, and SRCC.
                </p>
              </div>

              <div className="border-t border-white/15 pt-5">
                <Users className="w-5 h-5 text-[#5B8F8A] mb-2.5" />
                <h4 className="font-semibold text-white mb-1.5 text-base">Student Volunteer Network</h4>
                <p className="text-[#EEF3F8]/80 text-xs leading-relaxed font-normal">
                  Coordinated by our HR lead to build a dedicated cohort of trained student peer advocates to support campus awareness and safety.
                </p>
              </div>

              <div className="border-t border-white/15 pt-5">
                <Building2 className="w-5 h-5 text-[#5B8F8A] mb-2.5" />
                <h4 className="font-semibold text-white mb-1.5 text-base">Collaborations with Established NGOs</h4>
                <p className="text-[#EEF3F8]/80 text-xs leading-relaxed font-normal">
                  Seeking future opportunities to collaborate with accredited non-profits and mental health organizations.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#EEF3F8]/60 mt-8 italic">
              * Note: The items above reflect our forward-looking milestones and goals, not existing partnerships or formal affiliations.
            </p>
          </div>
        </div>

        {/* Honest Disclosure Box - Calming neutral palette */}
        <div className="p-5 sm:p-6 bg-[#EEF3F8]/60 border border-[#17243A]/10 rounded-2xl flex items-start gap-4 text-xs text-[#252B35] leading-relaxed">
          <AlertCircle className="w-5 h-5 text-[#5B8F8A] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wide text-[#17243A] block mb-1">Important Transparency Disclosure:</span>
            Aawaaz Setu is currently an independent, student-led awareness initiative founded by DTU student Shreyansh Gupta and co-founded by USICT student Shorya Panchal, with HR coordination by SRCC student Anubhav Gupta. It is <strong>not a registered NGO</strong> and does not claim official government registration, institutional partnerships, professional psychological counselling, or medical services. We act strictly as an educational and peer awareness platform connecting people with verified external support bodies.
          </div>
        </div>

      </div>
    </section>
  );
};
