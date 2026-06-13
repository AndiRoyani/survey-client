// src/data/mockData.ts

export type ProjectStatus = 'draft' | 'pending_review' | 'active' | 'completed' | 'cancelled';
export type TaskStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'revision';

export interface Product {
  id: string;
  name: string;
  category: string;
  notes?: string;
}

export interface StoreProduct {
  productId: string;
  productName: string;
  category: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  products: StoreProduct[];
  notes?: string;
}

export interface Task {
  id: string;
  projectId: string;
  storeName: string;
  productName: string;
  category: string;
  status: TaskStatus;
  price?: number;
  photo?: string;
  surveyorNote?: string;
  completedAt?: string;
}

export interface ProjectLog {
  date: string;
  event: string;
  actor: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  deadline: string;
  createdAt: string;
  status: ProjectStatus;
  notes: string;
  stores: Store[];
  products: Product[];
  tasks: Task[];
  logs: ProjectLog[];
}

export const STATUS_CONFIG: Record<ProjectStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  color: string;
}> = {
  draft:          { label: 'Draft',           variant: 'secondary',    color: 'text-muted-foreground' },
  pending_review: { label: 'Menunggu Review', variant: 'outline',      color: 'text-amber-500' },
  active:         { label: 'Aktif',           variant: 'default',      color: 'text-primary' },
  completed:      { label: 'Selesai',         variant: 'outline',      color: 'text-green-500' },
  cancelled:      { label: 'Dibatalkan',      variant: 'destructive',  color: 'text-destructive' },
};

export const TASK_STATUS_CONFIG: Record<TaskStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
}> = {
  pending:     { label: 'Belum Dimulai', variant: 'secondary' },
  in_progress: { label: 'Dikerjakan',    variant: 'default' },
  submitted:   { label: 'Dikirim',       variant: 'outline' },
  approved:    { label: 'Approved',      variant: 'outline' },
  revision:    { label: 'Perlu Revisi',  variant: 'destructive' },
};

export const mockProjects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Survey Retail Indomaret Jabodetabek',
    description: 'Survey harga dan ketersediaan produk sabun di jaringan Indomaret area Jabodetabek.',
    deadline: '2026-06-25',
    createdAt: '2026-06-01',
    status: 'active',
    notes: 'Kumpulkan foto display rak sabun colek dan harga kompetitor terupdate.',
    products: [
      { id: 'PRD-01', name: 'Sabun So Klin 900ml', category: 'Kebersihan' },
      { id: 'PRD-02', name: 'Rinso Anti Noda 1kg', category: 'Kebersihan' },
      { id: 'PRD-03', name: 'Sunlight 750ml',      category: 'Kebersihan' },
      { id: 'PRD-04', name: 'Wipol 780ml',         category: 'Kebersihan' },
    ],
    stores: [
      { id: 'STR-01', name: 'Indomaret Kemang',    address: 'Jl. Kemang Raya No.10',   city: 'Jakarta Selatan', products: [{ productId: 'PRD-01', productName: 'Sabun So Klin 900ml', category: 'Kebersihan' }, { productId: 'PRD-02', productName: 'Rinso Anti Noda 1kg', category: 'Kebersihan' }] },
      { id: 'STR-02', name: 'Indomaret Ampera',    address: 'Jl. Ampera Raya No.5',    city: 'Jakarta Selatan', products: [{ productId: 'PRD-01', productName: 'Sabun So Klin 900ml', category: 'Kebersihan' }, { productId: 'PRD-03', productName: 'Sunlight 750ml', category: 'Kebersihan' }, { productId: 'PRD-04', productName: 'Wipol 780ml', category: 'Kebersihan' }] },
      { id: 'STR-03', name: 'Indomaret Cilandak',  address: 'Jl. TB Simatupang No.3',  city: 'Jakarta Selatan', products: [{ productId: 'PRD-02', productName: 'Rinso Anti Noda 1kg', category: 'Kebersihan' }, { productId: 'PRD-04', productName: 'Wipol 780ml', category: 'Kebersihan' }] },
    ],
    tasks: [
      { id: 'TSK-001', projectId: 'PRJ-001', storeName: 'Indomaret Kemang',   productName: 'Sabun So Klin 900ml', category: 'Kebersihan', status: 'approved',  price: 22500, photo: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&auto=format&fit=crop&q=60', completedAt: '2026-06-10 09:15' },
      { id: 'TSK-002', projectId: 'PRJ-001', storeName: 'Indomaret Kemang',   productName: 'Rinso Anti Noda 1kg', category: 'Kebersihan', status: 'approved',  price: 31000, photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&auto=format&fit=crop&q=60', completedAt: '2026-06-10 09:45' },
      { id: 'TSK-003', projectId: 'PRJ-001', storeName: 'Indomaret Ampera',   productName: 'Sabun So Klin 900ml', category: 'Kebersihan', status: 'submitted', price: 23000 },
      { id: 'TSK-004', projectId: 'PRJ-001', storeName: 'Indomaret Ampera',   productName: 'Sunlight 750ml',      category: 'Kebersihan', status: 'in_progress' },
      { id: 'TSK-005', projectId: 'PRJ-001', storeName: 'Indomaret Ampera',   productName: 'Wipol 780ml',         category: 'Kebersihan', status: 'pending' },
      { id: 'TSK-006', projectId: 'PRJ-001', storeName: 'Indomaret Cilandak', productName: 'Rinso Anti Noda 1kg', category: 'Kebersihan', status: 'revision' },
      { id: 'TSK-007', projectId: 'PRJ-001', storeName: 'Indomaret Cilandak', productName: 'Wipol 780ml',         category: 'Kebersihan', status: 'pending' },
    ],
    logs: [
      { date: '2026-06-01 10:00', event: 'Project dibuat', actor: 'Admin Client' },
      { date: '2026-06-01 10:30', event: 'Project disubmit ke admin internal', actor: 'Admin Client' },
      { date: '2026-06-02 09:00', event: 'Project dikonfirmasi admin, status menjadi Aktif', actor: 'Admin Internal' },
    ],
  },
  {
    id: 'PRJ-002',
    name: 'Audit Ketersediaan Susu Bayi',
    description: 'Audit stok dan harga susu bayi di minimarket area Jakarta.',
    deadline: '2026-06-20',
    createdAt: '2026-05-28',
    status: 'active',
    notes: 'Fokus pada stok SGM Eksplor 1+ Madu 400g.',
    products: [
      { id: 'PRD-05', name: 'SGM 1+ Madu 400g',       category: 'Susu & Nutrisi' },
      { id: 'PRD-06', name: 'Dancow 1+ Vanila 800g',   category: 'Susu & Nutrisi' },
      { id: 'PRD-07', name: 'Bebelac 3 Madu 800g',     category: 'Susu & Nutrisi' },
    ],
    stores: [
      { id: 'STR-04', name: 'Alfamart Bangka',   address: 'Jl. Bangka No.12',     city: 'Jakarta Selatan', products: [{ productId: 'PRD-05', productName: 'SGM 1+ Madu 400g', category: 'Susu & Nutrisi' }, { productId: 'PRD-06', productName: 'Dancow 1+ Vanila 800g', category: 'Susu & Nutrisi' }] },
      { id: 'STR-05', name: 'Indomaret Blok M',  address: 'Jl. Melawai No.3',     city: 'Jakarta Selatan', products: [{ productId: 'PRD-05', productName: 'SGM 1+ Madu 400g', category: 'Susu & Nutrisi' }, { productId: 'PRD-07', productName: 'Bebelac 3 Madu 800g', category: 'Susu & Nutrisi' }] },
    ],
    tasks: [
      { id: 'TSK-010', projectId: 'PRJ-002', storeName: 'Alfamart Bangka',  productName: 'SGM 1+ Madu 400g',     category: 'Susu & Nutrisi', status: 'approved',  price: 42500, photo: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300&auto=format&fit=crop&q=60', completedAt: '2026-06-05 11:00' },
      { id: 'TSK-011', projectId: 'PRJ-002', storeName: 'Alfamart Bangka',  productName: 'Dancow 1+ Vanila 800g', category: 'Susu & Nutrisi', status: 'approved',  price: 92000, photo: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop&q=60', completedAt: '2026-06-05 11:30' },
      { id: 'TSK-012', projectId: 'PRJ-002', storeName: 'Indomaret Blok M', productName: 'SGM 1+ Madu 400g',     category: 'Susu & Nutrisi', status: 'submitted', price: 43000 },
      { id: 'TSK-013', projectId: 'PRJ-002', storeName: 'Indomaret Blok M', productName: 'Bebelac 3 Madu 800g',  category: 'Susu & Nutrisi', status: 'pending' },
    ],
    logs: [
      { date: '2026-05-28 08:00', event: 'Project dibuat',                                        actor: 'Admin Client' },
      { date: '2026-05-28 08:30', event: 'Project disubmit ke admin internal',                    actor: 'Admin Client' },
      { date: '2026-05-29 10:00', event: 'Project dikonfirmasi admin, status menjadi Aktif',      actor: 'Admin Internal' },
      { date: '2026-06-05 12:00', event: 'Progress mencapai 50% task selesai',                    actor: 'Sistem' },
    ],
  },
  {
    id: 'PRJ-003',
    name: 'Survey Harga Minyak Goreng',
    description: 'Survey harga minyak goreng kemasan di pasar modern.',
    deadline: '2026-06-10',
    createdAt: '2026-05-20',
    status: 'completed',
    notes: 'Catat harga Sania & Fortune ukuran 1L dan 2L.',
    products: [
      { id: 'PRD-08', name: 'Minyak Sania 1L',   category: 'Sembako' },
      { id: 'PRD-09', name: 'Minyak Fortune 2L',  category: 'Sembako' },
    ],
    stores: [
      { id: 'STR-06', name: 'Superindo Fatmawati', address: 'Jl. RS Fatmawati No.7', city: 'Jakarta Selatan', products: [{ productId: 'PRD-08', productName: 'Minyak Sania 1L', category: 'Sembako' }, { productId: 'PRD-09', productName: 'Minyak Fortune 2L', category: 'Sembako' }] },
    ],
    tasks: [
      { id: 'TSK-020', projectId: 'PRJ-003', storeName: 'Superindo Fatmawati', productName: 'Minyak Sania 1L',  category: 'Sembako', status: 'approved', price: 17500, photo: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=60', completedAt: '2026-06-08 14:00' },
      { id: 'TSK-021', projectId: 'PRJ-003', storeName: 'Superindo Fatmawati', productName: 'Minyak Fortune 2L', category: 'Sembako', status: 'approved', price: 33000, photo: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=60', completedAt: '2026-06-08 14:20' },
    ],
    logs: [
      { date: '2026-05-20 09:00', event: 'Project dibuat',                                   actor: 'Admin Client' },
      { date: '2026-05-20 09:15', event: 'Project disubmit ke admin internal',               actor: 'Admin Client' },
      { date: '2026-05-21 08:00', event: 'Project dikonfirmasi, status menjadi Aktif',       actor: 'Admin Internal' },
      { date: '2026-06-08 15:00', event: 'Semua task approved, project menjadi Completed',  actor: 'Sistem' },
    ],
  },
  {
    id: 'PRJ-004',
    name: 'Monitor Distribusi Bumbu Masak',
    description: 'Pantau ketersediaan bumbu masak instan di warung dan minimarket.',
    deadline: '2026-07-15',
    createdAt: '2026-06-12',
    status: 'draft',
    notes: '',
    products: [
      { id: 'PRD-10', name: 'Royco Ayam 230g', category: 'Bumbu' },
      { id: 'PRD-11', name: 'Masako Sapi 230g', category: 'Bumbu' },
    ],
    stores: [],
    tasks: [],
    logs: [
      { date: '2026-06-12 10:00', event: 'Project dibuat sebagai draft', actor: 'Admin Client' },
    ],
  },
  {
    id: 'PRJ-005',
    name: 'Cek Ketersediaan Produk Frozen',
    description: 'Survei ketersediaan produk frozen food di jaringan supermarket.',
    deadline: '2026-07-01',
    createdAt: '2026-06-11',
    status: 'pending_review',
    notes: 'Fokus pada freezer bagian depan toko.',
    products: [
      { id: 'PRD-12', name: 'Fiesta Nugget 500g',  category: 'Frozen Food' },
      { id: 'PRD-13', name: 'Sozzis 1kg',           category: 'Frozen Food' },
    ],
    stores: [
      { id: 'STR-07', name: 'Giant Kebayoran', address: 'Jl. Kebayoran Lama No.1', city: 'Jakarta Selatan', products: [{ productId: 'PRD-12', productName: 'Fiesta Nugget 500g', category: 'Frozen Food' }, { productId: 'PRD-13', productName: 'Sozzis 1kg', category: 'Frozen Food' }] },
    ],
    tasks: [],
    logs: [
      { date: '2026-06-11 13:00', event: 'Project dibuat',                         actor: 'Admin Client' },
      { date: '2026-06-11 14:00', event: 'Project disubmit ke admin internal',     actor: 'Admin Client' },
    ],
  },
];