// src/pages/ProjectDetail.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  STATUS_CONFIG, TASK_STATUS_CONFIG,
  type Project, type TaskStatus,
} from '@/data/mockData';
import {
  ArrowLeftIcon, StoreIcon, PackageIcon, ListChecksIcon,
  ImageIcon, ClockIcon, CheckCircle2Icon,
} from 'lucide-react';

type DetailTab = 'overview' | 'tasks' | 'results' | 'logs';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [taskStatusFilter, setTaskStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [taskStoreFilter, setTaskStoreFilter]   = useState<string>('all');

  const cfg        = STATUS_CONFIG[project.status];
  const totalTasks = project.tasks.length;
  const approved   = project.tasks.filter(t => t.status === 'approved').length;
  const inProgress = project.tasks.filter(t => t.status === 'in_progress').length;
  const pending    = project.tasks.filter(t => t.status === 'pending').length;
  const revision   = project.tasks.filter(t => t.status === 'revision').length;
  const pct        = totalTasks > 0 ? Math.round((approved / totalTasks) * 100) : 0;

  const storeNames = [...new Set(project.tasks.map(t => t.storeName))];

  const filteredTasks = project.tasks.filter(t => {
    const matchStatus = taskStatusFilter === 'all' || t.status === taskStatusFilter;
    const matchStore  = taskStoreFilter  === 'all' || t.storeName === taskStoreFilter;
    return matchStatus && matchStore;
  });

  const approvedTasks = project.tasks.filter(t => t.status === 'approved');

  const tabs: { key: DetailTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview',      icon: <CheckCircle2Icon className="w-4 h-4" /> },
    { key: 'tasks',    label: 'Task',           icon: <ListChecksIcon className="w-4 h-4" /> },
    { key: 'results',  label: 'Hasil Survey',   icon: <ImageIcon className="w-4 h-4" /> },
    { key: 'logs',     label: 'Riwayat',        icon: <ClockIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Back + Title */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mt-1 shrink-0">
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Kembali
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
          </div>
          <h2 className="text-xl font-bold leading-tight">{project.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
        </div>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Deadline',      value: project.deadline },
          { label: 'Dibuat',        value: project.createdAt },
          { label: 'Total Toko',    value: `${project.stores.length} toko` },
          { label: 'Total Produk',  value: `${project.products.length} produk` },
        ].map(item => (
          <div key={item.label} className="bg-muted/40 rounded-lg p-3 border border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</p>
            <p className="text-sm font-bold mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
              ${activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ---- OVERVIEW ---- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Progress Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Total Task',      value: totalTasks, color: '' },
              { label: 'Approved',        value: approved,   color: 'text-green-500' },
              { label: 'Dikerjakan',      value: inProgress, color: 'text-primary' },
              { label: 'Belum Dimulai',   value: pending,    color: 'text-muted-foreground' },
              { label: 'Perlu Revisi',    value: revision,   color: 'text-destructive' },
            ].map(item => (
              <Card key={item.label}>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                  <p className={`text-2xl font-extrabold mt-1 ${item.color}`}>{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress bar */}
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Progress Keseluruhan</span>
                <span className="text-sm font-bold text-primary">{pct}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-primary h-3 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{approved} dari {totalTasks} task approved</p>
            </CardContent>
          </Card>

          {/* Catatan */}
          {project.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Catatan untuk Surveyor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">{project.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Daftar Toko */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <StoreIcon className="w-4 h-4 text-primary" /> Daftar Toko ({project.stores.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.stores.length === 0 ? (
                <p className="text-xs text-muted-foreground">Belum ada toko.</p>
              ) : project.stores.map(store => (
                <div key={store.id} className="border border-border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold">{store.name}</p>
                      <p className="text-xs text-muted-foreground">{store.address}, {store.city}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{store.products.length} produk</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {store.products.map(sp => (
                      <span key={sp.productId}
                        className="text-[10px] bg-muted px-2 py-0.5 rounded-full border border-border">
                        {sp.productName}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daftar Produk */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <PackageIcon className="w-4 h-4 text-primary" /> Daftar Produk ({project.products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {project.products.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Belum ada produk.</p>
                ) : project.products.map(prod => (
                  <div key={prod.id} className="flex items-center justify-between border border-border rounded-lg px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold">{prod.name}</p>
                      <p className="text-[10px] text-muted-foreground">{prod.category}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{prod.id}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---- TASKS ---- */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-3">
            <Select value={taskStatusFilter} onValueChange={v => setTaskStatusFilter(v as TaskStatus | 'all')}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Belum Dimulai</SelectItem>
                <SelectItem value="in_progress">Dikerjakan</SelectItem>
                <SelectItem value="submitted">Dikirim</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="revision">Perlu Revisi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={taskStoreFilter} onValueChange={setTaskStoreFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter toko" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Toko</SelectItem>
                {storeNames.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground self-center">
              {filteredTasks.length} task ditampilkan
            </span>
          </div>

          <Card>
            <CardContent className="px-0 pb-0">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Tidak ada task.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {['Toko', 'Produk', 'Kategori', 'Status', 'Selesai'].map(h => (
                        <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTasks.map(task => {
                      const tcfg = TASK_STATUS_CONFIG[task.status];
                      return (
                        <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-5 font-medium text-xs">{task.storeName}</td>
                          <td className="py-3 px-5 text-xs">{task.productName}</td>
                          <td className="py-3 px-5 text-xs text-muted-foreground">{task.category}</td>
                          <td className="py-3 px-5">
                            <Badge variant={tcfg.variant} className="text-[10px]">{tcfg.label}</Badge>
                          </td>
                          <td className="py-3 px-5 text-xs text-muted-foreground">
                            {task.completedAt ?? '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---- HASIL SURVEY ---- */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {approvedTasks.length === 0 ? (
            <div className="text-center py-16 bg-muted/25 border border-dashed border-border rounded-2xl">
              <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">Belum ada hasil survey</p>
              <p className="text-xs text-muted-foreground mt-1">Hasil muncul setelah task diapprove admin.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {approvedTasks.map(task => (
                <Card key={task.id} className="overflow-hidden">
                  {task.photo && (
                    <div className="h-40 overflow-hidden bg-muted">
                      <img src={task.photo} alt={task.productName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <CardContent className="pt-3 pb-4 space-y-1">
                    <p className="text-sm font-bold">{task.productName}</p>
                    <p className="text-xs text-muted-foreground">{task.storeName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-extrabold text-primary">
                        Rp{task.price?.toLocaleString('id-ID') ?? '—'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{task.completedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- RIWAYAT ---- */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          {project.logs.map((log, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0" />
                {idx < project.logs.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1 min-h-[2rem]" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold">{log.event}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {log.date} · oleh <span className="font-medium">{log.actor}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};