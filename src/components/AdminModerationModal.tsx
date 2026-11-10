import React, { useState } from 'react';
import { Story, SiteConfig, ContactMessage, StoryStatus, StoryCategory } from '../types';
import {
  X,
  Lock,
  CheckCircle2,
  XCircle,
  Archive,
  Edit3,
  KeyRound,
  Download,
  Save,
  Globe,
  Mail,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  onUpdateStory: (updatedStory: Story) => void;
  onDeleteStory: (id: string) => void;
  config: SiteConfig;
  onUpdateConfig: (newConfig: Partial<SiteConfig>) => void;
  contactMessages?: ContactMessage[];
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose,
  stories,
  onUpdateStory,
  onDeleteStory,
  config,
  onUpdateConfig,
  contactMessages = [],
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'messages' | 'settings'>('overview');
  const [filterStatus, setFilterStatus] = useState<StoryStatus | 'all'>('Pending Review');

  // Story edit mode
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editCategory, setEditCategory] = useState<StoryCategory>('Anonymous Stories');

  // Settings mode
  const [formUrl, setFormUrl] = useState(config.googleFormUrl);
  const [contactEmail, setContactEmail] = useState(config.email);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === 'aawaz2026') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const startEdit = (story: Story) => {
    setEditingStoryId(story.id);
    setEditTitle(story.title);
    setEditContent(story.content);
    setEditAuthor(story.authorName);
    setEditCategory(story.category);
  };

  const saveEdit = (originalStory: Story) => {
    onUpdateStory({
      ...originalStory,
      title: editTitle,
      content: editContent,
      excerpt: editContent.slice(0, 180) + '...',
      authorName: editAuthor,
      category: editCategory,
      privacySanitized: true, // marked as sanitized
    });
    setEditingStoryId(null);
  };

  const handleStatusChange = (story: Story, newStatus: StoryStatus) => {
    onUpdateStory({
      ...story,
      status: newStatus,
      date: newStatus === 'Published' ? `Published · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : story.date,
    });
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'project_aawaz_submissions_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredStories = stories.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const pendingCount = stories.filter((s) => s.status === 'Pending Review').length;
  const publishedCount = stories.filter((s) => s.status === 'Published').length;
  const archivedCount = stories.filter((s) => s.status === 'Archived').length;

  return (
    <div className="fixed inset-0 z-50 bg-[#17243A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#17243A]/10 relative my-6 max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#17243A]/10 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#17243A] text-white flex items-center justify-center font-bold border border-[#5B8F8A]/30">
              <Lock className="w-5 h-5 text-[#EAE5F5]" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A]">
                Aawaaz Setu — Founder Administration Dashboard
              </h3>
              <p className="text-xs text-[#687385]">
                Confidential Submission Review, Privacy Sanitization & Settings
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

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="py-12 flex flex-col items-center justify-center max-w-sm mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF3F8] text-[#5B8F8A] flex items-center justify-center mb-4 border border-[#5B8F8A]/20">
              <KeyRound className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#17243A] mb-2">
              Founder Passkey Required
            </h4>
            <p className="text-xs text-[#687385] mb-6 font-normal">
              Enter the administration passkey to review confidential survivor submissions, sanitize identifying details, and manage publishing.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter passkey (default: aawaz2026)"
                  className="w-full px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/20 rounded-xl text-center text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-2 font-medium">
                    Incorrect passkey. Default passkey is: aawaz2026
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#17243A] hover:bg-[#252B35] text-white font-semibold text-xs rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-xs border border-[#17243A]"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Nav Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#17243A]/10 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'bg-[#EEF3F8] text-[#252B35] hover:bg-[#EAE5F5]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 inline mr-1" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('stories')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'stories'
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'bg-[#EEF3F8] text-[#252B35] hover:bg-[#EAE5F5]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1" />
                  <span>Stories ({stories.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'messages'
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'bg-[#EEF3F8] text-[#252B35] hover:bg-[#EAE5F5]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                  <span>Messages ({contactMessages.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'bg-[#EEF3F8] text-[#252B35] hover:bg-[#EAE5F5]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 inline mr-1" />
                  <span>Settings</span>
                </button>
              </div>

              <button
                onClick={handleExportData}
                className="text-xs text-[#252B35] hover:text-[#17243A] flex items-center gap-1.5 px-3 py-1.5 border border-[#17243A]/15 rounded-xl hover:bg-[#EEF3F8] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#5B8F8A]" />
                <span>Export Submissions (JSON)</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="py-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
                    <span className="text-xs font-semibold uppercase text-amber-800 block">Pending Review</span>
                    <span className="text-2xl font-bold font-serif text-[#17243A]">{pendingCount}</span>
                  </div>
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                    <span className="text-xs font-semibold uppercase text-emerald-800 block">Published Stories</span>
                    <span className="text-2xl font-bold font-serif text-[#17243A]">{publishedCount}</span>
                  </div>
                  <div className="p-4 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10">
                    <span className="text-xs font-semibold uppercase text-[#687385] block">Archived Stories</span>
                    <span className="text-2xl font-bold font-serif text-[#17243A]">{archivedCount}</span>
                  </div>
                  <div className="p-4 bg-[#EEF3F8] rounded-2xl border border-[#5B8F8A]/30">
                    <span className="text-xs font-semibold uppercase text-[#5B8F8A] block">Total Received</span>
                    <span className="text-2xl font-bold font-serif text-[#17243A]">{stories.length}</span>
                  </div>
                </div>

                <div className="p-5 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 text-xs text-[#252B35] space-y-2">
                  <span className="font-bold text-[#17243A] block text-sm">Founder Moderation Guidelines (Section 11 & 18):</span>
                  <ul className="list-disc pl-4 space-y-1 text-[#687385]">
                    <li>Only stories with the <strong>Published</strong> status will appear publicly on the Victim Storytelling page.</li>
                    <li>Always edit and remove real names of perpetrators or victims, phone numbers, and identifying locations before publishing.</li>
                    <li>Never fabricate stories or testimonials. If no stories are approved, the website gracefully shows a respectful empty state.</li>
                    <li>Submissions without publication consent must remain strictly private to this dashboard.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: STORY MANAGEMENT */}
            {activeTab === 'stories' && (
              <div className="flex-1 flex flex-col overflow-hidden pt-4">
                {/* Status Filter Chips */}
                <div className="flex items-center gap-1.5 mb-4 shrink-0 overflow-x-auto pb-1 text-xs">
                  {(['Pending Review', 'Approved', 'Published', 'Rejected', 'Archived', 'all'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1 rounded-xl font-medium cursor-pointer ${
                        filterStatus === st
                          ? 'bg-[#17243A] text-white shadow-2xs'
                          : 'bg-[#EEF3F8] text-[#252B35] hover:bg-[#EAE5F5]'
                      }`}
                    >
                      {st} ({stories.filter((s) => (st === 'all' ? true : s.status === st)).length})
                    </button>
                  ))}
                </div>

                {/* Submissions List */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {filteredStories.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#687385] bg-[#F8F7F3] rounded-2xl">
                      No submissions found under status: {filterStatus}.
                    </div>
                  ) : (
                    filteredStories.map((story) => {
                      const isEditing = editingStoryId === story.id;
                      return (
                        <div
                          key={story.id}
                          className="p-5 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  story.status === 'Published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : story.status === 'Approved'
                                    ? 'bg-sky-100 text-sky-800'
                                    : story.status === 'Pending Review'
                                    ? 'bg-amber-100 text-amber-800'
                                    : story.status === 'Rejected'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-stone-200 text-stone-700'
                                }`}
                              >
                                {story.status}
                              </span>
                              <span className="font-semibold text-[#17243A]">{story.authorName}</span>
                              <span className="text-[#687385]">({story.category})</span>
                              {story.email && (
                                <span className="text-[#687385] font-mono">[{story.email}]</span>
                              )}
                            </div>
                            <span className="text-[#687385] text-[11px]">
                              Submitted: {new Date(story.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          {isEditing ? (
                            <div className="space-y-3 pt-2 bg-white p-4 rounded-xl border border-[#17243A]/10">
                              <div className="text-xs font-bold text-[#5B8F8A] uppercase">
                                Redact & Sanitize for Privacy (Section 11)
                              </div>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-[#17243A]/20 rounded-xl font-bold"
                                placeholder="Story Title"
                              />
                              <textarea
                                rows={5}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-[#17243A]/20 rounded-xl leading-relaxed font-sans"
                                placeholder="Edit text to remove real names, locations, and identifying details"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingStoryId(null)}
                                  className="px-3 py-1 text-xs text-[#687385] hover:text-[#17243A] cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveEdit(story)}
                                  className="px-4 py-1.5 text-xs font-semibold bg-[#17243A] text-white rounded-lg flex items-center gap-1 cursor-pointer"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save Sanitized Version</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h5 className="font-serif font-bold text-sm text-[#17243A] mb-1">
                                {story.title}
                              </h5>
                              <p className="text-xs text-[#252B35]/85 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border border-[#17243A]/10">
                                {story.content}
                              </p>
                            </div>
                          )}

                          {/* Verification Flags */}
                          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#687385] pt-1">
                            <span className="flex items-center gap-1">
                              {story.consentGiven ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                              )}
                              <span>Publication Consent: {story.consentGiven ? 'Granted' : 'Private Only (No Consent)'}</span>
                            </span>

                            <span className="flex items-center gap-1">
                              {story.privacySanitized ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#5B8F8A]" />
                              ) : (
                                <span className="text-amber-600 font-medium">Needs Privacy Redaction</span>
                              )}
                            </span>
                          </div>

                          {/* Action Controls */}
                          <div className="pt-2 border-t border-[#17243A]/10 flex flex-wrap items-center justify-between gap-2">
                            <button
                              onClick={() => startEdit(story)}
                              className="text-xs text-[#5B8F8A] hover:text-[#17243A] flex items-center gap-1 font-medium cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sanitize & Edit</span>
                            </button>

                            <div className="flex flex-wrap items-center gap-1.5">
                              {story.status !== 'Published' && (
                                <button
                                  disabled={!story.consentGiven}
                                  onClick={() => handleStatusChange(story, 'Published')}
                                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                                    story.consentGiven
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                  }`}
                                  title={!story.consentGiven ? 'Cannot publish without explicit consent' : 'Publish story publicly'}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Publish Story</span>
                                </button>
                              )}

                              {story.status === 'Published' && (
                                <button
                                  onClick={() => handleStatusChange(story, 'Approved')}
                                  className="px-3 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg cursor-pointer"
                                  title="Unpublish from public view"
                                >
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Unpublish</span>
                                </button>
                              )}

                              {story.status !== 'Approved' && story.status !== 'Published' && (
                                <button
                                  onClick={() => handleStatusChange(story, 'Approved')}
                                  className="px-2.5 py-1 text-xs font-semibold bg-sky-50 text-sky-800 rounded-lg hover:bg-sky-100"
                                >
                                  Approve
                                </button>
                              )}

                              {story.status !== 'Rejected' && (
                                <button
                                  onClick={() => handleStatusChange(story, 'Rejected')}
                                  className="px-2.5 py-1 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
                                >
                                  Reject
                                </button>
                              )}

                              {story.status !== 'Archived' && (
                                <button
                                  onClick={() => handleStatusChange(story, 'Archived')}
                                  className="px-2 py-1 text-xs text-stone-600 bg-stone-200/70 rounded-lg hover:bg-stone-200"
                                >
                                  Archive
                                </button>
                              )}

                              <button
                                onClick={() => onDeleteStory(story.id)}
                                className="p-1 text-stone-400 hover:text-rose-600"
                                title="Delete submission"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CONTACT MESSAGES */}
            {activeTab === 'messages' && (
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {contactMessages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#687385] bg-[#F8F7F3] rounded-2xl">
                    No contact inquiries received yet.
                  </div>
                ) : (
                  contactMessages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[#687385]">
                        <span className="font-bold text-[#17243A]">{msg.subject}</span>
                        <span>{new Date(msg.submittedAt).toLocaleString()}</span>
                      </div>
                      <p className="text-[#252B35] whitespace-pre-line bg-white p-3.5 rounded-xl border border-[#17243A]/10">
                        {msg.message}
                      </p>
                      <div className="text-[11px] text-[#687385] flex items-center gap-4">
                        <span>From: {msg.name || 'Anonymous Peer'}</span>
                        {msg.email && <span>Email: {msg.email}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="py-6 space-y-6 overflow-y-auto">
                <div className="p-5 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 space-y-3">
                  <h4 className="font-bold text-sm text-[#17243A]">
                    Google Form Link (Section 10)
                  </h4>
                  <p className="text-xs text-[#687385]">
                    Paste your actual Google Form link here. When visitors click "Submit Through Google Form", this link will open.
                  </p>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                    className="w-full px-3 py-2 bg-white border border-[#17243A]/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => onUpdateConfig({ googleFormUrl: formUrl })}
                      className="px-4 py-1.5 bg-[#17243A] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Update Form Link
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 space-y-3">
                  <h4 className="font-bold text-sm text-[#17243A]">
                    Official Contact Email
                  </h4>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#17243A]/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => onUpdateConfig({ email: contactEmail })}
                      className="px-4 py-1.5 bg-[#17243A] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Update Email
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom info */}
            <div className="pt-4 border-t border-[#17243A]/10 flex items-center justify-between text-[11px] text-[#687385] shrink-0">
              <span>Admin Key: aawaz2026 (In-session protected)</span>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-[#687385] hover:text-[#17243A] cursor-pointer"
              >
                Lock Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
