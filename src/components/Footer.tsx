import React, { useState } from 'react';
import { Lock, Mail, Check, ArrowRight } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
  onOpenPrivacy: () => void;
  onOpenDisclaimer: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenPrivacy,
  onOpenDisclaimer,
  onOpenAdmin,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      const stored = localStorage.getItem('aawaaz_setu_newsletter');
      const list = stored ? JSON.parse(stored) : [];
      list.push({ email: newsletterEmail.trim(), subscribedAt: new Date().toISOString() });
      localStorage.setItem('aawaaz_setu_newsletter', JSON.stringify(list));
    } catch (err) {
      console.error('Failed to store newsletter subscriber', err);
    }

    setIsSubscribed(true);
    setNewsletterEmail('');
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#17243A] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Logo, Tagline & Description */}
          <div className="lg:col-span-5 space-y-4">
            <a
              href="#top"
              onClick={handleScrollToTop}
              className="flex items-center gap-3 group inline-flex"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/15 flex items-center justify-center shadow-xs">
                <img
                  src="./assets/aistudio/Aawaaz_setu_logo_02eff1ad.jpeg"
                  alt="Aawaaz Setu Emblem"
                  className="w-full h-full object-cover rounded-[9px]"
                />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white group-hover:text-[#EAE5F5] transition-colors">
                Aawaaz Setu
              </span>
            </a>

            <p className="font-serif italic text-base text-[#EAE5F5]">
              "Every Voice Deserves to Be Heard."
            </p>

            <p className="text-xs sm:text-sm text-[#EEF3F8]/80 leading-relaxed max-w-md font-normal">
              An independent student-led awareness initiative bridging silence with solidarity, dedicated to promoting survivor dignity, equality, and accessible support resources.
            </p>

            <div className="text-xs text-[#EEF3F8]/60 pt-2">
              <span>Official Email: </span>
              <a
                href={`mailto:${config.email}`}
                className="text-white hover:text-[#5B8F8A] underline transition-colors"
              >
                {config.email}
              </a>
            </div>

            {/* Discreet Minimalist Newsletter Box */}
            <div className="pt-3 max-w-md">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#EAE5F5] block mb-1.5">
                Stay Informed
              </span>
              <p className="text-xs text-[#EEF3F8]/70 mb-2.5">
                Receive occasional, discreet email updates on community awareness campaigns and student solidarity initiatives.
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#5B8F8A]/20 border border-[#5B8F8A]/40 text-xs text-[#EAE5F5]">
                  <Check className="w-4 h-4 text-[#5B8F8A]" />
                  <span>Thank you for subscribing. We will keep you quietly updated.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-1.5">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-xl p-1 focus-within:border-[#5B8F8A] transition-colors">
                    <Mail className="w-4 h-4 text-[#EEF3F8]/50 ml-2.5 shrink-0" />
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="bg-transparent text-xs text-white placeholder-[#EEF3F8]/40 focus:outline-hidden w-full px-2 py-1.5"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-[#5B8F8A] hover:bg-[#4d7d79] text-white text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Join</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  {errorMsg && (
                    <p className="text-[11px] text-rose-300 pl-1">{errorMsg}</p>
                  )}
                  <p className="text-[10px] text-[#EEF3F8]/50 pl-1">
                    No spam, ever. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EAE5F5] block">
              Navigation
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#EEF3F8]/80">
              <a
                href="#top"
                onClick={handleScrollToTop}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </a>
              <a href="#about" className="hover:text-white transition-colors">About Us</a>
              <a href="#founder" className="hover:text-white transition-colors">Meet Founder</a>
              <a href="#awareness" className="hover:text-white transition-colors">Awareness</a>
              <a href="#share-story" className="hover:text-white transition-colors">Share Your Story</a>
              <a href="#stories" className="hover:text-white transition-colors">Survivor Stories</a>
              <a href="#support" className="hover:text-white transition-colors">Find Support</a>
              <a href="#resources" className="hover:text-white transition-colors">Resources</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={onOpenDisclaimer}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Terms & Disclaimer
              </button>
            </div>
          </div>

          {/* Col 3: Emergency Reminder & Admin Portal */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">
              Emergency Assistance
            </span>
            <p className="text-xs text-[#EEF3F8]/80 leading-relaxed font-normal">
              If you or someone you know is in immediate danger, contact emergency services immediately:
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs">
              <a
                href="tel:112"
                className="py-2 px-3 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl font-mono font-semibold transition-colors flex items-center justify-between"
              >
                <span>National Emergency</span>
                <span>112</span>
              </a>
              <a
                href="tel:1091"
                className="py-2 px-3 bg-[#5B8F8A]/20 text-[#EAE5F5] hover:bg-[#5B8F8A]/30 border border-[#5B8F8A]/30 rounded-xl font-mono font-semibold transition-colors flex items-center justify-between"
              >
                <span>Women Helpline</span>
                <span>1091</span>
              </a>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[11px] text-[#EEF3F8]/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Secure Admin Dashboard</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Mandatory Transparency Notice & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EEF3F8]/60">
          <p>
            © 2026 Aawaaz Setu. All rights reserved.
          </p>

          <p className="text-center sm:text-right text-[11px]">
            "Aawaaz Setu is an independent student-led awareness initiative and is not a registered NGO or professional counselling service."
          </p>
        </div>

      </div>
    </footer>
  );
};
