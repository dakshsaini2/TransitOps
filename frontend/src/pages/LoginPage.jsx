import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeClosed, Eye } from "lucide-react";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Fleet Manager");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px] animate-fade-in-up">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
            <span className="w-7 h-7 bg-warm-600 rounded text-white flex items-center justify-center text-xs font-bold group-hover:scale-105 transition-transform duration-150">
              T
            </span>
            <span className="font-semibold text-[1.05rem] tracking-tight text-warm-600">
              TransitOps
            </span>
          </Link>

          {/* Heading */}
          <h1 className="text-[1.75rem] font-bold tracking-tight text-warm-600 leading-tight mb-2">
            Welcome back
          </h1>
          <p className="text-[0.9375rem] text-warm-500 mb-8">
            Log in to your account to continue.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-[0.8125rem] font-medium text-warm-600"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-3.5 py-2.5 text-sm text-warm-600 bg-white border border-warm-300 rounded-lg outline-none placeholder:text-warm-400 transition-all duration-150 focus:border-warm-500 focus:ring-2 focus:ring-warm-200 hover:border-warm-400"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-role"
                className="text-[0.8125rem] font-medium text-warm-600"
              >
                Role
              </label>
              <div className="relative">
                <select
                  id="login-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-warm-600 bg-white border border-warm-300 rounded-lg outline-none transition-all duration-150 focus:border-warm-500 focus:ring-2 focus:ring-warm-200 hover:border-warm-400 appearance-none cursor-pointer"
                >
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
                <svg className="w-4 h-4 text-warm-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-[0.8125rem] font-medium text-warm-600"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-notion-blue hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 text-sm text-warm-600 bg-white border border-warm-300 rounded-lg outline-none placeholder:text-warm-400 transition-all duration-150 focus:border-warm-500 focus:ring-2 focus:ring-warm-200 hover:border-warm-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600 transition-colors duration-150 text-sm"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium text-white bg-warm-600 hover:bg-warm-800 rounded-lg transition-all duration-150 hover:-translate-y-px hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right — Decorative panel */}
      <div className="hidden lg:flex flex-1 bg-warm-100 border-l border-warm-300 items-center justify-center p-12 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-notion-blue opacity-[0.06] blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-notion-purple opacity-[0.06] blur-[100px] pointer-events-none" />

        <div className="max-w-[360px] animate-fade-in-up delay-200">
          {/* Decorative card */}
          <div className="bg-white border border-warm-300 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-6">
            <h3 className="text-lg font-semibold text-warm-600 tracking-tight mb-2">
              Manage your entire fleet
            </h3>
            <p className="text-sm text-warm-500 leading-relaxed">
              From vehicle registration and driver scheduling to maintenance
              logs and fuel analytics — everything in one workspace.
            </p>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: "127", lbl: "Vehicles" },
              { val: "98%", lbl: "Uptime" },
              { val: "40%", lbl: "Cost saved" },
            ].map((s) => (
              <div
                key={s.lbl}
                className="bg-white border border-warm-300 rounded-lg p-4 text-center"
              >
                <div className="text-lg font-bold text-warm-600 tracking-tight">
                  {s.val}
                </div>
                <div className="text-[0.6875rem] text-warm-400 mt-0.5">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
