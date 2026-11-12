import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ShieldCheck, AlertTriangle, Send, CheckCircle2, Copy, Check, MessageSquare } from 'lucide-react';
import { Story, SiteConfig, StoryCategory, AuthorCreditPreference } from '../types';

interface ShareStorySectionProps {
  config: SiteConfig;
  onUpdateConfig?: (newConfig: Partial<SiteConfig>) => void;
  onSubmitStory: (story: Omit<Story, 'id' | 'status' | 'date' | 'submittedAt'>) => void;
  onOpenConversationLookup?: (code?: string) => void;
}

export const ShareStorySection: React.FC<ShareStorySectionProps> = ({
  config,
  onUpdateConfig,
  onSubmitStory,
  onOpenConversationLookup,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string>('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const mailtoHref = `mailto:${config.email}?subject=${encodeURIComponent(
    'Aawaaz Setu — Story Submission'
  )}&body=${encodeURIComponent(
    `Dear Aawaaz Setu Team,\n\nI would like to share my story with your awareness initiative.\n\n[Credit Preference]: Anonymous / Pseudonym / First name\n[Preferred Name]: \n[Story Title]: \n[My Story / Experience]: \n\n[Publication Consent]: (Yes / No) - I agree / do not agree for this story to be considered for anonymous publication after review with identifying details removed.\n\nThank you.`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    try {
      // Submit to backend persistent database
      const response = await fetch('/api/stories/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: storyTitle.trim() || 'Survivor Experience',
          content: storyContent.trim(),
          category,
          authorName: preferredName.trim() || 'Anonymous Survivor',
          creditPreference,
          consentGiven,
          privacySanitized,
          allowContact,
          email: email.trim() || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmittedCode(data.conversationId);
        try {
          localStorage.setItem('aawaaz_last_conversation_code', data.conversationId);
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.warn('Backend submission error, persisting locally:', err);
    } finally {
      setIsSubmitting(false);
    }

    // Also notify local parent state
    onSubmitStory({
      authorName: preferredName.trim() || 'Anonymous Survivor',
      creditPreference,
      category,
      title: storyTitle.trim() || 'Survivor Experience',
      excerpt: storyContent.trim().slice(0, 180) + '...',
      content: storyContent.trim(),
      consentGiven,
      privacySanitized,
      email: email.trim() || undefined,
      allowContact,
    });

    setIsSubmitted(true);
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

        {/* Submit via Direct Email Channel */}
        <div className="mb-12">
          <div className="p-7 sm:p-9 bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#5B8F8A]/30 hover:shadow-xs transition-all duration-300">
            <div className="max-w-2xl">
              <div className="w-11 h-11 rounded-2xl bg-[#17243A] text-white flex items-center justify-center mb-4 shadow-xs border border-[#5B8F8A]/20">
                <Mail className="w-5 h-5 text-[#EAE5F5]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A] mb-2">
                Submit via Direct Email
              </h3>
              <p className="text-xs sm:text-sm text-[#252B35]/80 leading-relaxed mb-3 font-normal">
                Prefer submitting directly from your personal email client? Send your confession or experience directly to our private inbox. The subject line and confidential format are prefilled for your convenience: <span className="font-mono text-[#17243A] font-semibold">Aawaaz Setu — Story Submission</span>.
              </p>
              <div className="text-xs text-[#687385] font-mono">
                Official Inbox: <strong className="text-[#17243A]">{config.email}</strong>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <a
                href={mailtoHref}
                className="py-3.5 px-6 text-center text-sm font-semibold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs shadow-2xs flex items-center justify-center gap-2 cursor-pointer border border-[#17243A]"
              >
                <Mail className="w-4 h-4 text-[#EAE5F5]" />
                <span>Email Us ({config.email})</span>
              </a>
            </div>
          </div>
        </div>

        {/* On-Site Story Submission Form */}
        <div className="bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 p-6 sm:p-10 shadow-xs">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#17243A] mb-2">
                Submit Anonymously On-Site
              </h3>
              <p className="text-sm text-[#252B35]/80 leading-relaxed font-normal max-w-2xl">
                Share your journey or thoughts below. Every submission is automatically issued a secure, confidential <strong>Conversation Code (AS-XXXX-XXXX)</strong> so you can privately read replies from our team and send anonymous follow-up messages.
              </p>
            </div>
            {onOpenConversationLookup && (
              <button
                type="button"
                onClick={() => onOpenConversationLookup()}
                className="shrink-0 px-4 py-2 bg-white hover:bg-[#EEF3F8] text-[#17243A] border border-[#17243A]/15 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs self-start md:self-auto"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#5B8F8A]" />
                <span>Already Have a Code? Check Replies</span>
              </button>
            )}
          </div>

          {isSubmitted ? (
            <div className="p-8 sm:p-10 bg-white rounded-2xl border border-[#5B8F8A]/30 text-center space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3F8] text-[#5B8F8A] flex items-center justify-center mx-auto border border-[#5B8F8A]/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A] mb-2">
                  Thank You for Trusting Us With Your Story
                </h4>
                <p className="text-sm text-[#252B35]/80 max-w-lg mx-auto leading-relaxed font-normal">
                  Your experience has been securely submitted to the Aawaaz Setu review queue.
                  {consentGiven ? (
                    <span> Because you consented to publication, our team will review and redact identifying details before considering it for public display.</span>
                  ) : (
                    <span> As requested, your submission will remain completely private to our awareness team and will <strong>not</strong> be published publicly.</span>
                  )}
                </p>
              </div>

              {/* Private Two-Way Conversation Tracking Code Box */}
              {submittedCode && (
                <div className="max-w-md mx-auto p-5 bg-[#F8F7F3] rounded-2xl border-2 border-[#5B8F8A]/40 text-left space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B8F8A]">
                      Your Unique Conversation Code
                    </span>
                    <span className="text-[10px] text-[#687385] font-semibold bg-white px-2 py-0.5 rounded-md border border-[#17243A]/10">
                      Two-Way Private Channel
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-[#17243A]/15 shadow-2xs">
                    <span className="font-mono font-bold text-base sm:text-lg text-[#17243A] tracking-wider select-all">
                      {submittedCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(submittedCode);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2500);
                      }}
                      className="px-3.5 py-2 bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                    >
                      {codeCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Code Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#EAE5F5]" />
                          <span>Copy Conversation Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Required Clear Warning */}
                  <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> Save this code securely. You will need it to read private admin replies.
                    </span>
                  </div>

                  {onOpenConversationLookup && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenConversationLookup(submittedCode)}
                        className="w-full py-2.5 px-4 bg-[#5B8F8A] hover:bg-[#4d7d79] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#EAE5F5]" />
                        <span>Open My Conversation Thread Now</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSubmittedCode('');
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
