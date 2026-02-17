import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Settings,
  Inbox,
  UserPlus,
  BellRing,
  LogOut,
  X,
} from "lucide-react";
import Logo from "./Logo";
import anandImg from "../assets/Anand.png";

const Sidebar = ({
  activeTab,
  setActiveTab,
  onLogout,
  enquiryCount = 0,
  followUpCount = 0,
  onCloseMobile,
}) => {
  const [imgError, setImgError] = useState(false);
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "enquiries",
      label: "Enquiries",
      icon: <Inbox size={20} />,
      badge: enquiryCount,
      badgeColor: "bg-rose-500",
    },
    {
      id: "followups",
      label: "Follow-ups",
      icon: <BellRing size={20} />,
      badge: followUpCount,
      badgeColor: "bg-amber-500",
    },
    { id: "leads", label: "Leads", icon: <UserPlus size={20} /> },
    { id: "clients", label: "Clients", icon: <Users size={20} /> },
    { id: "projects", label: "Projects", icon: <FolderKanban size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-72 bg-[#18254D] text-slate-300 flex flex-col h-screen border-r border-white/5 shadow-2xl overflow-hidden select-none transition-all duration-300">
      <div className="p-5 pb-3 relative shrink-0">
        <button
          onClick={onCloseMobile}
          className="md:hidden absolute top-5 right-5 text-slate-400"
        >
          <X size={18} />
        </button>
        <Logo size={48} showText={true} className="!gap-3" />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all ${isActive ? "bg-black/20 text-white shadow-sm" : "hover:bg-white/5 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={isActive ? "text-secondary" : "text-slate-500"}
                >
                  {item.icon}
                </span>
                <span className="text-[13px] font-bold tracking-tight">
                  {item.label}
                </span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-white text-[#18254D] text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[1.25rem] text-center shadow-sm transition-colors">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5 shrink-0 bg-white/5">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
          <img
            src={anandImg}
            alt="User"
            className="w-10 h-10 rounded-lg border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white font-bold truncate">Anand</p>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 text-slate-500 hover:text-rose-400 transition-all active:scale-90"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
