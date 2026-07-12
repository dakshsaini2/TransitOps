import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeClosed, Eye } from "lucide-react";
import { apiFetch } from "../utils/api";


export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Fleet Manager");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getStrength = (pw) => {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-400" };
    if (score <= 2) return { level: 2, label: "Fair", color: "bg-amber-400" };
    if (score <= 3) return { level: 3, label: "Good", color: "bg-notion-blue" };
    return { level: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        full_name: name,
        email: email,
        password: password,
        role: role.toUpperCase().replace(" ", "_"),
      };
      await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      alert("Account created successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex">
      {/* Left — Decorative panel */}
      <div className="hidden lg:flex flex-1 bg-warm-100 border-r border-warm-300 items-center justify-center p-12 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-notion-purple opacity-[0.06] blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-notion-blue opacity-[0.06] blur-[100px] pointer-events-none" />

        <div className="max-w-[360px] animate-fade-in-up delay-200">
          <div className="bg-white border border-warm-300 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-6">
            <h3 className="text-lg font-semibold text-warm-600 tracking-tight mb-2">
              Real-time fleet analytics
            </h3>
            <p className="text-sm text-warm-500 leading-relaxed">
              Get instant visibility into vehicle utilization, driver
              performance, fuel consumption, and maintenance schedules.
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-3">
            {[
              "Vehicle & driver management",
              "Smart dispatch & routing",
              "Maintenance & fuel logging",
              "Exportable reports & dashboards",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-white border border-warm-300 rounded-lg px-4 py-3"
              >
                <span className="w-5 h-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  ✓
                </span>
                <span className="text-sm text-warm-500">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
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
            Create your account
          </h1>
          <p className="text-[0.9375rem] text-warm-500 mb-8">
            Get started with TransitOps for free.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-name"
                className="text-[0.8125rem] font-medium text-warm-600"
              >
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full px-3.5 py-2.5 text-sm text-warm-600 bg-white border border-warm-300 rounded-lg outline-none placeholder:text-warm-400 transition-all duration-150 focus:border-warm-500 focus:ring-2 focus:ring-warm-200 hover:border-warm-400"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-email"
                className="text-[0.8125rem] font-medium text-warm-600"
              >
                Work email
              </label>
              <input
                id="signup-email"
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
                htmlFor="signup-role"
                className="text-[0.8125rem] font-medium text-warm-600"
              >
                Role
              </label>
              <div className="relative">
                <select
                  id="signup-role"
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
              <label
                htmlFor="signup-password"
                className="text-[0.8125rem] font-medium text-warm-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
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

              {/* Strength meter */}
              {password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-all duration-250 ${n <= strength.level
                          ? strength.color
                          : "bg-warm-200"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-[0.6875rem] text-warm-400 min-w-[40px]">
                    {strength.label}
                  </span>
                </div>
              )}
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
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-warm-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-notion-blue font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
