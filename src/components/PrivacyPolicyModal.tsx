import React from 'react';
import { X, Shield } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
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
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A]">
                Privacy Policy
              </h3>
              <p className="text-xs text-[#687385]">
                Aawaaz Setu — Ethical Standards & Data Transparency
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
        <div className="space-y-5 text-xs sm:text-sm text-[#252B35]/85 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 font-normal">
          <div>
            <h4 className="font-bold text-[#17243A] mb-1">1. Non-Commercial, Student-Led Mission</h4>
            <p>
              Aawaaz Setu is an independent, non-commercial awareness initiative founded by DTU student Shreyansh Gupta and co-founded by USICT student Shorya Panchal. We do not sell data, run tracking trackers, or monetize visitor interactions in any form.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17243A] mb-1">2. Story Submission & Mandatory Review Protocol</h4>
            <p>
              Every story or confession submitted via email, Google Form, or on-site interface is subject to careful human review before any publication consideration. We never automatically publish user submissions.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17243A] mb-1">3. Privacy Redaction & De-Identification</h4>
            <p>
              If a survivor grants explicit consent for their submission to be featured on our website, our review process removes all identifying references (such as personal names, locations, phone numbers, and academic institutions) to safeguard survivor confidentiality.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#17243A] mb-1">4. Right to Unpublish or Delete</h4>
            <p>
              If you have shared an experience and later wish to withdraw it, contact us at <span className="font-mono text-[#17243A]">ProjectAawaazUni@gmail.com</span> with details, and your submission will be removed promptly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#17243A]/10 flex items-center justify-between">
          <span className="text-[11px] text-[#687385]">Aawaaz Setu — Safety First</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 cursor-pointer shadow-xs"
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
};
