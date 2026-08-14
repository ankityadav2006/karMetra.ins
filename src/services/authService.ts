import { UserRole, User } from '../types';
import { storageService } from './storage';

export interface OtpSession {
  identifier: string;
  maskedIdentifier: string;
  method: 'mobile' | 'email';
  role: UserRole;
  code: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  lastSentTime: number;
}

const ACTIVE_OTP_KEY = 'karmetra_active_otp_session';
const OTP_REQUEST_LOG_KEY = 'karmetra_otp_request_log';

function getActiveSession(): OtpSession | null {
  try {
    const raw = sessionStorage.getItem(ACTIVE_OTP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setActiveSession(session: OtpSession | null): void {
  try {
    if (session) {
      sessionStorage.setItem(ACTIVE_OTP_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(ACTIVE_OTP_KEY);
    }
  } catch (e) {
    console.warn('Failed to save OTP session', e);
  }
}

export function maskMobileNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    const last4 = digits.slice(-4);
    const first2 = digits.slice(0, 2);
    return `+91 ${first2}*** *${last4}`;
  }
  return `+91 ${phone}`;
}

export function maskEmailAddress(email: string): string {
  const parts = email.split('@');
  if (parts.length === 2) {
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
    return `${maskedName}@${domain}`;
  }
  return email;
}

export const authService = {
  // Send OTP (SMS or Email)
  sendOtp(identifier: string, method: 'mobile' | 'email', role: UserRole): {
    success: boolean;
    maskedIdentifier: string;
    message: string;
    cooldownSeconds?: number;
    testCode?: string; // Stored securely for local demo helper
  } {
    const trimmed = identifier.trim();
    if (!trimmed) {
      return {
        success: false,
        maskedIdentifier: '',
        message: 'Please enter a valid mobile number or email address.',
      };
    }

    if (method === 'mobile') {
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 10) {
        return {
          success: false,
          maskedIdentifier: '',
          message: 'Please enter a valid 10-digit mobile number.',
        };
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return {
          success: false,
          maskedIdentifier: '',
          message: 'Please enter a valid email address.',
        };
      }
    }

    const currentSession = getActiveSession();
    const now = Date.now();

    // Check resend cooldown (30 seconds)
    if (currentSession && currentSession.identifier === trimmed && now - currentSession.lastSentTime < 30000) {
      const remainingSeconds = Math.ceil((30000 - (now - currentSession.lastSentTime)) / 1000);
      return {
        success: false,
        maskedIdentifier: currentSession.maskedIdentifier,
        message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
        cooldownSeconds: remainingSeconds,
      };
    }

    // Check rate limit (Max 5 requests in 10 minutes)
    let requestLog: number[] = [];
    try {
      const rawLog = sessionStorage.getItem(OTP_REQUEST_LOG_KEY);
      if (rawLog) requestLog = JSON.parse(rawLog);
    } catch {}
    
    requestLog = requestLog.filter(ts => now - ts < 600000); // 10 minutes
    if (requestLog.length >= 5) {
      return {
        success: false,
        maskedIdentifier: '',
        message: 'Too many OTP requests. Please try again in 10 minutes.',
      };
    }
    requestLog.push(now);
    sessionStorage.setItem(OTP_REQUEST_LOG_KEY, JSON.stringify(requestLog));

    // Generate 6-digit OTP code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const masked = method === 'mobile' ? maskMobileNumber(trimmed) : maskEmailAddress(trimmed);

    const newSession: OtpSession = {
      identifier: trimmed,
      maskedIdentifier: masked,
      method,
      role,
      code: generatedCode,
      createdAt: now,
      expiresAt: now + 300000, // 5 minutes validity
      attempts: 0,
      maxAttempts: 3,
      lastSentTime: now,
    };

    setActiveSession(newSession);

    return {
      success: true,
      maskedIdentifier: masked,
      message: method === 'mobile' ? `OTP sent to ${masked}` : `OTP sent to ${masked}`,
      testCode: generatedCode,
    };
  },

  // Verify OTP
  verifyOtp(identifier: string, enteredCode: string, role: UserRole): {
    success: boolean;
    message?: string;
    user?: User;
    isNewUser?: boolean;
  } {
    const session = getActiveSession();
    const now = Date.now();

    if (!session || session.identifier !== identifier.trim()) {
      return {
        success: false,
        message: 'Unable to send OTP. Please request a new OTP.',
      };
    }

    // Check expiry
    if (now > session.expiresAt) {
      setActiveSession(null);
      return {
        success: false,
        message: 'OTP has expired. Request a new OTP.',
      };
    }

    // Check max attempts limit
    if (session.attempts >= session.maxAttempts) {
      return {
        success: false,
        message: 'Too many attempts. Please try again later.',
      };
    }

    // Check code match (Allow actual generated code OR standard test demo codes e.g. 123456)
    const isCodeMatch =
      enteredCode === session.code ||
      enteredCode === '123456' ||
      enteredCode === '654321' ||
      enteredCode === '999999';

    if (!isCodeMatch) {
      session.attempts += 1;
      setActiveSession(session);

      if (session.attempts >= session.maxAttempts) {
        return {
          success: false,
          message: 'Too many attempts. Please try again later.',
        };
      }

      return {
        success: false,
        message: 'Incorrect OTP. Please try again.',
      };
    }

    // Clear session on successful verification
    setActiveSession(null);

    // Retrieve or create User account
    const users = storageService.getUsers();
    let existingUser = users.find(u =>
      u.role === role &&
      (u.phone.includes(identifier) || u.email.toLowerCase() === identifier.toLowerCase())
    );

    let isNewUser = false;

    if (!existingUser) {
      isNewUser = true;
      const isMobile = session.method === 'mobile';
      existingUser = {
        id: `user-${Date.now()}`,
        name: isMobile ? `User ${identifier.slice(-4)}` : identifier.split('@')[0],
        email: isMobile ? `user${identifier.slice(-4)}@karmetra.com` : identifier,
        phone: isMobile ? `+91 ${identifier.replace(/\D/g, '').slice(-10)}` : '+91 9876543210',
        role,
        isVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      users.push(existingUser);
      localStorage.setItem('karmetra_users', JSON.stringify(users));
    } else {
      existingUser.isVerified = true;
    }

    // Set current active user session
    storageService.setCurrentUser(existingUser);

    return {
      success: true,
      message: session.method === 'mobile' ? '✓ Mobile verified' : '✓ Email verified',
      user: existingUser,
      isNewUser,
    };
  },

  getCurrentSession(): OtpSession | null {
    return getActiveSession();
  },

  clearSession(): void {
    setActiveSession(null);
  },
};
