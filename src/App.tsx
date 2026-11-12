import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { AwarenessSection } from './components/AwarenessSection';
import { ShareStorySection } from './components/ShareStorySection';
import { StorytellingSection } from './components/StorytellingSection';
import { SupportSection } from './components/SupportSection';
import { ResourcesSection } from './components/ResourcesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { AdminModerationModal } from './components/AdminModerationModal';
import { VolunteerSection } from './components/VolunteerSection';
import { HonourableMentionsSection } from './components/HonourableMentionsSection';
import { ConversationLookupModal } from './components/ConversationLookupModal';
import { AawaazChatbot } from './components/AawaazChatbot';
import { ScrollToTop } from './components/ScrollToTop';
import { AawaazRunGame } from './components/AawaazRunGame';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Story, SiteConfig, ContactMessage } from './types';
import { DEFAULT_CONFIG, INITIAL_STORIES } from './data/initialData';

export default function App() {
  // Mini-game full-screen state
  const [isGameOpen, setIsGameOpen] = useState(false);

  // Global loading state for initial data initialization / skeleton loading UI
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize data with a 1-second delay to trigger skeleton loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Persistent stories state
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('project_aawaz_stories');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading stories from localStorage', e);
    }
    return INITIAL_STORIES;
  });

  // Persistent site configuration (email, google form link, socials)
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('project_aawaz_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically upgrade outdated personal profile link to official Aawaaz Setu LinkedIn
        if (parsed.linkedinUrl === 'https://www.linkedin.com/in/shreyansh-gupta-b85ab833b') {
          parsed.linkedinUrl = DEFAULT_CONFIG.linkedinUrl;
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (e) {
      console.error('Error loading config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  });

  // Persistent contact inquiries
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('project_aawaz_messages');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading messages from localStorage', e);
    }
    return [];
  });

  // Modal dialog states
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isConversationLookupOpen, setIsConversationLookupOpen] = useState(false);
  const [activeLookupCode, setActiveLookupCode] = useState('');

  // Auto-detect #admin or /admin to open the admin portal
  useEffect(() => {
    const handleUrlCheck = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (
        hash === '#admin' ||
        hash === '#/admin' ||
        hash === '#admin/login' ||
        pathname === '/admin' ||
        pathname === '/admin/login'
      ) {
        setIsAdminOpen(true);
      }
    };
    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    return () => window.removeEventListener('hashchange', handleUrlCheck);
  }, []);

  // Sync stories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('project_aawaz_stories', JSON.stringify(stories));
    } catch (e) {
      console.error('Failed to save stories to localStorage', e);
    }
  }, [stories]);

  // Sync config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('project_aawaz_config', JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config to localStorage', e);
    }
  }, [config]);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('project_aawaz_messages', JSON.stringify(contactMessages));
    } catch (e) {
      console.error('Failed to save messages to localStorage', e);
    }
  }, [contactMessages]);

  const handleUpdateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleNewStorySubmission = (
    newStoryData: Omit<Story, 'id' | 'status' | 'date' | 'submittedAt'>
  ) => {
    const newStory: Story = {
      ...newStoryData,
      id: `story-${Date.now()}`,
      status: 'Pending Review', // SECTION 11: NEVER automatically published; queued for manual review
      date: 'Pending Review',
      submittedAt: new Date().toISOString(),
    };

    setStories((prev) => [newStory, ...prev]);
  };

  const handleUpdateStory = (updatedStory: Story) => {
    setStories((prev) =>
      prev.map((s) => (s.id === updatedStory.id ? updatedStory : s))
    );
  };

  const handleDeleteStory = (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const handleNewMessage = (msg: ContactMessage) => {
    setContactMessages((prev) => [msg, ...prev]);
  };

  const navigateToSupport = () => {
    const el = document.getElementById('support');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // If Aawaaz Run is active, render the dedicated full-screen game view
  if (isGameOpen) {
    return <AawaazRunGame onBackToWebsite={() => setIsGameOpen(false)} />;
  }

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col bg-[#F8F7F3] text-[#252B35] overflow-x-clip">
      {/* Top Navbar */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
        onOpenConversationLookup={() => setIsConversationLookupOpen(true)}
      />

      {/* Main Page Layout */}
      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* 1. Hero Section */}
        <Hero
          onExploreMission={() => {
            const el = document.getElementById('about');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenGame={() => setIsGameOpen(true)}
        />

        {/* 2. About Us Section */}
        <AboutSection />

        {/* 3. Awareness Section */}
        <AwarenessSection />

        {/* 4. Survivor Storytelling Section (Section 11) */}
        <StorytellingSection
          stories={stories}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onNavigateToShare={() => {
            const el = document.getElementById('share-story');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavigateToSupport={navigateToSupport}
          isLoading={isLoading}
        />

        {/* Honourable Mentions Section */}
        <HonourableMentionsSection />

        {/* 5. Share Your Story Section (Section 9 & 10) */}
        <ShareStorySection
          config={config}
          onUpdateConfig={handleUpdateConfig}
          onSubmitStory={handleNewStorySubmission}
          onOpenConversationLookup={(code) => {
            if (code) setActiveLookupCode(code);
            setIsConversationLookupOpen(true);
          }}
        />

        {/* 6. Find Support & Helplines Section (Section 12) */}
        <SupportSection isLoading={isLoading} />

        {/* 7. Resources & Practical Toolkits Section (Section 13) */}
        <ResourcesSection />

        {/* 8. Join as a Volunteer Section */}
        <VolunteerSection />

        {/* 9. Contact Us Section (Section 14) */}
        <ContactSection
          config={config}
          onUpdateConfig={handleUpdateConfig}
          onNewMessage={handleNewMessage}
        />
      </main>

      {/* Footer (Section 17) */}
      <Footer
        config={config}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenConversationLookup={() => setIsConversationLookupOpen(true)}
      />

      {/* Modals */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      <ConversationLookupModal
        isOpen={isConversationLookupOpen}
        onClose={() => setIsConversationLookupOpen(false)}
        initialCode={activeLookupCode}
      />

      <AdminModerationModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        stories={stories}
        onUpdateStory={handleUpdateStory}
        onDeleteStory={handleDeleteStory}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        contactMessages={contactMessages}
      />

      {/* Floating Aawaaz AI Trauma-Informed Chatbot */}
      <AawaazChatbot />

      {/* Floating Scroll-to-Top Button */}
      <ScrollToTop />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
