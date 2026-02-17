export const MOCK_CLIENTS = [
  {
    id: "c1",
    name: "Anand Kumar",
    company: "FinTech Solutions Pvt Ltd",
    email: "anand.kumar@fintech.in",
    phone: "+91 98765 43210",
    status: "Lead",
    leadType: "Hot",
    avatar: "Anand.png",
    joinedDate: "2023-11-15",
    lastContact: "2023-11-20",
    industry: "Financial Services",
    notes:
      "Very interested in our API integration. Needs a demo by next Tuesday. Decision maker.",
  },
  {
    id: "c2",
    name: "Vikram Malhotra",
    company: "Malhotra Logistics",
    email: "vikram@malhotra.com",
    phone: "+91 98123 45678",
    status: "Lead",
    leadType: "Warm",
    avatar: "https://picsum.photos/100/100?random=12",
    joinedDate: "2023-11-10",
    lastContact: "2023-11-18",
    industry: "Logistics",
    notes:
      "Checking budget for the next quarter. Currently using a manual system. Open to a pilot program.",
  },
  {
    id: "c3",
    name: "Kavita Rao",
    company: "Urban Health Care",
    email: "kavita.rao@urbanhealth.org",
    phone: "+91 99887 76655",
    status: "Lead",
    leadType: "Cold",
    avatar: "https://picsum.photos/100/100?random=13",
    joinedDate: "2023-10-05",
    lastContact: "2023-11-10",
    industry: "Healthcare",
    notes:
      "Early stage discussion. Need to follow up in 3 months once their new facility is ready.",
  },
  {
    id: "c4",
    name: "Suresh Raina",
    company: "Nexus Real Estate",
    email: "suresh@nexus.co.in",
    phone: "+91 97654 32109",
    status: "Active",
    avatar: "https://picsum.photos/100/100?random=14",
    joinedDate: "2023-01-10",
    lastContact: "2023-11-15",
    industry: "Real Estate",
    notes:
      "Long-term client. Satisfied with the current CRM flow. Looking to upgrade to the enterprise plan.",
  },
];

export const MOCK_FOLLOW_UPS = [
  {
    id: "f1",
    clientId: "c2",
    title: "Call James regarding logistics MVP",
    dueDate: new Date().toISOString(), // Today
    status: "pending",
    priority: "High",
  },
  {
    id: "f2",
    clientId: "c1",
    title: "Send security audit report",
    dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: "pending",
    priority: "Medium",
  },
  {
    id: "f3",
    clientId: "c3",
    title: "Follow up on dashboard latency ticket",
    dueDate: new Date(Date.now() + 172800000).toISOString(), // In 2 days
    status: "pending",
    priority: "Low",
  },
];

export const MOCK_PROJECTS = [
  {
    id: "p1",
    clientId: "c1",
    name: "Security Infrastructure Audit",
    status: "In Progress",
    budget: 45000,
    deadline: "2023-12-15",
    progress: 65,
  },
];

export const MOCK_ACTIVITIES = [
  {
    id: "a1",
    clientId: "c1",
    type: "email",
    description: "Sent weekly security report",
    date: "2023-10-25T14:30:00",
  },
  {
    id: "a2",
    clientId: "c2",
    type: "call",
    description: "Introductory call with James",
    date: "2023-10-28T10:00:00",
  },
];

export const MOCK_ENQUIRIES = [
  {
    id: "e1",
    name: "Tony Stark",
    email: "tony@starkindustries.com",
    phone: "+1 (555) 999-8888",
    website: "https://starkindustries.com",
    message:
      "We are looking for a secure CRM solution to manage our defense contracts. Needs to be air-gapped compliant.",
    date: "2023-10-29T09:15:00",
    status: "new",
  },
];

export const ANALYTICS_DATA = [
  { name: "May", enquiries: 12, clients: 8, projects: 2, engagement: 65 },
  { name: "Jun", enquiries: 18, clients: 10, projects: 4, engagement: 72 },
  { name: "Jul", enquiries: 15, clients: 12, projects: 5, engagement: 70 },
  { name: "Aug", enquiries: 24, clients: 15, projects: 6, engagement: 78 },
  { name: "Sep", enquiries: 32, clients: 18, projects: 9, engagement: 82 },
  { name: "Oct", enquiries: 28, clients: 22, projects: 12, engagement: 88 },
];

export const QUARTERLY_ANALYTICS_DATA = [
  { name: "Q1 2023", enquiries: 45, clients: 32, projects: 8, engagement: 62 },
  { name: "Q2 2023", enquiries: 58, clients: 40, projects: 12, engagement: 70 },
  { name: "Q3 2023", enquiries: 75, clients: 55, projects: 18, engagement: 79 },
  { name: "Q4 2023", enquiries: 88, clients: 68, projects: 24, engagement: 85 },
];
