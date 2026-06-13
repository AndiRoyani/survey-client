// src/pages/SurveyResults.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProjects, type Task } from '@/data/mockData';
import {
  ImageIcon, DownloadIcon, StoreIcon, PackageIcon,
  ChevronDownIcon, ChevronRightIcon,
} from 'lucide-react';

type ViewMode = 'store' | 'product';

export const SurveyResults: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockProjects[0].id);
  const [viewMode, setViewMode]                   = useState<ViewMode>('store');
  const [expandedKeys, setExpandedKeys]           = useState<Set<string>>(new Set());

  const project      = mockProjects.find(p => p.id === selectedProjectId)!;
  const approvedTasks = project.tasks.filter(t => t.status === 'approved');

  const storeNames   = [...new Set(approvedTasks.map(t => t.storeName))];
  const productNames = [...new Set(approvedTasks.map(t => t.productName))];

  const toggle = (key: string) =>
    setExpandedKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className="border border-border rounded-xl overflow-hidden flex flex-col sm:flex-row gap-0">
      {task.photo ? (
        <div className="h-40 sm:h-auto sm:w-40 shrink-0 overflow-hidden bg-muted">
          <img src={task.photo} alt={task.productName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="h-40 sm:h-auto sm:w-40 shrink-0 bg-muted flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="space-y-1">
          <p className="text-sm font-bold">{task.productName}</p>
          <p className="text-xs text-muted-foreground">{task.storeName}</p>
          <Badge variant="secondary" className="text-[10px] w-fit">{task.category}</Badge>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Harga tercatat</p>
            <p className="text-lg font-extrabold text-primary">
              Rp{task.price?.toLocaleString('id-ID') ?? '—'}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground text-right">{task.completedAt}</p>
        </div>
        {task.surveyorNote && (
          <p className="text-[11px] text-muted-foreground italic border-t border-border mt-2 pt-2">
            "{task.surveyorNote}"
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hasil Survey</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Data task yang sudah diapprove oleh admin.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert('Export Excel — coming soon di Tahap 8!')}>
          <DownloadIcon className="w-4 h-4 mr-1.5" /> Export Excel
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={selectedProjectId} onValueChange={v => { setSelectedProjectId(v); setExpandedKeys(new Set()); }}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Pilih project" />
          </SelectTrigger>
          <SelectContent>
            {mockProjects
              .filter(p => p.tasks.some(t => t.status === 'approved'))
              .map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* View mode toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setViewMode('store')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors
              ${viewMode === 'store' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
          >
            <StoreIcon className="w-3.5 h-3.5" /> Per Toko
          </button>
          <button
            onClick={() => setViewMode('product')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors
              ${viewMode === 'product' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
          >
            <PackageIcon className="w-3.5 h-3.5" /> Per Produk
          </button>
        </div>

        <span className="text-xs text-muted-foreground">
          {approvedTasks.length} task approved
        </span>
      </div>

      {/* Empty state */}
      {approvedTasks.length === 0 && (
        <div className="text-center py-20 bg-muted/25 border border-dashed border-border rounded-2xl">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">Belum ada hasil survey</p>
          <p className="text-xs text-muted-foreground mt-1">Hasil muncul setelah task diapprove oleh admin.</p>
        </div>
      )}

      {/* View per TOKO */}
      {approvedTasks.length > 0 && viewMode === 'store' && (
        <div className="space-y-3">
          {storeNames.map(store => {
            const storeTasks = approvedTasks.filter(t => t.storeName === store);
            const expanded   = expandedKeys.has(store);
            return (
              <Card key={store} className="overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                  onClick={() => toggle(store)}
                >
                  <div className="flex items-center gap-3">
                    {expanded
                      ? <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                      : <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />}
                    <StoreIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">{store}</span>
                    <Badge variant="secondary" className="text-[10px]">{storeTasks.length} produk</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Klik untuk {expanded ? 'tutup' : 'lihat hasil'}
                  </span>
                </button>

                {expanded && (
                  <div className="border-t border-border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {storeTasks.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* View per PRODUK */}
      {approvedTasks.length > 0 && viewMode === 'product' && (
        <div className="space-y-3">
          {productNames.map(product => {
            const productTasks = approvedTasks.filter(t => t.productName === product);
            const expanded     = expandedKeys.has(product);
            const avgPrice     = Math.round(
              productTasks.reduce((a, t) => a + (t.price ?? 0), 0) / productTasks.length
            );
            return (
              <Card key={product} className="overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                  onClick={() => toggle(product)}
                >
                  <div className="flex items-center gap-3">
                    {expanded
                      ? <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                      : <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />}
                    <PackageIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">{product}</span>
                    <Badge variant="secondary" className="text-[10px]">{productTasks.length} toko</Badge>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-muted-foreground">Rata-rata harga</p>
                    <p className="text-sm font-bold text-primary">Rp{avgPrice.toLocaleString('id-ID')}</p>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {productTasks.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
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