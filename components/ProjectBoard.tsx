import React, { useState } from "react";
import { MOCK_PROJECTS, MOCK_CLIENTS } from "../constants";
import { Project, ProjectStatus } from "../types";
import {
  Calendar,
  DollarSign,
  MoreVertical,
  Plus,
  Clock,
  LayoutGrid,
} from "lucide-react";

const COLUMNS: {
  id: ProjectStatus;
  title: string;
  color: string;
  dotColor: string;
  activeTabBg: string;
  activeTabText: string;
}[] = [
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

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const client = MOCK_CLIENTS.find((c) => c.id === project.clientId);

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

const ProjectBoard: React.FC = () => {
  const [activeStage, setActiveStage] = useState<ProjectStatus>("Planning");

  const activeColumn = COLUMNS.find((c) => c.id === activeStage)!;
  const filteredProjects = MOCK_PROJECTS.filter(
    (p) => p.status === activeStage,
  );

  return (
    <div className="space-y-5 animate-fade-in w-full h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="max-w-2xl">
          <h2 className="text-lg md:text-xl lg:text-2xl font-black text-primary tracking-tighter mb-2">
            Operations
          </h2>
          <p className="text-xs md:text-sm text-textMuted font-medium leading-relaxed">
            Global project pipeline and strategic delivery oversight.
          </p>
        </div>
        <div className="w-full lg:w-auto">
          <button className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-[11px] font-black uppercase tracking-[0.25em] shadow-lg active:scale-95">
            <Plus size={14} strokeWidth={3} /> New Deployment
          </button>
        </div>
      </div>

      {/* Stage Toggle Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {COLUMNS.map((column) => {
          const count = MOCK_PROJECTS.filter(
            (p) => p.status === column.id,
          ).length;
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
              <ProjectCard key={project.id} project={project} />
            ))}
            <button className="py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[10px] font-black uppercase tracking-widest hover:border-secondary hover:text-secondary hover:bg-secondary/[0.02] transition-all group flex flex-col items-center justify-center gap-2 min-h-[100px]">
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
            <button className="w-full max-w-sm py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[10px] font-black uppercase tracking-widest hover:border-secondary hover:text-secondary hover:bg-secondary/[0.02] transition-all group flex flex-col items-center justify-center gap-2">
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
  );
};

export default ProjectBoard;
