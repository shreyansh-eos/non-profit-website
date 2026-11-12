import React from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, Users, Sparkles, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

export const VolunteerSection: React.FC = () => {
  const volunteerFormUrl = 'https://forms.gle/C3PwTZ7HSacA84Tt9';

  return (
    <section id="volunteer" className="py-20 sm:py-24 bg-[#F8F7F3] border-b border-[#17243A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Volunteer Feature Card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#17243A] text-white p-8 sm:p-12 lg:p-16 border border-[#17243A] shadow-xl">
          
          {/* Subtle Background Geometric Accents */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#5B8F8A]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#EAE5F5]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Messaging */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-wider text-[#EAE5F5]">
                <HeartHandshake className="w-4 h-4 text-[#5B8F8A]" />
                <span>Volunteer Registration Form</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Join as a Volunteer
              </h2>

              <p className="font-serif italic text-lg sm:text-xl text-[#EAE5F5]">
                "Be a voice for awareness, compassion, and change. Join our volunteer community and help us make a difference."
              </p>

              <p className="text-sm sm:text-base text-[#EEF3F8]/85 leading-relaxed font-normal max-w-2xl">
                We invite university students, campus ambassadors, peer listeners, and passionate individuals across India to join the Aawaaz Setu initiative. Whether you want to lead on-campus awareness drives, contribute editorial support, coordinate survivor resources, or design solidarity toolkits, your voice matters.
              </p>

              {/* Impact Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#EEF3F8]">
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#5B8F8A] shrink-0" />
                  <span>Campus Advocacy</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#5B8F8A] shrink-0" />
                  <span>Resource Curation</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#5B8F8A] shrink-0" />
                  <span>Peer Solidarity</span>
                </div>
              </div>

            </div>

            {/* Right Column: Action Card with Prominent Button */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-white text-[#17243A] shadow-lg border border-[#17243A]/10 space-y-6 text-center sm:text-left">
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#5B8F8A]/15 text-[#5B8F8A] flex items-center justify-center border border-[#5B8F8A]/25 shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8F8A] block">
                      Official Registration
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#17243A]">
                      Volunteer Community
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#252B35]/80 leading-relaxed font-normal">
                  Fill out our official registration form to tell us about your skills, university/city, and the awareness areas you are excited to support.
                </p>

                <div className="pt-2">
                  <a
                    href={volunteerFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-2xl bg-[#17243A] hover:bg-[#252B35] text-white font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center justify-center gap-2.5 group cursor-pointer border border-[#17243A]"
                    title="Open Volunteer Registration Form in a new tab"
                  >
                    <HeartHandshake className="w-4 h-4 text-[#EAE5F5] group-hover:scale-110 transition-transform" />
                    <span>Become a Volunteer</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#EEF3F8]/70 group-hover:text-white transition-colors" />
                  </a>
                </div>

                <div className="text-[11px] text-[#687385] text-center pt-1 border-t border-[#17243A]/10 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5B8F8A]" />
                  <span>Student-led & Volunteer-powered Initiative</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
