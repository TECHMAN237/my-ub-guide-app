import React, { useState } from 'react';
import { ArrowLeft, Shield, Info, HelpCircle, FileText, CheckCircle2, Bot, Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
          <p className="text-xs text-slate-500">Guides for using XENA AI and navigating university procedures</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-[#E1E8F2] rounded-3xl p-5 shadow-2xs space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">How to use XENA AI</h2>
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
          <h1 className="text-xl font-bold text-[#17233B]">About XENA AI</h1>
          <p className="text-xs text-slate-500">Your AI-powered University Orientation Companion</p>
        </div>
      </div>

      <div className="bg-white border border-[#E1E8F2] rounded-3xl p-6 shadow-2xs space-y-4 text-xs text-slate-600 leading-relaxed">
        <p>
          <strong>XENA AI (UniGuide)</strong> was built to solve the information barrier in university orientation. Navigating higher education regulations, credit constraints, fees breakdowns, and admissions requirements should be seamless and transparent.
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
          Version 1.0.0-MVP • Powered by Google Gemini AI
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
          When you submit a query, the text and necessary academic context (such as your level and faculty) are sent to the configured Google Gemini API service via a secure server proxy to generate helpful answers.
        </p>

        <h2 className="font-bold text-slate-800 text-xs">3. Data Clearing</h2>
        <p>
          You can wipe all locally stored conversations, bookmarks, and preferences at any time using the "Reset Demo Data" option in the drawer menu.
        </p>
      </div>
    </div>
  );
};

// Sign-Up Screen matching Screen 3 in visual reference
export const SignUpView: React.FC = () => {
  const { navigateTo, updateProfile, userCategory } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name || 'Ferdinand Tanyi',
      email: email || 'ferdinand@example.com',
      phone: phone,
      category: userCategory,
    });
    navigateTo('/setup/profile');
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div>
        <div className="flex items-center justify-between pt-2 mb-6">
          <button
            type="button"
            onClick={() => navigateTo('/setup/user-type')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200/60"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9" />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#17233B] tracking-tight mb-1">
            Create your account
          </h1>
          <p className="text-xs text-[#68758B]">
            Join XENA AI for a personalized university experience.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ferdinand Tanyi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] rounded-xl px-3.5 py-2.5 text-xs text-[#17233B] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@student.uniguide.edu.cm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] rounded-xl px-3.5 py-2.5 text-xs text-[#17233B] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (optional)</label>
            <input
              type="tel"
              placeholder="+237 670 00 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] rounded-xl px-3.5 py-2.5 text-xs text-[#17233B] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-[#17233B] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#1463F3] hover:bg-[#104fc2] text-white font-semibold text-xs flex items-center justify-center shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigateTo('/auth/login')}
            className="text-xs text-slate-600"
          >
            Already have an account? <span className="font-semibold text-[#1463F3]">Log In</span>
          </button>
        </div>
      </div>

      <div className="text-center py-4 text-[11px] text-slate-400">
        Demo registration for university evaluation
      </div>
    </div>
  );
};

export const LoginView: React.FC = () => {
  const { navigateTo, updateProfile } = useApp();
  const [email, setEmail] = useState('ferdinand.tanyi@student.uniguide.edu.cm');
  const [password, setPassword] = useState('demo1234');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: 'Ferdinand Tanyi',
      email: email,
      category: 'enrolled',
    });
    navigateTo('/home');
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div>
        <div className="flex items-center justify-between pt-2 mb-6">
          <button
            type="button"
            onClick={() => navigateTo('/setup/user-type')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200/60"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9" />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#17233B] tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-xs text-[#68758B]">
            Log in with your university credentials or demo access.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] rounded-xl px-3.5 py-2.5 text-xs text-[#17233B] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] rounded-xl px-3.5 py-2.5 text-xs text-[#17233B] focus:outline-hidden"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#1463F3] hover:bg-[#104fc2] text-white font-semibold text-xs flex items-center justify-center shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              Log In
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigateTo('/auth/signup')}
            className="text-xs text-slate-600"
          >
            Don't have an account? <span className="font-semibold text-[#1463F3]">Sign Up</span>
          </button>
        </div>
      </div>

      <div className="text-center py-4 text-[11px] text-slate-400">
        Demo credentials pre-filled for testing
      </div>
    </div>
  );
};
