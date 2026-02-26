import React, { useState } from "react";
import {
  Clock,
  Bell,
  CheckCircle2,
  Plus,
  MessageSquare,
  Phone,
  Check,
  X,
  ChevronDown,
  UserPlus,
} from "lucide-react";

const FollowUpList = ({
  followUps,
  clients,
  onToggleStatus,
  onAddFollowUp,
  onSelectClient,
  onNavigate,
  typeFilter = "All",
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    description: "",
    followup_date: new Date().toISOString().split("T")[0],
    followup_mode: "call",
    followup_status: "pending",
    follow_brief: "",
    priority: "Medium",
  });
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const getClientById = (id) => clients.find((c) => c.id === id);
  const isOverdue = (date) =>
    new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const filteredFollowUps = followUps
    .filter((f) => {
      const client = getClientById(f.clientId);
      if (typeFilter !== "All") {
        if (!client) return false;
        if (typeFilter === "Active" && client.status !== "Active") return false;
        if (typeFilter === "Lead" && client.status !== "Lead") return false;
      }

      if (f.status === "completed" && activeFilter !== "All") return false;
      if (activeFilter === "Overdue")
        return isOverdue(f.dueDate) && f.status === "pending";
      if (activeFilter === "Today")
        return isToday(f.dueDate) && f.status === "pending";
      if (activeFilter === "Upcoming")
        return (
          !isOverdue(f.dueDate) && !isToday(f.dueDate) && f.status === "pending"
        );
      return true;
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFollowUp(formData);
    setShowAddModal(false);
    setFormData({
      clientId: "",
      title: "",
      description: "",
      followup_date: new Date().toISOString().split("T")[0],
      followup_mode: "call",
      followup_status: "pending",
      follow_brief: "",
      priority: "Medium",
    });
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case "High":
        return "bg-error/10 text-error border-error/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Low":
        return "bg-info/10 text-info border-info/20";
    }
  };

  return (
    <div className="w-full relative">
      <div className="space-y-5 animate-fade-in w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="max-w-2xl">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-primary tracking-tight mb-1.5">
              {typeFilter === "Active"
                ? "Client Follow-Ups"
                : typeFilter === "Lead"
                  ? "Lead Follow-Ups"
                  : "Follow-Ups"}
            </h2>
            <p className="text-xs md:text-sm text-textMuted font-medium leading-relaxed">
              {typeFilter === "Active"
                ? "Manage communications with your onboarded clients."
                : typeFilter === "Lead"
                  ? "Track interactions with your potential leads."
                  : "Stay on top of your client and lead communications."}
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 group"
            >
              <Plus
                size={16}
                strokeWidth={3}
                className="group-hover:rotate-90 transition-transform"
              />{" "}
              Add Follow-Up
            </button>
          </div>
        </div>

        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto no-scrollbar">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full">
            {["All", "Overdue", "Today", "Upcoming"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-1 px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === f ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {filteredFollowUps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm w-full">
              <Bell size={24} className="text-slate-100 mb-3" />
              <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                No Active Tasks
              </p>
            </div>
          ) : (
            filteredFollowUps.map((f) => {
              const client = getClientById(f.clientId);
              const overdue = isOverdue(f.dueDate) && f.status === "pending";
              return (
                <div
                  key={f.id}
                  className={`group bg-white rounded-xl border transition-all hover:shadow-md flex flex-col md:flex-row items-center p-4 md:p-4 gap-4 ${f.status === "completed" ? "opacity-50 grayscale" : overdue ? "border-error/20 bg-error/[0.01]" : "border-slate-200 hover:border-secondary/30"}`}
                >
                  <button
                    onClick={() => onToggleStatus(f.id)}
                    className={`w-9 h-9 rounded-lg border-3 transition-all flex items-center justify-center shrink-0 ${f.status === "completed" ? "bg-success border-success text-white" : "bg-white border-slate-100 text-transparent hover:border-secondary"}`}
                  >
                    {f.status === "completed" ? (
                      <Check size={16} strokeWidth={4} />
                    ) : (
                      <CheckCircle2 size={14} strokeWidth={3} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getPriorityBadge(f.priority)}`}
                      >
                        {f.priority}
                      </span>
                      {overdue && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-error bg-error/10 px-2.5 py-0.5 rounded-md border border-error/20">
                          Overdue
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-sm font-bold text-primary tracking-tight truncate ${f.status === "completed" ? "line-through opacity-50" : ""}`}
                    >
                      {f.title}
                    </h4>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1.5 text-[10px] text-textMuted font-bold uppercase tracking-widest">
                      <Clock size={12} className="text-secondary" />
                      {new Date(f.dueDate).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div
                    onClick={() => client && onSelectClient(client)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-slate-200 cursor-pointer transition-all shadow-inner shrink-0"
                  >
                    <img
                      src={client?.avatar}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      alt=""
                    />
                    <div className="text-left">
                      <p className="text-[13px] font-bold text-primary truncate leading-none">
                        {client?.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                        {client?.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        client && onSelectClient(client, "activity")
                      }
                      className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-primary transition-all active:scale-90"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-secondary transition-all active:scale-90">
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in my-auto">
            <div className="bg-primary p-6 text-white relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-2xl transition-colors"
              >
                <X size={24} strokeWidth={3} />
              </button>
              <h3 className="text-lg font-bold tracking-tighter mb-1">
                Add Follow Up
              </h3>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                Create a new follow-up task
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider ml-1">
                    Target Identity
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsClientDropdownOpen(!isClientDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm hover:border-secondary transition-all"
                    >
                      <span className="text-primary truncate max-w-[90%]">
                        {formData.clientId
                          ? clients.find((c) => c.id === formData.clientId)
                              ?.name
                          : "Target Identity..."}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform flex-shrink-0 ${isClientDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isClientDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[80]"
                          onClick={() => setIsClientDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-fade-in-up origin-top max-h-60 overflow-y-auto">
                          <div className="sticky top-0 bg-[#18254D] px-4 py-3 border-b border-white/10 z-10">
                            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                              Select Client
                            </p>
                          </div>
                          {clients.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, clientId: c.id });
                                setIsClientDropdownOpen(false);
                              }}
                              className={`w-full text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                formData.clientId === c.id
                                  ? "bg-slate-100 text-secondary"
                                  : "text-[#18254D] hover:bg-slate-50"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Task Description
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Discuss project scope"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Add details about your follow-up..."
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                      Follow-up Date
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-[#18254D]"
                      value={formData.followup_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          followup_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                      Follow-up Mode
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setIsModeDropdownOpen(!isModeDropdownOpen)
                        }
                        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-secondary transition-all"
                      >
                        <span className="text-primary capitalize">
                          {formData.followup_mode}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform ${isModeDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isModeDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-[80]"
                            onClick={() => setIsModeDropdownOpen(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-fade-in-up origin-top">
                            <div className="bg-[#18254D] px-4 py-3 border-b border-white/10">
                              <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                                Select Mode
                              </p>
                            </div>
                            {["call", "email", "meeting", "whatsapp"].map(
                              (mode) => (
                                <button
                                  key={mode}
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      followup_mode: mode,
                                    });
                                    setIsModeDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors capitalize ${
                                    formData.followup_mode === mode
                                      ? "bg-slate-100 text-secondary"
                                      : "text-[#18254D] hover:bg-slate-50"
                                  }`}
                                >
                                  {mode}
                                </button>
                              ),
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Follow-up Status
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsStatusDropdownOpen(!isStatusDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-secondary transition-all"
                    >
                      <span className="text-primary capitalize">
                        {formData.followup_status}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isStatusDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[80]"
                          onClick={() => setIsStatusDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-fade-in-up origin-top">
                          <div className="bg-[#18254D] px-4 py-3 border-b border-white/10">
                            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                              Select Status
                            </p>
                          </div>
                          {[
                            "pending",
                            "completed",
                            "rescheduled",
                            "cancelled",
                          ].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  followup_status: status,
                                });
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors capitalize ${
                                formData.followup_status === status
                                  ? "bg-slate-100 text-secondary"
                                  : "text-[#18254D] hover:bg-slate-50"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Brief Notes
                  </label>
                  <textarea
                    placeholder="Add any brief notes..."
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none resize-none"
                    value={formData.follow_brief}
                    onChange={(e) =>
                      setFormData({ ...formData, follow_brief: e.target.value })
                    }
                    rows="2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-secondary text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg"
                >
                  Create Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpList;
