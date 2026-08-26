import React, { useState, useEffect } from 'react';
import { useAuth } from "../hook/useAuth.js";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

/* ─────────────────────────────────────────────
   Dark-mode hook — persists to localStorage and
   toggles the 'dark' class on <html>.
   ───────────────────────────────────────────── */
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('meera-mg-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('meera-mg-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('meera-mg-theme', 'light');
    }
  }, [isDark]);

  return [isDark, () => setIsDark((v) => !v)];
}

/* ─────────────────────────────────────────────
   Floating-label input
   ───────────────────────────────────────────── */
function FloatingInput({ id, label, type = 'text', value, onChange, required = false, children }) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        placeholder={label}
        required={required}
        value={value}
        onChange={onChange}
        className={[
          'peer block w-full border-0 border-b py-[14px] px-0 pr-8 bg-transparent',
          'text-[#181818] dark:text-[#F2F0EB]',
          'border-[#DEDAD2] dark:border-[#30302E]',
          'focus:border-[#9A7652] dark:focus:border-[#B58A5A]',
          'focus:ring-0 focus:outline-none placeholder-transparent transition-colors duration-200 text-base',
        ].join(' ')}
      />
      <label
        htmlFor={id}
        className={[
          'absolute left-0 top-[14px] text-sm text-[#6F6B64] dark:text-[#A9A49B] cursor-text',
          'transition-all duration-200',
          '-translate-y-6 peer-placeholder-shown:translate-y-0',
          'peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-sm',
        ].join(' ')}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Icons ── */
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ─────────────────────────────────────────────
   Login page
   ───────────────────────────────────────────── */
const Login = () => {
  const [isDark, toggleDark] = useDarkMode();
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading } = useSelector(state => state.auth);

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({
      email: formData.email,
      password: formData.password,
    });
    navigate("/")
  };

  return (
    <main
      className="min-h-screen flex flex-col md:flex-row bg-[#F5F3EF] dark:bg-[#111111] text-[#181818] dark:text-[#F2F0EB] transition-colors duration-300"
      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
    >
      {/* ── LEFT PANEL — editorial branding (md+) ── */}
      <div className="hidden md:flex md:w-[55%] bg-[#F5F3EF] dark:bg-[#111111] flex-col justify-between p-16 min-h-screen transition-colors duration-300 border-r border-[#DEDAD2] dark:border-[#30302E]">
        <header>
          <span
            className="text-2xl tracking-[-0.04em] text-[#181818] dark:text-[#F2F0EB]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Meera M&G
          </span>
        </header>

        <div className="flex-1 flex items-center">
          <h2
            className="text-[clamp(52px,5.5vw,90px)] leading-[1.05] tracking-[-0.03em] text-[#181818] dark:text-[#F2F0EB] whitespace-pre-line transition-colors duration-300"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            {'Return to\nyour\ncollection.'}
          </h2>
        </div>

        <footer>
          <p className="text-sm tracking-wide text-[#6F6B64] dark:text-[#A9A49B] transition-colors duration-300">
            The curated marketplace for rare objects.
          </p>
        </footer>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="w-full md:w-[45%] bg-[#FFFFFF] dark:bg-[#1B1B1B] flex flex-col justify-center p-6 sm:p-12 md:p-16 min-h-screen relative transition-colors duration-300">

        {/* Theme toggle + mobile logo */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-4">
          <span
            className="block md:hidden text-xl tracking-[-0.04em] text-[#181818] dark:text-[#F2F0EB]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Meera M&G
          </span>
          <button
            type="button"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-semibold uppercase tracking-[0.1em] border-[#DEDAD2] dark:border-[#30302E] text-[#6F6B64] dark:text-[#A9A49B] hover:border-[#9A7652] dark:hover:border-[#B58A5A] hover:text-[#9A7652] dark:hover:text-[#B58A5A] transition-all duration-200"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Form */}
        <div className="w-full max-w-md mx-auto mt-16 md:mt-0">
          <div className="mb-12">
            <h1
              className="text-[32px] leading-[1.3] text-[#181818] dark:text-[#F2F0EB] mb-2 transition-colors duration-300"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              Sign in
            </h1>
            <p className="text-sm text-[#6F6B64] dark:text-[#A9A49B] transition-colors duration-300">
              Welcome back to Meera M&G.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <FloatingInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />

            {/* Password with show/hide */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="peer block w-full border-0 border-b py-[14px] px-0 pr-8 bg-transparent text-[#181818] dark:text-[#F2F0EB] border-[#DEDAD2] dark:border-[#30302E] focus:border-[#9A7652] dark:focus:border-[#B58A5A] focus:ring-0 focus:outline-none placeholder-transparent transition-colors duration-200 text-base"
              />
              <label
                htmlFor="password"
                className="absolute left-0 top-[14px] text-sm text-[#6F6B64] dark:text-[#A9A49B] cursor-text transition-all duration-200 -translate-y-6 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-sm"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
                className="absolute right-0 top-[14px] text-[#6F6B64] dark:text-[#A9A49B] hover:text-[#181818] dark:hover:text-[#F2F0EB] transition-colors duration-200"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Forgot password link
            <div className="flex justify-end pt-1">
              <a href="#" className="text-xs text-[#6F6B64] dark:text-[#A9A49B] hover:text-[#181818] dark:hover:text-[#F2F0EB] transition-colors duration-200">
                Forgot password?
              </a>
            </div> */}

            {/* CTA */}
            <div className="pt-2">
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-[14px] px-6 rounded bg-[#9A7652] dark:bg-[#B58A5A] hover:bg-[#7F5F40] dark:hover:bg-[#C49A68] text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9A7652] dark:focus:ring-[#B58A5A] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <ContinueWithGoogle/>
            <p className="text-xs text-[#6F6B64] dark:text-[#A9A49B] transition-colors duration-200">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#181818] dark:text-[#F2F0EB] border-b border-[#DEDAD2] dark:border-[#30302E] hover:border-[#9A7652] dark:hover:border-[#B58A5A] pb-0.5 transition-colors duration-200"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;