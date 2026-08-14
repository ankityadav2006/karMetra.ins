import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Interview } from '../../types';
import { storageService, subscribeStorage } from '../../services/storage';
import { MessageSquare, Send, Calendar, MapPin, Clock, X, Check, CheckCheck } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientId?: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, recipientName = 'KarMetra Recruiter', recipientId = 'u-2' }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getCurrentUser());
  const [messages, setMessages] = useState<Message[]>(() => storageService.getMessages());
  const [interviews, setInterviews] = useState<Interview[]>(() => storageService.getInterviews());
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeStorage(() => {
      setCurrentUser(storageService.getCurrentUser());
      setMessages(storageService.getMessages());
      setInterviews(storageService.getInterviews());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    storageService.sendMessage(currentUser, recipientId, inputText.trim());
    setInputText('');

    // Simulate instant automated recruiter response if sent by seeker
    if (currentUser.role === 'seeker') {
      setTimeout(() => {
        storageService.sendMessage(
          {
            id: recipientId,
            name: recipientName,
            email: 'recruiter@karmetra.com',
            phone: '+91 98000 00000',
            role: 'employer',
            isVerified: true,
            createdAt: '2026-01-01',
          },
          currentUser.id,
          "Thank you for your message! Our team has received your application update. We will contact you shortly regarding interview slots."
        );
      }, 1200);
    }
  };

  const [notice, setNotice] = useState<string | null>(null);

  const handleAcceptInterview = (interviewId: string) => {
    storageService.updateInterviewStatus(interviewId, 'Accepted');
    setNotice('✓ Interview invitation accepted! Venue details saved to your interview calendar.');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[85vh] shadow-2xl border border-slate-200 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-teal-800 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
              💬
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">{recipientName}</h3>
              <p className="text-[11px] text-teal-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-300 animate-ping inline-block"></span>
                Online • KarMetra Verified Representative
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-teal-100 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {notice && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center animate-in fade-in">
            {notice}
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            const attachedInt = m.attachedInterviewId ? interviews.find((i) => i.id === m.attachedInterviewId) : null;

            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="text-[10px] text-slate-400 font-medium px-1 mb-0.5">{m.senderName}</div>

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    isMe ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Attached Interview Invitation Card if available */}
                  {attachedInt && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/50 bg-amber-50 text-slate-900 rounded-xl p-3 border border-amber-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Calendar className="w-4 h-4 text-amber-700" />
                        Interview Invitation
                      </div>
                      <p className="font-semibold">{attachedInt.jobTitle}</p>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {attachedInt.date} at {attachedInt.time} ({attachedInt.interviewType})
                      </p>
                      <p className="text-[11px] text-slate-600 flex items-start gap-1">
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{attachedInt.locationOrLink}</span>
                      </p>

                      <div className="pt-2 flex items-center gap-2">
                        {attachedInt.status === 'Accepted' ? (
                          <span className="text-[11px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                            ✓ Interview Accepted
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcceptInterview(attachedInt.id)}
                            className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs"
                          >
                            Accept Invitation
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-teal-100' : 'text-slate-400'}`}>
                    <span>{m.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-teal-200" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to recruiter..."
            className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
