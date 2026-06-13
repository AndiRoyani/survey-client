// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList,
  BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FolderKanbanIcon, CheckCircle2Icon, ListTodoIcon, ClockIcon,
  TrendingUpIcon, ArrowRightIcon, PlusIcon,
} from 'lucide-react';
import { mockProjects, STATUS_CONFIG, type Project } from '@/data/mockData';
import { ProjectsPage } from './Projects';
import { ProjectDetail } from './ProjectDetail';
import { CreateProject } from './CreateProject';
import { MonitorProgress } from './MonitorProgress';
import { SurveyResults } from './SurveyResults';
import { Settings } from './Settings';

type Page = 'dashboard' | 'projects' | 'project-detail' | 'create-project' | 'progress' | 'results' | 'settings';

const trendData = [
  { day: 'Senin', count: 28 },
  { day: 'Selasa', count: 45 },
  { day: 'Rabu', count: 62 },
  { day: 'Kamis', count: 38 },
  { day: 'Jumat', count: 79 },
  { day: 'Sabtu', count: 53 },
  { day: 'Minggu', count: 31 },
];
const maxTrend = Math.max(...trendData.map(d => d.count));

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [page, setPage]               = useState<Page>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!user) return null;

  const activeProjects  = mockProjects.filter(p => p.status === 'active').length;
  const doneProjects    = mockProjects.filter(p => p.status === 'completed').length;
  const tasksDoneMonth  = mockProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'approved').length, 0);
  const tasksInProgress = mockProjects.reduce((a, p) => a + p.tasks.filter(t => t.status === 'in_progress').length, 0);
  const recentProjects  = [...mockProjects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleViewDetail = (project: Project) => {
    setSelectedProject(project);
    setPage('project-detail');
  };

  // Breadcrumb label
  const breadcrumbs: Record<Page, string> = {
    dashboard:       'Dashboard',
    projects:        'Project Saya',
    'project-detail': 'Detail Project',
    'create-project': 'Buat Project',
    progress:        'Progress',
    results:         'Hasil Survey',
    settings:        'Pengaturan',
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        <AppSidebar onNavigate={(p) => setPage(p as Page)} currentPage={page} />

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => setPage('dashboard')}
                      className="cursor-pointer text-muted-foreground hover:text-foreground text-sm"
                    >
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {page !== 'dashboard' && (
                    <>
                      <BreadcrumbSeparator />
                      {page === 'project-detail' && (
                        <>
                          <BreadcrumbItem>
                            <BreadcrumbLink
                              onClick={() => setPage('projects')}
                              className="cursor-pointer text-muted-foreground hover:text-foreground text-sm"
                            >
                              Project Saya
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                        </>
                      )}
                      <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold text-sm">
                          {page === 'project-detail' && selectedProject
                            ? selectedProject.name
                            : breadcrumbs[page]}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:block">{user.company}</span>
              <Button onClick={logout} variant="outline" size="sm" className="text-xs">Log Out</Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">

            {/* ---- DASHBOARD ---- */}
            {page === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Selamat datang, {user.name.split(' ')[0]} 👋</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Ringkasan aktivitas survey Anda hari ini.</p>
                  </div>
                  {user.role === 'client_admin' && (
                    <Button size="sm" onClick={() => setPage('create-project')}>
                      <PlusIcon className="w-4 h-4 mr-1.5" /> Buat Project Baru
                    </Button>
                  )}
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Project Aktif',          value: activeProjects,  icon: <FolderKanbanIcon className="h-4 w-4 text-primary" />,  sub: 'Sedang berjalan',    subColor: 'text-primary' },
                    { label: 'Project Selesai',         value: doneProjects,    icon: <CheckCircle2Icon className="h-4 w-4 text-primary" />,  sub: 'Semua task approved', subColor: 'text-muted-foreground' },
                    { label: 'Task Selesai Bulan Ini',  value: tasksDoneMonth,  icon: <ListTodoIcon className="h-4 w-4 text-primary" />,      sub: 'Data sudah approved', subColor: 'text-muted-foreground' },
                    { label: 'Task Masih Berjalan',     value: tasksInProgress, icon: <ClockIcon className="h-4 w-4 text-primary" />,         sub: 'Dalam proses',        subColor: 'text-muted-foreground' },
                  ].map(item => (
                    <Card key={item.label}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                        {item.icon}
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-extrabold">{item.value}</div>
                        <p className={`text-xs mt-1 font-semibold flex items-center gap-1 ${item.subColor}`}>
                          {item.subColor === 'text-primary' && <TrendingUpIcon className="w-3.5 h-3.5" />}
                          {item.sub}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Chart + Progress */}
                <div className="grid gap-6 lg:grid-cols-3">
                  <Card className="lg:col-span-2 p-5">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-base font-bold">Tren Task Selesai (7 Hari Terakhir)</CardTitle>
                      <CardDescription className="text-xs">Jumlah task approved per hari.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="flex items-end justify-between gap-2 h-40 border-b border-border pb-2">
                        {trendData.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                            <span className="text-[10px] text-muted-foreground font-bold">{item.count}</span>
                            <div style={{ height: `${(item.count / maxTrend) * 120}px` }}
                              className="w-full bg-primary rounded-t-md transition-all duration-500 hover:opacity-80 min-h-[4px]" />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between gap-2 mt-2">
                        {trendData.map((item, idx) => (
                          <div key={idx} className="flex-1 text-center">
                            <span className="text-[10px] text-muted-foreground">{item.day.slice(0, 3)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-5">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-base font-bold">Progress Project Aktif</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 space-y-4">
                      {mockProjects.filter(p => p.status === 'active').map(p => {
                        const done  = p.tasks.filter(t => t.status === 'approved').length;
                        const total = p.tasks.length;
                        const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                        return (
                          <div key={p.id} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold truncate pr-2">{p.name}</span>
                              <span className="text-xs font-bold text-primary shrink-0">{pct}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground">{done}/{total} task selesai</p>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Projects */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-base font-bold">Project Terbaru</CardTitle>
                      <CardDescription className="text-xs mt-0.5">4 project terakhir.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary gap-1"
                      onClick={() => setPage('projects')}>
                      Lihat Semua <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-y border-border bg-muted/40">
                            {['Nama Project', 'Status', 'Deadline', 'Progress', ''].map((h, i) => (
                              <th key={i} className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {recentProjects.map(p => {
                            const done  = p.tasks.filter(t => t.status === 'approved').length;
                            const total = p.tasks.length;
                            const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                            const cfg   = STATUS_CONFIG[p.status];
                            return (
                              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="font-semibold text-sm">{p.name}</div>
                                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{p.id}</div>
                                </td>
                                <td className="py-4 px-6">
                                  <Badge variant={cfg.variant} className="text-[11px]">{cfg.label}</Badge>
                                </td>
                                <td className="py-4 px-6 text-xs text-muted-foreground">{p.deadline}</td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-muted rounded-full h-1.5">
                                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-xs font-bold text-primary">{pct}%</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <Button variant="ghost" size="sm" className="text-xs h-7"
                                    onClick={() => handleViewDetail(p)}>
                                    Detail <ArrowRightIcon className="w-3 h-3 ml-1" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ---- PROJECTS LIST ---- */}
            {page === 'projects' && (
              <ProjectsPage
                onViewDetail={handleViewDetail}
                onCreateProject={() => setPage('create-project')}
              />
            )}

            {/* ---- PROJECT DETAIL ---- */}
            {page === 'project-detail' && selectedProject && (
              <ProjectDetail
                project={selectedProject}
                onBack={() => setPage('projects')}
              />
            )}

            {page === 'create-project' && (
                <CreateProject
                  onBack={() => setPage('projects')}
                  onSubmit={(data, asDraft) => {
                    alert(asDraft
                      ? `Project "${data.name}" disimpan sebagai draft!`
                      : `Project "${data.name}" berhasil disubmit ke admin!`);
                    setPage('projects');
                  }}
                />
              )}
            {page === 'progress' && <MonitorProgress />}
            {page === 'results'  && <SurveyResults />}
            {page === 'settings' && <Settings />}

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};