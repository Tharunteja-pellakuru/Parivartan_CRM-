import React, { useState } from "react";
import {
  User,
  Lock,
  Users,
  Shield,
  Save,
  Camera,
  Check,
  Zap,
} from "lucide-react";
import anandImg from "../assets/Anand.png";

const MOCK_ADMINS = [
  {
    id: "1",
    name: "Anand",
    email: "root@parivartan.crm",
    role: "Root",
    status: "Active",
    lastActive: "Now",
  },
  {
    id: "2",
    name: "Chaitanya",
    email: "chaitanya@parivartan.crm",
    role: "Manager",
    status: "Active",
    lastActive: "15 mins ago",
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "Anand",
    email: "root@parivartan.crm",
    phone: "+91 98765 43210",
    bio: "Root Administrator for Parivartan CRM. Managing system architecture and team access.",
    avatar: anandImg,
  });
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  const [admins, setAdmins] = useState(MOCK_ADMINS);

  const handleProfileSave = () => {
    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 3000);
  };

  return (
    <div className="w-full relative">
      <div className="space-y-5 animate-fade-in w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="max-w-2xl">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-primary tracking-tight mb-2">
              Preferences
            </h2>
            <p className="text-sm text-textMuted font-medium leading-relaxed">
              Configure your professional profile and global portal
              architecture.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-60 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 p-4 lg:p-6">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: "profile", label: "Identity", icon: <User size={14} /> },
                { id: "security", label: "Security", icon: <Lock size={14} /> },
                { id: "team", label: "Personnel", icon: <Users size={14} /> },
                { id: "system", label: "Protocol", icon: <Shield size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-xl translate-x-1"
                      : "text-slate-500 hover:bg-slate-200/50 hover:text-primary"
                  }`}
                >
                  {React.cloneElement(tab.icon, {
                    size: 16,
                    strokeWidth: 3,
                  })}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="hidden lg:block mt-12 p-4 bg-primary text-white rounded-xl shadow-xl relative overflow-hidden group">
              <Zap className="absolute -right-4 -bottom-4 text-secondary/20 w-16 h-16 group-hover:scale-125 transition-transform" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">
                Node Status
              </h4>
              <p className="text-sm font-bold tracking-tight leading-tight">
                Root Operational
              </p>
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mt-2">
                All protocols optimal
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-8 lg:p-10">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fade-in max-w-4xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
                  <div className="relative group cursor-pointer shrink-0">
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-slate-50 object-cover shadow-xl group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-primary/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={20} />
                    </div>
                  </div>
                  <div className="text-center sm:text-left pt-2">
                    <h3 className="text-xl font-bold text-primary tracking-tight mb-2">
                      {profile.name}
                    </h3>
                    <p className="text-[11px] text-textMuted font-bold uppercase tracking-widest">
                      {profile.email}
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                      <span className="px-4 py-1.5 bg-secondary text-primary rounded-xl text-[9px] font-bold uppercase tracking-wider shadow-sm">
                        Root Admin
                      </span>
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-bold uppercase tracking-wider border border-slate-200">
                        System Key: PRV-001
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider ml-1">
                      Identity Label
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] ml-1">
                      Secure Vector (Email)
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed text-sm font-medium"
                    />
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tight ml-1">
                      Universal Root Key is immutable.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] ml-1">
                      Voice Vector (Phone)
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] ml-1">
                      Strategic Briefing (Bio)
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none resize-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100">
                  <button
                    onClick={handleProfileSave}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-slate-800 shadow-lg transition-all active:scale-95 text-[11px] font-bold uppercase tracking-widest"
                  >
                    {isProfileSaved ? (
                      <Check size={16} strokeWidth={2.5} />
                    ) : (
                      <Save size={16} strokeWidth={2.5} />
                    )}
                    {isProfileSaved ? "Protocol Updated" : "Execute Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === "system" && (
              <div className="space-y-6 animate-fade-in max-w-4xl">
                <div className="pb-8 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-primary tracking-tight mb-2">
                    Portal Architecture
                  </h3>
                  <p className="text-xs md:text-sm text-textMuted font-medium">
                    Root level overrides for the global CRM environment.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="group p-5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center gap-5 hover:bg-white hover:border-secondary/30 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-primary text-secondary rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-12 transition-transform">
                        <Shield size={18} strokeWidth={3} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-primary text-sm md:text-base tracking-tight leading-none mb-2">
                          Maintenance Protocol
                        </h4>
                        <p className="text-[11px] md:text-xs text-textMuted font-bold uppercase tracking-widest">
                          Restrict global access during infrastructure upgrades.
                        </p>
                      </div>
                    </div>
                    <button className="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full bg-slate-200 cursor-pointer transition-colors hover:bg-slate-300">
                      <span className="inline-block h-6 w-6 transform rounded-full bg-white transition translate-x-1 shadow-md" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* RESTRICTED TABS */}
            {(activeTab === "team" || activeTab === "security") && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-slate-50 text-slate-200 p-5 rounded-xl mb-6 shadow-inner flex items-center justify-center">
                  {activeTab === "team" ? (
                    <Users size={28} />
                  ) : (
                    <Lock size={28} />
                  )}
                </div>
                <h3 className="text-base md:text-lg font-bold text-primary uppercase tracking-widest mb-4">
                  {activeTab} Controls
                </h3>
                <p className="text-xs md:text-sm text-textMuted max-w-sm font-bold uppercase tracking-widest leading-relaxed">
                  Enterprise-tier overrides are restricted for this tactical
                  build.
                </p>
                <button className="mt-6 px-5 py-3 border-2 border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
                  Request Elevation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
