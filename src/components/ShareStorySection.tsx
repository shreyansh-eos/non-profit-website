import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ExternalLink, ShieldCheck, AlertTriangle, Send, CheckCircle2, Settings, FileText } from 'lucide-react';
import { Story, SiteConfig, StoryCategory, AuthorCreditPreference } from '../types';

interface ShareStorySectionProps {
  config: SiteConfig;
  onUpdateConfig: (newConfig: Partial<SiteConfig>) => void;
  onSubmitStory: (story: Omit<Story, 'id' | 'status' | 'date' | 'submittedAt'>) => void;
}

export const ShareStorySection: React.FC<ShareStorySectionProps> = ({
  config,
  onUpdateConfig,
  onSubmitStory,
}) => {
  const [preferredName, setPreferredName] = useState('');
  const [creditPreference, setCreditPreference] = useState<AuthorCreditPreference>('Anonymous');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<StoryCategory>('Anonymous Stories');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [consentGiven, setConsentGiven] = useState(false); // Optional for publication
  const [privacySanitized, setPrivacySanitized] = useState(true);
  const [allowContact, setAllowContact] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [editingFormUrl, setEditingFormUrl] = useState(false);
  const [tempFormUrl, setTempFormUrl] = useState(config.googleFormUrl);
  const [showFormGuide, setShowFormGuide] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const mailtoHref = `mailto:${config.email}?subject=${encodeURIComponent(
    'Aawaaz Setu — Story Submission'
  )}&body=${encodeURIComponent(
    `Dear Aawaaz Setu Team,\n\nI would like to share my story with your awareness initiative.\n\n[Credit Preference]: Anonymous / Pseudonym / First name\n[Preferred Name]: \n[Story Title]: \n[My Story / Experience]: \n\n[Publication Consent]: (Yes / No) - I agree / do not agree for this story to be considered for anonymous publication after review with identifying details removed.\n\nThank you.`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!storyContent.trim()) {
      setErrorMessage('Please write your story or experience before submitting.');
      return;
    }

    if (storyContent.trim().length < 30) {
      setErrorMessage('Please provide a little more context (at least 30 characters) so our review team can understand.');
      return;
    }

    // Note: Publication consent is NOT mandatory for general confession submissions as specified in Section 9
    onSubmitStory({
      authorName: preferredName.trim() || 'Anonymous Survivor',
      creditPreference,
      category,
      title: storyTitle.trim() || 'Survivor Experience',
      excerpt: storyContent.trim().slice(0, 180) + '...',
      content: storyContent.trim(),
      consentGiven, // whether author opted in for public publishing
      privacySanitized,
      email: email.trim() || undefined,
      allowContact,
    });

    setIsSubmitted(true);
  };

  const handleSaveFormUrl = () => {
    onUpdateConfig({ googleFormUrl: tempFormUrl });
    setEditingFormUrl(false);
  };

  return (
    <section id="share-story" className="py-20 sm:py-24 bg-white border-b border-[#17243A]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-3">
            <span>Confidential & Anonymous Submission</span>
            <span aria-hidden="true" className="text-[#687385]">·</span>
            <span>Your Voice Matters</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243A] tracking-tight mb-4">
            Share Your Story
          </h2>
          <p className="text-base sm:text-lg text-[#252B35]/85 leading-relaxed">
            Speaking up is a deeply personal and courageous step. Whether you wish to remain entirely anonymous or share your journey with your preferred name, this platform exists to honor your voice without judgment.
          </p>
        </motion.div>

        {/* Mandatory Section 9 Card: "Before submitting, please remember" */}
        <div className="p-6 sm:p-8 bg-[#EEF3F8]/70 rounded-3xl border border-[#17243A]/10 mb-12 shadow-2xs">
          <h3 className="font-serif text-lg font-bold text-[#17243A] mb-3 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#5B8F8A]" />
            <span>Before submitting, please remember:</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#252B35]/85 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] shrink-0 mt-2" />
              <span>Do not include your full name unless you genuinely wish to.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] shrink-0 mt-2" />
              <span>Avoid sharing addresses, phone numbers, or identifying information.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] shrink-0 mt-2" />
              <span>Do not include another person's private information.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] shrink-0 mt-2" />
              <span>Do not submit threats, harassment, or graphic descriptions.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] shrink-0 mt-2" />
              <span>Sharing a story does not guarantee publication.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8F8A] shrink-0 mt-2" />
              <span>Stories will never be published without explicit permission.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-2" />
              <span className="font-semibold text-[#17243A]">Aawaaz Setu is not a professional counselling or emergency service.</span>
            </li>
          </ul>
        </div>

        {/* Two Prominent Action Channels: Email Us & Google Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          
          {/* Button 1: Email Us with Prefilled Subject */}
          <div className="p-7 sm:p-8 bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 flex flex-col justify-between hover:border-[#5B8F8A]/30 hover:shadow-xs transition-all duration-300">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#17243A] text-white flex items-center justify-center mb-5 shadow-xs border border-[#5B8F8A]/20">
                <Mail className="w-5 h-5 text-[#EAE5F5]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17243A] mb-2">
                Submit via Direct Email
              </h3>
              <p className="text-xs sm:text-sm text-[#252B35]/80 leading-relaxed mb-4">
                Send your submission directly to our private inbox. Subject line is prefilled for your convenience: <span className="font-mono text-[#17243A]">Aawaaz Setu — Story Submission</span>.
              </p>
              <div className="text-xs text-[#687385] mb-6 font-mono">
                Recipient: <strong className="text-[#17243A]">{config.email}</strong>
              </div>
            </div>

            <a
              href={mailtoHref}
              className="w-full py-3.5 px-4 text-center text-sm font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs shadow-2xs flex items-center justify-center gap-2 cursor-pointer border border-[#17243A]"
            >
              <Mail className="w-4 h-4 text-[#EAE5F5]" />
              <span>Email Us ({config.email})</span>
            </a>
          </div>

          {/* Button 2: Submit Through Google Form (Configurable) */}
          <div className="p-7 sm:p-8 bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 flex flex-col justify-between hover:border-[#5B8F8A]/30 hover:shadow-xs transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-[#5B8F8A]/15 text-[#5B8F8A] flex items-center justify-center border border-[#5B8F8A]/20">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFormGuide(!showFormGuide)}
                    className="text-xs text-[#5B8F8A] hover:text-[#17243A] flex items-center gap-1 p-1 transition-colors cursor-pointer"
                    title="View Recommended Google Form Fields"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Form Fields</span>
                  </button>
                  <button
                    onClick={() => setEditingFormUrl(!editingFormUrl)}
                    title="Configure Google Form URL"
                    className="text-xs text-[#687385] hover:text-[#17243A] flex items-center gap-1 p-1 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure URL</span>
                  </button>
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#17243A] mb-2">
                Submit Through Google Form
              </h3>
              <p className="text-xs sm:text-sm text-[#252B35]/80 leading-relaxed mb-4">
                Prefer submitting via a standardized Google Form? You can submit your confession or experience anonymously through our official form.
              </p>

              {editingFormUrl ? (
                <div className="mb-4 p-4 bg-white rounded-2xl border border-[#17243A]/10 text-xs space-y-2.5">
                  <label className="font-semibold text-[#17243A] block">Set your Google Form URL:</label>
                  <input
                    type="url"
                    value={tempFormUrl}
                    onChange={(e) => setTempFormUrl(e.target.value)}
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                    className="w-full px-3 py-2 border border-[#17243A]/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingFormUrl(false)}
                      className="px-3 py-1 text-[#687385] hover:text-[#17243A] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveFormUrl}
                      className="px-4 py-1.5 bg-[#17243A] text-white rounded-lg font-medium cursor-pointer"
                    >
                      Save URL
                    </button>
                  </div>
                </div>
              ) : null}

              {showFormGuide && (
                <div className="mb-4 p-4 bg-white rounded-2xl border border-[#17243A]/10 text-xs text-[#252B35] space-y-2">
                  <div className="font-bold text-[#17243A]">Section 10 Recommended Google Form Fields:</div>
                  <ol className="list-decimal pl-4 space-y-1 text-[#252B35]/80">
                    <li>What would you like to submit? (Personal Experience / Confession / Awareness Story / Message)</li>
                    <li>Story Title (Optional)</li>
                    <li>Story or Experience (Long-answer)</li>
                    <li>How would you prefer your story to be credited? (Anonymous / Pseudonym / First name)</li>
                    <li>Do you consent to your story being considered for publication? (Yes / No)</li>
                    <li>Agree to identifying details removal? (Yes / No)</li>
                    <li>Would you like to be contacted? (Yes via email / No)</li>
                    <li>Email address (Optional)</li>
                    <li>Consent acknowledgment checkbox</li>
                  </ol>
                </div>
              )}
            </div>

            {config.googleFormUrl ? (
              <a
                href={config.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 text-center text-sm font-semibold text-[#17243A] bg-white hover:bg-[#EEF3F8] border border-[#17243A]/20 hover:border-[#17243A]/40 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Google Form</span>
                <ExternalLink className="w-4 h-4 text-[#5B8F8A]" />
              </a>
            ) : (
              <button
                onClick={() => setEditingFormUrl(true)}
                className="w-full py-3.5 px-4 text-center text-sm font-semibold text-[#687385] bg-[#EEF3F8] hover:bg-[#EAE5F5] border border-dashed border-[#17243A]/20 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#5B8F8A]" />
                <span>Configure Google Form Link</span>
              </button>
            )}
          </div>

        </div>

        {/* On-Site Story Submission Form */}
        <div className="bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 p-6 sm:p-10 shadow-xs">
          
          <div className="mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#17243A] mb-2">
              Submit Anonymously On-Site
            </h3>
            <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal">
              You can also share directly below. Submissions are securely queued for manual review. We sanitize identifying names, places, and sensitive identifiers before any publication consideration.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 sm:p-10 bg-white rounded-2xl border border-[#5B8F8A]/30 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3F8] text-[#5B8F8A] flex items-center justify-center mx-auto border border-[#5B8F8A]/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A]">
                Thank You for Trusting Us With Your Story
              </h4>
              <p className="text-sm text-[#252B35]/80 max-w-lg mx-auto leading-relaxed font-normal">
                Your experience has been securely submitted to the Aawaaz Setu review queue. Our team reviews every submission with care.
                {consentGiven ? (
                  <span> Because you consented to publication, our team will review and redact identifying details before considering it for public display.</span>
                ) : (
                  <span> As requested, your submission will remain completely private to our awareness team and will <strong>not</strong> be published publicly.</span>
                )}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setStoryContent('');
                    setStoryTitle('');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-[#17243A] bg-[#EEF3F8] hover:bg-[#EAE5F5] rounded-xl transition-colors cursor-pointer border border-[#17243A]/10"
                >
                  Submit Another Story or Confession
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                    How would you prefer your story credited?
                  </label>
                  <select
                    value={creditPreference}
                    onChange={(e) => setCreditPreference(e.target.value as AuthorCreditPreference)}
                    className="w-full px-4 py-3 bg-white border border-[#17243A]/15 rounded-xl text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  >
                    <option value="Anonymous">Anonymous</option>
                    <option value="Anonymous with a pseudonym">Anonymous with a pseudonym</option>
                    <option value="First name only">First name only</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                    Preferred Name / Pseudonym <span className="text-[#687385] font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="e.g. Anonymous Survivor, DTU Student, etc."
                    className="w-full px-4 py-3 bg-white border border-[#17243A]/15 rounded-xl text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                  <p className="text-[11px] text-[#687385] mt-1">Leave blank to display as "Anonymous Survivor".</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                    Story Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StoryCategory)}
                    className="w-full px-4 py-3 bg-white border border-[#17243A]/15 rounded-xl text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  >
                    <option value="Survivor Experiences">Survivor Experiences</option>
                    <option value="Anonymous Stories">Anonymous Stories</option>
                    <option value="Awareness Stories">Awareness Stories</option>
                    <option value="Personal Reflections">Personal Reflections</option>
                    <option value="Recovery and Support">Recovery and Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                    Story Title <span className="text-[#687385] font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="e.g. Reclaiming safety after silence"
                    className="w-full px-4 py-3 bg-white border border-[#17243A]/15 rounded-xl text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                  Your Story or Experience <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={6}
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Share your thoughts, journey, feelings, or message to other survivors. Please avoid mentioning specific phone numbers, real names of individuals, or identifiable addresses to ensure safety and privacy..."
                  className="w-full px-4 py-3 bg-white border border-[#17243A]/15 rounded-xl text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A] leading-relaxed"
                  required
                />
                <div className="flex justify-between items-center text-[11px] text-[#687385] mt-1">
                  <span>Take all the space you need. Every expression is valid.</span>
                  <span>{storyContent.length} characters</span>
                </div>
              </div>

              {/* Optional Contact Settings */}
              <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowContact}
                    onChange={(e) => setAllowContact(e.target.checked)}
                    className="h-4 w-4 text-[#5B8F8A] rounded border-[#17243A]/20 focus:ring-[#5B8F8A]"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#252B35]">
                    Would you like to be contacted regarding your submission? (Optional)
                  </span>
                </label>

                {allowContact && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                      Email Address (Confidential)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                    />
                    <p className="text-[11px] text-[#687385] mt-1">Never displayed publicly or shared with third parties.</p>
                  </div>
                )}
              </div>

              {/* SECTION 9 CONSENT NOTICE & PUBLICATION OPTION (NOT MANDATORY FOR SUBMISSION) */}
              <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 space-y-4">
                <div className="text-xs text-[#252B35]/85 leading-relaxed bg-[#EEF3F8] p-4 rounded-xl border border-[#5B8F8A]/20">
                  <strong className="text-[#17243A]">Consent Notice:</strong> "By submitting a story, you understand that Aawaaz Setu may review it for awareness purposes. Publication is optional and requires separate explicit permission. You may choose to submit your story without agreeing to publication."
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#5B8F8A] rounded border-[#17243A]/20 focus:ring-[#5B8F8A]"
                  />
                  <span className="text-xs sm:text-sm text-[#252B35] leading-normal">
                    <strong>Publication Consent (Optional):</strong> I consent to my story being considered for anonymous public publication on the Aawaaz Setu website after review.
                  </span>
                </label>

                {consentGiven && (
                  <label className="flex items-start gap-3 cursor-pointer pl-6">
                    <input
                      type="checkbox"
                      checked={privacySanitized}
                      onChange={(e) => setPrivacySanitized(e.target.checked)}
                      className="mt-1 h-4 w-4 text-[#5B8F8A] rounded border-[#17243A]/20 focus:ring-[#5B8F8A]"
                    />
                    <span className="text-xs text-[#687385] leading-normal">
                      I agree that identifying details (names, institutions, locations) may be removed or edited for privacy and clarity before any publication.
                    </span>
                  </label>
                )}
              </div>

              {/* Crucial Ethical Warning Notice */}
              <div className="p-4 bg-[#EEF3F8] border border-[#17243A]/10 rounded-2xl text-xs text-[#252B35] leading-relaxed flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#5B8F8A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#17243A]">Important Notice on Digital Transmission:</strong> We do not promise absolute confidentiality across open electronic networks. All submissions are manually reviewed before any publication consideration. Submission does not guarantee response or publication.
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#17243A] hover:bg-[#252B35] text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md shadow-xs flex items-center gap-2 cursor-pointer border border-[#17243A]"
                >
                  <Send className="w-4 h-4 text-[#EAE5F5]" />
                  <span>Submit Story to Review Queue</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
