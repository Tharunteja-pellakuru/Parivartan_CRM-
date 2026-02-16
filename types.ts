import React from "react";

export type ClientStatus =
  | "Lead"
  | "Active"
  | "Churned"
  | "Pending"
  | "Inactive";

export type LeadType = "Hot" | "Warm" | "Cold";

export type ProjectStatus = "Planning" | "In Progress" | "Review" | "Completed";

export type InteractionType = "email" | "call" | "meeting" | "note" | "system";

export type FollowUpStatus = "pending" | "completed" | "snoozed";

export type Priority = "Low" | "Medium" | "High";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ClientStatus;
  leadType?: LeadType;
  avatar: string;
  joinedDate: string;
  lastContact: string;
  industry: string;
  notes: string; // Raw notes for AI analysis
  website?: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  progress: number; // 0-100
}

export interface Activity {
  id: string;
  clientId: string;
  type: InteractionType;
  description: string;
  date: string;
}

export interface FollowUp {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  dueDate: string;
  status: FollowUpStatus;
  priority: Priority;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  message: string;
  date: string;
  status: "new" | "read" | "hold" | "dismissed";
  holdReason?: string;
  aiAnalysis?: {
    isRelevant: boolean;
    reason: string;
  };
}

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
}
