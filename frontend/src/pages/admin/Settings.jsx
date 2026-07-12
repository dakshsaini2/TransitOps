import { Save, Bell, ShieldCheck, Database, Globe } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Global Settings</h1>
          <p className="text-warm-500 text-sm mt-1">Configure system-wide preferences and platform settings.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-warm-600 hover:bg-warm-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation / Sections */}
        <div className="col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg bg-warm-100 text-warm-800 font-medium flex items-center gap-3">
             <Globe className="w-5 h-5 text-warm-500" /> General
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-warm-50 text-warm-600 font-medium flex items-center gap-3 transition-colors">
             <ShieldCheck className="w-5 h-5 text-warm-400" /> Security
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-warm-50 text-warm-600 font-medium flex items-center gap-3 transition-colors">
             <Bell className="w-5 h-5 text-warm-400" /> Notifications
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-warm-50 text-warm-600 font-medium flex items-center gap-3 transition-colors">
             <Database className="w-5 h-5 text-warm-400" /> Data & Backups
          </button>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-2 bg-white border border-warm-300 rounded-xl shadow-sm p-6 space-y-8">
          
          <section>
            <h3 className="text-lg font-semibold text-warm-700 mb-4 border-b border-warm-200 pb-2">Company Information</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Company Name</label>
                  <input type="text" defaultValue="TransitOps Logistics" className="w-full px-4 py-2 bg-warm-50 border border-warm-300 rounded-lg text-sm text-warm-800 outline-none focus:ring-2 focus:ring-warm-200" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@transitops.com" className="w-full px-4 py-2 bg-warm-50 border border-warm-300 rounded-lg text-sm text-warm-800 outline-none focus:ring-2 focus:ring-warm-200" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1">Timezone</label>
                    <select className="w-full px-4 py-2 bg-warm-50 border border-warm-300 rounded-lg text-sm text-warm-800 outline-none focus:ring-2 focus:ring-warm-200">
                      <option>Asia/Kolkata (IST)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1">Currency</label>
                    <select className="w-full px-4 py-2 bg-warm-50 border border-warm-300 rounded-lg text-sm text-warm-800 outline-none focus:ring-2 focus:ring-warm-200">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
               </div>
            </div>
          </section>

          <section>
             <h3 className="text-lg font-semibold text-warm-700 mb-4 border-b border-warm-200 pb-2">Platform Preferences</h3>
             <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-warm-600 rounded border-warm-300 focus:ring-warm-500" />
                  <span className="text-sm text-warm-700 font-medium">Enable automatic vehicle maintenance reminders</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-warm-600 rounded border-warm-300 focus:ring-warm-500" />
                  <span className="text-sm text-warm-700 font-medium">Require admin approval for expenses over ₹10,000</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-warm-600 rounded border-warm-300 focus:ring-warm-500" />
                  <span className="text-sm text-warm-700 font-medium">Force 2-Factor Authentication (2FA) for all users</span>
                </label>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}
