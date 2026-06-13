// src/pages/MonitorProgress.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProjects, TASK_STATUS_CONFIG, STATUS_CONFIG, type TaskStatus } from '@/data/mockData';
import {
  CheckCircle2Icon, ClockIcon, ListTodoIcon, AlertCircleIcon,
  FolderKanbanIcon, ChevronDownIcon, ChevronRightIcon,
} from 'lucide-react';

export const MonitorProgress: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockProjects[0].id);
  const [taskStatusFilter, setTaskStatusFilter]   = useState<TaskStatus | 'all'>('all');
  const [taskStoreFilter, setTaskStoreFilter]     = useState<string>('all');
  const [groupByStore, setGroupByStore]           = useState(false);
  const [expandedStores, setExpandedStores]       = useState<Set<string>>(new Set());

  const project = mockProjects.find(p => p.id === selectedProjectId)!;
  const tasks   = project.tasks;

  // Stats
  const total      = tasks.length;
  const approved   = tasks.filter(t => t.status === 'approved').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending    = tasks.filter(t => t.status === 'pending').length;
  const revision   = tasks.filter(t => t.status === 'revision').length;
  const submitted  = tasks.filter(t => t.status === 'submitted').length;
  const pct        = total > 0 ? Math.round((approved / total) * 100) : 0;

  const storeNames = [...new Set(tasks.map(t => t.storeName))];

  const filteredTasks = tasks.filter(t => {
    const matchStatus = taskStatusFilter === 'all' || t.status === taskStatusFilter;
    const matchStore  = taskStoreFilter  === 'all' || t.storeName === taskStoreFilter;
    return matchStatus && matchStore;
  });

  // Group by store
  const tasksByStore = storeNames.reduce<Record<string, typeof tasks>>((acc, store) => {
    acc[store] = filteredTasks.filter(t => t.storeName === store);
    return acc;
  }, {});

  const toggleStore = (store: string) =>
    setExpandedStores(prev => {
      const next = new Set(prev);
      next.has(store) ? next.delete(store) : next.add(store);
      return next;
    });

  const projectCfg = STATUS_CONFIG[project.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Monitor Progress</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Pantau status task secara real-time per project.</p>
      </div>

      {/* Project Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Pilih project" />
          </SelectTrigger>
          <SelectContent>
            {mockProjects
              .filter(p => p.status === 'active' || p.status === 'completed')
              .map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Badge variant={projectCfg.variant}>{projectCfg.label}</Badge>
        <span className="text-xs text-muted-foreground">Deadline: {project.deadline}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Task',    value: total,      icon: <FolderKanbanIcon className="w-4 h-4" />, color: '' },
          { label: 'Approved',      value: approved,   icon: <CheckCircle2Icon className="w-4 h-4" />, color: 'text-green-500' },
          { label: 'Dikerjakan',    value: inProgress, icon: <ClockIcon className="w-4 h-4" />,        color: 'text-primary' },
          { label: 'Dikirim',       value: submitted,  icon: <ListTodoIcon className="w-4 h-4" />,     color: 'text-blue-500' },
          { label: 'Belum Mulai',   value: pending,    icon: <ClockIcon className="w-4 h-4" />,        color: 'text-muted-foreground' },
          { label: 'Perlu Revisi',  value: revision,   icon: <AlertCircleIcon className="w-4 h-4" />,  color: 'text-destructive' },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="pt-4 pb-4">
              <div className={`flex items-center gap-1.5 text-muted-foreground mb-1 ${item.color}`}>
                {item.icon}
                <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
              </div>
              <p className={`text-2xl font-extrabold ${item.color}`}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Progress Keseluruhan</span>
            <span className="text-sm font-bold text-primary">{pct}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            {/* Stacked progress bar */}
            <div className="flex h-full rounded-full overflow-hidden">
              <div className="bg-green-500 transition-all duration-700"
                style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%` }} />
              <div className="bg-primary transition-all duration-700"
                style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }} />
              <div className="bg-blue-500 transition-all duration-700"
                style={{ width: `${total > 0 ? (submitted / total) * 100 : 0}%` }} />
              <div className="bg-destructive transition-all duration-700"
                style={{ width: `${total > 0 ? (revision / total) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-3">
            {[
              { label: 'Approved',    color: 'bg-green-500',   count: approved },
              { label: 'Dikerjakan',  color: 'bg-primary',     count: inProgress },
              { label: 'Dikirim',     color: 'bg-blue-500',    count: submitted },
              { label: 'Perlu Revisi',color: 'bg-destructive', count: revision },
              { label: 'Belum Mulai', color: 'bg-muted-foreground', count: pending },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-[11px] text-muted-foreground">{item.label}: <strong>{item.count}</strong></span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter + Group Toggle */}
      <div className="flex flex-wrap gap-3 items-center">
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
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Filter toko" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Toko</SelectItem>
            {storeNames.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Button
          variant={groupByStore ? 'default' : 'outline'}
          size="sm"
          onClick={() => setGroupByStore(g => !g)}
        >
          Group by Toko
        </Button>

        <span className="text-xs text-muted-foreground self-center ml-auto">
          {filteredTasks.length} task ditampilkan
        </span>
      </div>

      {/* Task Table / Grouped View */}
      {!groupByStore ? (
        <Card>
          <CardContent className="px-0 pb-0">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Tidak ada task.</div>
            ) : (
              <div className="overflow-x-auto">
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
                          <td className="py-3 px-5 text-xs font-medium">{task.storeName}</td>
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
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {storeNames
            .filter(s => taskStoreFilter === 'all' || s === taskStoreFilter)
            .map(store => {
              const storeTasks = tasksByStore[store] ?? [];
              const expanded   = expandedStores.has(store);
              const storeApproved = storeTasks.filter(t => t.status === 'approved').length;
              const storePct      = storeTasks.length > 0
                ? Math.round((storeApproved / storeTasks.length) * 100) : 0;

              return (
                <Card key={store} className="overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                    onClick={() => toggleStore(store)}
                  >
                    <div className="flex items-center gap-3">
                      {expanded
                        ? <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                        : <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-sm font-semibold">{store}</span>
                      <Badge variant="secondary" className="text-[10px]">{storeTasks.length} task</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-muted rounded-full h-1.5 hidden sm:block">
                        <div className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${storePct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-primary">{storePct}%</span>
                    </div>
                  </button>

                  {expanded && storeTasks.length > 0 && (
                    <div className="border-t border-border overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/40">
                            {['Produk', 'Kategori', 'Status', 'Selesai'].map(h => (
                              <th key={h} className="text-left py-2.5 px-5 font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {storeTasks.map(task => {
                            const tcfg = TASK_STATUS_CONFIG[task.status];
                            return (
                              <tr key={task.id} className="hover:bg-muted/20">
                                <td className="py-2.5 px-5 font-medium">{task.productName}</td>
                                <td className="py-2.5 px-5 text-muted-foreground">{task.category}</td>
                                <td className="py-2.5 px-5">
                                  <Badge variant={tcfg.variant} className="text-[10px]">{tcfg.label}</Badge>
                                </td>
                                <td className="py-2.5 px-5 text-muted-foreground">{task.completedAt ?? '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {expanded && storeTasks.length === 0 && (
                    <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
                      Tidak ada task yang cocok dengan filter.
                    </div>
                  )}
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};