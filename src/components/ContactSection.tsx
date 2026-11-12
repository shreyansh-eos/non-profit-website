import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle2, Share2, Instagram, Linkedin, Twitter, Youtube, ExternalLink, Settings, AlertTriangle, Building2, User } from 'lucide-react';
import { SiteConfig, ContactMessage } from '../types';

interface ContactSectionProps {
  config: SiteConfig;
  onUpdateConfig: (newConfig: Partial<SiteConfig>) => void;
  onNewMessage?: (msg: ContactMessage) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  config,
  onUpdateConfig,
  onNewMessage,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Awareness Inquiry');
  const [message, setMessage] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingSocials, setEditingSocials] = useState(false);
  const [tempSocials, setTempSocials] = useState({
    instagramUrl: config.instagramUrl,
    linkedinUrl: config.linkedinUrl,
    twitterUrl: config.twitterUrl,
    youtubeUrl: config.youtubeUrl,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const mailtoHref = `mailto:${config.email}?subject=${encodeURIComponent(
    'Aawaaz Setu — Inquiry'
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!message.trim()) {
      setErrorMessage('Please enter your message before sending.');
      return;
    }

    if (!consentAcknowledged) {
      setErrorMessage('Please acknowledge the non-emergency and email communication notice below.');
      return;
    }

    if (onNewMessage) {
      onNewMessage({
        id: `msg-${Date.now()}`,
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        subject,
        message: message.trim(),
        submittedAt: new Date().toISOString(),
        consentAcknowledged,
      });
    }

    setSubmitted(true);
  };

  const handleSaveSocials = () => {
    onUpdateConfig(tempSocials);
    setEditingSocials(false);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-white border-b border-[#17243A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-3">
            <span>Direct Communication</span>
            <span aria-hidden="true" className="text-[#687385]">·</span>
            <span>Connect with the Initiative</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243A] tracking-tight mb-4">
            Get in Touch With Aawaaz Setu.
          </h2>
          <p className="text-base sm:text-lg text-[#252B35]/85 leading-relaxed">
            Have a question, suggestion, awareness idea, or wish to reach out? We welcome responsible communication.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Founder Identity, Email & Social Links */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Leadership Card (Founder, Co-Founder & HR Manager) */}
            <div className="p-7 bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B8F8A] block">
                  Initiative Leadership & Team
                </span>
                <a
                  href="#founder"
                  className="text-xs font-semibold text-[#5B8F8A] hover:text-[#17243A] hover:underline"
                >
                  Meet Team →
                </a>
              </div>

              {/* Shreyansh Gupta */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#17243A]/10">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-[#17243A]/10 shadow-xs shrink-0">
                    <img
                      src="./assets/aistudio/image_93510b04.png"
                      alt="Shreyansh Gupta"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#17243A] leading-tight truncate">
                        Shreyansh Gupta
                      </h3>
                      <span className="text-[10px] font-bold uppercase text-[#5B8F8A] bg-[#EEF3F8] px-2 py-0.5 rounded-md shrink-0">
                        Founder
                      </span>
                    </div>
                    <p className="text-xs text-[#687385] truncate">B.Tech Mechanical Engg., DTU Delhi</p>
                  </div>
                </div>
                <a
                  href="https://www.linkedin.com/in/shreyansh-gupta-b85ab833b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-[#0077B5]/10 hover:bg-[#0077B5] text-[#0077B5] hover:text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 border border-[#0077B5]/20 shadow-2xs"
                  title="Follow Shreyansh Gupta on LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 fill-current" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Paritosh Rana */}
              <div className="flex items-center gap-3.5 pb-3 border-b border-[#17243A]/10">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-[#17243A]/10 shadow-xs shrink-0">
                  <img
                    src="./assets/aistudio/WhatsApp_Image_2026-11-11_at_8.16.12_PM_2ff73539.jpeg"
                    alt="Paritosh Rana"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#17243A] leading-tight truncate">
                      Paritosh Rana
                    </h3>
                    <span className="text-[10px] font-bold uppercase text-[#5B8F8A] bg-[#EEF3F8] px-2 py-0.5 rounded-md shrink-0">
                      Managing Director
                    </span>
                  </div>
                  <p className="text-xs text-[#687385] truncate">Strategic Operations & Campus Campaigns</p>
                </div>
              </div>

              {/* Shorya Panchal */}
              <div className="flex items-center gap-3.5 pb-3 border-b border-[#17243A]/10">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-[#17243A]/10 shadow-xs shrink-0">
                  <img
                    src="./assets/aistudio/image_1cf77474.png"
                    alt="Shorya Panchal"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#17243A] leading-tight truncate">
                      Shorya Panchal
                    </h3>
                    <span className="text-[10px] font-bold uppercase text-[#5B8F8A] bg-[#EEF3F8] px-2 py-0.5 rounded-md shrink-0">
                      Co-Founder
                    </span>
                  </div>
                  <p className="text-xs text-[#687385] truncate">B.Tech ECE, USICT (GGSIPU), Dwarka</p>
                </div>
              </div>

              {/* Anubhav Gupta */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-[#17243A]/10 shadow-xs shrink-0">
                  <img
                    src="./assets/aistudio/image_d4766d2a.png"
                    alt="Anubhav Gupta"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#17243A] leading-tight truncate">
                      Anubhav Gupta
                    </h3>
                    <span className="text-[10px] font-bold uppercase text-[#5B8F8A] bg-[#EEF3F8] px-2 py-0.5 rounded-md shrink-0">
                      HR & Volunteers
                    </span>
                  </div>
                  <p className="text-xs text-[#687385] truncate">B.Com. (Hons.), SRCC, University of Delhi</p>
                </div>
              </div>

              <p className="text-xs text-[#687385] pt-2 border-t border-[#17243A]/10 font-normal">
                Independent, student-led awareness initiative. Not currently a registered NGO.
              </p>
            </div>

            {/* Primary Email Card with Prominent Clickable Button */}
            <div className="p-7 bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#17243A] text-white flex items-center justify-center mb-4 shadow-xs border border-[#5B8F8A]/20">
                <Mail className="w-5 h-5 text-[#EAE5F5]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] block mb-1">
                Official Email
              </span>
              <a
                href={`mailto:${config.email}`}
                className="font-serif text-xl sm:text-2xl font-bold text-[#17243A] hover:text-[#5B8F8A] transition-colors break-all block mb-3"
              >
                {config.email}
              </a>
              <p className="text-xs text-[#687385] leading-relaxed mb-6 font-normal">
                Direct point of contact for inquiries, student collaborations, and feedback.
              </p>

              {/* Prominent clickable email button */}
              <a
                href={mailtoHref}
                className="w-full py-3.5 px-4 text-center text-xs font-bold text-white bg-[#17243A] hover:bg-[#252B35] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer border border-[#17243A]"
              >
                <Mail className="w-4 h-4 text-[#EAE5F5]" />
                <span>Contact Aawaaz Setu</span>
              </a>
            </div>

            {/* Connect With Aawaaz Setu (Official Social Media Section) */}
            <div className="p-7 bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 shadow-2xs space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5B8F8A] mb-1.5">
                  <Share2 className="w-4 h-4 text-[#5B8F8A]" />
                  <span>Stay Connected</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A] tracking-tight">
                  Connect With Aawaaz Setu
                </h3>
                <p className="text-xs sm:text-sm text-[#252B35]/85 leading-relaxed mt-1.5 font-normal">
                  Stay connected with our mission. Follow us on social media to spread awareness, share stories, and be a part of the change.
                </p>
              </div>

              {/* 3 Dedicated Official Social Media Cards with 'Follow Us' Buttons */}
              <div className="space-y-3 pt-2">
                {/* 1. Instagram */}
                <div className="p-3.5 bg-white rounded-2xl border border-[#17243A]/10 hover:border-rose-400/50 flex items-center justify-between gap-3 shadow-2xs hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Instagram className="w-5 h-5 fill-current" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#17243A] leading-tight truncate">Instagram</h4>
                      <p className="text-[11px] text-[#687385] truncate">@aawaazsetu</p>
                    </div>
                  </div>
                  <a
                    href="https://www.instagram.com/aawaazsetu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-linear-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Follow Us</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* 2. LinkedIn */}
                <div className="p-3.5 bg-white rounded-2xl border border-[#17243A]/10 hover:border-[#0077B5]/50 flex items-center justify-between gap-3 shadow-2xs hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#0077B5] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Linkedin className="w-5 h-5 fill-current" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#17243A] leading-tight truncate">LinkedIn</h4>
                      <p className="text-[11px] text-[#687385] truncate">Aawaaz Setu Official</p>
                    </div>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/aawaaz-setu-889b5b449"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#0077B5] hover:bg-[#005f93] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Follow Us</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* 3. X (Twitter) */}
                <div className="p-3.5 bg-white rounded-2xl border border-[#17243A]/10 hover:border-[#17243A]/40 flex items-center justify-between gap-3 shadow-2xs hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#17243A] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Twitter className="w-5 h-5 fill-current" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#17243A] leading-tight truncate">X (Twitter)</h4>
                      <p className="text-[11px] text-[#687385] truncate">@AawaazSetu</p>
                    </div>
                  </div>
                  <a
                    href="https://x.com/AawaazSetu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Follow Us</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form with Section 14 Notice */}
          <div className="lg:col-span-7 bg-[#F8F7F3] rounded-3xl border border-[#17243A]/10 p-6 sm:p-10 shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-[#17243A] mb-2">
              Send a Direct Message
            </h3>
            <p className="text-xs sm:text-sm text-[#252B35]/80 leading-relaxed mb-6 font-normal">
              For general inquiries, campus student volunteer interest, or constructive feedback, submit your note below.
            </p>

            {/* Section 14 Mandatory Form Warning Notice */}
            <div className="mb-6 p-4 bg-[#EEF3F8] border border-[#17243A]/10 rounded-2xl text-xs text-[#252B35] leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#5B8F8A] shrink-0 mt-0.5" />
              <div>
                "Please do not use this form for emergencies or to submit highly sensitive personal information. Email communication may not be completely confidential."
              </div>
            </div>

            {submitted ? (
              <div className="p-8 sm:p-10 bg-white rounded-2xl border border-[#5B8F8A]/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#EEF3F8] text-[#5B8F8A] flex items-center justify-center mx-auto border border-[#5B8F8A]/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#17243A]">
                  Message Received
                </h4>
                <p className="text-xs sm:text-sm text-[#252B35]/80 max-w-md mx-auto">
                  Thank you for reaching out to Aawaaz Setu. We appreciate your voice and will review your note promptly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#17243A] bg-[#EEF3F8] hover:bg-[#EAE5F5] rounded-xl mt-2 cursor-pointer transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                      Name <span className="text-[#687385] font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Student / Peer / Volunteer"
                      className="w-full px-4 py-2.5 bg-white border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                      Email Address <span className="text-[#687385] font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className="w-full px-4 py-2.5 bg-white border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Campus Awareness Idea / Volunteer Inquiry"
                    className="w-full px-4 py-2.5 bg-white border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#17243A] mb-1.5">
                    Message <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can Aawaaz Setu help or collaborate?..."
                    className="w-full px-4 py-2.5 bg-white border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#252B35] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentAcknowledged}
                      onChange={(e) => setConsentAcknowledged(e.target.checked)}
                      className="mt-0.5 h-4 w-4 text-[#5B8F8A] rounded border-[#17243A]/20 focus:ring-[#5B8F8A]"
                    />
                    <span className="text-xs text-[#687385] leading-normal">
                      I understand that this form is for non-emergency inquiries and that email transmission across public networks may not be completely confidential.
                    </span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#17243A] hover:bg-[#252B35] text-white font-semibold text-xs rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs shadow-2xs flex items-center gap-2 cursor-pointer border border-[#17243A]"
                  >
                    <Send className="w-3.5 h-3.5 text-[#EAE5F5]" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
