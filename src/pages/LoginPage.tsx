/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Phone, Mail, Lock, AlertCircle, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' | 'otp' | 'register' | 'forgot'
  const [mode, setMode] = useState<'login' | 'otp' | 'register' | 'forgot'>('login');

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('rahim@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Validation & errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Return to previous page or dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validateEmailOrPhone = (val: string): boolean => {
    const trimmed = val.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    return emailRegex.test(trimmed) || bdPhoneRegex.test(trimmed);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isLocked) {
      setErrorMessage('Account temporarily locked due to 5 consecutive failed attempts. Please wait 15 minutes (BR-1).');
      return;
    }

    if (!validateEmailOrPhone(emailOrPhone)) {
      setErrorMessage('Enter a valid email or phone number');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    // Demo test verification (allow demo passwords or standard)
    if (password === 'wrongpassword') {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      if (nextFail >= 5) {
        setIsLocked(true);
        setErrorMessage('Account locked for 15 minutes after 5 consecutive failed attempts (BR-1).');
      } else {
        setErrorMessage(`Incorrect email/phone or password. (${5 - nextFail} attempts remaining)`);
      }
      return;
    }

    // Success
    login(emailOrPhone, name || 'Rahim');
    navigate(from, { replace: true });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateEmailOrPhone(emailOrPhone)) {
      setErrorMessage('Enter a valid email or phone number');
      return;
    }

    setOtpSent(true);
    setSuccessNotice('A simulated 6-digit verification code has been generated: 742190');
    setOtpCode('742190');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '742190' && otpCode.length < 4) {
      setErrorMessage('Invalid verification code. Please enter 742190');
      return;
    }
    login(emailOrPhone, 'Rahim');
    navigate(from, { replace: true });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!validateEmailOrPhone(emailOrPhone)) {
      setErrorMessage('Enter a valid email or phone number');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    login(emailOrPhone, name.trim());
    navigate(from, { replace: true });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailOrPhone(emailOrPhone)) {
      setErrorMessage('Enter a valid email or phone number');
      return;
    }
    setSuccessNotice('Password reset link sent to registered email/phone (Simulated).');
    setTimeout(() => {
      setMode('login');
      setSuccessNotice(null);
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Peach branding box */}
        <div className="lg:col-span-5 rounded-3xl bg-[#FFF0E8] border border-[#FFE2D1] p-10 flex flex-col justify-center items-center text-center min-h-[420px] shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F0440A] text-white flex items-center justify-center font-extrabold text-2xl mb-8 shadow-sm">
            SZ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1615] tracking-tight leading-tight">
            Give with confidence.
          </h2>
          <p className="text-lg text-[#665D58] mt-3 font-medium">
            See where it goes.
          </p>

          <div className="mt-12 text-xs text-[#8A817C] bg-white/70 backdrop-blur-xs py-2.5 px-4 rounded-xl border border-white">
            <ShieldCheck className="w-4 h-4 inline-block text-emerald-600 mr-1.5 -mt-0.5" />
            Hospital Verified • Scholar Board Audited
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-6">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1A1615] tracking-tight">
              {mode === 'login' && 'Welcome back'}
              {mode === 'otp' && 'Sign in with phone OTP'}
              {mode === 'register' && 'Create an account'}
              {mode === 'forgot' && 'Reset your password'}
            </h1>
            <p className="text-sm text-[#665E5A] mt-2">
              {mode === 'login' && 'Sign in to manage your giving'}
              {mode === 'otp' && 'We will send a one-time verification code'}
              {mode === 'register' && 'Join Smart Zakat to track your donations and auto-pay'}
              {mode === 'forgot' && 'Enter your email or phone to receive a password reset link'}
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Notice */}
          {successNotice && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* MODE 1: Standard Password Sign In */}
          {mode === 'login' && (
            <form onSubmit={handleStandardLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Email or phone
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] placeholder-[#9E958F] focus:outline-none focus:ring-2 focus:ring-[#F0440A] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[#1A1615]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setMode('forgot');
                    }}
                    className="text-xs font-medium text-[#F0440A] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] placeholder-[#9E958F] focus:outline-none focus:ring-2 focus:ring-[#F0440A] focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLocked}
                className="w-full py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07] shadow-sm transition-all disabled:opacity-50 active:scale-95"
              >
                Sign In
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#EAE3DC]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-[#948A84] font-medium">- or -</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setMode('otp');
                }}
                className="w-full py-3.5 px-6 rounded-full bg-white border border-[#DDD5CE] text-[#1A1615] font-semibold text-sm hover:bg-[#FAF7F5] transition-all"
              >
                Continue with phone OTP
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-[#665E5A]">
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setMode('register');
                    }}
                    className="font-bold text-[#F0440A] hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </div>

              {/* Demo Helper */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmailOrPhone('rahim@example.com');
                    setPassword('password123');
                    login('rahim@example.com', 'Rahim');
                    navigate(from, { replace: true });
                  }}
                  className="text-xs text-[#8A817C] hover:text-[#F0440A] underline"
                >
                  ⚡ Instant Demo Sign-in as Rahim
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: OTP Flow */}
          {mode === 'otp' && (
            <div className="space-y-5">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                      Bangladesh Mobile Number
                    </label>
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="+8801712345678"
                      className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07]"
                  >
                    Send One-Time Password
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={6}
                      className="w-full px-4 py-3 text-center tracking-widest text-xl font-bold rounded-xl border border-[#DDD5CE] bg-white focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                      required
                    />
                    <p className="text-xs text-[#8A817C] mt-1 text-center">
                      Simulated code: <strong>742190</strong> (valid for 5 minutes)
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07]"
                  >
                    Verify & Sign In
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setMode('login');
                }}
                className="w-full py-2.5 text-center text-sm font-medium text-[#665E5A] hover:text-[#1A1615]"
              >
                ← Back to Password Login
              </button>
            </div>
          )}

          {/* MODE 3: Create Account */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Email or phone
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="you@example.com or +88017XXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Create Password (min. 8 characters)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07]"
              >
                Create Account
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-[#665E5A] hover:text-[#F0440A] font-medium"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: Forgot Password */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1615] mb-2">
                  Registered Email or Phone
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD5CE] bg-white text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#F0440A]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#F0440A] text-white font-semibold text-base hover:bg-[#D63A07]"
              >
                Send Password Reset Link
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-2 text-center text-sm font-medium text-[#665E5A] hover:text-[#1A1615]"
              >
                ← Back to Sign In
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
