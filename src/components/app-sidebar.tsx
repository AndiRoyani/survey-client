// src/components/app-sidebar.tsx
"use client"

import * as React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon, FolderKanbanIcon, ListChecksIcon,
  ImageIcon, SettingsIcon, BarChart2Icon,
} from "lucide-react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function AppSidebar({ onNavigate, currentPage, ...props }: AppSidebarProps) {
  const { user } = useAuth();

  const teams = [{
    name: user?.company ?? 'Client Portal',
    logo: <BarChart2Icon className="size-4" />,
    plan: "Survey Management",
  }];

  const navItems = [
    { title: "Dashboard",       url: "dashboard",  icon: <LayoutDashboardIcon className="size-4" />, isActive: currentPage === 'dashboard' },
    { title: "Project Saya",    url: "projects",   icon: <FolderKanbanIcon className="size-4" />,    isActive: currentPage === 'projects' || currentPage === 'project-detail' },
    { title: "Monitor Progress",url: "progress",   icon: <ListChecksIcon className="size-4" />,      isActive: currentPage === 'progress' },
    { title: "Hasil Survey",    url: "results",    icon: <ImageIcon className="size-4" />,           isActive: currentPage === 'results' },
    { title: "Pengaturan",      url: "settings",   icon: <SettingsIcon className="size-4" />,        isActive: currentPage === 'settings' },
  ].map(item => ({
    ...item,
    onClick: () => onNavigate?.(item.url),
  }));

  const navUser = user
    ? { name: user.name, email: user.email, avatar: user.avatar }
    : { name: "Guest", email: "", avatar: "" };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader><TeamSwitcher teams={teams} /></SidebarHeader>
      <SidebarContent><NavMain items={navItems} /></SidebarContent>
      <SidebarFooter><NavUser user={navUser} /></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}