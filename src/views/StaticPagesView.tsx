import React, { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  User,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HelpView: React.FC = () => {
  const { goBack, navigateTo, sendMessage } = useApp();

  const handleAskHelpAI = async (topic: string) => {
    navigateTo('/chat');
    await sendMessage(`Can you explain how to ${topic} in the university portal and regulations?`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17233B]">Help & Support</h1>
          <p className="text-xs text-slate-500">Guides for using My UB Guide and navigating university procedures</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-[#E1E8F2] rounded-3xl p-5 shadow-2xs space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">How to use My UB Guide</h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p>• <strong>Ask Questions:</strong> Type any question into the chat box or tap on suggested questions on the home screen.</p>
            <p>• <strong>Verify Sources:</strong> Each official answer cites its regulatory source document (e.g. Fees Circular, Academic Regulations Statute 4).</p>
            <p>• <strong>Save Answers:</strong> Tap the bookmark icon below any answer to retrieve it later from your Saved Items.</p>
            <p>• <strong>Switching Modes:</strong> You can switch between Prospective and Enrolled student mode in your profile settings anytime.</p>
          </div>
        </div>

        <div className="bg-white border border-[#E1E8F2] rounded-3xl p-5 shadow-2xs space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Frequently Asked Guidance</h2>
          <div className="space-y-2">
            {[
              'register courses online',
              'apply for additional credit units',
              'pay school fees in installments',
              'check the academic calendar dates'
            ].map((topic, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskHelpAI(topic)}
                className="w-full text-left p-3 rounded-xl bg-[#F6F8FC] hover:bg-[#EEF5FF] text-xs font-semibold text-[#1463F3] flex items-center justify-between transition-colors"
              >
                <span>How do I {topic}?</span>
                <Bot className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E1E8F2] rounded-3xl p-5 shadow-2xs text-xs text-slate-600 space-y-2">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Official Registry Contact</h2>
          <p>If you encounter an issue requiring administrative intervention:</p>
          <p className="font-semibold text-slate-800">Email: helpdesk@uniguide.edu.cm</p>
          <p className="font-semibold text-slate-800">Tel: +237 222 23 45 67 (Monday - Friday, 8am - 4pm)</p>
          <p className="text-[11px] text-slate-400">Main Campus Central Administration Building, Ground Floor</p>
        </div>
      </div>
    </div>
  );
};

export const AboutView: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17233B]">About My UB Guide</h1>
          <p className="text-xs text-slate-500">Your AI-powered University Orientation Companion</p>
        </div>
      </div>

      <div className="bg-white border border-[#E1E8F2] rounded-3xl p-6 shadow-2xs space-y-4 text-xs text-slate-600 leading-relaxed">
        <p>
          <strong>My UB Guide</strong> was built to solve the information barrier in university orientation. Navigating higher education regulations, credit constraints, fees breakdowns, and admissions requirements should be seamless and transparent.
        </p>
        <p>
          The system indexes official university prospectuses, academic senate resolutions, and departmental guidelines to provide source-verified answers directly to both prospective applicants and registered students.
        </p>

        <div className="pt-3 border-t border-slate-100 space-y-2">
          <h2 className="font-bold text-slate-800 text-xs">Core Principles:</h2>
          <div className="space-y-1">
            <p>• <strong>Source-Grounded:</strong> Official policies are backed by cited regulations.</p>
            <p>• <strong>Personalized:</strong> Tailored responses based on faculty, level, and enrollment status.</p>
            <p>• <strong>Bilingual:</strong> Built for bilingual accessibility in English and French.</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          Version 1.0.0-MVP • Powered by Google Gemma AI
        </div>
      </div>
    </div>
  );
};

export const PrivacyView: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17233B]">Privacy Policy</h1>
          <p className="text-xs text-slate-500">How your local data and queries are handled</p>
        </div>
      </div>

      <div className="bg-white border border-[#E1E8F2] rounded-3xl p-6 shadow-2xs space-y-4 text-xs text-slate-600 leading-relaxed">
        <h2 className="font-bold text-slate-800 text-xs">1. Local Storage</h2>
        <p>
          In this MVP release, user profiles, saved bookmarks, checklist completion, and chat history are securely stored in your browser's private local storage. No unnecessary personally identifiable records are shared.
        </p>

        <h2 className="font-bold text-slate-800 text-xs">2. AI Request Processing</h2>
        <p>
          When you submit a query, the text and necessary academic context (such as your level and faculty) are sent to the configured Gemma AI API service via a secure server proxy to generate helpful answers.
        </p>

        <h2 className="font-bold text-slate-800 text-xs">3. Data Clearing</h2>
        <p>
          You can wipe all locally stored conversations, bookmarks, and preferences at any time using the "Reset Demo Data" option in the drawer menu.
        </p>
      </div>
    </div>
  );
};

// Sign-Up View styled to match the new purple auth layout
export const SignUpView: React.FC = () => {
  const { navigateTo, updateProfile, userCategory } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      updateProfile({
        name: name || 'Ferdinand Tanyi',
        email: email || 'ferdinand@example.com',
        phone: phone,
        category: userCategory || 'enrolled',
      });
      setIsLoading(false);
      navigateTo('/setup/profile');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-[28px] sm:rounded-[32px] shadow-xl shadow-slate-200/50 p-6 sm:p-9 max-w-[420px] w-full mx-auto border border-slate-100/80 my-auto">
        
        {/* Brand Icon Header */}
        <div className="w-14 h-14 rounded-2xl bg-[#5128E8] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#5128E8]/30">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight text-center mb-1.5">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 text-center leading-relaxed mb-6">
          Join My UB Guide for personalized university orientation.
        </p>

        <form onSubmit={handleSignUp} className="space-y-3.5">
          {/* Full Name */}
          <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 focus-within:border-[#5128E8] focus-within:ring-2 focus-within:ring-[#5128E8]/10 rounded-2xl h-[56px] transition-all">
            <User className="w-5 h-5 text-slate-400 shrink-0 ml-4 mr-3" />
            <input
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-hidden font-medium pr-4"
            />
          </div>

          {/* Email */}
          <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 focus-within:border-[#5128E8] focus-within:ring-2 focus-within:ring-[#5128E8]/10 rounded-2xl h-[56px] transition-all">
            <Mail className="w-5 h-5 text-slate-400 shrink-0 ml-4 mr-3" />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-hidden font-medium pr-4"
            />
          </div>

          {/* Phone */}
          <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 focus-within:border-[#5128E8] focus-within:ring-2 focus-within:ring-[#5128E8]/10 rounded-2xl h-[56px] transition-all">
            <Phone className="w-5 h-5 text-slate-400 shrink-0 ml-4 mr-3" />
            <input
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-hidden font-medium pr-4"
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 focus-within:border-[#5128E8] focus-within:ring-2 focus-within:ring-[#5128E8]/10 rounded-2xl h-[56px] transition-all">
            <Lock className="w-5 h-5 text-slate-400 shrink-0 ml-4 mr-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-hidden font-medium pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[58px] rounded-full bg-[#5128E8] hover:bg-[#421fd1] text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-md shadow-[#5128E8]/25 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center mt-5 text-xs">
          <span className="text-slate-500">Already have an account? </span>
          <button
            type="button"
            onClick={() => navigateTo('/auth/login')}
            className="font-bold text-[#5128E8] hover:underline cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

// Login View reproducing the exact reference specification
export const LoginView: React.FC = () => {
  const { navigateTo, updateProfile, showToast } = useApp();
  const [email, setEmail] = useState('ferdinand.tanyi@student.uniguide.edu.cm');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      if (showToast) showToast('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      updateProfile({
        name: 'Ferdinand Tanyi',
        email: email,
        category: 'enrolled',
      });
      setIsLoading(false);
      navigateTo('/home');
    }, 350);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateProfile({
        name: 'Ferdinand Tanyi (Google)',
        email: 'ferdinand.google@student.uniguide.edu.cm',
        category: 'enrolled',
      });
      setIsLoading(false);
      navigateTo('/home');
    }, 350);
  };

  const handleForgotPassword = () => {
    if (showToast) {
      showToast('Password recovery instructions sent to your email.');
    }
  };

  const handleGuestAccess = () => {
    updateProfile({
      name: 'Guest Student',
      email: 'guest@student.uniguide.edu.cm',
      category: 'prospective',
    });
    navigateTo('/home');
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-[28px] sm:rounded-[32px] shadow-xl shadow-slate-200/50 p-6 sm:p-9 max-w-[420px] w-full mx-auto border border-slate-100/80 my-auto">
        
        {/* Brand Icon Header */}
        <div className="w-14 h-14 rounded-2xl bg-[#5128E8] text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#5128E8]/30">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>

        {/* Welcome Back Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight text-center mb-1.5">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 text-center leading-relaxed mb-6 sm:mb-7">
          Enter your credentials to access your My UB Guide account.
        </p>

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email Input */}
          <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 focus-within:border-[#5128E8] focus-within:ring-2 focus-within:ring-[#5128E8]/10 rounded-2xl h-[58px] transition-all">
            <Mail className="w-5 h-5 text-slate-400 shrink-0 ml-4 mr-3" />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-hidden font-medium pr-4"
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 focus-within:border-[#5128E8] focus-within:ring-2 focus-within:ring-[#5128E8]/10 rounded-2xl h-[58px] transition-all">
            <Lock className="w-5 h-5 text-slate-400 shrink-0 ml-4 mr-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-hidden font-medium pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between pt-1 pb-1 text-xs">
            <label className="flex items-center gap-2 font-medium text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded text-[#5128E8] focus:ring-[#5128E8] border-slate-300 accent-[#5128E8] cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#5128E8] font-semibold hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Primary Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[58px] rounded-full bg-[#5128E8] hover:bg-[#421fd1] text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-lg shadow-[#5128E8]/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative bg-white px-3 text-[11px] font-bold text-slate-400 tracking-wider">
            OR
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full h-[56px] rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer mb-6"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Bottom Links */}
        <div className="text-center space-y-2 text-xs">
          <div>
            <span className="text-slate-500">Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigateTo('/auth/signup')}
              className="font-bold text-[#5128E8] hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGuestAccess}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors cursor-pointer"
            >
              Continue as guest
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
