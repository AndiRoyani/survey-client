import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2Icon,
  FolderKanbanIcon,
  ListTodoIcon,
  TrendingUpIcon,
  Users2Icon,
  DollarSignIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  DownloadIcon,
  PlusIcon,
  Building2Icon,
  CheckSquareIcon
} from 'lucide-react';

// --- MOCK DATA ---
const initialProjects = [
  {
    id: 'PRJ-001',
    name: 'Survey Retail Indomaret Jabodetabek',
    client: 'Wings Group',
    status: 'pending_review',
    stores: 45,
    products: 4,
    totalTasks: 180,
    deadline: '2026-06-25',
    notes: 'Kumpulkan foto display rak sabun colek dan harga kompetitor terupdate.',
  },
  {
    id: 'PRJ-002',
    name: 'Audit Ketersediaan Susu Bayi',
    client: 'Danone Indonesia',
    status: 'active',
    stores: 120,
    products: 3,
    totalTasks: 360,
    deadline: '2026-06-20',
    notes: 'Fokus pada stok susu SGM Eksplor 1+ Madu 400g.',
  },
  {
    id: 'PRJ-003',
    name: 'Survey Harga Minyak Goreng',
    client: 'Wilmar International',
    status: 'active',
    stores: 80,
    products: 2,
    totalTasks: 160,
    deadline: '2026-06-18',
    notes: 'Catat harga Sania & Fortune ukuran 1L dan 2L.',
  }
];

const initialJobs = [
  {
    id: 'JOB-201',
    project: 'Audit Ketersediaan Susu Bayi',
    fwName: 'Budi Santoso',
    category: 'Susu & Nutrisi',
    tasksCount: 30,
    status: 'submitted',
    submitDate: '2026-06-12 10:30',
    ratePerTask: 12500,
    tasks: [
      { id: 'TSK-101', product: 'SGM 1+ Madu 400g', store: 'Indomaret Kemang', price: 42500, status: 'approved', photo: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=150&auto=format&fit=crop&q=60' },
      { id: 'TSK-102', product: 'Dancow 1+ Vanila 800g', store: 'Alfamart Ampera', price: 92000, status: 'pending', photo: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=150&auto=format&fit=crop&q=60' },
      { id: 'TSK-103', product: 'Bebelac 3 Madu 800g', store: 'Superindo Cilandak', price: 155000, status: 'pending', photo: 'https://images.unsplash.com/photo-1626244843335-5be066d95318?w=150&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 'JOB-202',
    project: 'Survey Harga Minyak Goreng',
    fwName: 'Siti Aminah',
    category: 'Sembako',
    tasksCount: 20,
    status: 'submitted',
    submitDate: '2026-06-12 11:15',
    ratePerTask: 10000,
    tasks: [
      { id: 'TSK-201', product: 'Minyak Sania 2L', store: 'Alfamart Bangka', price: 34500, status: 'pending', photo: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 'JOB-203',
    project: 'Audit Ketersediaan Susu Bayi',
    fwName: 'Rian Hidayat',
    category: 'Susu & Nutrisi',
    tasksCount: 30,
    status: 'assigned',
    submitDate: '-',
    ratePerTask: 12500,
    tasks: []
  }
];

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState(initialProjects);
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Active view tab in main dashboard area
  const [activeTab, setActiveTab] = useState('overview');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Action handlers
  const handleConfirmProject = (projectId: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status: 'active' } : p))
    );
    triggerToast(`Project ${projectId} berhasil dikonfirmasi dan status diubah menjadi Aktif!`);
  };

  const handleApproveJob = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'approved' } : j))
    );
    triggerToast(`Job ${jobId} telah disetujui! Data siap diekspor ke Client.`);
  };

  const handleRejectJob = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'rejected' } : j))
    );
    triggerToast(`Job ${jobId} ditolak. Field worker akan mendapat notifikasi revisi.`);
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        {/* Dynamic App Sidebar */}
        <AppSidebar />

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="text-muted-foreground hover:text-foreground">Internal</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-muted-foreground" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold">
                      {user.role === 'superadmin' ? 'Superadmin Dashboard' :
                        user.role === 'admin' ? 'Admin Operasional' :
                          user.role === 'supervisor' ? 'Supervisor Panel' : 'Finance Dashboard'}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1 font-mono uppercase text-xs tracking-wider">
                Role: {user.role}
              </Badge>
              <Button onClick={logout} variant="outline" size="sm" className="text-xs">
                Log Out
              </Button>
            </div>
          </header>

          {/* Toast Notification */}
          {notification && (
            <div className="absolute top-20 right-6 z-50 p-4 bg-card border border-border text-foreground rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{notification}</span>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* ----------------- 1. SUPERADMIN OVERVIEW ----------------- */}
            {(user.role === 'superadmin' || activeTab === 'overview') && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Ringkasan Sistem</h2>
                  <p className="text-sm text-muted-foreground">Statistik operasional seluruh project, task, dan field worker hari ini.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <span className="text-sm font-medium text-muted-foreground">Project Aktif</span>
                      <FolderKanbanIcon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-extrabold">4 Project</div>
                      <p className="text-xs text-primary flex items-center gap-1 mt-1 font-semibold">
                        <TrendingUpIcon className="w-3.5 h-3.5" /> +1 baru minggu ini
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <span className="text-sm font-medium text-muted-foreground">Total Task Terbuat</span>
                      <ListTodoIcon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-extrabold">700 Task</div>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">360 In-Progress</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">120 Submitted</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <span className="text-sm font-medium text-muted-foreground">Field Worker Aktif</span>
                      <Users2Icon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-extrabold">32 Orang</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dari total 45 mitra terdaftar
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <span className="text-sm font-medium text-muted-foreground">Estimasi Tagihan</span>
                      <DollarSignIcon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-extrabold">Rp8.150.000</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Bulan Juni 2026
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* SVG Performance Chart Block */}
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="md:col-span-2 p-5">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-base font-bold">Tren Penyelesaian Task (Harian)</CardTitle>
                      <CardDescription className="text-xs">Aktivitas penyelesaian task selama 5 hari terakhir.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-48 flex items-end justify-between px-2 pt-4 border-b border-border">
                      {/* Simple Beautiful Custom Bar Chart */}
                      {[
                        { day: 'Senin', count: 45 },
                        { day: 'Selasa', count: 68 },
                        { day: 'Rabu', count: 110 },
                        { day: 'Kamis', count: 90 },
                        { day: 'Jumat', count: 125 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 w-full">
                          <div className="text-xs text-muted-foreground font-bold mb-1">{item.count}</div>
                          <div
                            style={{ height: `${(item.count / 150) * 120}px` }}
                            className="w-12 bg-primary rounded-t-lg transition-all duration-500 hover:opacity-95 relative group"
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-border text-foreground text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                              Status: Approved
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground mt-2 font-medium">{item.day}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="p-5 flex flex-col justify-between">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-base font-bold">Rasio Status Task</CardTitle>
                    </CardHeader>
                    <div className="flex-1 flex items-center justify-center relative">
                      {/* Interactive ring diagram */}
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="50" fill="transparent" stroke="var(--muted)" strokeWidth="12" />
                        <circle cx="64" cy="64" r="50" fill="transparent" stroke="var(--primary)" strokeWidth="12" strokeDasharray="314.16" strokeDashoffset="90" />
                        <circle cx="64" cy="64" r="50" fill="transparent" stroke="var(--chart-2)" strokeWidth="12" strokeDasharray="314.16" strokeDashoffset="220" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-black">71%</span>
                        <span className="text-[10px] text-muted-foreground">Approved</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-full inline-block"></span> 40% In Progress</div>
                      <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-chart-2 rounded-full inline-block"></span> 31% Approved</div>
                      <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-muted-foreground rounded-full inline-block"></span> 20% Submitted</div>
                      <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-destructive rounded-full inline-block"></span> 9% Rejected</div>
                    </div>
                  </Card>
                </div>
              </div>
            )}


            {/* ----------------- 2. ADMIN OPERASIONAL VIEW ----------------- */}
            {(user.role === 'admin' || user.role === 'superadmin') && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border pt-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Building2Icon className="w-5 h-5 text-primary" />
                      Konfirmasi Project & Saran Distribusi Job
                    </h2>
                    <p className="text-sm text-muted-foreground">Review project masuk dari client dan generate saran distribusi task ke job mitra.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Cari project..."
                      className="w-64 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button size="sm">
                      <PlusIcon className="w-4 h-4 mr-1" /> Project Baru
                    </Button>
                  </div>
                </div>

                {/* Projects Feed */}
                <div className="grid gap-6">
                  {projects
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(project => (
                      <Card key={project.id} className="overflow-hidden">
                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-muted-foreground">{project.id}</span>
                              <h3 className="text-base font-bold">{project.name}</h3>
                              <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                {project.status === 'active' ? 'Aktif / Berjalan' : 'Butuh Konfirmasi'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <div>Client: <strong>{project.client}</strong></div>
                              <div>Toko: <strong>{project.stores} toko</strong></div>
                              <div>Produk: <strong>{project.products} item</strong></div>
                              <div>Deadline: <strong>{project.deadline}</strong></div>
                            </div>
                            <p className="text-xs text-muted-foreground italic bg-muted/40 p-2.5 rounded-lg border border-border mt-2">
                              Catatan: {project.notes}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                            {project.status === 'pending_review' ? (
                              <>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => triggerToast(`Project ${project.id} ditolak dan dikembalikan ke client.`)}
                                >
                                  Tolak
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmProject(project.id)}
                                >
                                  Konfirmasi & Buat {project.totalTasks} Task
                                </Button>
                              </>
                            ) : (
                              <div className="flex flex-col gap-1 items-end">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => triggerToast(`Saran distribusi otomatis dijalankan untuk ${project.id}.`)}
                                >
                                  Kelola & Distribusikan Job
                                </Button>
                                <span className="text-[10px] text-muted-foreground">Progress: 0 / {project.totalTasks} Task selesai</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expandable Preview: Algoritma Pengelompokan Kategori */}
                        {project.status === 'active' && (
                          <div className="px-5 pb-5 pt-3 bg-muted/20 border-t border-border space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Simulasi Saran Distribusi (Max 2 Kategori/Job)</h4>
                              <Badge variant="outline">Auto-Grouping</Badge>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="bg-card p-3 rounded-lg border border-border flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold">Job 1 (Susu Bayi)</span>
                                    <Badge variant="secondary" className="text-[9px] px-1.5">Susu & Nutrisi</Badge>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">120 Task • 40 Toko</span>
                                </div>
                                <Button size="sm" variant="link" className="text-primary text-[11px] p-0 h-auto self-start mt-2">
                                  Assign ke FW <ArrowRightIcon className="w-3 h-3 ml-1" />
                                </Button>
                              </div>

                              <div className="bg-card p-3 rounded-lg border border-border flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold">Job 2 (Minyak Goreng)</span>
                                    <Badge variant="secondary" className="text-[9px] px-1.5">Sembako</Badge>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">80 Task • 40 Toko</span>
                                </div>
                                <Button size="sm" variant="link" className="text-primary text-[11px] p-0 h-auto self-start mt-2">
                                  Assign ke FW <ArrowRightIcon className="w-3 h-3 ml-1" />
                                </Button>
                              </div>

                              <div className="bg-card p-3 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-center p-4">
                                <span className="text-xs text-muted-foreground font-semibold mb-1">Override Manual</span>
                                <span className="text-[10px] text-muted-foreground">Pindahkan task antar job via drag & drop.</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                </div>
              </div>
            )}


            {/* ----------------- 3. SUPERVISOR REVIEW QUEUE ----------------- */}
            {(user.role === 'supervisor' || user.role === 'superadmin') && (
              <div className="space-y-6">
                <div className="border-t border-border pt-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CheckSquareIcon className="w-5 h-5 text-primary" />
                    Antrian Review Job (Persetujuan Hasil Survey)
                  </h2>
                  <p className="text-sm text-muted-foreground">Tinjau hasil foto produk, koordinat GPS, dan kecocokan harga sebelum dikirim ke portal client.</p>
                </div>

                <div className="grid gap-6">
                  {jobs
                    .filter(j => j.status === 'submitted')
                    .map(job => (
                      <Card key={job.id} className="overflow-hidden">
                        <div className="bg-muted/30 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">{job.id}</span>
                              <span className="text-xs text-muted-foreground">| Project: <strong>{job.project}</strong></span>
                              <Badge>Submitted</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Oleh Field Worker: <span className="font-bold text-foreground">{job.fwName}</span> • Dikirim: {job.submitDate}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="font-bold text-xs"
                              onClick={() => handleRejectJob(job.id)}
                            >
                              <XIcon className="w-3.5 h-3.5 mr-1" /> Tolak Job
                            </Button>
                            <Button
                              size="sm"
                              className="font-bold text-xs"
                              onClick={() => handleApproveJob(job.id)}
                            >
                              <CheckIcon className="w-3.5 h-3.5 mr-1" /> Approve Job
                            </Button>
                          </div>
                        </div>

                        {/* List Task di dalam Job */}
                        <div className="p-5 space-y-3">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Daftar Foto & Input Harga:</span>
                          <div className="grid gap-4 sm:grid-cols-3">
                            {job.tasks.map(task => (
                              <div key={task.id} className="bg-muted/20 rounded-xl p-3 border border-border flex gap-3">
                                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border">
                                  <img src={task.photo} alt={task.product} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1 min-w-0">
                                  <span className="text-[10px] font-mono text-muted-foreground block">{task.id}</span>
                                  <span className="text-xs font-bold block truncate">{task.product}</span>
                                  <span className="text-xs text-muted-foreground block truncate">{task.store}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold font-mono">Rp{task.price.toLocaleString()}</span>
                                    <Badge variant="outline" className="text-[8px] h-3.5 border-primary text-primary bg-primary/5">OK (GPS)</Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}

                  {jobs.filter(j => j.status === 'submitted').length === 0 && (
                    <div className="text-center py-12 bg-muted/25 border border-dashed border-border rounded-2xl">
                      <CheckCircle2Icon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <span className="text-sm font-semibold text-muted-foreground block">Semua antrian review bersih!</span>
                      <span className="text-xs text-muted-foreground mt-1 block">Tidak ada job yang butuh review saat ini.</span>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* ----------------- 4. FINANCE PAYMENT TRACKER ----------------- */}
            {(user.role === 'finance' || user.role === 'superadmin') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <DollarSignIcon className="w-5 h-5 text-primary" />
                      Pembayaran & Laporan Keuangan Field Worker
                    </h2>
                    <p className="text-sm text-muted-foreground">Kelola tagihan mitra field worker berdasarkan total task yang disetujui (Approved).</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <DownloadIcon className="w-4 h-4 mr-1.5" /> Export Excel Rekap (SheetJS)
                  </Button>
                </div>

                {/* Tagihan Summary Table */}
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                        <tr>
                          <th className="py-4 px-6">Nama Field Worker</th>
                          <th className="py-4 px-6">Total Job Approved</th>
                          <th className="py-4 px-6">Rate / Task</th>
                          <th className="py-4 px-6">Estimasi Tagihan</th>
                          <th className="py-4 px-6">Status Pembayaran</th>
                          <th className="py-4 px-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {jobs
                          .filter(j => j.status === 'approved')
                          .map((job, idx) => (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                              <td className="py-4 px-6 font-bold">{job.fwName}</td>
                              <td className="py-4 px-6 font-mono text-xs">{job.id} ({job.tasksCount} task)</td>
                              <td className="py-4 px-6 font-mono text-xs">Rp{job.ratePerTask.toLocaleString()}</td>
                              <td className="py-4 px-6 font-bold font-mono">Rp{(job.tasksCount * job.ratePerTask).toLocaleString()}</td>
                              <td className="py-4 px-6">
                                <Badge variant="outline" className="border-amber-500 text-amber-500 bg-amber-500/5">Pending Transfer</Badge>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <Button
                                  size="sm"
                                  className="text-[11px] h-7 font-bold"
                                  onClick={() => triggerToast(`Pembayaran untuk ${job.fwName} sukses ditandai Lunas!`)}
                                >
                                  Bayar Lunas
                                </Button>
                              </td>
                            </tr>
                          ))}

                        {jobs.filter(j => j.status === 'approved').length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-muted-foreground text-xs font-semibold">
                              Tidak ada tagihan approved yang pending pembayaran.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
