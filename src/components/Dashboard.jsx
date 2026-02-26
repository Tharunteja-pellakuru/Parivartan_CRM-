import React, { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Briefcase,
  Inbox,
  CheckCircle2,
  Clock,
  User,
  Activity,
  UserPlus,
  Bell,
  ChevronRight,
  Trash2,
  ListChecks,
  X,
} from "lucide-react";
import { ANALYTICS_DATA, QUARTERLY_ANALYTICS_DATA } from "../utils/constants";
import anandImg from "../assets/Anand.png";

const StatCard = ({ title, value, trend, trendUp, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between overflow-hidden relative">
    <div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
          {React.cloneElement(icon, { size: 20 })}
        </div>
        {trend && (
          <span
            className={`flex items-center text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full whitespace-nowrap ${trendUp ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
          >
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-textMuted text-[11px] font-semibold uppercase tracking-wider relative z-10 truncate">
        {title}
      </h3>
      <div className="flex items-baseline gap-2 mt-1.5 relative z-10">
        <p className="text-2xl sm:text-3xl font-bold text-primary tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const Dashboard = ({
  followUps,
  clients,
  enquiries,
  onSelectFollowUp,
  onViewAllFollowUps,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState("tasks");
  const [chartInterval, setChartInterval] = useState("monthly");
  const dropdownRef = useRef(null);

  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isMissed = (date) => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const newEnquiries = enquiries.filter((e) => e.status === "new");
  const todayTasks = followUps.filter(
    (f) => isToday(f.dueDate) && f.status === "pending",
  );
  const missedTasks = followUps.filter(
    (f) => isMissed(f.dueDate) && f.status === "pending",
  );
  const totalNotifications =
    newEnquiries.length + todayTasks.length + missedTasks.length;

  const newEnquiriesCount = newEnquiries.length;
  const leadCount = clients.filter((c) => c.status === "Lead").length;
  const clientCount = clients.filter((c) => c.status === "Active").length;

  const totalPool = leadCount + clientCount;
  const engagementRate =
    totalPool > 0 ? Math.round((clientCount / totalPool) * 100) : 0;

  const chartData =
    chartInterval === "monthly" ? ANALYTICS_DATA : QUARTERLY_ANALYTICS_DATA;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative">
      <div className="space-y-6 md:space-y-8 animate-fade-in relative z-0">
        <div className="flex flex-row flex-wrap justify-between items-center gap-6">
          <div className="max-w-2xl shrink-0">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#18254D] tracking-tighter mb-2">
              Welcome back, Anand.
            </h2>
            <p className="text-sm md:text-base text-textMuted font-medium leading-relaxed">
              Let's build something remarkable today.
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-full border border-slate-200 shadow-sm w-auto relative z-20">
            <div
              className="relative flex-1 lg:flex-initial lg:w-10 shrink-0"
              ref={dropdownRef}
            >
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`h-11 md:h-12 w-full rounded-full transition-all relative flex items-center justify-center shrink-0 ${
                  showNotifications
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary hover:bg-slate-50"
                }`}
              >
                <div className="relative">
                  <Bell size={18} strokeWidth={2.5} />
                  {totalNotifications > 0 && !showNotifications && (
                    <span className="bg-[#18254D] text-white text-[10px] font-bold rounded-full h-4 min-w-[1rem] flex items-center justify-center shadow-lg absolute -top-1.5 -right-1.5 border border-white">
                      {totalNotifications}
                    </span>
                  )}
                </div>
              </button>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-sm"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="fixed lg:absolute left-1/2 md:left-auto lg:right-0 -translate-x-1/2 lg:translate-x-0 mt-3 w-[280px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden animate-pop z-[100] top-24 lg:top-auto">
                    <div className="p-4 pb-2 border-b border-black/5 bg-black/5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">
                          Notifications
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-slate-200 rounded-lg text-slate-400"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex p-1 bg-slate-200/50 rounded-xl">
                        <button
                          onClick={() => setNotifTab("tasks")}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${notifTab === "tasks" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
                        >
                          Tasks
                        </button>
                        <button
                          onClick={() => setNotifTab("enquiries")}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${notifTab === "enquiries" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
                        >
                          Enquiries
                        </button>
                      </div>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto p-2.5 no-scrollbar space-y-1.5">
                      {/* Content omitted for brevity, logic remains same */}
                      {notifTab === "tasks" &&
                        (todayTasks.length + missedTasks.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                              No pending tasks
                            </p>
                          </div>
                        ) : (
                          <>
                            {missedTasks.map((f) => (
                              <div
                                key={f.id}
                                onClick={() =>
                                  onSelectFollowUp(
                                    clients.find((c) => c.id === f.clientId),
                                    "activity",
                                  )
                                }
                                className="p-2.5 bg-error/5 border border-error/10 rounded-xl cursor-pointer hover:bg-white hover:border-error/20 transition-all"
                              >
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="text-[8px] font-bold text-error uppercase tracking-widest">
                                    Missed
                                  </span>
                                  <span className="text-[8px] text-slate-400 font-semibold">
                                    {new Date(f.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-[11px] font-bold text-primary truncate">
                                  {f.title}
                                </p>
                              </div>
                            ))}
                            {todayTasks.map((f) => (
                              <div
                                key={f.id}
                                onClick={() =>
                                  onSelectFollowUp(
                                    clients.find((c) => c.id === f.clientId),
                                    "activity",
                                  )
                                }
                                className="p-2.5 bg-white border border-slate-100 rounded-xl cursor-pointer hover:border-secondary transition-all"
                              >
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="text-[8px] font-bold text-secondary uppercase tracking-widest">
                                    {f.priority} Priority
                                  </span>
                                  <span className="text-[8px] text-slate-400 font-semibold">
                                    {new Date(f.dueDate).toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" },
                                    )}
                                  </span>
                                </div>
                                <p className="text-[11px] font-bold text-primary truncate">
                                  {f.title}
                                </p>
                              </div>
                            ))}
                          </>
                        ))}
                      {notifTab === "enquiries" &&
                        (newEnquiries.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              No new enquiries
                            </p>
                          </div>
                        ) : (
                          newEnquiries.map((e) => (
                            <div
                              key={e.id}
                              onClick={() => onNavigate("enquiries")}
                              className="p-2.5 bg-white border border-slate-100 rounded-xl cursor-pointer hover:border-secondary transition-all"
                            >
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-[7.5px] font-bold text-secondary uppercase tracking-widest">
                                  New Enquiry
                                </span>
                                <span className="text-[7.5px] text-slate-400 font-bold">
                                  {new Date(e.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-primary truncate">
                                {e.name}
                              </p>
                              <p className="text-[9px] text-slate-400 truncate mt-0.5">
                                {e.message}
                              </p>
                            </div>
                          ))
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="w-[1px] h-6 bg-slate-100 mx-1" />
            <div className="flex-1 lg:flex-initial flex items-center justify-center sm:justify-end gap-2 px-2 min-w-max">
              <div className="text-right flex flex-col items-end">
                <p className="text-xs font-bold text-primary leading-none">
                  Anand
                </p>
                <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-0.5">
                  Root
                </p>
              </div>
              <img
                src={anandImg}
                alt="Profile"
                className="w-8 h-8 md:w-9 md:h-9 rounded-lg object-cover border border-slate-100 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <StatCard
            title="New Enquiries"
            value={newEnquiriesCount.toString()}
            trend="+4 today"
            trendUp={true}
            icon={<Inbox />}
          />
          <StatCard
            title="Total Leads"
            value={leadCount.toString()}
            trend="Steady"
            trendUp={true}
            icon={<UserPlus />}
          />
          <StatCard
            title="Lead → Client Conversion"
            value={clientCount.toString()}
            trend="Retained"
            trendUp={true}
            icon={<Users />}
          />
          <StatCard
            title="Engagement Rate"
            value={`${engagementRate}%`}
            trend="Optimal"
            trendUp={true}
            icon={<Activity />}
          />
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col w-full h-[500px]">
              <h3 className="text-base font-bold text-primary tracking-tight mb-5">
                Today's Task
              </h3>
              <div className="space-y-4 flex-1 overflow-y-auto pr-1 no-scrollbar">
                {todayTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle2 size={24} className="text-slate-200 mb-3" />
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      All Caught Up
                    </p>
                  </div>
                ) : (
                  todayTasks.map((f) => {
                    const client = clients.find((c) => c.id === f.clientId);
                    return (
                      <div
                        key={f.id}
                        onClick={() =>
                          client && onSelectFollowUp(client, "activity")
                        }
                        className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-secondary transition-all cursor-pointer shadow-sm group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${f.priority === "High" ? "bg-error/10 text-error" : "bg-info/10 text-info"}`}
                          >
                            {f.priority}
                          </span>
                          <span className="text-[9px] text-textMuted font-bold flex items-center gap-1 uppercase">
                            <Clock size={10} />{" "}
                            {new Date(f.dueDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-primary group-hover:text-secondary truncate">
                          {f.title}
                        </h4>
                      </div>
                    );
                  })
                )}
              </div>
              <button
                onClick={onViewAllFollowUps}
                className="w-full text-center text-[10px] text-primary font-bold uppercase tracking-[0.2em] bg-slate-100 py-4 rounded-xl hover:bg-slate-200 transition-all mt-6 shrink-0"
              >
                View All Tasks
              </button>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col w-full h-[500px]">
              <h3 className="text-base font-bold text-error tracking-tighter mb-5 flex items-center gap-2">
                Missed Tasks
                {missedTasks.length > 0 && (
                  <span className="bg-error/10 text-error text-[10px] px-2 py-0.5 rounded-full">
                    {missedTasks.length}
                  </span>
                )}
              </h3>
              <div className="space-y-4 flex-1 overflow-y-auto pr-1 no-scrollbar">
                {missedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle2 size={24} className="text-slate-200 mb-3" />
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      No Missed Tasks
                    </p>
                  </div>
                ) : (
                  missedTasks.map((f) => {
                    const client = clients.find((c) => c.id === f.clientId);
                    return (
                      <div
                        key={f.id}
                        onClick={() =>
                          client && onSelectFollowUp(client, "activity")
                        }
                        className="p-5 bg-error/5 border border-error/10 rounded-2xl hover:bg-white hover:border-error transition-all cursor-pointer shadow-sm group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-white/50 text-error border border-error/10`}
                          >
                            Overdue
                          </span>
                          <span className="text-[8px] text-error/60 font-black flex items-center gap-1 uppercase">
                            <Clock size={10} />{" "}
                            {new Date(f.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-primary group-hover:text-error truncate">
                          {f.title}
                        </h4>
                      </div>
                    );
                  })
                )}
              </div>
              <button
                onClick={onViewAllFollowUps}
                className="w-full text-center text-[10px] text-error font-bold uppercase tracking-[0.2em] bg-error/5 py-4 rounded-xl hover:bg-error/10 transition-all mt-6 shrink-0"
              >
                View All Tasks
              </button>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-primary tracking-tighter">
                  Engagement Rate
                </h3>
              </div>
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setChartInterval("monthly")}
                  className={`text-[9px] font-bold px-4 py-1.5 rounded-md transition-all ${chartInterval === "monthly" ? "bg-white text-primary shadow-sm" : "text-textMuted"}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setChartInterval("quarterly")}
                  className={`text-[9px] font-bold px-4 py-1.5 rounded-md transition-all ${chartInterval === "quarterly" ? "bg-white text-primary shadow-sm" : "text-textMuted"}`}
                >
                  Quarter
                </button>
              </div>
            </div>
            <div className="h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 9, fontWeight: 800 }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 9, fontWeight: 800 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontSize: "10px",
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="enquiries"
                    stroke="#1F3A5F"
                    fill="#1F3A5F"
                    fillOpacity={0.05}
                    strokeWidth={2.5}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clients"
                    stroke="#2EC4B6"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
