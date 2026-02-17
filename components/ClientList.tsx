import React, { useState } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  ChevronRight,
  Flame,
  Sun,
  Snowflake,
  Plus,
  X,
  UserPlus,
  Briefcase,
  Tag,
  Globe,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  UserCheck,
  Upload,
  Paperclip,
} from "lucide-react";
import { Client, ClientStatus, LeadType } from "../types";

interface ClientListProps {
  clients: Client[];
  allClients?: Client[];
  onSelectClient: (client: Client) => void;
  onAddClient: (
    clientData: Omit<Client, "id" | "joinedDate" | "lastContact" | "avatar"> & {
      projectName?: string;
      onboardingDate?: string;
      clientType?: "New" | "Existing";
    },
  ) => void;
  onDeleteClient?: (id: string) => void;
  onOnboardClient?: (
    id: string,
    onboardingData: {
      name: string;
      email: string;
      phone: string;
      clientType: "New" | "Existing";
      status: ClientStatus;
      projectName: string;
      projectDescription: string;
      onboardingDate: string;
      deadline: string;
      scopeDocument: string;
    },
  ) => void;
  title?: string;
}

const ClientList: React.FC<ClientListProps> = ({
  clients,
  onSelectClient,
  onAddClient,
  onDeleteClient,
  onOnboardClient,
  allClients = [],
  title = "Clients",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>("All");
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardingLeadId, setOnboardingLeadId] = useState<string | null>(null);
  const [isNameDropdownOpen, setIsNameDropdownOpen] = useState(false);
  const [nameSearch, setNameSearch] = useState("");

  const [onboardingData, setOnboardingData] = useState({
    name: "",
    email: "",
    phone: "",
    clientType: "New" as "New" | "Existing",
    status: "Active" as ClientStatus,
    projectName: "",
    projectDescription: "",
    onboardingDate: new Date().toISOString().split("T")[0],
    deadline: "",
    scopeDocument: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: (title === "Leads" ? "Lead" : "Active") as ClientStatus,
    leadType: (title === "Leads" ? "Warm" : undefined) as LeadType | undefined,
    industry: "",
    notes: "",
    projectName: "",
    onboardingDate: new Date().toISOString().split("T")[0],
    clientType: "New" as "New" | "Existing",
    website: "",
  });

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOnboardClient && onboardingLeadId) {
      onOnboardClient(onboardingLeadId, onboardingData);
      setShowOnboardModal(false);
      setOnboardingLeadId(null);
      setOnboardingData({
        name: "",
        email: "",
        phone: "",
        clientType: "New",
        status: "Active",
        projectName: "",
        projectDescription: "",
        onboardingDate: new Date().toISOString().split("T")[0],
        deadline: "",
        scopeDocument: "",
      });
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || client.status === filterStatus;
    let matchesLeadType = true;
    if (title === "Leads") {
      matchesLeadType =
        leadTypeFilter === "All" || client.leadType === leadTypeFilter;
    }
    return matchesSearch && matchesStatus && matchesLeadType;
  });

  const getStatusBadge = (client: Client) => {
    if (client.status === "Lead" && client.leadType) {
      switch (client.leadType) {
        case "Hot":
          return {
            label: "Hot",
            className: "bg-error/10 text-error border-error/20",
            icon: <Flame size={12} strokeWidth={3} />,
          };
        case "Warm":
          return {
            label: "Warm",
            className: "bg-warning/10 text-warning border-warning/20",
            icon: <Sun size={12} strokeWidth={3} />,
          };
        case "Cold":
          return {
            label: "Cold",
            className: "bg-info/10 text-info border-info/20",
            icon: <Snowflake size={12} strokeWidth={3} />,
          };
        default:
          return {
            label: "Lead",
            className: "bg-primary/10 text-primary border-primary/20",
            icon: null,
          };
      }
    }

    switch (client.status) {
      case "Lead":
        return {
          label: "Lead",
          className: "bg-info/10 text-info border-info/20",
          icon: null,
        };
      case "Active":
        return {
          label: "Active",
          className: "bg-success/10 text-success border-success/20",
          icon: null,
        };
      case "Pending":
        return {
          label: "Pending",
          className: "bg-slate-100 text-slate-500 border-slate-200",
          icon: null,
        };
      case "Churned":
        return {
          label: "Churned",
          className: "bg-slate-200 text-slate-400 border-slate-300",
          icon: null,
        };
      case "Inactive":
        return {
          label: "Inactive",
          className: "bg-slate-100 text-slate-400 border-slate-200",
          icon: null,
        };
      default:
        return {
          label: client.status,
          className: "bg-slate-100 text-slate-700 border-slate-200",
          icon: null,
        };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddClient) {
      const submissionData = {
        ...formData,
        company: formData.company || "Independent",
        industry: formData.industry || "Unknown",
      };
      onAddClient(submissionData);
      setShowAddModal(false);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: (title === "Leads" ? "Lead" : "Active") as ClientStatus,
        leadType: (title === "Leads" ? "Warm" : undefined) as
          | LeadType
          | undefined,
        industry: "",
        notes: "",
        projectName: "",
        onboardingDate: new Date().toISOString().split("T")[0],
        clientType: "New" as "New" | "Existing",
      });
    }
  };

  return (
    <div className="w-full relative">
      <div className="space-y-5 animate-fade-in w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="max-w-2xl">
            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-primary tracking-tighter mb-2">
              {title}
            </h2>
            <p className="text-xs md:text-sm text-textMuted font-medium leading-relaxed">
              Manage your network of {title.toLowerCase()} and strategic
              partnerships.
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-[11px] font-black uppercase tracking-[0.25em] shadow-lg active:scale-95 group"
            >
              <Plus
                size={18}
                strokeWidth={3}
                className="group-hover:rotate-90 transition-transform"
              />
              Add {title === "Leads" ? "Lead" : "Client"}
            </button>
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-white p-2 md:p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto no-scrollbar">
            {title === "Leads" && (
              <div className="relative">
                <button
                  onClick={() => setIsTierDropdownOpen(!isTierDropdownOpen)}
                  className="flex items-center justify-between gap-3 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#18254D] hover:bg-white hover:border-slate-200 transition-all min-w-[160px] shadow-sm shadow-slate-200/50 group"
                >
                  <span>
                    {leadTypeFilter === "All"
                      ? "All Lead Status"
                      : leadTypeFilter}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={3}
                    className={`transition-transform duration-300 ${isTierDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isTierDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[80]"
                      onClick={() => setIsTierDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 z-[90] animate-fade-in-up origin-top">
                      {["All", "Hot", "Warm", "Cold"].map((tier) => (
                        <button
                          key={tier}
                          onClick={() => {
                            setLeadTypeFilter(tier);
                            setIsTierDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                            leadTypeFilter === (tier === "All" ? "All" : tier)
                              ? "bg-[#18254D] text-white"
                              : "text-[#18254D] hover:bg-slate-50"
                          }`}
                        >
                          {tier === "All" ? "All Tiers" : tier}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    Identity
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    {title === "Leads" ? "Lead Status" : "Status"}
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    {title === "Leads" ? "Note" : "Industry Sector"}
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    Last Pulse
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    Control
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => {
                  const status = getStatusBadge(client);
                  return (
                    <tr
                      key={client.id}
                      onClick={() => onSelectClient(client)}
                      className="group hover:bg-slate-50/50 cursor-pointer transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl border-2 border-slate-50 shadow-lg shrink-0">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm text-primary tracking-tight leading-none mb-1 group-hover:text-secondary transition-colors">
                              {client.name}
                            </div>
                            {title !== "Leads" && (
                              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">
                                {client.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span
                            className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase flex items-center gap-2 shadow-sm transition-all ${status.className}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                            {client.status === "Lead" ? (
                              <Tag size={16} className="text-secondary" />
                            ) : (
                              <Briefcase size={16} className="text-slate-400" />
                            )}
                          </div>
                          <span className="text-sm font-bold text-primary truncate max-w-[200px]">
                            {client.status === "Lead"
                              ? client.notes || client.industry
                              : client.industry}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-slate-400 text-right font-black uppercase tracking-widest">
                        {new Date(client.lastContact).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className="flex justify-end gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {onOnboardClient && client.status === "Lead" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOnboardingLeadId(client.id);
                                setOnboardingData({
                                  name: client.name,
                                  email: client.email,
                                  phone: client.phone,
                                  clientType: "New",
                                });
                                setShowOnboardModal(true);
                              }}
                              className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-90 shadow-sm"
                              title="Convert to Client"
                            >
                              <UserCheck size={18} />
                            </button>
                          )}
                          {onDeleteClient && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClient(client.id);
                              }}
                              className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-300 hover:text-error hover:border-error hover:bg-error/5 transition-all active:scale-90 shadow-sm"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="w-14 h-14 bg-slate-50 text-slate-200 p-4 rounded-xl mb-4 shadow-inner flex items-center justify-center mx-auto">
                        <Search size={32} />
                      </div>
                      <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">
                        Zero Results
                      </p>
                      <p className="text-sm font-medium text-slate-400 mt-2">
                        No matching records detected in this segment.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in my-auto flex flex-col">
            <div className="bg-primary p-6 text-white relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-10 right-10 p-2 hover:bg-white/10 rounded-2xl transition-colors"
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
                    New {title === "Leads" ? "Lead" : "Client"}
                  </h3>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
              {title !== "Leads" && (
                <div className="space-y-3 pb-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                    Client Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-all group has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="clientType"
                          value="New"
                          checked={formData.clientType === "New"}
                          onChange={() =>
                            setFormData({ ...formData, clientType: "New" })
                          }
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-primary transition-all"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary leading-none">
                          New Client
                        </p>
                        <p className="text-[9px] text-textMuted font-bold mt-1">
                          First-time engagement
                        </p>
                      </div>
                    </label>

                    <label className="flex-1 flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-all group has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="clientType"
                          value="Existing"
                          checked={formData.clientType === "Existing"}
                          onChange={() =>
                            setFormData({ ...formData, clientType: "Existing" })
                          }
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-primary transition-all"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary leading-none">
                          Existing Client
                        </p>
                        <p className="text-[9px] text-textMuted font-bold mt-1">
                          Repeat organization
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Onboarding Date and Project Name removed as requested */}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                    {title === "Leads" ? "Full Name" : "Client Name"}
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      placeholder={
                        formData.clientType === "Existing"
                          ? "Search existing clients..."
                          : "e.g. Anand Kumar"
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formData.clientType === "Existing") {
                          setIsNameDropdownOpen(true);
                          setNameSearch(e.target.value);
                        }
                      }}
                      onFocus={() => {
                        if (formData.clientType === "Existing") {
                          setIsNameDropdownOpen(true);
                        }
                      }}
                    />

                    {formData.clientType === "Existing" &&
                      isNameDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 z-[110] max-h-60 overflow-y-auto animate-fade-in-up">
                          {allClients
                            .filter((c) =>
                              c.name
                                .toLowerCase()
                                .includes(nameSearch.toLowerCase()),
                            )
                            .map((client) => (
                              <button
                                key={client.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    name: client.name,
                                    company: client.company,
                                    email: client.email,
                                    phone: client.phone,
                                    industry: client.industry,
                                  });
                                  setIsNameDropdownOpen(false);
                                  setNameSearch("");
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                              >
                                <div>
                                  <p className="text-sm font-black text-primary group-hover:text-secondary">
                                    {client.name}
                                  </p>
                                  <p className="text-[10px] text-textMuted font-bold">
                                    {client.company}
                                  </p>
                                </div>
                                <ChevronRight
                                  size={14}
                                  className="text-slate-300 group-hover:text-secondary transition-colors"
                                />
                              </button>
                            ))}
                          {allClients.filter((c) =>
                            c.name
                              .toLowerCase()
                              .includes(nameSearch.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-4 py-3 text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                No clients found
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    {formData.clientType === "Existing" &&
                      isNameDropdownOpen && (
                        <div
                          className="fixed inset-0 z-[105]"
                          onClick={() => setIsNameDropdownOpen(false)}
                        />
                      )}
                  </div>
                </div>

                {/* Company Name removed as requested */}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                    Email ID
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. anand.kumar@fintech.in"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 000..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                {title === "Leads" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                      Website Url
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://www.company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </div>
                )}

                {title === "Leads" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                      Lead Status
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Hot", "Warm", "Cold"] as LeadType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              leadType: type,
                            })
                          }
                          className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                            formData.leadType === type
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
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {title === "Leads" && (
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                      Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add any additional context..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold resize-none"
                      value={formData.notes || formData.industry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notes: e.target.value,
                          industry: e.target.value, // Keeping industry in sync for backward compatibility if needed
                        })
                      }
                    />
                  </div>
                )}
                {/* Client Status added as requested */}
                {title !== "Leads" && (
                  <div className="space-y-3 pb-2 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                      Client Status
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {(["Active", "Inactive"] as const).map((status) => (
                        <label
                          key={status}
                          className={`flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-all group has-[:checked]:bg-primary/5 has-[:checked]:border-primary`}
                        >
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name="clientStatusManual"
                              value={status}
                              checked={formData.status === status}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  status: status as ClientStatus,
                                })
                              }
                              className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-primary transition-all"
                            />
                            <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-primary leading-none">
                              {status}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#18254D] text-white rounded-xl hover:bg-slate-800 text-[12px] font-black uppercase tracking-[0.4em] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  Add {title === "Leads" ? "Lead" : "Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in my-auto flex flex-col">
            <div className="bg-[#18254D] p-7 text-white relative">
              <button
                onClick={() => setShowOnboardModal(false)}
                className="absolute top-10 right-10 p-2 hover:bg-white/10 rounded-2xl transition-colors"
              >
                <X size={28} strokeWidth={3} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <UserPlus size={28} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight leading-none">
                    New Client
                  </h3>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleOnboardSubmit}
              className="p-6 md:p-8 space-y-6"
            >
              {/* Client Type selection */}
              <div className="space-y-3 pb-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                  Client Type
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-[#18254D] transition-all group has-[:checked]:bg-[#18254D]/5 has-[:checked]:border-[#18254D]">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="clientTypeOnboard"
                        value="New"
                        checked={onboardingData.clientType === "New"}
                        onChange={() =>
                          setOnboardingData({
                            ...onboardingData,
                            clientType: "New",
                          })
                        }
                        className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-full checked:border-[#18254D] transition-all"
                      />
                      <div className="absolute w-3 h-3 bg-[#18254D] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary leading-none">
                        New Client
                      </p>
                      <p className="text-[10px] text-textMuted font-bold mt-1">
                        First-time engagement
                      </p>
                    </div>
                  </label>

                  <label className="flex-1 flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-[#18254D] transition-all group has-[:checked]:bg-[#18254D]/5 has-[:checked]:border-[#18254D]">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="clientTypeOnboard"
                        value="Existing"
                        checked={onboardingData.clientType === "Existing"}
                        onChange={() =>
                          setOnboardingData({
                            ...onboardingData,
                            clientType: "Existing",
                          })
                        }
                        className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-full checked:border-[#18254D] transition-all"
                      />
                      <div className="absolute w-3 h-3 bg-[#18254D] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary leading-none">
                        Existing Client
                      </p>
                      <p className="text-[10px] text-textMuted font-bold mt-1">
                        Repeat organization
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                    Client Name
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      placeholder={
                        onboardingData.clientType === "Existing"
                          ? "Search existing clients..."
                          : "e.g. Anand Kumar"
                      }
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                      value={onboardingData.name}
                      onChange={(e) => {
                        setOnboardingData({
                          ...onboardingData,
                          name: e.target.value,
                        });
                        if (onboardingData.clientType === "Existing") {
                          setIsNameDropdownOpen(true);
                          setNameSearch(e.target.value);
                        }
                      }}
                      onFocus={() => {
                        if (onboardingData.clientType === "Existing") {
                          setIsNameDropdownOpen(true);
                        }
                      }}
                    />

                    {onboardingData.clientType === "Existing" &&
                      isNameDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 z-[110] max-h-60 overflow-y-auto animate-fade-in-up">
                          {allClients
                            .filter((c) =>
                              c.name
                                .toLowerCase()
                                .includes(nameSearch.toLowerCase()),
                            )
                            .map((client) => (
                              <button
                                key={client.id}
                                type="button"
                                onClick={() => {
                                  setOnboardingData({
                                    ...onboardingData,
                                    name: client.name,
                                    email: client.email,
                                    phone: client.phone,
                                  });
                                  setIsNameDropdownOpen(false);
                                  setNameSearch("");
                                }}
                                className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                              >
                                <div>
                                  <p className="text-sm font-black text-primary group-hover:text-secondary">
                                    {client.name}
                                  </p>
                                  <p className="text-[11px] text-textMuted font-bold">
                                    {client.company}
                                  </p>
                                </div>
                                <ChevronRight
                                  size={16}
                                  className="text-slate-300 group-hover:text-secondary transition-colors"
                                />
                              </button>
                            ))}
                        </div>
                      )}

                    {onboardingData.clientType === "Existing" &&
                      isNameDropdownOpen && (
                        <div
                          className="fixed inset-0 z-[105]"
                          onClick={() => setIsNameDropdownOpen(false)}
                        />
                      )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                    Email ID
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. anand.kumar@fintech.in"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                    value={onboardingData.email}
                    onChange={(e) =>
                      setOnboardingData({
                        ...onboardingData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 000..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                    value={onboardingData.phone}
                    onChange={(e) =>
                      setOnboardingData({
                        ...onboardingData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3 pb-2 md:col-span-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                    Client Status
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(["Active", "Inactive"] as const).map((status) => (
                      <label
                        key={status}
                        className={`flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-[#18254D] transition-all group has-[:checked]:bg-[#18254D]/5 has-[:checked]:border-[#18254D]`}
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="clientStatusOnboard"
                            value={status}
                            checked={onboardingData.status === status}
                            onChange={() =>
                              setOnboardingData({
                                ...onboardingData,
                                status: status as ClientStatus,
                              })
                            }
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-[#18254D] transition-all"
                          />
                          <div className="absolute w-2.5 h-2.5 bg-[#18254D] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-primary leading-none">
                            {status}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Project Details Section Added */}
                <div className="md:col-span-2 pt-4 border-t border-slate-100 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <Briefcase size={18} strokeWidth={3} />
                    </div>
                    <h4 className="text-sm font-black text-primary uppercase tracking-wider">
                      Project Details
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                        Project Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Website Redesign"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                        value={onboardingData.projectName}
                        onChange={(e) =>
                          setOnboardingData({
                            ...onboardingData,
                            projectName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                        Scope Document
                      </label>
                      <div className="relative group">
                        <input
                          type="file"
                          id="scope-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setOnboardingData({
                                ...onboardingData,
                                scopeDocument: file.name,
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor="scope-upload"
                          className={`w-full flex items-center justify-between px-5 py-4 bg-slate-50 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                            onboardingData.scopeDocument
                              ? "border-emerald-200 bg-emerald-50/30"
                              : "border-slate-200 hover:border-secondary hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                onboardingData.scopeDocument
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-200 text-slate-400 group-hover:bg-secondary group-hover:text-white"
                              } transition-all`}
                            >
                              {onboardingData.scopeDocument ? (
                                <Paperclip size={16} strokeWidth={3} />
                              ) : (
                                <Upload size={16} strokeWidth={3} />
                              )}
                            </div>
                            <span
                              className={`text-sm font-bold ${
                                onboardingData.scopeDocument
                                  ? "text-emerald-700"
                                  : "text-slate-400 group-hover:text-primary"
                              }`}
                            >
                              {onboardingData.scopeDocument ||
                                "Upload Document"}
                            </span>
                          </div>
                          {onboardingData.scopeDocument && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOnboardingData({
                                  ...onboardingData,
                                  scopeDocument: "",
                                });
                              }}
                              className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-500 transition-colors"
                            >
                              <X size={16} strokeWidth={3} />
                            </button>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                        Project Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Briefly describe the project scope..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold resize-none"
                        value={onboardingData.projectDescription}
                        onChange={(e) =>
                          setOnboardingData({
                            ...onboardingData,
                            projectDescription: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                        Onboarding Date
                      </label>
                      <input
                        required
                        type="date"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                        value={onboardingData.onboardingDate}
                        onChange={(e) =>
                          setOnboardingData({
                            ...onboardingData,
                            onboardingDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                        Project Deadline
                      </label>
                      <input
                        required
                        type="date"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-sm font-bold"
                        value={onboardingData.deadline}
                        onChange={(e) =>
                          setOnboardingData({
                            ...onboardingData,
                            deadline: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-5 bg-[#18254D] text-white rounded-xl hover:bg-slate-800 text-[13px] font-black uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
