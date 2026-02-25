import React, { useState } from "react";
// MOCK_PROJECTS and MOCK_CLIENTS are now passed as props
import {
  Calendar,
  DollarSign,
  MoreVertical,
  Plus,
  Clock,
  UserPlus,
  X,
  Upload,
  ChevronDown,
} from "lucide-react";

const COLUMNS = [
  {
    id: "Planning",
    title: "Planning",
    color: "text-info",
    dotColor: "bg-info",
    activeTabBg: "bg-info/10",
    activeTabText: "text-info",
  },
  {
    id: "In Progress",
    title: "Execution",
    color: "text-warning",
    dotColor: "bg-warning",
    activeTabBg: "bg-warning/10",
    activeTabText: "text-warning",
  },
  {
    id: "Review",
    title: "Audit",
    color: "text-secondary",
    dotColor: "bg-secondary",
    activeTabBg: "bg-secondary/10",
    activeTabText: "text-secondary",
  },
  {
    id: "Completed",
    title: "Deployed",
    color: "text-success",
    dotColor: "bg-success",
    activeTabBg: "bg-success/10",
    activeTabText: "text-success",
  },
];

const ProjectCard = ({ project, clients }) => {
  const client = clients.find((c) => c.id === project.clientId);

  return (
    <div className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-secondary/50 hover:shadow-lg transition-all cursor-pointer animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {client?.company}
          </div>
        </div>
        <button className="p-1.5 text-slate-300 hover:text-primary transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>

      <h4 className="font-black text-primary text-sm md:text-base tracking-tight mb-4 group-hover:text-secondary transition-colors">
        {project.name}
      </h4>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1.5">
          <span className="text-slate-400">Completion</span>
          <span className="text-primary">{project.progress}%</span>
        </div>
        <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-textMuted">
        <div className="flex items-center gap-2">
          <Clock size={10} className="text-secondary" />
          <span>
            {new Date(project.deadline).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
          <DollarSign size={10} className="text-success" />
          <span className="text-primary">
            {(project.budget / 1000).toFixed(0)}k
          </span>
        </div>
      </div>
    </div>
  );
};

const ProjectBoard = ({ projects, clients, onAddProject, onAddClient }) => {
  const [activeStage, setActiveStage] = useState("Planning");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    projectName: "",
    projectStatus: "Planning",
    projectCategory: "Tech",
    projectPriority: "Medium",
    projectDescription: "",
    onboardingDate: new Date().toISOString().split("T")[0],
    deadline: "",
    scopeDocument: "",
  });

  const activeColumn = COLUMNS.find((c) => c.id === activeStage);
  const filteredProjects = projects.filter((p) => p.status === activeStage);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Create client first (or link to existing, though form is simplified to 'New' for now)
    const clientId = `c-${Date.now()}`;
    if (onAddClient) {
      onAddClient({
        id: clientId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        projectName: formData.projectName,
        projectStatus: formData.projectStatus,
        projectCategory: formData.projectCategory,
        projectPriority: formData.projectPriority,
        projectDescription: formData.projectDescription,
        onboardingDate: formData.onboardingDate,
        deadline: formData.deadline,
        scopeDocument: formData.scopeDocument,
      });
    }

    // 2. Create project entry
    if (onAddProject) {
      onAddProject({
        clientId: clientId,
        name: formData.projectName,
        status: formData.projectStatus,
        budget: 0, // Default for now
        deadline: formData.deadline,
        progress:
          formData.projectStatus === "Completed"
            ? 100
            : formData.projectStatus === "Testing"
              ? 75
              : formData.projectStatus === "On Going"
                ? 40
                : 10,
        category: formData.projectCategory,
        priority: formData.projectPriority,
      });
    }

    setShowAddModal(false);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "Active",
      projectName: "",
      projectStatus: "Planning",
      projectCategory: "Tech",
      projectPriority: "Medium",
      projectDescription: "",
      onboardingDate: new Date().toISOString().split("T")[0],
      deadline: "",
      scopeDocument: "",
    });
  };

  return (
    <div className="w-full h-full relative">
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="max-w-2xl">
            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-primary tracking-tighter mb-2">
              Projects
            </h2>
            <p className="text-xs md:text-sm text-textMuted font-medium leading-relaxed">
              Manage and track all your projects and their delivery status.
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-[11px] font-black uppercase tracking-[0.25em] shadow-lg active:scale-95"
            >
              <Plus size={14} strokeWidth={3} /> Add New Project
            </button>
          </div>
        </div>

        {/* Stage Toggle Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {COLUMNS.map((column) => {
            const count = projects.filter((p) => p.status === column.id).length;
            const isActive = activeStage === column.id;
            return (
              <button
                key={column.id}
                onClick={() => setActiveStage(column.id)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em] ${
                  isActive
                    ? `${column.activeTabBg} ${column.activeTabText} shadow-sm`
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${isActive ? column.dotColor : "bg-slate-300"} transition-colors`}
                ></div>
                <span>{column.title}</span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[9px] font-black border ${
                    isActive
                      ? `${column.activeTabBg} ${column.activeTabText} border-current/20`
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 min-h-[300px]">
          {/* Stage Header */}
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-4">
              <div
                className={`w-3 h-3 rounded-full ${activeColumn.dotColor}`}
              ></div>
              <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em]">
                {activeColumn.title}
              </h3>
            </div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "Project" : "Projects"}
            </span>
          </div>

          {/* Project Cards Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  clients={clients}
                />
              ))}
              <button
                onClick={() => setShowAddModal(true)}
                className="py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[10px] font-black uppercase tracking-widest hover:border-secondary hover:text-secondary hover:bg-secondary/[0.02] transition-all group flex flex-col items-center justify-center gap-2 min-h-[100px]"
              >
                <Plus
                  size={16}
                  strokeWidth={3}
                  className="group-hover:scale-125 transition-transform"
                />
                Initiate Project
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full max-w-sm py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[10px] font-black uppercase tracking-widest hover:border-secondary hover:text-secondary hover:bg-secondary/[0.02] transition-all group flex flex-col items-center justify-center gap-2"
              >
                <Plus
                  size={18}
                  strokeWidth={3}
                  className="group-hover:scale-125 transition-transform"
                />
                Initiate Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in my-auto flex flex-col">
            <div className="bg-primary p-6 text-white relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-2xl transition-colors"
              >
                <X size={28} strokeWidth={3} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center shadow-lg border border-secondary/20">
                  <UserPlus
                    size={28}
                    className="text-secondary"
                    strokeWidth={3}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter leading-none">
                    Add New Project
                  </h3>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">
                    Project and Client Details
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-6">
              {/* CLIENT DETAILS HEADING */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-[2px] w-8 bg-secondary rounded-full" />
                <h4 className="text-[14px] font-black text-[#18254D] uppercase tracking-[0.2em]">
                  Client Details
                </h4>
                <div className="h-[2px] flex-1 bg-slate-100 rounded-full" />
              </div>

              {/* CLIENT TYPE (Simplified version as per image) */}
              <div className="space-y-3 pb-2">
                <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                  CLIENT TYPE
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-white border-2 border-[#18254D] rounded-2xl cursor-pointer transition-all group shadow-sm">
                    <div className="relative flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#18254D] rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#18254D] rounded-full" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#18254D] leading-none">
                        New Client
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">
                        First-time engagement
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* NAME & EMAIL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    CLIENT NAME
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Anand Kumar"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold shadow-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    EMAIL ID
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="anand.kumar@fintech.in"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold shadow-sm"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* PHONE & STATUS */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    PHONE NUMBER
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold shadow-sm"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    CLIENT STATUS
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Active", "Inactive"].map((status) => (
                      <label
                        key={status}
                        className={`flex items-center gap-3 h-[46px] px-4 bg-white border rounded-xl cursor-pointer transition-all group shadow-sm ${
                          formData.status === status
                            ? "border-[#18254D] bg-[#18254D]/5"
                            : "border-slate-200"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, status: status })
                        }
                      >
                        <div className="relative flex items-center justify-center">
                          <div
                            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all ${
                              formData.status === status
                                ? "border-[#18254D]"
                                : "border-slate-300"
                            }`}
                          >
                            {formData.status === status && (
                              <div className="w-2.5 h-2.5 bg-[#18254D] rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-black text-[#18254D] leading-none">
                          {status}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* PROJECT DETAILS HEADING */}
              <div className="flex items-center gap-3 pt-6">
                <div className="h-[2px] w-8 bg-secondary rounded-full" />
                <h4 className="text-[14px] font-black text-[#18254D] uppercase tracking-[0.2em]">
                  Project Details
                </h4>
                <div className="h-[2px] flex-1 bg-slate-100 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* PROJECT NAME & STATUS */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    PROJECT NAME
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Website Redesign"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold shadow-sm"
                    value={formData.projectName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    PROJECT STATUS
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsStatusDropdownOpen(!isStatusDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-secondary transition-all"
                    >
                      <span className="text-primary">
                        {formData.projectStatus}
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
                            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
                              Select Status
                            </p>
                          </div>
                          {["Planning", "On Going", "Testing", "Completed"].map(
                            (status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    projectStatus: status,
                                  });
                                  setIsStatusDropdownOpen(false);
                                }}
                                className={`w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                                  formData.projectStatus === status
                                    ? "bg-slate-100 text-secondary"
                                    : "text-[#18254D] hover:bg-slate-50"
                                }`}
                              >
                                {status}
                              </button>
                            ),
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    PROJECT CATEGORY
                  </label>
                  <div className="flex gap-2">
                    {["Tech", "Social Media"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, projectCategory: cat })
                        }
                        className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest ${
                          formData.projectCategory === cat
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
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    PROJECT PRIORITY
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-secondary transition-all"
                    >
                      <span className="text-primary">
                        {formData.projectPriority}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${isPriorityDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isPriorityDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[80]"
                          onClick={() => setIsPriorityDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-fade-in-up origin-top">
                          <div className="bg-[#18254D] px-4 py-3 border-b border-white/10">
                            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">
                              Select Priority
                            </p>
                          </div>
                          {["High", "Medium", "Low"].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  projectPriority: level,
                                });
                                setIsPriorityDropdownOpen(false);
                              }}
                              className={`w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                                formData.projectPriority === level
                                  ? "bg-slate-100 text-secondary"
                                  : "text-[#18254D] hover:bg-slate-50"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* PROJECT DESCRIPTION */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    PROJECT DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief overview of the project scope..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold resize-none shadow-sm"
                    value={formData.projectDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectDescription: e.target.value,
                      })
                    }
                  />
                </div>

                {/* DATES */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    ONBOARDING DATE
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold shadow-sm"
                      value={formData.onboardingDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          onboardingDate: e.target.value,
                        })
                      }
                    />
                    <Calendar
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none md:hidden lg:block"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    DEADLINE (TENTATIVE)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold shadow-sm"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deadline: e.target.value,
                        })
                      }
                    />
                    <Calendar
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none md:hidden lg:block"
                    />
                  </div>
                </div>

                {/* SCOPE DOCUMENT */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-[#18254D] uppercase tracking-widest ml-1">
                    SCOPE DOCUMENT
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            scopeDocument: file.name,
                          });
                        }
                      }}
                    />
                    <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-secondary group-hover:bg-secondary/5 transition-all flex items-center gap-3 shadow-sm">
                      <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <Upload size={16} className="text-secondary" />
                      </div>
                      <span
                        className={`text-sm font-bold ${formData.scopeDocument ? "text-[#18254D]" : "text-slate-400"}`}
                      >
                        {formData.scopeDocument ||
                          "Click to upload scope document (PDF, DOCX)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-14 bg-[#18254D] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl active:scale-[0.97] transition-all hover:bg-[#1e2e5e] hover:shadow-2xl flex items-center justify-center gap-3 group/btn"
                >
                  <UserPlus
                    size={20}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                  <span>ADD PROJECT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
