import React, { useState } from "react";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

/* ── Icons ── */
const EyeIcon = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
   </svg>
);
const EyeOffIcon = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
   </svg>
);

/* ── Floating-label input ── */
function FloatingInput({
   id,
   label,
   type = "text",
   value,
   onChange,
   required = false,
   children,
}) {
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
               "peer block w-full border-0 border-b py-3.5 px-0 pr-8 bg-transparent",
               "text-[#000000]",
               "border-[#dddddd]",
               "focus:border-[#000000]",
               "focus:ring-0 focus:outline-none placeholder-transparent transition-colors duration-200 text-base",
            ].join(" ")}
         />
         <label
            htmlFor={id}
            className={[
               "absolute left-0 top-3.5 text-sm text-[#666666] cursor-text",
               "transition-all duration-200",
               "-translate-y-6 peer-placeholder-shown:translate-y-0",
               "peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-sm",
            ].join(" ")}
         >
            {label}
         </label>
         {children}
      </div>
   );
}

/* ════════════════════════════════════
   Login page
════════════════════════════════════ */
const Login = () => {
   const [showPassword, setShowPassword] = useState(false);
   const { error, loading } = useSelector((state) => state.auth);
   const { handleLogin } = useAuth();
   const navigate = useNavigate();

   const [formData, setFormData] = useState({ email: "", password: "" });
   const user = useSelector((state) => state.auth.user);

   React.useEffect(() => {
      if (user) {
         if (user.role === "buyer") {
            navigate("/");
         } else if (user.role === "seller") {
            navigate("/seller/dashboard");
         }
      }
   }, [user, navigate]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const user = await handleLogin({
         email: formData.email,
         password: formData.password,
      });
      if (user.role == "buyer") {
         navigate("/");
      } else if (user.role == "seller") {
         navigate("/seller/dashboard");
      }
   };

   return (
      <main
         className="min-h-screen flex flex-col md:flex-row bg-[#ffffff] text-[#000000]"
         style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
         {/* ── LEFT PANEL — editorial branding (md+) ── */}
         <div className="hidden md:flex md:w-[55%] bg-[#f5f5f5] flex-col justify-between p-16 min-h-screen border-r border-[#e5e5e5]">
            <header>
               <span
                  className="text-2xl tracking-[-0.04em] text-[#000000]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
               >
                  Meera M&amp;G
               </span>
            </header>

            <div className="flex-1 flex items-center">
               <h2
                  className="text-[clamp(52px,5.5vw,90px)] leading-[1.05] tracking-[-0.03em] text-[#000000] whitespace-pre-line"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
               >
                  {"Crafted from\nthe earth,\nbuilt to last."}
               </h2>
            </div>

            <footer>
               <p className="text-sm tracking-wide text-[#666666]">
                  The trusted source for premium marble &amp; granite.
               </p>
            </footer>
         </div>

         {/* ── RIGHT PANEL — form ── */}
         <div className="w-full md:w-[45%] bg-[#ffffff] flex flex-col justify-center p-6 sm:p-12 md:p-16 min-h-screen relative">
            {/* Mobile logo */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10">
               <span
                  className="block md:hidden text-xl tracking-[-0.04em] text-[#000000]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
               >
                  Meera M&amp;G
               </span>
            </div>

            {/* Form */}
            <div className="w-full max-w-md mx-auto mt-16 md:mt-0">
               <div className="mb-12">
                  <h1
                     className="text-[32px] leading-[1.3] text-[#000000] mb-2"
                     style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                     }}
                  >
                     Sign in
                  </h1>
                  <p className="text-sm text-[#666666]">
                     Welcome back to Meera M&amp;G.
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-7">
                  <FloatingInput
                     id="email"
                     label="Email Address"
                     type="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                  />

                  {/* Password with show/hide */}
                  <div className="relative">
                     <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="peer block w-full border-0 border-b py-3.5 px-0 pr-8 bg-transparent text-[#000000] border-[#dddddd] focus:border-[#000000] focus:ring-0 focus:outline-none placeholder-transparent transition-colors duration-200 text-base"
                     />
                     <label
                        htmlFor="password"
                        className="absolute left-0 top-3.5 text-sm text-[#666666] cursor-text transition-all duration-200 -translate-y-6 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-sm"
                     >
                        Password
                     </label>
                     <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label="Toggle password visibility"
                        className="absolute right-0 top-3.5 text-[#666666] hover:text-[#000000] transition-colors duration-200"
                     >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                     </button>
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                     {/* {error && <p className="text-red-400 text-sm mb-3">{error}</p>} */}
                     <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-6 rounded bg-[#000000] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-widest transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000] focus:ring-offset-[#ffffff] disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {loading ? "Signing in..." : "Sign In"}
                     </button>
                  </div>
               </form>

               <div className="mt-6 text-center">
                  <ContinueWithGoogle />
                  <p className="text-xs text-[#666666]">
                     Don&apos;t have an account?{" "}
                     <Link
                        to="/register"
                        className="text-[#000000] border-b border-[#dddddd] hover:border-[#000000] pb-0.5 transition-colors duration-200"
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
