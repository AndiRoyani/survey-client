// src/pages/Projects.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { mockProjects, STATUS_CONFIG, type Project, type ProjectStatus } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import {
  PlusIcon, SearchIcon, ArrowRightIcon, FolderOpenIcon,
} from 'lucide-react';

interface ProjectsPageProps {
  onViewDetail: (project: Project) => void;
  onCreateProject: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onViewDetail, onCreateProject }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const filtered = mockProjects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Saya</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Semua project survey milik {user?.company}.
          </p>
        </div>
        {user?.role === 'client_admin' && (
          <Button size="sm" onClick={onCreateProject}>
            <PlusIcon className="w-4 h-4 mr-1.5" /> Buat Project Baru
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama project..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as ProjectStatus | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_review">Menunggu Review</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Table */}
      <Card>
        <CardContent className="px-0 pb-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpenIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">Tidak ada project ditemukan</p>
              <p className="text-xs text-muted-foreground mt-1">Coba ubah filter atau buat project baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {['Nama Project', 'Status', 'Progress Task', 'Deadline', 'Dibuat', ''].map((h, i) => (
                      <th key={i} className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(p => {
                    const done  = p.tasks.filter(t => t.status === 'approved').length;
                    const total = p.tasks.length;
                    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                    const cfg   = STATUS_CONFIG[p.status];

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{p.id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={cfg.variant} className="text-[11px]">{cfg.label}</Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-1.5">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-primary">{pct}%</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{done}/{total} task</div>
                        </td>
                        <td className="py-4 px-6 text-xs text-muted-foreground">{p.deadline}</td>
                        <td className="py-4 px-6 text-xs text-muted-foreground">{p.createdAt}</td>
                        <td className="py-4 px-6 text-right">
                          <Button variant="ghost" size="sm" className="text-xs h-7 gap-1"
                            onClick={() => onViewDetail(p)}>
                            Detail <ArrowRightIcon className="w-3 h-3" />
                          </Button>
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
    </div>
  );
};