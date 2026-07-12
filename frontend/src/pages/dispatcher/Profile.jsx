import { useState } from "react";
import { User, Mail, Phone, Shield } from "lucide-react";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "Alex Carter",
    email: "alex.dispatcher@transitops.com",
    phone: "+91 98765 43210",
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Profile updated successfully");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warm-700 tracking-tight">Profile Settings</h1>
        <p className="text-warm-500 text-sm mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="bg-white border border-warm-300 rounded-xl shadow-sm overflow-hidden">
        
        {/* Header / Avatar */}
        <div className="p-6 border-b border-warm-200 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-notion-blue to-notion-purple flex items-center justify-center text-white font-bold text-2xl shadow-sm">
            AC
          </div>
          <div>
            <h2 className="text-xl font-bold text-warm-700">{formData.name}</h2>
            <div className="flex items-center gap-2 text-sm text-warm-500 mt-1">
              <Shield className="w-4 h-4 text-warm-400" />
              Dispatcher Role
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-warm-600 uppercase tracking-wider">Personal Information</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-warm-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-warm-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-600 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border border-warm-300 rounded-lg text-sm focus:ring-2 focus:ring-warm-200 focus:border-warm-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-warm-200 flex justify-end">
             <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 text-sm font-medium text-white bg-warm-600 hover:bg-warm-800 rounded-lg transition-all duration-150 hover:-translate-y-px hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none flex items-center gap-2"
              >
                {isSaving && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Save Changes
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
