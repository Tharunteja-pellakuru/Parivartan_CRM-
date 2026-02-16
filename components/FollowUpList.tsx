import React, { useState } from "react";
import {
  Clock,
  Bell,
  CheckCircle2,
  Plus,
  MessageSquare,
  Phone,
  X,
  Check,
} from "lucide-react";
import { FollowUp, Client, Priority } from "../types";

interface FollowUpListProps {
  followUps: FollowUp[];
  clients: Client[];
  onToggleStatus: (id: string) => void;
  onAddFollowUp: (data: Omit<FollowUp, "id" | "status">) => void;
  onSelectClient: (client: Client, tab?: string) => void;
}

const FollowUpList: React.FC<FollowUpListProps> = ({
  followUps,
  clients,
  onToggleStatus,
  onAddFollowUp,
  onSelectClient,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Overdue" | "Today" | "Upcoming"
  >("All");
  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium" as Priority,
  });

  const getClientById = (id: string) => clients.find((c) => c.id === id);
  const isOverdue = (date: string) =>
    new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isToday = (date: string) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFollowUp(formData);
    setShowAddModal(false);
    setFormData({
      clientId: "",
      title: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "Medium",
    });
  };

  const getPriorityBadge = (p: Priority) => {
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
    <div className="space-y-5 animate-fade-in w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="max-w-2xl">
          <h2 className="text-lg md:text-xl lg:text-2xl font-black text-primary tracking-tighter mb-1.5">
            Follow-Ups
          </h2>
          <p className="text-xs md:text-sm text-textMuted font-medium leading-relaxed">
            Stay on top of your client communications.
          </p>
        </div>
        <div className="w-full lg:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 group"
          >
            <Plus
              size={16}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform"
            />{" "}
            New Follow-Up
          </button>
        </div>
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto no-scrollbar">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full">
          {["All", "Overdue", "Today", "Upcoming"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`flex-1 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === f ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
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
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
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
                      className={`px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${getPriorityBadge(f.priority)}`}
                    >
                      {f.priority}
                    </span>
                    {overdue && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-error bg-error/10 px-2.5 py-0.5 rounded-md border border-error/20">
                        Overdue
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-sm font-black text-primary tracking-tight truncate ${f.status === "completed" ? "line-through opacity-50" : ""}`}
                  >
                    {f.title}
                  </h4>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1.5 text-[10px] text-textMuted font-black uppercase tracking-widest">
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
                    <p className="text-[12px] font-black text-primary truncate leading-none">
                      {client?.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {client?.company}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => client && onSelectClient(client, "activity")}
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

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-primary p-6 text-white">
              <h3 className="text-lg font-black tracking-tighter mb-1">
                New Task
              </h3>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                Schedule Follow-up
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <select
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold appearance-none"
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData({ ...formData, clientId: e.target.value })
                  }
                >
                  <option value="">Target Identity...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  required
                  type="text"
                  placeholder="Task Description"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="date"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                  <select
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as any,
                      })
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                  Deploy
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
