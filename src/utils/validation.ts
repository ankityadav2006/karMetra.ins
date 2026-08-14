/**
 * Standardized Form Validation Utilities for KarMetra.in
 * Provides real-time user-friendly error messages for all input forms.
 */

export const validationRules = {
  /**
   * Validate Email Address
   */
  email: (email: string, isRequired = true): string | null => {
    if (!email || !email.trim()) {
      return isRequired ? 'Email address is required' : null;
    }
    const clean = email.trim();
    // Standard RFC 5322 regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(clean)) {
      return 'Please enter a valid email address (e.g. name@example.com)';
    }
    return null;
  },

  /**
   * Validate Indian Mobile Phone Number
   */
  phone: (phone: string, isRequired = true): string | null => {
    if (!phone || !phone.trim()) {
      return isRequired ? 'Mobile number is required' : null;
    }
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 0 && !isRequired) return null;
    if (clean.length !== 10) {
      return 'Mobile number must be exactly 10 digits';
    }
    if (!/^[6-9]\d{9}$/.test(clean)) {
      return 'Mobile number must start with 6, 7, 8, or 9';
    }
    return null;
  },

  /**
   * Validate Password
   */
  password: (password: string, isRequired = true): string | null => {
    if (!password) {
      return isRequired ? 'Password is required' : null;
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return 'Password must contain at least 1 letter and 1 number';
    }
    return null;
  },

  /**
   * Password strength calculator
   */
  getPasswordStrength: (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 4) return { score: 3, label: 'Strong', color: 'bg-teal-500' };
    return { score: 4, label: 'Very Strong', color: 'bg-emerald-500' };
  },

  /**
   * Validate Full Name
   */
  name: (name: string, fieldLabel = 'Full name', minLength = 2): string | null => {
    if (!name || !name.trim()) {
      return `${fieldLabel} is required`;
    }
    if (name.trim().length < minLength) {
      return `${fieldLabel} must be at least ${minLength} characters`;
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(name.trim())) {
      return `${fieldLabel} can only contain letters and standard punctuation`;
    }
    return null;
  },

  /**
   * Validate Indian Pincode (6 digits)
   */
  pincode: (pincode: string, isRequired = true): string | null => {
    if (!pincode || !pincode.trim()) {
      return isRequired ? 'Pincode is required' : null;
    }
    const clean = pincode.replace(/\D/g, '');
    if (clean.length !== 6) {
      return 'Pincode must be a 6-digit number';
    }
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      return 'Pincode cannot start with 0';
    }
    return null;
  },

  /**
   * Validate Indian GSTIN (15 alphanumeric characters)
   * Format: 2 digits (state) + 10 chars PAN + 1 digit entity + 1 char (Z) + 1 checksum
   */
  gstin: (gstin: string, isRequired = false): string | null => {
    if (!gstin || !gstin.trim()) {
      return isRequired ? 'GSTIN is required' : null;
    }
    const clean = gstin.trim().toUpperCase();
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (clean.length !== 15 || !gstinRegex.test(clean)) {
      return 'Invalid GSTIN format (e.g. 27AAAAA0000A1Z5)';
    }
    return null;
  },

  /**
   * Validate Indian PAN (10 alphanumeric characters)
   * Format: 5 letters + 4 numbers + 1 letter
   */
  pan: (pan: string, isRequired = false): string | null => {
    if (!pan || !pan.trim()) {
      return isRequired ? 'PAN is required' : null;
    }
    const clean = pan.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (clean.length !== 10 || !panRegex.test(clean)) {
      return 'Invalid PAN format (e.g. AAAPA1234F)';
    }
    return null;
  },

  /**
   * Validate Minimum and Maximum Salary
   */
  salaryRange: (min: number, max: number): { minError: string | null; maxError: string | null } => {
    let minError: string | null = null;
    let maxError: string | null = null;

    if (min <= 0 || isNaN(min)) {
      minError = 'Minimum salary must be greater than ₹0';
    }
    if (max <= 0 || isNaN(max)) {
      maxError = 'Maximum salary must be greater than ₹0';
    } else if (max < min) {
      maxError = `Max salary cannot be less than min salary (₹${min.toLocaleString('en-IN')})`;
    }
    return { minError, maxError };
  },

  /**
   * Validate Experience Range
   */
  experienceRange: (minExp: number, maxExp: number): { minError: string | null; maxError: string | null } => {
    let minError: string | null = null;
    let maxError: string | null = null;

    if (minExp < 0 || isNaN(minExp)) {
      minError = 'Min experience cannot be negative';
    }
    if (maxExp < 0 || isNaN(maxExp)) {
      maxError = 'Max experience cannot be negative';
    } else if (maxExp < minExp) {
      maxError = `Max experience (${maxExp} yrs) cannot be less than min experience (${minExp} yrs)`;
    }
    return { minError, maxError };
  },

  /**
   * Validate Passing Year
   */
  passingYear: (year: string, isRequired = true): string | null => {
    if (!year || !year.trim()) {
      return isRequired ? 'Passing year is required' : null;
    }
    const num = Number(year.trim());
    const currentYear = new Date().getFullYear();
    if (isNaN(num) || num < 1960 || num > currentYear + 6) {
      return `Please enter a valid 4-digit passing year (1960-${currentYear + 6})`;
    }
    return null;
  },

  /**
   * Validate Age
   */
  age: (age: number | string, min = 18, max = 70): string | null => {
    const num = Number(age);
    if (isNaN(num) || num === 0) {
      return 'Age is required';
    }
    if (num < min || num > max) {
      return `Age must be between ${min} and ${max} years`;
    }
    return null;
  },

  /**
   * Generic Required Text Validation
   */
  required: (val: string, fieldName = 'This field', minLength = 1): string | null => {
    if (!val || !val.trim()) {
      return `${fieldName} is required`;
    }
    if (val.trim().length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
  },
};
