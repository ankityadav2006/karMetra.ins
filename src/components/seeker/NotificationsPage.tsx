import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { storageService, subscribeStorage } from '../../services/storage';
import { Notification, User } from '../../types';

interface NotificationsPageProps {
  currentUser: User;
  onNavigate?: (tab: string, extraId?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'jobs' | 'applications' | 'learning' | 'career'>('All');

  useEffect(() => {
    const load = () => {
      setNotifications(storageService.getNotifications());
    };
    load();
    const unsub = subscribeStorage(load);
    return () => unsub();
  }, []);

  const handleMarkAllRead = () => {
    storageService.markNotificationsRead();
  };

  const handleNotificationClick = (notif: Notification) => {
    storageService.markNotificationRead(notif.id);

    if (onNavigate) {
      if (notif.targetType === 'course' || notif.category === 'learning' && notif.targetId?.startsWith('crs-')) {
        onNavigate('learning', notif.targetId);
      } else if (notif.targetType === 'certificate' || notif.category === 'learning' && notif.targetId?.startsWith('KMT-')) {
        onNavigate('certificates', notif.targetId);
      } else if (notif.targetType === 'job' || notif.category === 'jobs') {
        onNavigate('jobs', notif.targetId);
      } else if (notif.targetType === 'career' || notif.category === 'career') {
        onNavigate('career-guidance', notif.targetId);
      } else if (notif.targetType === 'application' || notif.category === 'applications') {
        onNavigate('applications', notif.targetId);
      } else if (notif.targetType === 'interview' || notif.type === 'interview') {
        onNavigate('interviews', notif.targetId);
      } else if (notif.link) {
        onNavigate(notif.link, notif.targetId);
      }
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeCategory === 'All') return true;
    return n.category === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'jobs':
        return {
          icon: <Briefcase className="w-4 h-4 text-blue-600" />,
          label: 'Job Match',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'applications':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          label: 'Application & Interview',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'learning':
        return {
          icon: <GraduationCap className="w-4 h-4 text-teal-600" />,
          label: 'Skill & Certificate',
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
        };
      case 'career':
        return {
          icon: <Sparkles className="w-4 h-4 text-purple-600" />,
          label: 'Career Guidance',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-slate-600" />,
          label: 'Update',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Notifications & Activity
              </h1>
              {unreadCount > 0 && (
                <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Real-time updates regarding job invites, course milestones, certificates, and hiring alerts.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-white border border-teal-200 rounded-xl hover:bg-teal-50 transition shadow-xs"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200 no-scrollbar">
          {(
            [
              { key: 'All', label: 'All Updates', count: notifications.length },
              {
                key: 'jobs',
                label: 'Jobs & Alerts',
                count: notifications.filter((n) => n.category === 'jobs').length,
              },
              {
                key: 'applications',
                label: 'Applications & Interviews',
                count: notifications.filter((n) => n.category === 'applications').length,
              },
              {
                key: 'learning',
                label: 'Learning & Certificates',
                count: notifications.filter((n) => n.category === 'learning').length,
              },
              {
                key: 'career',
                label: 'Career Guidance',
                count: notifications.filter((n) => n.category === 'career').length,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                activeCategory === tab.key
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === tab.key
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You are all caught up in this category. New updates will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map((notif) => {
              const isUnread = !notif.isRead && !notif.read;
              const badge = getCategoryBadge(notif.category);

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isUnread
                      ? 'bg-teal-50/40 border-teal-200 hover:bg-teal-50/80 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Category Icon */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex-shrink-0 mt-0.5">
                      {badge.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.timestamp}
                        </span>
                      </div>

                      <h4
                        className={`text-sm font-semibold ${
                          isUnread ? 'text-slate-900 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Link */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <span className="text-xs font-bold text-teal-700 flex items-center gap-1 group-hover:underline">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
