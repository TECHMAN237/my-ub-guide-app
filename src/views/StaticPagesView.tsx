import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompassMark } from '../components/layout/AppHeader';

const PageHeader: React.FC<{
  title: string;
  lede: string;
  onBack: () => void;
}> = ({ title, lede, onBack }) => (
  <div className="flex items-start gap-2">
    <button
      type="button"
      onClick={onBack}
      className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
    <div className="min-w-0 pt-1">
      <h1 className="page-title text-ink">{title}</h1>
      <p className="page-lede mt-1">{lede}</p>
    </div>
  </div>
);

export const HelpView: React.FC = () => {
  const { goBack, navigateTo, sendMessage } = useApp();

  const handleAskHelpAI = async (topic: string) => {
    navigateTo('/chat');
    await sendMessage(`Can you explain how to ${topic} in the university portal and regulations?`);
  };

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-6 sm:px-8 md:pb-16">
      <PageHeader
        title="Help"
        lede="How to use UB Compass, and where to go for university procedures."
        onBack={goBack}
      />

      <div className="measure mt-8 space-y-8">
        <section>
          <h2 className="text-[18px] font-semibold text-ink">Using UB Compass</h2>
          <ul className="mt-2 space-y-2 text-[16px] leading-relaxed text-muted">
            <li>
              Ask a question in the box on the home screen, or choose one of the suggested
              questions.
            </li>
            <li>
              Answers cite the official document they come from. Follow the source to read the
              original.
            </li>
            <li>
              Save an answer with the bookmark control to find it later under Saved.
            </li>
            <li>
              Switch between prospective and enrolled student mode from the menu at any time.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-ink">Common guidance</h2>
          <div className="mt-1">
            {[
              'register courses online',
              'apply for additional credit units',
              'pay school fees in installments',
              'check the academic calendar dates',
            ].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleAskHelpAI(topic)}
                className="row-link w-full text-left"
              >
                <span className="text-[16px] text-ink">How do I {topic}?</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-ink">Registry contact</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-muted">
            For matters that need an administrative decision, contact the central registry.
          </p>
          <dl className="mt-2 text-[16px]">
            <div className="flex flex-wrap gap-x-2 py-1">
              <dt className="text-muted">Email</dt>
              <dd className="text-ink">helpdesk@uniguide.edu.cm</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 py-1">
              <dt className="text-muted">Telephone</dt>
              <dd className="text-ink">+237 222 23 45 67</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 py-1">
              <dt className="text-muted">Hours</dt>
              <dd className="text-ink">Monday to Friday, 8am to 4pm</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 py-1">
              <dt className="text-muted">Address</dt>
              <dd className="text-ink">Main Campus, Central Administration Building, ground floor</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
};

export const AboutView: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-6 sm:px-8 md:pb-16">
      <PageHeader
        title="About UB Compass"
        lede="A plain-language guide to the University of Buea."
        onBack={goBack}
      />

      <div className="measure mt-8 space-y-6 text-[16px] leading-relaxed text-muted">
        <p>
          UB Compass exists because university regulations are scattered across prospectuses,
          senate resolutions and departmental notices. Finding one answer should not require
          reading all of them.
        </p>
        <p>
          The assistant searches official University of Buea information and answers in plain
          language, with the source attached. It is useful whether you are applying or already
          enrolled.
        </p>

        <section>
          <h2 className="text-[18px] font-semibold text-ink">What it stands on</h2>
          <ul className="mt-2 space-y-1.5">
            <li>Answers are grounded in official documents and cite them.</li>
            <li>Guidance is adjusted to your faculty, level and student status.</li>
            <li>The interface and answers work in English and French.</li>
          </ul>
        </section>

        <p className="border-t border-rule pt-4 text-[14px]">
          Version 1.0 · Powered by OpenRouter
        </p>
      </div>
    </div>
  );
};

export const PrivacyView: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-6 sm:px-8 md:pb-16">
      <PageHeader
        title="Privacy"
        lede="What is stored, where it goes, and how to clear it."
        onBack={goBack}
      />

      <div className="measure mt-8 space-y-6 text-[16px] leading-relaxed text-muted">
        <section>
          <h2 className="text-[18px] font-semibold text-ink">Data kept in your browser</h2>
          <p className="mt-1">
            Your profile, saved items, checklist progress and conversation history are stored in
            this browser’s local storage. They are not copied to a separate account database.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-ink">When you ask a question</h2>
          <p className="mt-1">
            The text of your question and the academic context needed to answer it, such as your
            faculty and level, are sent through our server to an AI model served by OpenRouter.
            The API key stays on the server and is never sent to your browser.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-ink">Voice input</h2>
          <p className="mt-1">
            Recording only starts when you press the microphone. Audio is used to produce text
            for your question and is not kept after the message is sent.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-ink">Clearing your data</h2>
          <p className="mt-1">
            Use Reset demo data in the menu to remove locally stored conversations, saved items
            and preferences from this browser.
          </p>
        </section>
      </div>
    </div>
  );
};

const AuthShell: React.FC<{
  title: string;
  lede: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}> = ({ title, lede, children, footer }) => (
  <div className="flex min-h-screen flex-col justify-center bg-ground px-5 py-10">
    <div className="mx-auto w-full max-w-[400px]">
      <div className="mb-8 flex items-center gap-2.5">
        <CompassMark className="h-6 w-6 text-accent" />
        <span className="text-[17px] font-semibold leading-none text-ink">UB Compass</span>
      </div>

      <h1 className="page-title text-ink">{title}</h1>
      <p className="page-lede mt-1">{lede}</p>

      <div className="mt-6">{children}</div>
      <div className="mt-6">{footer}</div>
    </div>
  </div>
);

export const SignUpView: React.FC = () => {
  const { navigateTo, signupDemo } = useApp();
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
      signupDemo(name || 'Ferdinand Tanyi', email || 'ferdinand@example.com');
      setIsLoading(false);
      navigateTo('/setup/profile');
    }, 350);
  };

  return (
    <AuthShell
      title="Create an account"
      lede="Save your conversations and get guidance for your programme."
      footer={
        <p className="text-[14px] text-muted">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigateTo('/auth/login')}
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Sign in
          </button>
        </p>
      }
    >
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-[14px] font-medium text-ink">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1 block text-[14px] font-medium text-ink">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </div>

        <div>
          <label htmlFor="signup-phone" className="mb-1 block text-[14px] font-medium text-ink">
            Phone <span className="text-muted">(optional)</span>
          </label>
          <input
            id="signup-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="field"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1 block text-[14px] font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-[10px] text-muted transition-colors hover:text-ink"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
};

export const LoginView: React.FC = () => {
  const { navigateTo, loginDemo, showToast } = useApp();
  const [email, setEmail] = useState('ferdinand.tanyi@student.uniguide.edu.cm');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      if (showToast) showToast('Enter both your email and password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      loginDemo(email, 'Ferdinand Tanyi');
      setIsLoading(false);
      navigateTo('/home');
    }, 350);
  };

  const handleGuestAccess = () => {
    loginDemo('guest@student.uniguide.edu.cm', 'Guest Student');
    navigateTo('/home');
  };

  return (
    <AuthShell
      title="Welcome back"
      lede="Sign in to keep your conversations and saved answers."
      footer={
        <div className="space-y-3 text-[14px]">
          <p className="text-muted">
            No account?{' '}
            <button
              type="button"
              onClick={() => navigateTo('/auth/signup')}
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              Create one
            </button>
          </p>
          <button
            type="button"
            onClick={handleGuestAccess}
            className="min-h-[44px] font-medium text-muted underline-offset-2 transition-colors hover:text-ink hover:underline"
          >
            Continue as guest
          </button>
        </div>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1 block text-[14px] font-medium text-ink">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1 block text-[14px] font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-[10px] text-muted transition-colors hover:text-ink"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex min-h-[36px] cursor-pointer items-center gap-2 text-[14px] text-muted">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 accent-accent"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => showToast('Password recovery is not available in this demo.')}
            className="min-h-[36px] text-[14px] font-medium text-accent underline-offset-2 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
};
