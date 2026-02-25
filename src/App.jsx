import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ClientList from "./components/ClientList";
import ClientDetail from "./components/ClientDetail";
import ProjectBoard from "./components/ProjectBoard";
import EnquiryList from "./components/EnquiryList";
import FollowUpList from "./components/FollowUpList";
import Settings from "./components/Settings";
import LoginPage from "./components/LoginPage";
import { Menu, Zap, X } from "lucide-react";
import Logo from "./components/Logo";
import {
  MOCK_CLIENTS,
  MOCK_ENQUIRIES,
  MOCK_FOLLOW_UPS,
  MOCK_ACTIVITIES,
  MOCK_PROJECTS,
} from "./utils/constants";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailTab, setDetailTab] = useState("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isSidebarCollapsed = false;

  // State management for data
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [enquiries, setEnquiries] = useState(MOCK_ENQUIRIES);
  const [followUps, setFollowUps] = useState(MOCK_FOLLOW_UPS);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("dashboard");
    setSelectedClient(null);
  };

  const handleClientSelect = (client, tab = "overview") => {
    setSelectedClient(client);
    setDetailTab(tab);
    setActiveTab("client-detail");
    setIsMobileSidebarOpen(false);
  };

  const handleBackToClients = () => {
    const returnTab = selectedClient?.status === "Lead" ? "leads" : "clients";
    setSelectedClient(null);
    setActiveTab(returnTab);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedClient(null);
    setDetailTab("overview");
    setIsMobileSidebarOpen(false);
  };

  const handleDeleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddClient = (data) => {
    const newClient = {
      id: `c-${Date.now()}`,
      ...data, // includes projectName, projectCategory, status, etc.
      avatar: `https://picsum.photos/100/100?random=${clients.length + 10}`,
      joinedDate: data.onboardingDate || new Date().toISOString().split("T")[0],
      lastContact: new Date().toISOString().split("T")[0],
      industry: data.projectCategory || data.industry || "Unknown",
      company: data.projectName || data.company || "Independent",
      notes:
        data.status === "Lead"
          ? data.notes
          : `${data.notes || ""}\n\n[Project Details]\nProject: ${data.projectName}\nStatus: ${data.projectStatus}\nDescription: ${data.projectDescription}\nDeadline: ${data.deadline}\nScope: ${data.scopeDocument}`,
    };
    setClients([newClient, ...clients]);
  };

  const handleOnboardClient = (id, onboardingData) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...onboardingData,
              status: onboardingData.status,
              isConverted: true,
              joinedDate: onboardingData.onboardingDate,
              industry: onboardingData.projectCategory || c.industry,
              company: onboardingData.projectName || c.company,
              notes: `${c.notes}\n\n[Project Onboarding]\nProject: ${onboardingData.projectName}\nStatus: ${onboardingData.projectStatus}\nDescription: ${onboardingData.projectDescription}\nDeadline: ${onboardingData.deadline}\nScope: ${onboardingData.scopeDocument}`,
            }
          : c,
      ),
    );
  };

  const handleUpdateClient = (updatedClient) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)),
    );
    setSelectedClient(updatedClient); // Sync current detail view
  };

  const handleDismissLead = (id) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Dismissed" } : c)),
    );
  };

  const handleRestoreLead = (id) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Lead", isConverted: false } : c,
      ),
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            followUps={followUps}
            clients={clients}
            enquiries={enquiries}
            onSelectFollowUp={handleClientSelect}
            onViewAllFollowUps={() => setActiveTab("followups")}
            onNavigate={handleTabChange}
          />
        );
      case "enquiries":
        return (
          <EnquiryList
            enquiries={enquiries}
            onPromote={(enquiry, type) => {
              const newClient = {
                id: `c-${Date.now()}`,
                name: enquiry.name,
                company: enquiry.website
                  ? enquiry.website.replace(/^https?:\/\//, "").split("/")[0]
                  : "Independent",
                email: enquiry.email,
                phone: enquiry.phone,
                status: "Lead",
                leadType: type,
                avatar: `https://picsum.photos/100/100?random=${clients.length + 10}`,
                joinedDate: new Date().toISOString().split("T")[0],
                lastContact: new Date().toISOString().split("T")[0],
                industry: "Unknown",
                notes: enquiry.message,
                website: enquiry.website,
              };
              setClients([newClient, ...clients]);
              setEnquiries((prev) => prev.filter((e) => e.id !== enquiry.id));
              setActiveTab("leads");
            }}
            onDismiss={(id) =>
              setEnquiries((prev) =>
                prev.map((e) =>
                  e.id === id ? { ...e, status: "dismissed" } : e,
                ),
              )
            }
            onHold={(id) =>
              setEnquiries((prev) =>
                prev.map((e) => (e.id === id ? { ...e, status: "hold" } : e)),
              )
            }
            onRestore={(id) =>
              setEnquiries((prev) =>
                prev.map((e) => (e.id === id ? { ...e, status: "new" } : e)),
              )
            }
            onDelete={(id) =>
              setEnquiries((prev) => prev.filter((e) => e.id !== id))
            }
            onDeleteAll={() =>
              setEnquiries((prev) =>
                prev.filter((e) => e.status !== "dismissed"),
              )
            }
            onUpdate={(updated) =>
              setEnquiries((prev) =>
                prev.map((e) => (e.id === updated.id ? updated : e)),
              )
            }
            onAdd={(data) => {
              const newEnquiry = {
                id: `e-${Date.now()}`,
                ...data,
                date: new Date().toISOString(),
                status: "new",
              };
              setEnquiries([newEnquiry, ...enquiries]);
            }}
          />
        );
      case "followups":
      case "followups-clients":
      case "followups-leads":
        return (
          <FollowUpList
            followUps={followUps}
            clients={clients}
            typeFilter={
              activeTab === "followups-clients"
                ? "Active"
                : activeTab === "followups-leads"
                  ? "Lead"
                  : "All"
            }
            onToggleStatus={(id) =>
              setFollowUps((prev) =>
                prev.map((f) =>
                  f.id === id
                    ? {
                        ...f,
                        status:
                          f.status === "completed" ? "pending" : "completed",
                      }
                    : f,
                ),
              )
            }
            onAddFollowUp={(data) =>
              setFollowUps([
                { id: `f-${Date.now()}`, status: "pending", ...data },
                ...followUps,
              ])
            }
            onSelectClient={handleClientSelect}
            onNavigate={handleTabChange}
          />
        );
      case "leads":
        return (
          <ClientList
            clients={clients.filter(
              (c) =>
                c.status === "Lead" ||
                c.status === "Dismissed" ||
                c.isConverted,
            )}
            onSelectClient={handleClientSelect}
            onDeleteClient={handleDeleteClient}
            onOnboardClient={handleOnboardClient}
            onDismissLead={handleDismissLead}
            onRestoreLead={handleRestoreLead}
            onAddClient={handleAddClient}
            onAddActivity={(data) =>
              setActivities([{ id: `a-${Date.now()}`, ...data }, ...activities])
            }
            allClients={clients}
            title="Leads"
          />
        );
      case "clients":
        return (
          <ClientList
            clients={clients.filter((c) => c.status === "Active")}
            onSelectClient={handleClientSelect}
            onDeleteClient={handleDeleteClient}
            onAddClient={handleAddClient}
            allClients={clients}
          />
        );
      case "client-detail":
        return selectedClient ? (
          <ClientDetail
            client={selectedClient}
            onBack={handleBackToClients}
            onUpdateClient={handleUpdateClient}
            onAddActivity={(data) =>
              setActivities([{ id: `a-${Date.now()}`, ...data }, ...activities])
            }
            activities={activities}
            initialTab={detailTab}
          />
        ) : (
          <ClientList clients={clients} onSelectClient={handleClientSelect} />
        );
      case "projects":
        return (
          <ProjectBoard
            projects={projects}
            clients={clients}
            onAddClient={handleAddClient}
            onAddProject={(projectData) =>
              setProjects([
                { id: `p-${Date.now()}`, ...projectData },
                ...projects,
              ])
            }
          />
        );
      case "settings":
        return <Settings />;
      default:
        return (
          <Dashboard
            followUps={followUps}
            clients={clients}
            enquiries={enquiries}
            onSelectFollowUp={handleClientSelect}
            onViewAllFollowUps={() => setActiveTab("followups")}
            onNavigate={handleTabChange}
          />
        );
    }
  };

  // Auth Gate
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Sidebar Backdrop for Mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-primary/30 backdrop-blur-xl z-[105] min-[1201px]:hidden transition-all duration-500 ease-in-out"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} min-[1201px]:translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[110] min-[1201px]:z-20 min-[1201px]:animate-slide-right`}
      >
        <Sidebar
          activeTab={
            activeTab === "client-detail"
              ? selectedClient?.status === "Lead"
                ? "leads"
                : "clients"
              : activeTab
          }
          setActiveTab={handleTabChange}
          onLogout={handleLogout}
          enquiryCount={
            enquiries.filter((e) => e.status === "new" || e.status === "read")
              .length
          }
          followUpCount={followUps.filter((f) => f.status === "pending").length}
          clientFollowUpCount={
            followUps.filter((f) => {
              if (f.status !== "pending") return false;
              const client = clients.find((c) => c.id === f.clientId);
              return client?.status === "Active";
            }).length
          }
          leadFollowUpCount={
            followUps.filter((f) => {
              if (f.status !== "pending") return false;
              const client = clients.find((c) => c.id === f.clientId);
              return client?.status === "Lead";
            }).length
          }
          isCollapsed={isSidebarCollapsed}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-[1201px]:ml-72 w-full transition-all duration-300 min-[1201px]:animate-slide-left">
        {/* Mobile Top Bar */}
        <header className="min-[1201px]:hidden flex items-center justify-between bg-[#18254D] text-white p-5 fixed top-0 left-0 right-0 z-[100] shadow-lg h-20">
          <Logo size={40} showText={true} className="!gap-2.5" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            }}
            className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center border border-white/10"
          >
            {isMobileSidebarOpen ? (
              <X size={24} strokeWidth={3} />
            ) : (
              <Menu size={24} strokeWidth={3} />
            )}
          </button>
        </header>

        <main className="flex-1 p-4 min-[1201px]:p-8 w-full max-w-full overflow-x-hidden mt-20 min-[1201px]:mt-0">
          <div className="max-w-7xl mx-auto pb-20">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default App;
