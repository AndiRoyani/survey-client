"use client"

import * as React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  Building2Icon,
  BriefcaseIcon,
  LayersIcon,
  UsersIcon,
  DollarSignIcon,
  BarChart3Icon,
  SettingsIcon,
  ShieldAlertIcon,
  CheckSquareIcon,
  BriefcaseIcon as ProjectIcon
} from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Teams switcher info
  const teams = [
    {
      name: "SurveyOps HQ",
      logo: <ShieldAlertIcon className="size-4" />,
      plan: "Internal Platform",
    }
  ]

  // Main navigation items based on role
  const getNavItems = () => {
    if (!user) return []

    const items = [
      {
        title: "Dashboard",
        url: "#dashboard",
        icon: <LayoutDashboardIcon className="size-4" />,
        isActive: true,
      }
    ]

    // Superadmin & Admin: Client Management
    if (user.role === 'superadmin' || user.role === 'admin') {
      items.push({
        title: "Manajemen Client",
        url: "#clients",
        icon: <Building2Icon className="size-4" />,
        isActive: false,
      })
    }

    // Superadmin & Admin: Project Management
    if (user.role === 'superadmin' || user.role === 'admin') {
      items.push({
        title: "Manajemen Project",
        url: "#projects",
        icon: <BriefcaseIcon className="size-4" />,
        isActive: false,
      })
    }

    // Superadmin & Admin: Job & Task Management (distribute jobs)
    if (user.role === 'superadmin' || user.role === 'admin') {
      items.push({
        title: "Manajemen Job & Task",
        url: "#jobs-management",
        icon: <LayersIcon className="size-4" />,
        isActive: false,
      })
    }

    // Superadmin, Admin & Supervisor: Monitor Job
    if (user.role === 'superadmin' || user.role === 'admin' || user.role === 'supervisor') {
      items.push({
        title: "Monitor Progress",
        url: "#monitor",
        icon: <BarChart3Icon className="size-4" />,
        isActive: false,
      })
    }

    // Superadmin & Supervisor: Review and Approval
    if (user.role === 'superadmin' || user.role === 'supervisor') {
      items.push({
        title: "Review & Approval",
        url: "#review-approval",
        icon: <CheckSquareIcon className="size-4" />,
        isActive: false,
      })
    }

    // Superadmin & Admin: Field Worker Management
    if (user.role === 'superadmin' || user.role === 'admin') {
      items.push({
        title: "Manajemen Field Worker",
        url: "#field-workers",
        icon: <UsersIcon className="size-4" />,
        isActive: false,
      })
    }

    // Superadmin & Finance: Payment Management
    if (user.role === 'superadmin' || user.role === 'finance') {
      items.push({
        title: "Pembayaran FW",
        url: "#payments",
        icon: <DollarSignIcon className="size-4" />,
        isActive: false,
      })
    }

    // All roles: Settings (for superadmin it is full, for others it is general profile)
    items.push({
      title: user.role === 'superadmin' ? "Pengaturan Sistem" : "Pengaturan Akun",
      url: "#settings",
      icon: <SettingsIcon className="size-4" />,
      isActive: false,
    })

    return items
  }

  const navUser = user
    ? {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    : {
        name: "Guest User",
        email: "guest@example.com",
        avatar: "",
      }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
