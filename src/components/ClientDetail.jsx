import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Send,
  Clock,
  FileText,
  Plus,
  MessageSquare,
  Briefcase,
  Calendar,
  X,
  ChevronRight,
  Zap,
  Target,
  Pencil,
  Flame,
  Sun,
  Snowflake,
} from "lucide-react";
import { MOCK_PROJECTS, MOCK_ACTIVITIES } from "../utils/constants";
import {
  generateClientSummary,
  suggestNextAction,
} from "../services/geminiService";

const ClientDetail = ({
  client,
  onBack,
  onUpdateClient,
  onAddActivity,
  activities,
  initialTab = "overview",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [nextAction, setNextAction] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    leadType: client.leadType || "Warm",
    notes: client.notes,
    website: client.website || "",
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [isLogging, setIsLogging] = useState(false);
  const [logData, setLogData] = useState({
    type: "call",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].substring(0, 5),
  });

  const clientProjects = MOCK_PROJECTS.filter((p) => p.clientId === client.id);
  const clientActivities = activities.filter((a) => a.clientId === client.id);

  const handleLogInteraction = (e) => {
    e.preventDefault();
    if (onAddActivity && logData.description) {
      const combinedDateTime = new Date(`${logData.date}T${logData.time}`);
      onAddActivity({
        clientId: client.id,
        type: logData.type,
        description: logData.description,
        date: combinedDateTime.toISOString(),
      });
      setLogData({
        type: "call",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      });
      setIsLogging(false);
    }
  };

  return (
    <div className="w-full relative h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[calc(100vh-8rem)] animate-fade-in relative">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white gap-4">
          <div className="flex items-center gap-5 w-full lg:w-auto">
            <button
              onClick={onBack}
              className="p-3.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all border border-slate-100 shadow-sm"
            >
              <ArrowLeft size={20} strokeWidth={3} />
            </button>
            <div className="flex items-center gap-5 overflow-hidden">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl border-2 border-slate-50 shadow-lg shrink-0">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-primary tracking-tight truncate leading-none mb-1.5">
                  {client.name}
                </h2>
                <div className="flex items-center gap-2.5 text-[11px] text-textMuted font-bold uppercase tracking-widest truncate">
                  <span className="truncate">
                    {client.status === "Lead"
                      ? client.company || "Independent"
                      : client.projectName ||
                        client.company ||
                        "Global Project"}
                  </span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-[9px] font-bold tracking-widest border border-secondary/20">
                    {client.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            {client.status === "Lead" && (
              <button
                onClick={() => {
                  setEditFormData({
                    name: client.name,
                    email: client.email,
                    phone: client.phone,
                    leadType: client.leadType || "Warm",
                    notes: client.notes,
                    website: client.website || "",
                  });
                  setShowEditModal(true);
                }}
                className="flex-shrink-0 p-3.5 bg-slate-50 text-primary border border-slate-200 rounded-xl hover:bg-white hover:border-primary transition-all shadow-sm"
                title="Edit Lead Details"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Edit Lead Modal */}
          {showEditModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in overflow-y-auto py-10">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in my-auto">
                <div className="bg-primary p-6 flex justify-between items-center text-white">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight uppercase leading-tight">
                      Edit Lead Details
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Update primary contact information
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (onUpdateClient) {
                      onUpdateClient({
                        ...client,
                        name: editFormData.name,
                        email: editFormData.email,
                        phone: editFormData.phone,
                        leadType: editFormData.leadType,
                        notes: editFormData.notes,
                        website: editFormData.website,
                      });
                      setShowEditModal(false);
                    }
                  }}
                  className="p-6 space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Anand Kumar"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-medium"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
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
                      required
                      type="email"
                      placeholder="e.g. anand.kumar@fintech.in"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-medium"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
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
                      required
                      type="tel"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-medium"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                      Website Url
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://www.company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-medium"
                      value={editFormData.website}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          website: e.target.value,
                        })
                      }
                    />
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
                            setEditFormData({
                              ...editFormData,
                              leadType: type,
                            })
                          }
                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                            editFormData.leadType === type
                              ? type === "Hot"
                                ? "bg-error/5 border-error text-error shadow-lg shadow-error/10 scale-[1.02]"
                                : type === "Warm"
                                  ? "bg-warning/5 border-warning text-warning shadow-lg shadow-warning/10 scale-[1.02]"
                                  : "bg-info/5 border-info text-info shadow-lg shadow-info/10 scale-[1.02]"
                              : "bg-slate-50 border-slate-100 text-slate-400 grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                          }`}
                        >
                          {type === "Hot" ? (
                            <Flame size={18} strokeWidth={2.5} />
                          ) : type === "Warm" ? (
                            <Sun size={18} strokeWidth={2.5} />
                          ) : (
                            <Snowflake size={18} strokeWidth={2.5} />
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
                      rows={3}
                      placeholder="Add any additional context..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold resize-none"
                      value={editFormData.notes}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-primary text-white rounded-xl hover:bg-slate-800 text-[12px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95"
                    >
                      Update Lead
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Log Activity Modal */}
          {isLogging && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in overflow-y-auto py-10">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in my-auto">
                <div className="bg-primary p-6 flex justify-between items-center text-white">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight uppercase leading-tight">
                      Log Conversation
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Record interaction details
                    </p>
                  </div>
                  <button
                    onClick={() => setIsLogging(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleLogInteraction} className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                        Date
                      </label>
                      <input
                        required
                        type="date"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-medium"
                        value={logData.date}
                        onChange={(e) =>
                          setLogData({ ...logData, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                        Time
                      </label>
                      <input
                        required
                        type="time"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-medium"
                        value={logData.time}
                        onChange={(e) =>
                          setLogData({ ...logData, time: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                      Interaction Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["call", "email", "meeting"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setLogData({
                              ...logData,
                              type: type,
                            })
                          }
                          className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                            logData.type === type
                              ? "bg-secondary border-secondary text-white shadow-md shadow-secondary/20"
                              : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                      Conversation Details
                    </label>
                    <textarea
                      required
                      placeholder="Summary of the discussion..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold min-h-[100px] resize-none"
                      value={logData.description}
                      onChange={(e) =>
                        setLogData({ ...logData, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-primary text-white rounded-xl hover:bg-slate-800 text-[12px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95"
                    >
                      Save Entry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Side Panel */}
          <div className="w-full lg:w-[280px] border-b lg:border-b-0 lg:border-r border-slate-100 p-4 md:p-6 overflow-y-auto bg-slate-50/20 no-scrollbar shrink-0">
            <div className="space-y-8">
              <div>
                <h3 className="text-[9px] font-bold text-primary uppercase tracking-widest mb-4 opacity-40">
                  Contact Dossier
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-secondary">
                    <Mail
                      size={14}
                      className="text-slate-400 group-hover:text-secondary shrink-0"
                    />
                    <span className="text-xs font-bold text-primary truncate">
                      {client.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm group">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-primary truncate">
                      {client.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[9px] font-bold text-primary uppercase tracking-widest mb-4 opacity-40">
                  Discovery
                </h3>
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-inner italic text-xs md:text-sm text-primary leading-relaxed font-medium">
                  {client.notes}
                </div>
              </div>
            </div>
          </div>

          {/* Content View */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="bg-white p-2.5 border-b border-slate-100">
              <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                {[
                  { id: "overview", label: "Overview" },
                  {
                    id: "activity",
                    label:
                      client.status === "Lead" ? "Conversations" : "History",
                  },
                  ...(client.status !== "Lead"
                    ? [{ id: "projects", label: "Projects" }]
                    : []),
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar bg-white">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {client.status === "Lead" ? (
                    <>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group relative overflow-hidden">
                        <div className="p-2 bg-secondary/5 text-secondary rounded-lg w-fit mb-3 group-hover:bg-secondary group-hover:text-white transition-all">
                          <Zap size={16} />
                        </div>
                        <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Lead Status
                        </h3>
                        <p
                          className={`text-lg md:text-xl font-bold tracking-tight uppercase ${
                            client.leadType === "Hot"
                              ? "text-orange-500"
                              : client.leadType === "Warm"
                                ? "text-secondary"
                                : "text-info"
                          }`}
                        >
                          {client.leadType || "Warm"}
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group relative overflow-hidden">
                        <div className="p-2 bg-primary/5 text-primary rounded-lg w-fit mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                          <MessageSquare size={16} />
                        </div>
                        <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Recent Context
                        </h3>
                        <p className="text-sm font-bold text-primary truncate">
                          {client.notes?.split("\n")[0].substring(0, 40) ||
                            "No interaction logged"}
                          ...
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group relative overflow-hidden">
                        <div className="p-2 bg-primary/5 text-primary rounded-lg w-fit mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                          <Target size={16} />
                        </div>
                        <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Project Category
                        </h3>
                        <p className="text-lg md:text-xl font-bold text-primary tracking-tight uppercase">
                          {client.projectCategory || client.industry || "Tech"}
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group relative overflow-hidden">
                        <div className="p-2 bg-secondary/5 text-secondary rounded-lg w-fit mb-3 group-hover:bg-secondary group-hover:text-white transition-all">
                          <Zap size={16} />
                        </div>
                        <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Project Priority
                        </h3>
                        <p className="text-lg md:text-xl font-bold text-primary tracking-tight uppercase">
                          {client.projectPriority || "Medium"}
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group relative overflow-hidden md:col-span-2">
                        <div className="p-2 bg-info/5 text-info rounded-lg w-fit mb-3 group-hover:bg-info group-hover:text-white transition-all">
                          <Calendar size={16} />
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              Current Deadline
                            </h3>
                            <p className="text-lg md:text-xl font-bold text-primary tracking-tighter uppercase">
                              {client.deadline
                                ? new Date(client.deadline).toLocaleDateString(
                                    [],
                                    {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "Not Set"}
                            </p>
                          </div>
                          <div className="text-right">
                            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              Status
                            </h3>
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">
                              {client.projectStatus || "Active"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeTab === "activity" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-primary tracking-tight">
                      Timeline
                    </h3>
                    <button
                      onClick={() => setIsLogging(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                      <Plus size={16} /> Log Entry
                    </button>
                  </div>
                  <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-10">
                    {clientActivities.length === 0 ? (
                      <p className="ml-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Historical Void
                      </p>
                    ) : (
                      clientActivities.map((activity) => (
                        <div key={activity.id} className="ml-8 relative">
                          <div
                            className={`absolute -left-[45px] w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md z-10 ${activity.type === "email" ? "bg-info" : activity.type === "call" ? "bg-success" : "bg-slate-400"}`}
                          >
                            {activity.type === "call" ? (
                              <Phone size={14} />
                            ) : (
                              <Mail size={14} />
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                              {new Date(activity.date).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm font-medium text-primary leading-relaxed">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              {activeTab === "projects" && (
                <div className="space-y-4 animate-fade-in">
                  {clientProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl hover:border-secondary transition-all flex items-center gap-5"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-primary truncate mb-1">
                          {project.name}
                        </h4>
                        <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-2 overflow-hidden mt-3">
                          <div
                            className="bg-secondary h-full rounded-full transition-all duration-1000"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-primary">
                          ${(project.budget / 1000).toFixed(0)}k
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {project.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
