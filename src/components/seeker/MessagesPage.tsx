import React, { useState, useEffect } from 'react';
import {
  Search,
  Send,
  Paperclip,
  CheckCheck,
  Briefcase,
  GraduationCap,
  Calendar,
  ShieldCheck,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  Phone,
  Video,
} from 'lucide-react';
import { storageService, subscribeStorage } from '../../services/storage';
import { Conversation, Message, User } from '../../types';

interface MessagesPageProps {
  currentUser: User;
  onNavigate?: (tab: string, extraId?: string) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ currentUser, onNavigate }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Recruiter' | 'Company' | 'Karmetra Admin' | 'Career Support'>('All');
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      const convs = storageService.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConvId) {
        setActiveConvId(convs[0].id);
      }
      if (activeConvId) {
        setMessages(storageService.getConversationMessages(activeConvId));
      }
    };
    load();
    const unsub = subscribeStorage(load);
    return () => unsub();
  }, [activeConvId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSelectConv = (convId: string) => {
    setActiveConvId(convId);
    storageService.markConversationRead(convId);
    setMessages(storageService.getConversationMessages(convId));
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    storageService.sendMessage(
      currentUser,
      activeConversation.participantId,
      inputText.trim(),
      activeConversation.id
    );
    setInputText('');
  };

  const handleAttachJob = () => {
    if (!activeConversation) return;
    storageService.sendMessage(
      currentUser,
      activeConversation.participantId,
      'Sharing relevant job position for reference:',
      activeConversation.id,
      {
        attachedJobId: 'job-5',
        attachedJobTitle: 'MIS & Data Operations Executive',
      }
    );
    setAttachmentMenuOpen(false);
  };

  const handleAttachCourse = () => {
    if (!activeConversation) return;
    storageService.sendMessage(
      currentUser,
      activeConversation.participantId,
      'Sharing my active skill progress in Power BI:',
      activeConversation.id,
      {
        attachedCourseId: 'crs-pbi-101',
      }
    );
    setAttachmentMenuOpen(false);
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.participantCompany && c.participantCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || c.participantRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Messages & Direct Inquiries</span>
              <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Real-Time
              </span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Communicate directly with verified recruiters, hiring companies, Karmetra administrators, and career advisors.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Encrypted & Direct
            </span>
          </div>
        </div>

        {/* Main 2-Column Chat Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[720px]">
          {/* LEFT: Conversation List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
            {/* Search and Category Filters */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search messages, recruiters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
              </div>

              {/* Role filter pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {(['All', 'Recruiter', 'Company', 'Karmetra Admin', 'Career Support'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition ${
                      roleFilter === r
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No conversations found</p>
                  <p className="text-xs mt-1">Try clearing your search filter</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      className={`w-full text-left p-4 flex items-start gap-3 transition relative ${
                        isActive
                          ? 'bg-teal-50/70 border-l-4 border-teal-600'
                          : 'hover:bg-slate-100/70'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {conv.participantAvatar ? (
                          <img
                            src={conv.participantAvatar}
                            alt={conv.participantName}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                            {conv.participantName.charAt(0)}
                          </div>
                        )}
                        {conv.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-sm font-semibold text-slate-900 truncate flex items-center gap-1">
                            <span>{conv.participantName}</span>
                            {conv.verifiedBadge && (
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                            )}
                          </h4>
                          <span className="text-[11px] text-slate-400 whitespace-nowrap">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              conv.participantRole === 'Company'
                                ? 'bg-blue-100 text-blue-800'
                                : conv.participantRole === 'Recruiter'
                                ? 'bg-indigo-100 text-indigo-800'
                                : conv.participantRole === 'Karmetra Admin'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {conv.participantRole}
                          </span>
                          {conv.participantCompany && (
                            <span className="text-xs text-slate-500 truncate">
                              • {conv.participantCompany}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 truncate">{conv.lastMessageText}</p>
                      </div>

                      {/* Unread badge */}
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Active Chat Box */}
          <div className="flex-1 flex flex-col bg-white">
            {activeConversation ? (
              <>
                {/* Chat Top Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {activeConversation.participantAvatar ? (
                        <img
                          src={activeConversation.participantAvatar}
                          alt={activeConversation.participantName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                          {activeConversation.participantName.charAt(0)}
                        </div>
                      )}
                      {activeConversation.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {activeConversation.participantName}
                        </h3>
                        {activeConversation.verifiedBadge && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            <ShieldCheck className="w-3 h-3" />
                            Verified {activeConversation.participantRole}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {activeConversation.participantCompany ? `${activeConversation.participantCompany} • ` : ''}
                        {activeConversation.isOnline ? 'Active now' : 'Seen recently'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Initiating secure direct call with ${activeConversation.participantName}`)}
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                      title="Direct Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert(`Starting video meeting room with ${activeConversation.participantName}`)}
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                      title="Video Room"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  <div className="text-center my-2">
                    <span className="text-[11px] font-medium text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                      Official KarMetra Verified Channel
                    </span>
                  </div>

                  {messages.map((m) => {
                    const isMe = m.senderRole === 'seeker' || m.senderId === currentUser.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-xs ${
                            isMe
                              ? 'bg-teal-600 text-white rounded-br-none'
                              : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                          }`}
                        >
                          {!isMe && (
                            <p className="text-[11px] font-bold text-teal-700 mb-1">
                              {m.senderName}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed">{m.text}</p>

                          {/* Attached Job Card */}
                          {m.attachedJobId && (
                            <div className={`mt-2.5 p-3 rounded-xl border ${
                              isMe ? 'bg-teal-700/60 border-teal-500' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex items-center gap-2">
                                <Briefcase className={`w-4 h-4 ${isMe ? 'text-teal-200' : 'text-teal-600'}`} />
                                <span className="text-xs font-bold truncate">
                                  {m.attachedJobTitle || 'Featured Job Opening'}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <span className={`text-[11px] ${isMe ? 'text-teal-200' : 'text-slate-500'}`}>
                                  Tap to view full job & requirements
                                </span>
                                <button
                                  onClick={() => onNavigate && onNavigate('jobs', m.attachedJobId)}
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                                    isMe
                                      ? 'bg-white text-teal-800 hover:bg-teal-50'
                                      : 'bg-teal-600 text-white hover:bg-teal-700'
                                  }`}
                                >
                                  View Job
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Attached Course Card */}
                          {m.attachedCourseId && (
                            <div className={`mt-2.5 p-3 rounded-xl border ${
                              isMe ? 'bg-teal-700/60 border-teal-500' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div className="flex items-center gap-2">
                                <GraduationCap className={`w-4 h-4 ${isMe ? 'text-teal-200' : 'text-teal-600'}`} />
                                <span className="text-xs font-bold truncate">
                                  Power BI Interactive Training & Certificate
                                </span>
                              </div>
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <span className={`text-[11px] ${isMe ? 'text-teal-200' : 'text-slate-500'}`}>
                                  Progress: 75% • 2 lessons remaining
                                </span>
                                <button
                                  onClick={() => onNavigate && onNavigate('learning', m.attachedCourseId)}
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                                    isMe
                                      ? 'bg-white text-teal-800 hover:bg-teal-50'
                                      : 'bg-teal-600 text-white hover:bg-teal-700'
                                  }`}
                                >
                                  Open Course
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Attached Interview Card */}
                          {m.attachedInterviewId && (
                            <div className={`mt-2.5 p-3 rounded-xl border ${
                              isMe ? 'bg-teal-700/60 border-teal-500' : 'bg-amber-50 border-amber-200'
                            }`}>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-amber-700" />
                                <span className="text-xs font-bold text-amber-900">
                                  Walk-in Interview Scheduled: Aug 14, 11:00 AM
                                </span>
                              </div>
                              <p className="text-[11px] text-amber-800 mt-1">
                                Location: Apex Logistics Hub, MIDC Andheri East, Mumbai
                              </p>
                              <div className="mt-2">
                                <button
                                  onClick={() => onNavigate && onNavigate('interviews')}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition"
                                >
                                  View Details & Location
                                </button>
                              </div>
                            </div>
                          )}

                          <div className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                            isMe ? 'text-teal-200' : 'text-slate-400'
                          }`}>
                            <span>{m.timestamp}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-teal-200" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Attachment Dropdown */}
                {attachmentMenuOpen && (
                  <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600">Quick Attach:</span>
                    <button
                      onClick={handleAttachJob}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 flex items-center gap-1.5 transition"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                      Attach Relevant Job
                    </button>
                    <button
                      onClick={handleAttachCourse}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 flex items-center gap-1.5 transition"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                      Attach Course Progress
                    </button>
                    <button
                      onClick={() => setAttachmentMenuOpen(false)}
                      className="ml-auto text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Attach job, skill or document"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    placeholder={`Message ${activeConversation.participantName}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`p-2.5 rounded-xl font-medium flex items-center justify-center transition ${
                      inputText.trim()
                        ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <UserIcon className="w-12 h-12 mb-3 opacity-40" />
                <h3 className="text-base font-semibold text-slate-700">Select a Conversation</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Choose a recruiter, employer or career mentor from the left panel to begin discussing job opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
