import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🚐",
    title: "Vehicle Registry",
    desc: "Track every vehicle in your fleet — registration, insurance, permits, and compliance documents in one place.",
  },
  {
    icon: "👤",
    title: "Driver Management",
    desc: "Manage licenses, certifications, schedules, and performance records for every driver on your team.",
  },
  {
    icon: "📡",
    title: "Smart Dispatching",
    desc: "Assign vehicles and drivers to routes with intelligent scheduling that minimizes idle time.",
  },
  {
    icon: "🔧",
    title: "Maintenance Logs",
    desc: "Schedule preventive maintenance, track repairs, and get alerts before breakdowns happen.",
  },
  {
    icon: "⛽",
    title: "Fuel Logging",
    desc: "Monitor fuel consumption, detect anomalies, and optimize costs across your entire fleet.",
  },
  {
    icon: "📊",
    title: "Analytics & Reports",
    desc: "Understand fleet performance with real-time dashboards and exportable reports.",
  },
];

const STEPS = [
  {
    title: "Register your fleet",
    desc: "Add your vehicles and drivers to the platform. Import from spreadsheets or enter details manually.",
  },
  {
    title: "Configure operations",
    desc: "Set up routes, schedules, maintenance intervals, and fuel tracking rules that match your workflow.",
  },
  {
    title: "Dispatch & monitor",
    desc: "Assign trips, track progress in real time, and handle exceptions as they come up.",
  },
  {
    title: "Analyze & optimize",
    desc: "Use built-in analytics to spot inefficiencies, reduce costs, and make data-driven decisions.",
  },
];

const STATS = [
  { value: "99.8%", label: "Uptime" },
  { value: "40%", label: "Cost reduction" },
  { value: "10k+", label: "Vehicles managed" },
  { value: "150+", label: "Organizations" },
];

const SIDEBAR_ITEMS = [
  { icon: "📋", label: "Dashboard", active: true },
  { icon: "🚐", label: "Vehicles" },
  { icon: "👤", label: "Drivers" },
  { icon: "🗺️", label: "Routes" },
  { icon: "🔧", label: "Maintenance" },
  { icon: "⛽", label: "Fuel Logs" },
  { icon: "📊", label: "Reports" },
];

const FOOTER_COLS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Changelog", "Docs"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen bg-white text-warm-600 font-sans overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 bg-white/85 backdrop-blur-xl transition-all duration-250 ${
          scrolled ? "border-b border-warm-300" : "border-b border-transparent"
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-semibold text-[1.05rem] tracking-tight text-warm-600">
          <span className="w-7 h-7 bg-warm-600 rounded text-white flex items-center justify-center text-xs font-bold">
            T
          </span>
          TransitOps
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {["Features", "How it works", "Pricing"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-warm-500 hover:text-warm-600 transition-colors duration-150 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-warm-600 after:transition-all after:duration-250 hover:after:w-full"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-warm-500 hover:text-warm-600 hover:bg-warm-50 px-4 py-2 rounded transition-all duration-150">
            Log in
          </Link>
          <Link to="/signup" className="text-sm font-medium text-white bg-warm-600 hover:bg-warm-800 px-4 py-2 rounded transition-all duration-150 hover:-translate-y-px hover:shadow-lg">
            Get started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex md:hidden flex-col gap-[5px] p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-warm-600 rounded transition-transform duration-250 ${
              mobileOpen ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-warm-600 rounded transition-opacity duration-150 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-warm-600 rounded transition-transform duration-250 ${
              mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* ─── MOBILE MENU ─── */}
      {mobileOpen && (
        <div className="fixed top-16 inset-x-0 bottom-0 bg-white/97 backdrop-blur-2xl z-40 flex flex-col p-8 gap-2 animate-fade-in md:hidden">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-lg font-medium text-warm-600 py-4 border-b border-warm-300"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <Link to="/signup" className="mt-6 w-full text-sm font-medium text-white bg-warm-600 hover:bg-warm-800 px-4 py-3 rounded-lg transition-all duration-150 text-center block" onClick={() => setMobileOpen(false)}>
            Get started
          </Link>
          <Link to="/login" className="w-full text-sm font-medium text-warm-500 hover:text-warm-600 px-4 py-3 rounded-lg transition-all duration-150 text-center block" onClick={() => setMobileOpen(false)}>
            Log in
          </Link>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 lg:px-12 pt-28 pb-16 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute -top-24 -right-48 w-[600px] h-[600px] rounded-full bg-notion-blue opacity-[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-48 w-[600px] h-[600px] rounded-full bg-notion-purple opacity-[0.06] blur-[120px] pointer-events-none" />

        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-3.5 py-1.5 bg-warm-100 border border-warm-300 rounded-full text-[0.8125rem] text-warm-500 mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-dot" />
          Now in public beta
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up delay-100 text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.04em] text-warm-600 max-w-[800px] mb-5">
          Transport ops,{" "}
          <span className="bg-gradient-to-br from-notion-blue to-notion-purple bg-clip-text text-transparent">
            simplified
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-200 text-[clamp(1rem,1.8vw,1.2rem)] text-warm-500 max-w-[560px] leading-relaxed mb-8">
          A single platform to manage vehicles, drivers, dispatch, maintenance,
          fuel, and analytics — so your fleet runs like clockwork.
        </p>

        {/* CTA Group */}
        <div className="animate-fade-in-up delay-300 flex items-center gap-3 flex-wrap justify-center">
          <button className="text-[0.9375rem] font-medium text-white bg-warm-600 hover:bg-warm-800 px-6 py-3 rounded-lg transition-all duration-150 hover:-translate-y-px hover:shadow-lg group inline-flex items-center gap-2">
            Get started free
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </button>
          <button className="text-[0.9375rem] font-medium text-warm-600 bg-white border border-warm-300 hover:bg-warm-50 hover:border-warm-400 px-6 py-3 rounded-lg transition-all duration-150 hover:-translate-y-px">
            See a demo
          </button>
        </div>

        {/* ─── Dashboard Preview ─── */}
        <div className="animate-fade-in-up delay-500 mt-16 w-full max-w-[960px]">
          <div className="bg-white border border-warm-300 rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(15,15,15,0.04),0_4px_6px_-1px_rgba(0,0,0,0.04),0_20px_40px_-8px_rgba(0,0,0,0.06)]">
            {/* Window toolbar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-warm-300 bg-warm-100">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-4 text-xs text-warm-400 font-medium">TransitOps — Dashboard</span>
            </div>

            {/* Window content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 min-h-[320px]">
              {/* Sidebar */}
              <div className="flex md:flex-col gap-1 flex-wrap">
                {SIDEBAR_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-[0.8125rem] cursor-default transition-colors duration-150 ${
                      item.active
                        ? "bg-notion-blue/8 text-notion-blue font-medium"
                        : "text-warm-500 hover:bg-warm-100"
                    }`}
                  >
                    <span className="text-base w-5 text-center">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main area */}
              <div className="flex flex-col gap-5">
                <h3 className="text-lg font-semibold text-warm-600 tracking-tight">
                  Fleet Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "127", label: "Active vehicles", pct: 85, color: "bg-notion-blue" },
                    { value: "94%", label: "On-time rate", pct: 94, color: "bg-emerald-500" },
                    { value: "₹2.4L", label: "Monthly fuel cost", pct: 60, color: "bg-amber-500" },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="bg-warm-100 border border-warm-300 rounded-lg p-5 flex flex-col gap-1.5"
                    >
                      <span className="text-2xl font-bold text-warm-600 tracking-tight">
                        {card.value}
                      </span>
                      <span className="text-xs text-warm-500">{card.label}</span>
                      <div className="mt-auto h-1 bg-warm-300 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${card.color} transition-all duration-1000`}
                          style={{ width: `${card.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini table */}
                <div className="border border-warm-300 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-warm-100 text-xs font-medium text-warm-400 uppercase tracking-wider">
                    <span>Vehicle</span>
                    <span>Driver</span>
                    <span>Route</span>
                    <span>Status</span>
                  </div>
                  {[
                    { vehicle: "MH-12-AB-1234", driver: "R. Sharma", route: "Pune → Mumbai", status: "En route", statusColor: "bg-emerald-500" },
                    { vehicle: "MH-04-CD-5678", driver: "A. Patel", route: "Depot idle", status: "Idle", statusColor: "bg-warm-400" },
                    { vehicle: "MH-12-EF-9012", driver: "S. Kulkarni", route: "Mumbai → Nashik", status: "En route", statusColor: "bg-emerald-500" },
                  ].map((row) => (
                    <div
                      key={row.vehicle}
                      className="grid grid-cols-4 gap-2 px-4 py-3 border-t border-warm-300 text-sm text-warm-500 hover:bg-warm-50 transition-colors duration-100"
                    >
                      <span className="font-medium text-warm-600 font-mono text-xs">{row.vehicle}</span>
                      <span>{row.driver}</span>
                      <span>{row.route}</span>
                      <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${row.statusColor}`} />
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 px-6 lg:px-12 bg-warm-100 border-y border-warm-300">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center py-4">
              <div className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-warm-600 tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-warm-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6 lg:px-12">
        <div className="max-w-[1100px] mx-auto">
          {/* Header */}
          <div className="text-center flex flex-col items-center mb-16">
            <span className="text-[0.8125rem] font-medium text-notion-blue uppercase tracking-widest mb-3">
              Features
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-tight leading-tight mb-3">
              Everything your fleet needs
            </h2>
            <p className="text-[1.0625rem] text-warm-500 max-w-[560px] leading-relaxed">
              A comprehensive toolkit designed to handle every aspect of
              transport operations, from registration to reporting.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="p-8 border border-warm-300 rounded-xl bg-white hover:border-warm-400 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-250 cursor-default group"
              >
                <div className="w-10 h-10 flex items-center justify-center text-xl bg-warm-100 border border-warm-300 rounded-lg mb-5 group-hover:scale-110 transition-transform duration-250">
                  {feat.icon}
                </div>
                <h3 className="text-base font-semibold text-warm-600 tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-warm-500 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-6 lg:px-12 bg-warm-100">
        <div className="max-w-[1100px] mx-auto">
          {/* Header */}
          <div className="text-center flex flex-col items-center mb-16">
            <span className="text-[0.8125rem] font-medium text-notion-blue uppercase tracking-widest mb-3">
              How it works
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-tight leading-tight mb-3">
              Up and running in minutes
            </h2>
            <p className="text-[1.0625rem] text-warm-500 max-w-[560px] leading-relaxed">
              No complex setup. No training required. Just a few steps to
              digitize your transport operations.
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-[600px] mx-auto flex flex-col gap-10 relative before:content-[''] before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-px before:bg-warm-300 md:before:block before:hidden">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-6 relative">
                <div className="w-10 h-10 min-w-[40px] flex items-center justify-center text-sm font-semibold text-warm-600 bg-white border border-warm-300 rounded-full z-10">
                  {i + 1}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-lg font-semibold text-warm-600 tracking-tight mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-[0.9375rem] text-warm-500 leading-relaxed max-w-[480px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-warm-800 py-24 px-6 lg:px-12">
        <div className="max-w-[1100px] mx-auto text-center flex flex-col items-center">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-tight leading-tight mb-4 text-white">
            Ready to streamline your fleet?
          </h2>
          <p className="text-[1.0625rem] text-white/60 max-w-[500px] leading-relaxed mb-8">
            Join hundreds of organizations already managing their transport
            operations on TransitOps.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button className="text-[0.9375rem] font-medium text-warm-600 bg-white hover:bg-warm-100 px-6 py-3 rounded-lg transition-all duration-150 hover:-translate-y-px hover:shadow-lg group inline-flex items-center gap-2">
              Start for free
              <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </button>
            <button className="text-[0.9375rem] font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 px-6 py-3 rounded-lg transition-all duration-150">
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-warm-300 px-6 lg:px-12 pt-12 pb-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-10">
            {/* Brand */}
            <div className="max-w-[280px]">
              <div className="flex items-center gap-2 font-semibold text-base mb-3">
                <span className="w-6 h-6 bg-warm-600 rounded text-white flex items-center justify-center text-[0.625rem] font-bold">
                  T
                </span>
                TransitOps
              </div>
              <p className="text-[0.8125rem] text-warm-500 leading-relaxed">
                A centralized platform for managing the complete lifecycle of
                transport operations.
              </p>
            </div>

            {/* Columns */}
            <div className="flex gap-12 flex-wrap">
              {FOOTER_COLS.map((col) => (
                <div key={col.title}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-warm-400 mb-3">
                    {col.title}
                  </h4>
                  <ul className="list-none flex flex-col gap-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm text-warm-500 hover:text-warm-600 transition-colors duration-150"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-warm-300 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[0.8125rem] text-warm-400">
            <span>© 2026 TransitOps. All rights reserved.</span>
            <span>Built with care in India 🇮🇳</span>
          </div>
        </div>
      </footer>
    </div>
  );
}