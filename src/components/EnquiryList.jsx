import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Globe,
  CheckCircle,
  Clock,
  PauseCircle,
  RefreshCcw,
  Trash2,
  Flame,
  Sun,
  Snowflake,
  Plus,
  Send,
  Inbox,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { analyzeEnquiryRelevance } from "../services/geminiService";

const EnquiryList = ({
  enquiries,
  onPromote,
  onDismiss,
  onHold,
  onRestore,
  onDelete,
  onDeleteAll,
  onUpdate,
  onAdd,
}) => {
  const [activeTab, setActiveTab] = useState("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(false);
  const [hideIrrelevant, setHideIrrelevant] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [promoteFormData, setPromoteFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    leadType: "Warm",
    leadCategory: "Tech",
    notes: "",
  });
  const [showSimulateForm, setShowSimulateForm] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [holdReason, setHoldReason] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
  });

  useEffect(() => {
    if (aiAnalysisEnabled && activeTab === "new") {
      const runAnalysis = async () => {
        const toAnalyze = enquiries.filter(
          (e) => (e.status === "new" || e.status === "read") && !e.aiAnalysis,
        );
        if (toAnalyze.length > 0) {
          setIsAnalyzing(true);
          for (const enquiry of toAnalyze) {
            const result = await analyzeEnquiryRelevance(enquiry);
            onUpdate({ ...enquiry, aiAnalysis: result });
          }
          setIsAnalyzing(false);
        }
      };
      runAnalysis();
    }
  }, [aiAnalysisEnabled, activeTab, enquiries]);

  const filteredEnquiries = enquiries.filter((e) => {
    let matchesTab = false;
    if (activeTab === "new")
      matchesTab = e.status === "new" || e.status === "read";
    else if (activeTab === "hold") matchesTab = e.status === "hold";
    else if (activeTab === "dismissed") matchesTab = e.status === "dismissed";

    if (!matchesTab) return false;

    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.message && e.message.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === "new" && hideIrrelevant) {
      if (e.aiAnalysis && !e.aiAnalysis.isRelevant) return false;
    }
    return true;
  });

  const openLeadModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setPromoteFormData({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      website: enquiry.website,
      leadType: "Warm",
      leadCategory: "Tech",
      notes: enquiry.message,
    });
    setLeadModalOpen(true);
  };

  const confirmLeadConversion = () => {
    if (selectedEnquiry) {
      // Create a temporary updated enquiry object to pass the edited data
      const updatedEnquiry = {
        ...selectedEnquiry,
        name: promoteFormData.name,
        email: promoteFormData.email,
        phone: promoteFormData.phone,
        website: promoteFormData.website,
        projectCategory: promoteFormData.leadCategory,
        message: promoteFormData.notes,
      };
      onPromote(updatedEnquiry, promoteFormData.leadType);
      setLeadModalOpen(false);
      setSelectedEnquiry(null);
    }
  };

  const openHoldModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setHoldModalOpen(true);
    setHoldReason("");
  };

  const confirmHold = () => {
    if (selectedEnquiry) {
      onUpdate({ ...selectedEnquiry, status: "hold", holdReason: holdReason });
      onHold(selectedEnquiry.id);
      setHoldModalOpen(false);
      setSelectedEnquiry(null);
      setHoldReason("");
    }
  };

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData });
    setShowSimulateForm(false);
    setFormData({ name: "", email: "", phone: "", website: "", message: "" });
    setActiveTab("new");
  };

  return (
    <div className="w-full relative">
      <div className="space-y-5 animate-fade-in w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="max-w-2xl">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-primary tracking-tight mb-1.5">
              Enquiry Hub
            </h2>
            <p className="text-sm text-textMuted font-medium leading-relaxed">
              Manage and qualify all incoming business enquiries.
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <button
              onClick={() => setShowSimulateForm(true)}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-[11px] font-bold uppercase tracking-wider shadow-lg active:scale-95 group"
            >
              <Plus
                size={16}
                strokeWidth={2.5}
                className="group-hover:rotate-90 transition-transform"
              />
              New Enquiry
            </button>
          </div>
        </div>

        <div className="bg-white p-2 md:p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          {/* AI Controls Moved inside Control Bar for Enquiries */}
          <div className="flex items-center justify-between w-full">
            <div className="relative w-full md:w-96">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder={`Search in ${activeTab === "new" ? "Inbox" : activeTab === "hold" ? "On Hold" : "Dismissed"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              {activeTab === "new" && (
                <div className="flex items-center gap-2.5 px-4 h-[46px] bg-slate-50 border border-slate-100 rounded-xl">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest ${aiAnalysisEnabled ? "text-primary" : "text-slate-400"}`}
                  >
                    AI Analysis
                  </span>
                  <button
                    onClick={() => setAiAnalysisEnabled(!aiAnalysisEnabled)}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full transition-colors ${aiAnalysisEnabled ? "bg-secondary" : "bg-slate-200"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${aiAnalysisEnabled ? "translate-x-5" : "translate-x-1"} mt-0.5`}
                    />
                  </button>
                  {aiAnalysisEnabled && (
                    <div className="flex items-center gap-2.5 pl-4 border-l border-slate-200 ml-4 h-full">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${hideIrrelevant ? "text-primary" : "text-slate-400"}`}
                      >
                        Filter Spam
                      </span>
                      <button
                        onClick={() => setHideIrrelevant(!hideIrrelevant)}
                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full transition-colors ${hideIrrelevant ? "bg-primary" : "bg-slate-200"}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${hideIrrelevant ? "translate-x-5" : "translate-x-1"} mt-0.5`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lead View Toggles (Enquiries) */}
        <div className="flex justify-center my-6">
          <div className="inline-flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 shadow-sm leading-none h-[54px] items-center gap-1">
            {["new", "hold", "dismissed"].map((tab) => {
              const colors = {
                new: {
                  active: "text-blue-600 border-blue-100 bg-white",
                  hover: "hover:text-blue-500 hover:bg-white/50",
                },
                hold: {
                  active: "text-orange-600 border-orange-100 bg-white",
                  hover: "hover:text-orange-500 hover:bg-white/50",
                },
                dismissed: {
                  active: "text-rose-600 border-rose-100 bg-white",
                  hover: "hover:text-rose-500 hover:bg-white/50",
                },
              };
              const activeColor = colors[tab].active;
              const hoverColor = colors[tab].hover;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 h-full rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center min-w-[120px] border border-transparent whitespace-nowrap ${
                    activeTab === tab
                      ? `${activeColor} shadow-md`
                      : `text-slate-400 ${hoverColor}`
                  }`}
                >
                  {tab === "new"
                    ? "Inbox"
                    : tab === "hold"
                      ? "On Hold"
                      : "Dismissed"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {filteredEnquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 bg-white rounded-2xl border border-slate-200 shadow-sm w-full">
              <Inbox size={24} className="text-slate-100 mb-3" />
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Clear
              </p>
            </div>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className={`group bg-white rounded-2xl border transition-all hover:shadow-xl overflow-hidden flex flex-col w-full ${enquiry.aiAnalysis && !enquiry.aiAnalysis.isRelevant ? "border-error/10 bg-error/[0.01]" : "border-slate-200 hover:border-secondary/30"}`}
              >
                <div className="p-5 md:p-6 flex flex-col lg:flex-row gap-6 items-start">
                  <div className="lg:w-[260px] shrink-0 space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 ${enquiry.status === "hold" ? "bg-warning" : enquiry.status === "dismissed" ? "bg-slate-400" : "bg-primary"}`}
                      >
                        {enquiry.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-primary text-sm md:text-base tracking-tight truncate leading-none mb-1">
                          {enquiry.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[9px] text-textMuted font-bold uppercase tracking-widest">
                          <Clock size={12} className="text-secondary" />
                          {new Date(enquiry.date).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[8px] font-bold text-primary uppercase tracking-[0.3em] opacity-40">
                        Identity Dossier
                      </h4>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-[11px] text-textMuted font-bold p-3 bg-slate-50/50 rounded-xl border border-slate-100 truncate">
                          <Mail size={14} className="text-slate-400" />
                          <span className="truncate">{enquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-textMuted font-bold p-3 bg-slate-50/50 rounded-xl border border-slate-100 truncate">
                          <Phone size={14} className="text-slate-400" />
                          <span className="truncate">
                            {enquiry.phone || "Not Provided"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-textMuted font-bold p-3 bg-slate-50/50 rounded-xl border border-slate-100 truncate">
                          <Globe size={14} className="text-slate-400" />
                          <span className="truncate">
                            {enquiry.website || "Direct"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[8px] font-bold text-primary uppercase tracking-[0.3em] opacity-40">
                          Briefing
                        </h4>
                        <div className="flex gap-2">
                          {enquiry.holdReason && (
                            <div className="px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-lg text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                              <PauseCircle size={12} /> Reason Logged
                            </div>
                          )}
                          {enquiry.aiAnalysis && (
                            <div
                              className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest border flex items-center gap-1.5 shadow-sm ${enquiry.aiAnalysis.isRelevant ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"}`}
                            >
                              <Sparkles size={12} />
                              {enquiry.aiAnalysis.isRelevant
                                ? "Validated"
                                : "Spam"}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all shadow-inner relative space-y-4">
                        <p className="text-xs md:text-sm text-primary font-medium italic leading-relaxed">
                          "{enquiry.message}"
                        </p>
                        {enquiry.holdReason && (
                          <div className="pt-4 border-t border-slate-200/60">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                              Hold Reason
                            </p>
                            <p className="text-[11px] text-warning font-bold bg-warning/5 p-3 rounded-xl border border-warning/10">
                              {enquiry.holdReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-row flex-wrap items-center gap-2.5 group-hover:bg-white transition-colors">
                  {activeTab === "new" && (
                    <React.Fragment>
                      <button
                        onClick={() => openLeadModal(enquiry)}
                        className="bg-[#18254D] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-95 hover:bg-slate-800 transition-all whitespace-nowrap"
                      >
                        <CheckCircle size={14} strokeWidth={2.5} /> Add to Lead
                      </button>
                      <button
                        onClick={() => openHoldModal(enquiry)}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-warning hover:border-warning transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <PauseCircle size={14} /> Hold
                      </button>
                      <button
                        onClick={() => onDismiss(enquiry.id)}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-error hover:border-error transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <X size={14} /> Dismiss
                      </button>
                    </React.Fragment>
                  )}
                  {activeTab === "hold" && (
                    <React.Fragment>
                      <button
                        onClick={() => onRestore(enquiry.id)}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-95 transition-all whitespace-nowrap"
                      >
                        <RefreshCcw size={14} strokeWidth={3} /> Restore Enquiry
                      </button>
                      <button
                        onClick={() => onDismiss(enquiry.id)}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-error hover:border-error transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <X size={14} /> Dismiss
                      </button>
                    </React.Fragment>
                  )}
                  {activeTab === "dismissed" && (
                    <React.Fragment>
                      <button
                        onClick={() => onRestore(enquiry.id)}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-95 transition-all whitespace-nowrap"
                      >
                        <RefreshCcw size={14} strokeWidth={2.5} /> Restore
                        Enquiry
                      </button>
                      <button
                        onClick={() => onDelete(enquiry.id)}
                        className="p-2.5 bg-white border border-slate-200 text-slate-300 rounded-xl hover:text-error hover:border-error hover:bg-error/5 transition-all flex items-center justify-center"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </React.Fragment>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showSimulateForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in relative my-auto">
            <button
              onClick={() => setShowSimulateForm(false)}
              className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all z-20"
              title="Close"
            >
              <X size={20} strokeWidth={3} />
            </button>
            <div className="bg-primary p-6 text-white">
              <h3 className="text-2xl font-bold tracking-tight mb-1">
                New Enquiry
              </h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                Manual Entry
              </p>
            </div>
            <form onSubmit={handleSimulateSubmit} className="p-7 space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/5 outline-none transition-all"
                    placeholder="Enter full name..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/5 outline-none transition-all"
                      placeholder="Email address..."
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/5 outline-none transition-all"
                      placeholder="Phone number..."
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/5 outline-none transition-all"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Requirement Briefing
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium resize-none focus:ring-2 focus:ring-primary/5 outline-none transition-all"
                    placeholder="Type message here..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-14 bg-[#18254D] text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl active:scale-[0.97] transition-all hover:bg-[#1e2e5e] hover:shadow-2xl flex items-center justify-center gap-3 group/btn"
                >
                  <span>Add Enquiry</span>
                  <Send
                    size={16}
                    strokeWidth={2.5}
                    className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {leadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-zoom-in my-auto">
            <div className="bg-[#18254D] p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Plus size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight uppercase">
                  New Lead
                </h3>
              </div>
              <button
                onClick={() => setLeadModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    value={promoteFormData.name}
                    onChange={(e) =>
                      setPromoteFormData({
                        ...promoteFormData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Email ID
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    value={promoteFormData.email}
                    onChange={(e) =>
                      setPromoteFormData({
                        ...promoteFormData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    value={promoteFormData.phone}
                    onChange={(e) =>
                      setPromoteFormData({
                        ...promoteFormData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    value={promoteFormData.website}
                    onChange={(e) =>
                      setPromoteFormData({
                        ...promoteFormData,
                        website: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                  Lead Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Tech", "Media"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setPromoteFormData({
                          ...promoteFormData,
                          leadCategory: cat,
                        })
                      }
                      className={`flex items-center justify-center p-4 rounded-2xl border-2 transition-all font-bold uppercase text-[10px] tracking-widest ${
                        promoteFormData.leadCategory === cat
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-slate-100 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                  Lead Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Hot", "Warm", "Cold"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setPromoteFormData({
                          ...promoteFormData,
                          leadType: type,
                        })
                      }
                      className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                        promoteFormData.leadType === type
                          ? type === "Hot"
                            ? "bg-error/5 border-error text-error shadow-lg shadow-error/10 scale-105"
                            : type === "Warm"
                              ? "bg-warning/5 border-warning text-warning shadow-lg shadow-warning/10 scale-105"
                              : "bg-info/5 border-info text-info shadow-lg shadow-info/10 scale-105"
                          : "bg-slate-50 border-slate-100 text-slate-400 grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                      }`}
                    >
                      {type === "Hot" ? (
                        <Flame size={24} strokeWidth={2.5} />
                      ) : type === "Warm" ? (
                        <Sun size={24} strokeWidth={2.5} />
                      ) : (
                        <Snowflake size={24} strokeWidth={2.5} />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                  Note
                </label>
                <textarea
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  value={promoteFormData.notes}
                  onChange={(e) =>
                    setPromoteFormData({
                      ...promoteFormData,
                      notes: e.target.value,
                    })
                  }
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={confirmLeadConversion}
                  className="w-full py-5 bg-[#18254D] text-white rounded-xl text-[13px] font-bold uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all hover:bg-slate-800"
                >
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {holdModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in relative">
            <div className="bg-primary p-6 text-white">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-2xl font-bold tracking-tight">On Hold</h3>
                <button
                  onClick={() => setHoldModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-7 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Hold Reason
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium resize-none focus:ring-2 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300"
                    placeholder="Enter reason for suspending this enquiry..."
                    value={holdReason}
                    onChange={(e) => setHoldReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <button
                  onClick={confirmHold}
                  disabled={!holdReason.trim()}
                  className="w-full h-14 bg-[#18254D] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale hover:bg-slate-800"
                >
                  <span>Add To Hold</span>
                  <PauseCircle size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryList;
