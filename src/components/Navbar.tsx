import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, ArrowUpRight, Lock, Gamepad2 } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenDisclaimer: () => void;
  onOpenGame?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenGame,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickExit = () => {
    // Immediate redirect to an innocuous site for user safety
    window.location.replace('https://www.google.com');
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Awareness', href: '#awareness' },
    { name: 'Survivor Stories', href: '#stories' },
    { name: 'Share Story', href: '#share-story' },
    { name: 'Find Support', href: '#support' },
    { name: 'Resources', href: '#resources' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Banner Notice for Emergency Safety */}
      <div className="bg-[#17243A] text-[#EEF3F8] text-xs py-2 px-4 border-b border-[#5B8F8A]/25">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <p className="truncate text-xs font-normal">
            <span className="font-semibold text-[#EAE5F5]">Student-Led Awareness:</span> Aawaaz Setu is an educational initiative, not an emergency service. In immediate danger, call 112.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleQuickExit}
              title="Quickly exit this site and open Google"
              className="px-2.5 py-1 text-[11px] font-medium bg-[#252B35] hover:bg-rose-950 text-rose-200 border border-rose-400/30 rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer shadow-xs active:scale-95"
            >
              Quick Exit (Google)
            </button>
            <button
              onClick={onOpenAdmin}
              title="Admin Moderation Portal"
              className="text-[#687385] hover:text-[#EEF3F8] p-1 rounded transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar following 3-Zone Contract */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F7F3]/95 backdrop-blur-md shadow-xs border-b border-[#17243A]/10'
            : 'bg-[#F8F7F3] border-b border-[#17243A]/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single line, no clutter) */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-[#17243A] group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-xs border border-[#17243A]/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="./assets/aistudio/Aawaaz_setu_logo_02eff1ad.jpeg"
                alt="Aawaaz Setu Logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight text-[#17243A] leading-none group-hover:text-[#5B8F8A] transition-colors">
                Aawaaz Setu
              </span>
              <span className="text-[10px] text-[#5B8F8A] font-semibold tracking-wider uppercase mt-1">
                Awareness Initiative
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (concise, single-line, whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#252B35]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="whitespace-nowrap hover:text-[#5B8F8A] transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#5B8F8A] after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions (PWA Install, Take a Break, Find Support) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <PWAInstallButton />

            {onOpenGame && (
              <button
                onClick={onOpenGame}
                className="px-3.5 py-2 text-xs font-bold text-[#17243A] bg-[#EAE5F5] hover:bg-[#DDD5EE] border border-[#5B8F8A]/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                title="Play Aawaaz Run — A Peaceful Escape mini-game (works offline!)"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#5B8F8A]" />
                <span>Take a Break 🎮</span>
              </button>
            )}

            <a
              href="#support"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap shadow-xs flex items-center gap-1.5 border border-[#17243A]"
            >
              <Shield className="w-3.5 h-3.5 text-[#EAE5F5]" />
              <span>Find Support</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#252B35] hover:text-[#17243A] rounded-xl hover:bg-[#EEF3F8] transition-colors focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F8F7F3] border-b border-[#17243A]/10 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-base font-medium text-[#252B35] hover:bg-[#EEF3F8] hover:text-[#17243A] rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-[#17243A]/10 flex flex-col gap-2">
              {onOpenGame && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGame();
                  }}
                  className="w-full text-center px-4 py-3 text-sm font-bold text-[#17243A] bg-[#EAE5F5] hover:bg-[#DDD5EE] border border-[#5B8F8A]/30 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4 text-[#5B8F8A]" />
                  <span>Take a Break 🎮 (Aawaaz Run)</span>
                </button>
              )}
              <div className="flex justify-center pt-1">
                <PWAInstallButton />
              </div>
              <a
                href="#support"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-3 text-sm font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl shadow-xs"
              >
                Find Support & Helplines
              </a>
              <button
                onClick={handleQuickExit}
                className="w-full py-2.5 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 rounded-xl text-center"
              >
                Emergency Quick Exit
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
