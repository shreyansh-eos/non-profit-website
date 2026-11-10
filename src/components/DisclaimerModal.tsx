import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17243A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#17243A]/10 relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#17243A]/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF3F8] text-[#5B8F8A] flex items-center justify-center border border-[#5B8F8A]/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A]">
                Legal & Operational Disclaimer
              </h3>
              <p className="text-xs text-[#687385]">
                Aawaaz Setu — Essential Transparency & Scope
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#687385] hover:text-[#17243A] rounded-xl hover:bg-[#EEF3F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm text-[#252B35]/85 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 font-normal">
          <div className="p-4 bg-[#EEF3F8] border border-[#17243A]/10 rounded-2xl">
            <strong className="text-[#17243A] block mb-1">Not a Registered NGO:</strong>
            <p className="text-[#252B35]/80 text-xs">
              Aawaaz Setu is an independent, student-led awareness initiative started by DTU student Shreyansh Gupta and co-founded by USICT student Shorya Panchal. It is currently <strong>not a registered non-governmental organization (NGO)</strong>, non-profit society, or trust under Indian law.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17243A] mb-1">No Professional Legal, Medical, or Psychiatric Services</h4>
            <p>
              The content provided across Aawaaz Setu—including educational articles, legal summaries, bystander tips, and breathing tools—is prepared for general awareness and educational discussion only. It does not constitute professional legal advice, formal police investigation, medical diagnosis, or licensed psychiatric therapy.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17243A] mb-1">Crisis & Immediate Harm Protocol</h4>
            <p>
              Aawaaz Setu does not operate a 24/7 crisis dispatch team. If you or someone you know is in immediate physical danger, experiencing suicidal thoughts, or requires immediate medical or law enforcement intervention, please directly dial:
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
              <a href="tel:112" className="px-3 py-1.5 bg-[#17243A] text-white rounded-xl font-bold">112 (National Emergency)</a>
              <a href="tel:1091" className="px-3 py-1.5 bg-[#5B8F8A] text-white rounded-xl font-bold">1091 (Women Helpline)</a>
              <a href="tel:14416" className="px-3 py-1.5 bg-[#EEF3F8] text-[#17243A] border border-[#17243A]/10 rounded-xl font-bold">14416 (Tele-MANAS)</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#17243A] mb-1">Non-Affiliation Notice for External Resources</h4>
            <p>
              External support resources, government numbers, and NGO directories displayed on this website are provided solely as public interest information. Aawaaz Setu does not claim official affiliation, partnership, or sponsorship with any external organization listed.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17243A] mb-1">Fairness, Due Process & Integrity</h4>
            <p>
              We firmly support survivors while upholding respect for truth, constitutional dignity, and due process. We reject online mob justice, harassment campaigns, and unverified vigilantism.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#17243A]/10 flex items-center justify-between">
          <span className="text-[11px] text-[#687385]">Independent Student Initiative</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 cursor-pointer shadow-xs"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
