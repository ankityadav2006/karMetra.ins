import React from 'react';
import { UserRole } from '../../types';
import { Home, Search, Briefcase, MessageSquare, User, Building, Users, FileText, Layers } from 'lucide-react';

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadMessagesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  activeTab,
  onSelectTab,
  unreadMessagesCount = 0,
}) => {
  let items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Jobs', icon: Search },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (role === 'employer') {
    items = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
      { id: 'candidates', label: 'Candidates', icon: Users },
      { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
      { id: 'profile', label: 'Company', icon: Building },
    ];
  } else if (role === 'recruiter') {
    items = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'candidates', label: 'Candidates', icon: Users },
      { id: 'requirements', label: 'Requirements', icon: Layers },
      { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
      { id: 'profile', label: 'Profile', icon: User },
    ];
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 shadow-lg px-2 py-1 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-[60px] relative transition-colors ${
              isActive ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">{item.label}</span>

            {item.badge && item.badge > 0 ? (
              <span className="absolute top-0 right-3 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
