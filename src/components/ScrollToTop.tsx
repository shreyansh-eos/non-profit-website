import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (approx. 450px)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className="fixed bottom-22 right-5 md:right-7 z-30 p-3 rounded-full bg-[#17243A] text-[#F8F7F3] border border-white/20 shadow-lg hover:shadow-xl hover:bg-[#252B35] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#5B8F8A]"
    >
      <ArrowUp className="w-5 h-5 text-[#EAE5F5] group-hover:text-white transition-colors" />
    </button>
  );
};
