import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  CheckCircle2,
  XCircle,
  Archive,
  Edit3,
  Save,
  Mail,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Trash2,
  Shield,
  User,
  Plus,
  Image as ImageIcon,
  Upload,
  Calendar,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  Award,
  LogOut,
  FolderOpen,
  Check,
  Copy,
  Clock,
  Settings
} from 'lucide-react';
import { SiteConfig, ContactMessage, Story } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onUpdateConfig: (newConfig: Partial<SiteConfig>) => void;
  contactMessages?: ContactMessage[];
  stories?: Story[];
  onUpdateStory?: (updatedStory: Story) => void;
  onDeleteStory?: (id: string) => void;
}

interface BackendStory {
  id: number;
  conversation_id: string;
  access_token: string;
  title: string;
  story_content: string;
  author_name: string;
  credit_preference: string;
  category: string;
  status: string;
  consent_given: number;
  created_at: string;
  updated_at: string;
  message_count?: number;
  unread_messages?: number;
  messages?: Array<{
    id: number;
    sender_type: 'admin' | 'anonymous';
    message_content: string;
    created_at: string;
  }>;
}

interface HonourableMentionItem {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  image_urls: string[];
  caption?: string;
  quote?: string;
  category: string;
  author_name?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

interface MediaItem {
  id: number;
  file_url: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
}

export const AdminModerationModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  contactMessages = [],
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 8 Dashboard Sections
  type DashboardTab =
    | 'overview'
    | 'inbox'
    | 'conversations'
    | 'mentions'
    | 'media'
    | 'published'
    | 'drafts'
    | 'settings';

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Stats
  const [stats, setStats] = useState({
    totalStories: 0,
    unreadStories: 0,
    pendingStories: 0,
    totalMentions: 0,
    publishedMentions: 0,
    draftMentions: 0,
    totalMedia: 0,
  });

  // Stories
  const [stories, setStories] = useState<BackendStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<BackendStory | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Honourable Mentions Editor State
  const [mentions, setMentions] = useState<HonourableMentionItem[]>([]);
  const [editingMention, setEditingMention] = useState<Partial<HonourableMentionItem> | null>(null);
  const [mentionPreview, setMentionPreview] = useState<HonourableMentionItem | null>(null);

  // Media Library
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Settings
  const [settingsEmail, setSettingsEmail] = useState(config.email);

  // Token helper
  const getAuthToken = () => sessionStorage.getItem('aawaaz_admin_token') || '';

  // Auth verify on mount/open
  useEffect(() => {
    if (isOpen) {
      const token = getAuthToken();
      if (token) {
        fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.valid) {
              setIsAuthenticated(true);
              loadDashboardData();
            } else {
              sessionStorage.removeItem('aawaaz_admin_token');
              setIsAuthenticated(false);
            }
          })
          .catch(() => setIsAuthenticated(false));
      }
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      // 1. Stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) setStats(await statsRes.json());

      // 2. Stories
      const storiesRes = await fetch('/api/admin/stories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (storiesRes.ok) setStories(await storiesRes.json());

      // 3. Mentions
      const mentionsRes = await fetch('/api/admin/honourable-mentions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (mentionsRes.ok) setMentions(await mentionsRes.json());

      // 4. Media
      const mediaRes = await fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (mediaRes.ok) setMediaList(await mediaRes.json());
    } catch (e) {
      console.error('Failed to load admin dashboard data', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          sessionStorage.setItem('aawaaz_admin_token', data.token);
          setIsAuthenticated(true);
          setPasswordInput('');
          loadDashboardData();
        }
      } else {
        const data = await response.json();
        setLoginError(data.error || 'Invalid credentials. Access is restricted.');
      }
    } catch (err) {
      setLoginError('Could not connect to the backend server. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    const token = getAuthToken();
    fetch('/api/admin/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(console.error);

    sessionStorage.removeItem('aawaaz_admin_token');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Select a story & load all messages in thread
  const handleSelectStory = async (story: BackendStory) => {
    const token = getAuthToken();
    try {
      const res = await fetch(`/api/admin/stories/${story.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const full = await res.json();
        setSelectedStory(full);
        loadDashboardData(); // refresh unread badges
      }
    } catch (e) {
      console.error('Failed to load story detail', e);
    }
  };

  // Send admin reply
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedStory) return;

    setSendingReply(true);
    const token = getAuthToken();

    try {
      const res = await fetch(`/api/admin/stories/${selectedStory.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageContent: replyText.trim(),
          updateStatus: 'reviewed',
        }),
      });

      if (res.ok) {
        setReplyText('');
        handleSelectStory(selectedStory);
      }
    } catch (e) {
      console.error('Error sending admin reply', e);
    } finally {
      setSendingReply(false);
    }
  };

  // Change story status
  const handleUpdateStoryStatus = async (storyId: number, status: string) => {
    const token = getAuthToken();
    try {
      const res = await fetch(`/api/admin/stories/${storyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        loadDashboardData();
        if (selectedStory && selectedStory.id === storyId) {
          setSelectedStory({ ...selectedStory, status });
        }
      }
    } catch (e) {
      console.error('Error updating story status', e);
    }
  };

  // Delete story
  const handleDeleteStory = async (storyId: number) => {
    if (!window.confirm('Are you sure you want to delete this story conversation?')) return;
    const token = getAuthToken();

    try {
      const res = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (selectedStory?.id === storyId) setSelectedStory(null);
        loadDashboardData();
      }
    } catch (e) {
      console.error('Error deleting story', e);
    }
  };

  // Image Upload helper for Media Library or Honourable Mention
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onUrlGenerated?: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      alert('Only JPG, JPEG, PNG, and WEBP images are supported.');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result as string;
      const token = getAuthToken();

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            dataBase64: base64Data,
          }),
        });

        if (res.ok) {
          const uploaded = await res.json();
          loadDashboardData();
          if (onUrlGenerated) onUrlGenerated(uploaded.fileUrl);
        } else {
          alert('Failed to upload image to server.');
        }
      } catch (err) {
        console.error('Upload error', err);
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Save or Publish Honourable Mention
  const handleSaveMention = async (status: 'draft' | 'published') => {
    if (!editingMention?.title || !editingMention?.content) {
      alert('Title and Content are required to save.');
      return;
    }

    const token = getAuthToken();
    const payload = {
      ...editingMention,
      status,
      imageUrls: editingMention.image_urls || [],
    };

    try {
      let res;
      if (editingMention.id) {
        res = await fetch(`/api/admin/honourable-mentions/${editingMention.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/honourable-mentions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setEditingMention(null);
        loadDashboardData();
      } else {
        alert('Failed to save Honourable Mention.');
      }
    } catch (e) {
      console.error('Save mention error', e);
    }
  };

  const handleDeleteMention = async (id: number) => {
    if (!window.confirm('Delete this Honourable Mention post?')) return;
    const token = getAuthToken();

    try {
      const res = await fetch(`/api/admin/honourable-mentions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadDashboardData();
    } catch (e) {
      console.error('Delete mention error', e);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!window.confirm('Delete this image from the server?')) return;
    const token = getAuthToken();

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadDashboardData();
    } catch (e) {
      console.error('Delete media error', e);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#17243A]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
    >
      <div className="bg-[#F8F7F3] rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl border border-[#17243A]/20 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#17243A] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5B8F8A]/30 border border-[#5B8F8A]/40 flex items-center justify-center text-white">
              <Shield className="w-5 h-5 text-[#EAE5F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  Admin Dashboard & Moderation Portal
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#5B8F8A]/25 border border-[#5B8F8A]/40 text-[#EAE5F5] text-[10px] font-semibold uppercase tracking-wider">
                  Aawaaz Setu
                </span>
              </div>
              <p className="text-xs text-[#EEF3F8]/80">
                End-to-end story moderation, private conversations, media library, and content publishing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-950 text-white hover:text-rose-200 border border-white/15 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Log out from admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Login Screen OR Full Authenticated Dashboard */}
        {!isAuthenticated ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#17243A]/10 shadow-lg space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#17243A] text-white flex items-center justify-center mx-auto shadow-xs border border-[#5B8F8A]/30">
                  <Lock className="w-6 h-6 text-[#EAE5F5]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#17243A]">
                  Admin Authentication
                </h3>
                <p className="text-xs text-[#687385]">
                  Authorized administrators only. Credentials are authenticated via salted password hashing.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1.5">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#17243A] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm text-[#17243A] focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#17243A] hover:bg-[#252B35] text-white font-bold text-xs rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-[#EAE5F5]" />
                  <span>{isSubmitting ? 'Verifying...' : 'Secure Login'}</span>
                </button>
              </form>

              <div className="pt-2 border-t border-[#17243A]/10 text-center">
                <span className="text-[11px] text-[#687385]">
                  Strictly confidential · Aawaaz Setu Moderation Portal
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* AUTHENTICATED DASHBOARD WITH SIDEBAR NAVIGATION           */
          /* ========================================================= */
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#17243A]/10 p-3 sm:p-4 shrink-0 overflow-x-auto md:overflow-y-auto">
              <nav className="flex md:flex-col gap-1.5 min-w-max md:min-w-0 text-xs font-semibold">
                
                <button
                  onClick={() => { setActiveTab('overview'); setSelectedStory(null); setEditingMention(null); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer text-left ${
                    activeTab === 'overview'
                      ? 'bg-[#17243A] text-white shadow-2xs'
                      : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span className="truncate">Dashboard Overview</span>
                </button>

                <button
                  onClick={() => { setActiveTab('inbox'); setSelectedStory(null); setEditingMention(null); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-left ${
                    activeTab === 'inbox'
                      ? 'bg-[#17243A] text-white shadow-2xs'
                      : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="truncate">Story Inbox</span>
                  </div>
                  {stats.unreadStories > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      {stats.unreadStories}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab('mentions'); setSelectedStory(null); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-left ${
                    activeTab === 'mentions'
                      ? 'bg-[#17243A] text-white shadow-2xs'
                      : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Award className="w-4 h-4 shrink-0" />
                    <span className="truncate">Honourable Mentions</span>
                  </div>
                  <span className="text-[10px] text-[#687385]">
                    {mentions.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('media'); setSelectedStory(null); setEditingMention(null); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-left ${
                    activeTab === 'media'
                      ? 'bg-[#17243A] text-white shadow-2xs'
                      : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ImageIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">Media Library</span>
                  </div>
                  <span className="text-[10px] text-[#687385]">
                    {mediaList.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('published'); setSelectedStory(null); setEditingMention(null); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-left ${
                    activeTab === 'published'
                      ? 'bg-[#17243A] text-white shadow-2xs'
                      : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Published Posts</span>
                  </div>
                  <span className="text-[10px] text-[#687385]">
                    {stats.publishedMentions}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('drafts'); setSelectedStory(null); setEditingMention(null); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-left ${
                    activeTab === 'drafts'
                      ? 'bg-[#17243A] text-white shadow-2xs'
                      : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">Drafts</span>
                  </div>
                  <span className="text-[10px] text-[#687385]">
                    {stats.draftMentions}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('settings'); setSelectedStory(null); setEditingMention(null); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer text-left ${
                    activeTab === 'settings'
                      ? 'bg-[#17243A] text-white shadow-2xs'
                      : 'text-[#687385] hover:text-[#17243A] hover:bg-[#F8F7F3]'
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="truncate">Settings & Info</span>
                </button>

              </nav>

              <div className="hidden md:block pt-6 mt-6 border-t border-[#17243A]/10 text-xs text-[#687385]">
                <p className="font-semibold text-[#17243A]">Logged in as:</p>
                <p className="truncate font-mono">admin</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">● Session Active</p>
              </div>
            </aside>

            {/* Main Section Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              
              {/* ========================================================= */}
              {/* SECTION 1: DASHBOARD OVERVIEW                             */}
              {/* ========================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#17243A]">
                      Dashboard Overview
                    </h3>
                    <p className="text-xs sm:text-sm text-[#687385]">
                      Real-time metrics, submission counters, and quick administrative actions.
                    </p>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8F8A] block">
                        Total Submissions
                      </span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
                        {stats.totalStories}
                      </p>
                      <p className="text-[11px] text-[#687385]">Saved in SQLite DB</p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-rose-200 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                        Unread Submissions
                      </span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-rose-700">
                        {stats.unreadStories}
                      </p>
                      <p className="text-[11px] text-[#687385]">Awaiting initial review</p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                        Published Mentions
                      </span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">
                        {stats.publishedMentions}
                      </p>
                      <p className="text-[11px] text-[#687385]">Live on public site</p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                        Pending Replies / Drafts
                      </span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-700">
                        {stats.pendingStories + stats.draftMentions}
                      </p>
                      <p className="text-[11px] text-[#687385]">Drafts & follow-ups</p>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="p-6 bg-white rounded-3xl border border-[#17243A]/10 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-[#17243A]">Quick Actions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                      <button
                        onClick={() => { setActiveTab('inbox'); }}
                        className="p-3.5 rounded-xl bg-[#F8F7F3] hover:bg-[#EEF3F8] border border-[#17243A]/10 flex items-center justify-between text-[#17243A] cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#5B8F8A]" />
                          <span>Review Story Inbox</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#687385]" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingMention({
                            title: '',
                            subtitle: '',
                            content: '',
                            image_urls: [],
                            category: 'Student Voices',
                            author_name: 'Aawaaz Setu Team',
                            status: 'draft',
                          });
                          setActiveTab('mentions');
                        }}
                        className="p-3.5 rounded-xl bg-[#F8F7F3] hover:bg-[#EEF3F8] border border-[#17243A]/10 flex items-center justify-between text-[#17243A] cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[#5B8F8A]" />
                          <span>Create Honourable Mention</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#687385]" />
                      </button>

                      <button
                        onClick={() => { setActiveTab('media'); }}
                        className="p-3.5 rounded-xl bg-[#F8F7F3] hover:bg-[#EEF3F8] border border-[#17243A]/10 flex items-center justify-between text-[#17243A] cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-[#5B8F8A]" />
                          <span>Upload Images to Media Library</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#687385]" />
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="bg-white rounded-3xl border border-[#17243A]/10 p-6 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-[#17243A]">Recent Submissions</h4>
                    {stories.length === 0 ? (
                      <p className="text-xs text-[#687385] py-4 text-center">No anonymous stories received yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {stories.slice(0, 5).map((s) => (
                          <div
                            key={s.id}
                            onClick={() => { handleSelectStory(s); setActiveTab('inbox'); }}
                            className="p-3 rounded-xl bg-[#F8F7F3] hover:bg-[#EEF3F8] flex items-center justify-between text-xs cursor-pointer border border-[#17243A]/5 transition-colors"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-bold text-[#17243A] block truncate">{s.title}</span>
                              <span className="text-[11px] text-[#687385] font-mono">{s.conversation_id} · {s.author_name}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                              s.status === 'unread' ? 'bg-rose-100 text-rose-800' : 'bg-white text-[#687385]'
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION 2 & 3: ANONYMOUS STORY INBOX & CONVERSATIONS      */}
              {/* ========================================================= */}
              {(activeTab === 'inbox' || activeTab === 'conversations') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#17243A]">
                        Anonymous Story Inbox & Conversations
                      </h3>
                      <p className="text-xs sm:text-sm text-[#687385]">
                        Read confidential submissions, reply privately, and maintain end-to-end conversation histories.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left List of Stories */}
                    <div className="lg:col-span-5 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                      {stories.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-2xl border border-[#17243A]/10 text-xs text-[#687385]">
                          No submissions received yet.
                        </div>
                      ) : (
                        stories.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => handleSelectStory(st)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                              selectedStory?.id === st.id
                                ? 'bg-white border-[#5B8F8A] shadow-xs'
                                : 'bg-white/80 border-[#17243A]/10 hover:border-[#5B8F8A]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-mono text-[11px] font-bold text-[#5B8F8A]">{st.conversation_id}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                st.status === 'unread' ? 'bg-rose-100 text-rose-800' :
                                st.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                'bg-[#EEF3F8] text-[#17243A]'
                              }`}>
                                {st.status}
                              </span>
                            </div>
                            <h4 className="font-serif font-bold text-sm text-[#17243A] leading-snug truncate">
                              {st.title}
                            </h4>
                            <p className="text-xs text-[#687385] line-clamp-2 mt-1">
                              {st.story_content}
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-[#687385] mt-2 pt-2 border-t border-[#17243A]/5">
                              <span>{st.author_name}</span>
                              <span>{new Date(st.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Right Conversation & Reply View */}
                    <div className="lg:col-span-7 bg-white rounded-3xl border border-[#17243A]/10 p-5 sm:p-6 flex flex-col justify-between max-h-[70vh] shadow-xs">
                      {selectedStory ? (
                        <div className="flex flex-col h-full space-y-4">
                          
                          {/* Thread Header */}
                          <div className="border-b border-[#17243A]/10 pb-3 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#5B8F8A] bg-[#EEF3F8] px-2 py-0.5 rounded-md">
                                  {selectedStory.conversation_id}
                                </span>
                                <span className="text-xs text-[#687385]">{selectedStory.category}</span>
                              </div>
                              <h4 className="font-serif text-lg font-bold text-[#17243A] mt-1">
                                {selectedStory.title}
                              </h4>
                            </div>

                            {/* Status Change Buttons */}
                            <div className="flex items-center gap-1.5">
                              <select
                                value={selectedStory.status}
                                onChange={(e) => handleUpdateStoryStatus(selectedStory.id, e.target.value)}
                                className="px-2.5 py-1 bg-[#F8F7F3] border border-[#17243A]/15 rounded-lg text-xs font-semibold text-[#17243A]"
                              >
                                <option value="unread">Unread</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                                <option value="archived">Archived</option>
                              </select>
                              <button
                                onClick={() => handleDeleteStory(selectedStory.id)}
                                className="p-1.5 text-[#687385] hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                title="Delete Story"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Messages Scroll Area */}
                          <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-72">
                            {selectedStory.messages?.map((m) => (
                              <div
                                key={m.id}
                                className={`flex flex-col ${m.sender_type === 'admin' ? 'items-end' : 'items-start'}`}
                              >
                                <div
                                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                    m.sender_type === 'admin'
                                      ? 'bg-[#17243A] text-white rounded-tr-xs'
                                      : 'bg-[#EEF3F8] text-[#17243A] rounded-tl-xs border border-[#17243A]/10'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1 text-[10px] opacity-75 font-semibold">
                                    <span>{m.sender_type === 'admin' ? 'Admin Team' : 'Anonymous Visitor'}</span>
                                    <span>·</span>
                                    <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="whitespace-pre-line">{m.message_content}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Admin Reply Composer */}
                          <form onSubmit={handleSendAdminReply} className="pt-2 border-t border-[#17243A]/10 space-y-2">
                            <textarea
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type a confidential reply to this anonymous visitor..."
                              className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="submit"
                                disabled={sendingReply || !replyText.trim()}
                                className="px-5 py-2.5 bg-[#17243A] hover:bg-[#252B35] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <Send className="w-3.5 h-3.5 text-[#EAE5F5]" />
                                <span>{sendingReply ? 'Sending Reply...' : 'Send Private Reply'}</span>
                              </button>
                            </div>
                          </form>

                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#687385] space-y-2">
                          <MessageSquare className="w-10 h-10 text-[#5B8F8A]/40" />
                          <p className="text-xs">Select a submission from the list to view its complete thread and reply privately.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION 4, 6 & 7: HONOURABLE MENTIONS (PUBLISHED & DRAFTS)*/}
              {/* ========================================================= */}
              {(activeTab === 'mentions' || activeTab === 'published' || activeTab === 'drafts') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#17243A]">
                        {activeTab === 'published' ? 'Published Posts' : activeTab === 'drafts' ? 'Draft Stories' : 'Honourable Mentions Manager'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#687385]">
                        Create, format, upload images, and publish articles directly to the public website.
                      </p>
                    </div>

                    {!editingMention && (
                      <button
                        onClick={() =>
                          setEditingMention({
                            title: '',
                            subtitle: '',
                            content: '',
                            image_urls: [],
                            caption: '',
                            quote: '',
                            category: 'Student Voices',
                            author_name: 'Aawaaz Setu Team',
                            status: 'published',
                          })
                        }
                        className="px-4 py-2 bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create New Post</span>
                      </button>
                    )}
                  </div>

                  {/* Rich Content Editor Form */}
                  {editingMention ? (
                    <div className="p-6 bg-white rounded-3xl border border-[#17243A]/15 shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#17243A]/10 pb-3">
                        <h4 className="font-serif text-lg font-bold text-[#17243A]">
                          {editingMention.id ? 'Edit Honourable Mention' : 'New Honourable Mention Post'}
                        </h4>
                        <button
                          onClick={() => setEditingMention(null)}
                          className="text-xs text-[#687385] hover:text-[#17243A] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[#17243A] font-bold mb-1">Title *</label>
                          <input
                            type="text"
                            required
                            value={editingMention.title || ''}
                            onChange={(e) => setEditingMention({ ...editingMention, title: e.target.value })}
                            placeholder="e.g. Breaking Campus Silence: Student Solidarity at DTU"
                            className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[#17243A] font-bold mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={editingMention.subtitle || ''}
                            onChange={(e) => setEditingMention({ ...editingMention, subtitle: e.target.value })}
                            placeholder="e.g. How peer advocacy transforms campus culture"
                            className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      {/* Image Upload & Image URLs */}
                      <div className="p-4 rounded-2xl bg-[#F8F7F3] border border-[#17243A]/10 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-bold text-[#17243A] flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-[#5B8F8A]" />
                            <span>Post Images (JPG, JPEG, PNG, WEBP)</span>
                          </label>
                          <label className="px-3 py-1.5 bg-[#17243A] text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-[#252B35]">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e, (url) => {
                                  const current = editingMention.image_urls || [];
                                  setEditingMention({ ...editingMention, image_urls: [...current, url] });
                                })
                              }
                            />
                          </label>
                        </div>

                        {/* Image Previews */}
                        {editingMention.image_urls && editingMention.image_urls.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {editingMention.image_urls.map((img, idx) => (
                              <div key={idx} className="relative rounded-xl overflow-hidden aspect-16/9 border border-[#17243A]/10 group">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (editingMention.image_urls || []).filter((_, i) => i !== idx);
                                    setEditingMention({ ...editingMention, image_urls: next });
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md text-xs cursor-pointer opacity-80 group-hover:opacity-100"
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#687385] italic">No images added yet. Click Upload Image to add pictures.</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-[#17243A] font-bold mb-1">Category</label>
                          <input
                            type="text"
                            value={editingMention.category || 'Student Voices'}
                            onChange={(e) => setEditingMention({ ...editingMention, category: e.target.value })}
                            className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[#17243A] font-bold mb-1">Author Name</label>
                          <input
                            type="text"
                            value={editingMention.author_name || 'Aawaaz Setu Team'}
                            onChange={(e) => setEditingMention({ ...editingMention, author_name: e.target.value })}
                            className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[#17243A] font-bold mb-1">Image Caption</label>
                          <input
                            type="text"
                            value={editingMention.caption || ''}
                            onChange={(e) => setEditingMention({ ...editingMention, caption: e.target.value })}
                            placeholder="e.g. Student dialogue forum"
                            className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#17243A] mb-1">Featured Quote</label>
                        <input
                          type="text"
                          value={editingMention.quote || ''}
                          onChange={(e) => setEditingMention({ ...editingMention, quote: e.target.value })}
                          placeholder="e.g. “Courage is the bridge between silence and solidarity.”"
                          className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs italic"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#17243A] mb-1">Detailed Story Content *</label>
                        <textarea
                          rows={6}
                          required
                          value={editingMention.content || ''}
                          onChange={(e) => setEditingMention({ ...editingMention, content: e.target.value })}
                          placeholder="Write the full story or article here. Line breaks are preserved."
                          className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm leading-relaxed"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-[#17243A]/10">
                        <button
                          type="button"
                          onClick={() => setEditingMention(null)}
                          className="px-4 py-2 text-xs text-[#687385] hover:text-[#17243A] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setMentionPreview(editingMention as HonourableMentionItem)}
                          className="px-4 py-2 rounded-xl bg-[#EEF3F8] text-[#17243A] text-xs font-semibold hover:bg-[#EAE5F5] cursor-pointer"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveMention('draft')}
                          className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-semibold hover:bg-amber-200 cursor-pointer"
                        >
                          Save Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveMention('published')}
                          className="px-5 py-2 rounded-xl bg-[#5B8F8A] hover:bg-[#4d7d78] text-white text-xs font-bold cursor-pointer shadow-xs"
                        >
                          Publish to Website
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Mentions Table / List */
                    <div className="space-y-3">
                      {mentions
                        .filter((m) => {
                          if (activeTab === 'published') return m.status === 'published';
                          if (activeTab === 'drafts') return m.status === 'draft';
                          return true;
                        })
                        .map((item) => (
                          <div
                            key={item.id}
                            className="p-4 sm:p-5 bg-white rounded-2xl border border-[#17243A]/10 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {item.image_urls && item.image_urls.length > 0 ? (
                                <img
                                  src={item.image_urls[0]}
                                  alt={item.title}
                                  className="w-16 h-12 rounded-xl object-cover border border-[#17243A]/10 shrink-0"
                                />
                              ) : (
                                <div className="w-16 h-12 rounded-xl bg-[#EEF3F8] flex items-center justify-center text-[#5B8F8A] shrink-0">
                                  <Award className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-serif font-bold text-sm text-[#17243A] truncate">
                                    {item.title}
                                  </h4>
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                                    item.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </div>
                                <p className="text-xs text-[#687385] truncate mt-0.5">
                                  {item.category} · by {item.author_name || 'Team'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => setEditingMention(item)}
                                className="px-3 py-1.5 rounded-xl bg-[#EEF3F8] hover:bg-[#EAE5F5] text-[#17243A] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#5B8F8A]" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteMention(item.id)}
                                className="p-2 text-[#687385] hover:text-rose-600 rounded-xl hover:bg-rose-50 cursor-pointer"
                                title="Delete Post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION 5: IMAGE & MEDIA LIBRARY                          */}
              {/* ========================================================= */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#17243A]">
                        Image & Media Library
                      </h3>
                      <p className="text-xs sm:text-sm text-[#687385]">
                        Persistent cloud/disk image storage. Uploaded assets can be embedded anywhere on the site.
                      </p>
                    </div>

                    <label className="px-4 py-2 bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload New Image'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                    </label>
                  </div>

                  {mediaList.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#17243A]/20 space-y-2">
                      <ImageIcon className="w-10 h-10 text-[#5B8F8A]/40 mx-auto" />
                      <p className="text-xs text-[#687385]">No images uploaded to media library yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mediaList.map((m) => (
                        <div
                          key={m.id}
                          className="bg-white rounded-2xl border border-[#17243A]/10 p-2.5 shadow-2xs space-y-2 group"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8F7F3] border border-[#17243A]/5">
                            <img src={m.file_url} alt={m.file_name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-[#17243A] truncate">{m.file_name}</p>
                            <p className="text-[10px] text-[#687385] truncate">{new Date(m.uploaded_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-[#17243A]/5 text-xs">
                            <button
                              onClick={() => handleCopy(m.file_url)}
                              className="text-[10px] text-[#5B8F8A] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              {copiedUrl === m.file_url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedUrl === m.file_url ? 'Copied' : 'Copy URL'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMedia(m.id)}
                              className="text-[#687385] hover:text-rose-600 p-1"
                              title="Delete file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION 8: WEBSITE SETTINGS & INFO                        */}
              {/* ========================================================= */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#17243A]">
                      Website Content Management & Settings
                    </h3>
                    <p className="text-xs sm:text-sm text-[#687385]">
                      Manage official contact email, official social media links, and volunteer forms.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-3xl border border-[#17243A]/10 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-[#17243A]">Official Contact Email</h4>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={settingsEmail}
                        onChange={(e) => setSettingsEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs"
                      />
                      <button
                        onClick={() => {
                          onUpdateConfig({ email: settingsEmail });
                          alert('Email configuration updated.');
                        }}
                        className="px-4 py-2 bg-[#17243A] text-white text-xs font-semibold rounded-xl cursor-pointer shrink-0"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-3xl border border-[#17243A]/10 shadow-xs space-y-3 text-xs text-[#252B35]">
                    <h4 className="font-bold text-sm text-[#17243A]">Official Initiative URLs</h4>
                    <p>• <strong>Volunteer Form:</strong> https://forms.gle/C3PwTZ7HSacA84Tt9</p>
                    <p>• <strong>Instagram:</strong> https://www.instagram.com/aawaazsetu</p>
                    <p>• <strong>LinkedIn:</strong> https://www.linkedin.com/in/aawaaz-setu-889b5b449</p>
                    <p>• <strong>X (Twitter):</strong> https://x.com/AawaazSetu</p>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>

      {/* Preview Modal for Honourable Mention */}
      {mentionPreview && (
        <div className="fixed inset-0 z-60 bg-[#17243A]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#17243A]/10 pb-2">
              <span className="text-xs font-bold uppercase text-[#5B8F8A]">Live Post Preview</span>
              <button onClick={() => setMentionPreview(null)} className="p-1 hover:bg-[#F8F7F3] rounded-lg">✕</button>
            </div>
            {mentionPreview.image_urls && mentionPreview.image_urls.length > 0 && (
              <img src={mentionPreview.image_urls[0]} alt="Hero" className="w-full max-h-60 object-cover rounded-2xl" />
            )}
            <h2 className="font-serif text-2xl font-bold text-[#17243A]">{mentionPreview.title}</h2>
            {mentionPreview.subtitle && <p className="text-sm font-semibold text-[#5B8F8A]">{mentionPreview.subtitle}</p>}
            {mentionPreview.quote && <blockquote className="p-4 bg-[#EEF3F8] border-l-4 border-[#5B8F8A] italic text-xs">{mentionPreview.quote}</blockquote>}
            <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed text-[#252B35]">{mentionPreview.content}</p>
            <div className="flex justify-end pt-2">
              <button onClick={() => setMentionPreview(null)} className="px-4 py-2 bg-[#17243A] text-white text-xs font-semibold rounded-xl">Close Preview</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
