import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserRole, User } from '../../types';
import { storageService } from '../../services/storage';
import { KarmetraLogo } from '../common/KarmetraLogo';
import { useI18n } from '../../utils/i18n';
import { validationRules } from '../../utils/validation';
import { FieldError } from '../common/FieldError';
import {
  X,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
}) => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'mobile' | 'email' | 'password'>('mobile');
  const [selectedRole, setSelectedRole] = useState<UserRole>('seeker');

  // Input states — ALL STRICTLY BLANK FOR PRIVACY
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field touched states for progressive error display
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTouched, setOtpTouched] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [maskedTarget, setMaskedTarget] = useState('');
  const [testCodeHint, setTestCodeHint] = useState<string | undefined>(undefined);

  // General banner notifications
  const [generalError, setGeneralError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Reset all sensitive fields to BLANK when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setPhone('');
      setEmail('');
      setName('');
      setPassword('');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTouched(false);
      setTouched({});
      setGeneralError('');
      setSuccessMsg('');
      setTestCodeHint(undefined);
    }
  }, [isOpen, initialMode]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [mode, countdown]);

  // Real-time Field Validations
  const errors = useMemo(() => {
    const errs: Record<string, string | null> = {};

    if (mode === 'register') {
      errs.name = validationRules.name(name, 'Full name', 2);
    }

    if (authMethod === 'mobile') {
      errs.phone = validationRules.phone(phone);
    } else if (authMethod === 'email') {
      errs.email = validationRules.email(email);
    } else if (authMethod === 'password') {
      errs.email = validationRules.email(email);
      errs.password = validationRules.password(password);
    }

    if (mode === 'otp') {
      const fullOtp = otpDigits.join('');
      if (fullOtp.length < 6) {
        errs.otp = 'Please enter all 6 digits of the OTP code';
      } else {
        errs.otp = null;
      }
    }

    return errs;
  }, [mode, authMethod, name, phone, email, password, otpDigits]);

  const passwordStrength = useMemo(() => {
    return validationRules.getPasswordStrength(password);
  }, [password]);

  if (!isOpen) return null;

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Mark active fields as touched
    const newTouched: Record<string, boolean> = {
      name: true,
      phone: true,
      email: true,
      password: true,
    };
    setTouched(newTouched);

    // Check if there are blocking errors
    if (mode === 'register' && errors.name) {
      return;
    }
    if (authMethod === 'mobile' && errors.phone) {
      return;
    }
    if (authMethod === 'email' && errors.email) {
      return;
    }
    if (authMethod === 'password') {
      if (errors.email || errors.password) return;
      // Direct password login simulation
      setIsVerifyingOtp(true);
      setTimeout(() => {
        setIsVerifyingOtp(false);
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: name.trim() || (selectedRole === 'seeker' ? 'Candidate User' : 'Recruiter Partner'),
          email: email.trim(),
          phone: '+91 9876543210',
          role: selectedRole,
          isVerified: true,
          createdAt: new Date().toISOString().split('T')[0],
        };
        storageService.setCurrentUser(newUser);
        onLoginSuccess(newUser);
        onClose();
      }, 500);
      return;
    }

    if (authMethod === 'mobile') {
      const cleanPhone = phone.replace(/\D/g, '');
      setMaskedTarget(`+91 ******${cleanPhone.slice(-4)}`);
    } else {
      const parts = email.split('@');
      setMaskedTarget(`${parts[0].slice(0, 2)}***@${parts[1]}`);
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setMode('otp');
      setCountdown(30);
      setTestCodeHint('123456');
      setSuccessMsg('6-Digit OTP sent successfully! (Demo Code: 123456)');
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }, 500);
  };

  const handleOtpChange = (index: number, value: string) => {
    setOtpTouched(true);
    if (value.length > 1) {
      // Paste handle
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        inputRefs[5].current?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setOtpTouched(true);
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      return;
    }

    setIsVerifyingOtp(true);
    setGeneralError('');

    setTimeout(() => {
      setIsVerifyingOtp(false);
      const cleanPhone = phone.trim() || '9876543210';
      const cleanEmail = email.trim() || 'user@karmetra.in';
      const cleanName = name.trim() || (selectedRole === 'seeker' ? 'Candidate User' : 'Recruiter Partner');

      const newUser: User = {
        id: `u-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: `+91 ${cleanPhone}`,
        role: selectedRole,
        isVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      storageService.setCurrentUser(newUser);
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  // Demo Account Quick Login
  const handleQuickDemoLogin = (role: UserRole) => {
    const user = storageService.switchRole(role);
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <KarmetraLogo size="sm" variant="dark" showTagline={false} />
          <h2 className="text-lg font-black tracking-tight mt-3">
            {mode === 'login' && t('auth.signInTitle', 'Welcome Back to KarMetra')}
            {mode === 'register' && t('auth.signUpTitle', 'Create Your Account')}
            {mode === 'otp' && 'Verify 6-Digit OTP'}
          </h2>
          <p className="text-xs text-teal-200/80 mt-0.5">
            {mode === 'otp'
              ? `Verification code sent to ${maskedTarget}`
              : 'India’s fastest verified blue-collar and professional hiring platform'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {generalError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mode 1 & 2: Login or Register */}
          {mode !== 'otp' && (
            <form onSubmit={handleSendOtp} noValidate className="space-y-3.5">
              {/* Role Selection on Register */}
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">I want to:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('seeker')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center transition-all ${
                        selectedRole === 'seeker'
                          ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs ring-1 ring-teal-500/30'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      <span>Find a Job</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('recruiter')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center transition-all ${
                        selectedRole === 'recruiter'
                          ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs ring-1 ring-teal-500/30'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>Hire Talent</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name (for Register) with Real-Time Error */}
              {mode === 'register' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="auth-name" className="text-xs font-bold text-slate-700">
                      {t('auth.nameLabel', 'Full Name')} <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      markTouched('name');
                    }}
                    onBlur={() => markTouched('name')}
                    placeholder="e.g. Rahul Verma"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 text-xs outline-hidden transition-all placeholder:text-slate-400 ${
                      touched.name && errors.name
                        ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 focus:border-rose-500'
                        : touched.name && !errors.name && name.length >= 2
                        ? 'border-teal-500 bg-teal-50/20 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                        : 'border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  <FieldError error={errors.name} touched={touched.name} />
                </div>
              )}

              {/* Auth Method Switcher (Mobile vs Email vs Password) */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('mobile');
                    setGeneralError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    authMethod === 'mobile' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setGeneralError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    authMethod === 'email' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('password');
                    setGeneralError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    authMethod === 'password' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Password</span>
                </button>
              </div>

              {/* Mobile Phone Input with Real-Time Validation */}
              {authMethod === 'mobile' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="auth-phone" className="text-xs font-bold text-slate-700">
                      {t('auth.phoneLabel', 'Indian Mobile Number')} <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {phone.length}/10 digits
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold">
                      🇮🇳 +91
                    </span>
                    <input
                      id="auth-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(clean);
                        markTouched('phone');
                      }}
                      onBlur={() => markTouched('phone')}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`flex-1 px-3.5 py-2.5 rounded-xl border text-slate-900 text-xs font-bold tracking-wider outline-hidden transition-all placeholder:text-slate-400 placeholder:font-normal ${
                        touched.phone && errors.phone
                          ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 focus:border-rose-500'
                          : touched.phone && !errors.phone && phone.length === 10
                          ? 'border-teal-500 bg-teal-50/20 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                          : 'border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                      }`}
                    />
                  </div>
                  <FieldError
                    error={errors.phone}
                    touched={touched.phone}
                    successMessage={phone.length === 10 ? 'Valid 10-digit mobile number' : null}
                  />
                </div>
              )}

              {/* Email Input with Real-Time Validation */}
              {(authMethod === 'email' || authMethod === 'password') && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="auth-email" className="text-xs font-bold text-slate-700">
                      {t('auth.emailLabel', 'Email Address')} <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      markTouched('email');
                    }}
                    onBlur={() => markTouched('email')}
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 text-xs outline-hidden transition-all placeholder:text-slate-400 ${
                      touched.email && errors.email
                        ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 focus:border-rose-500'
                        : touched.email && !errors.email && email.includes('@')
                        ? 'border-teal-500 bg-teal-50/20 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                        : 'border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  <FieldError error={errors.email} touched={touched.email} />
                </div>
              )}

              {/* Password Input with Real-Time Validation & Strength Indicator */}
              {authMethod === 'password' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="auth-password" className="text-xs font-bold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    {password && (
                      <span className="text-[10px] font-bold text-slate-500">
                        Strength: <strong className="text-slate-800">{passwordStrength.label}</strong>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        markTouched('password');
                      }}
                      onBlur={() => markTouched('password')}
                      placeholder="At least 8 characters"
                      className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-slate-900 text-xs outline-hidden transition-all placeholder:text-slate-400 ${
                        touched.password && errors.password
                          ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400 focus:border-rose-500'
                          : touched.password && !errors.password && password.length >= 8
                          ? 'border-teal-500 bg-teal-50/20 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                          : 'border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Progress */}
                  {password && (
                    <div className="mt-1.5 grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 rounded-full transition-all ${
                            step <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <FieldError error={errors.password} touched={touched.password} />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isSendingOtp ? (
                  <span>Sending verification OTP...</span>
                ) : authMethod === 'password' ? (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>{t('auth.sendOtp', 'Get 6-Digit OTP')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Toggle Login / Register */}
              <div className="text-center pt-1 text-xs text-slate-500">
                {mode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setTouched({});
                        setGeneralError('');
                      }}
                      className="font-bold text-teal-700 hover:underline"
                    >
                      Sign Up Free
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setTouched({});
                        setGeneralError('');
                      }}
                      className="font-bold text-teal-700 hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* Mode 3: OTP Verification */}
          {mode === 'otp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 text-center">
                  {t('auth.enterOtp', 'Enter 6-Digit Verification Code')}
                </label>
                <div className="flex justify-center gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-12 text-center text-lg font-black rounded-xl border outline-hidden transition-all text-slate-900 ${
                        otpTouched && errors.otp
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-400'
                          : digit
                          ? 'border-teal-500 bg-teal-50/20 focus:border-teal-600 focus:ring-2 focus:ring-teal-500'
                          : 'border-slate-300 bg-slate-50 focus:border-teal-600 focus:ring-2 focus:ring-teal-500'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-center">
                  <FieldError error={errors.otp} touched={otpTouched} />
                </div>
              </div>

              {testCodeHint && (
                <div className="bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-200 text-center text-[11px] font-semibold">
                  Demo Test Passcode: <strong className="text-amber-950 font-black">{testCodeHint}</strong>
                </div>
              )}

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>{t('auth.verifyOtp', 'Verify & Sign In')}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setMode(initialMode)}
                  className="font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← Change Number / Email
                </button>

                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={() => {
                    setCountdown(30);
                    setSuccessMsg('New OTP code sent!');
                  }}
                  className="font-bold text-teal-700 disabled:text-slate-400 hover:underline"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Quick 1-Tap Demo Switcher for Testers */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                1-Tap Instant Demo Access
              </span>
              <span className="text-[10px] text-teal-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Pre-Configured Roles
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('seeker')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition-all group"
              >
                <p className="text-[11px] font-bold text-slate-800 group-hover:text-teal-900">Job Seeker</p>
                <p className="text-[9px] text-slate-500">Rohan (Candidate)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('recruiter')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition-all group"
              >
                <p className="text-[11px] font-bold text-slate-800 group-hover:text-teal-900">Recruiter</p>
                <p className="text-[9px] text-slate-500">Neha (HR Manager)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left transition-all group"
              >
                <p className="text-[11px] font-bold text-slate-800 group-hover:text-purple-900">Admin</p>
                <p className="text-[9px] text-slate-500">Super Admin Console</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>{t('auth.privacyNote', 'Protected under Indian data privacy & security standards.')}</span>
        </div>
      </div>
    </div>
  );
};
