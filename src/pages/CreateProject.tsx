// src/pages/CreateProject.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeftIcon, ArrowRightIcon, PlusIcon, Trash2Icon,
  CheckCircle2Icon, StoreIcon, PackageIcon, ClipboardListIcon,
  InfoIcon, SendIcon, SaveIcon,
} from 'lucide-react';

// ---- Types ----
interface ProductInput {
  id: string;
  name: string;
  category: string;
  notes: string;
}

interface StoreInput {
  id: string;
  name: string;
  address: string;
  city: string;
  selectedProductIds: string[];
  notes: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  deadline: string;
  notes: string;
  products: ProductInput[];
  stores: StoreInput[];
}

const CATEGORIES = ['Sayuran', 'Susu & Nutrisi', 'Minuman', 'Bumbu', 'Daging', 'Buah', 'Sembako', 'Kebersihan', 'Frozen Food', 'Lainnya'];

const emptyProduct = (): ProductInput => ({
  id: `prd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '', category: '', notes: '',
});

const emptyStore = (): StoreInput => ({
  id: `str-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '', address: '', city: '', selectedProductIds: [], notes: '',
});

const STEPS = [
  { num: 1, label: 'Info Project',    icon: <InfoIcon className="w-4 h-4" /> },
  { num: 2, label: 'Daftar Produk',   icon: <PackageIcon className="w-4 h-4" /> },
  { num: 3, label: 'Daftar Toko',     icon: <StoreIcon className="w-4 h-4" /> },
  { num: 4, label: 'Review & Submit', icon: <ClipboardListIcon className="w-4 h-4" /> },
];

interface CreateProjectProps {
  onBack: () => void;
  onSubmit: (data: ProjectFormData, asDraft: boolean) => void;
}

export const CreateProject: React.FC<CreateProjectProps> = ({ onBack, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ProjectFormData>({
    name: '', description: '', deadline: '', notes: '',
    products: [emptyProduct()],
    stores: [emptyStore()],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---- Helpers ----
  const setField = (field: keyof ProjectFormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const totalTasks = form.stores.reduce((acc, s) => acc + s.selectedProductIds.length, 0);

  // ---- Validation ----
  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};

    if (s === 1) {
      if (!form.name.trim())     errs.name     = 'Nama project wajib diisi';
      if (!form.deadline.trim()) errs.deadline = 'Deadline wajib diisi';
    }

    if (s === 2) {
      form.products.forEach((p, i) => {
        if (!p.name.trim())     errs[`pname_${i}`]  = 'Nama produk wajib diisi';
        if (!p.category.trim()) errs[`pcat_${i}`]   = 'Kategori wajib dipilih';
      });
      if (form.products.length === 0) errs.products = 'Minimal 1 produk';
    }

    if (s === 3) {
      form.stores.forEach((st, i) => {
        if (!st.name.trim())    errs[`sname_${i}`] = 'Nama toko wajib diisi';
        if (!st.city.trim())    errs[`scity_${i}`] = 'Kota wajib diisi';
        if (st.selectedProductIds.length === 0) errs[`sprod_${i}`] = 'Pilih minimal 1 produk';
      });
      if (form.stores.length === 0) errs.stores = 'Minimal 1 toko';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => { if (validateStep(step)) setStep(s => s + 1); };
  const goPrev = () => { setErrors({}); setStep(s => s - 1); };

  // ---- Product handlers ----
  const addProduct = () => setForm(f => ({ ...f, products: [...f.products, emptyProduct()] }));
  const removeProduct = (id: string) => setForm(f => ({
    ...f,
    products: f.products.filter(p => p.id !== id),
    stores: f.stores.map(s => ({
      ...s,
      selectedProductIds: s.selectedProductIds.filter(pid => pid !== id),
    })),
  }));
  const updateProduct = (id: string, field: keyof ProductInput, value: string) =>
    setForm(f => ({ ...f, products: f.products.map(p => p.id === id ? { ...p, [field]: value } : p) }));

  // ---- Store handlers ----
  const addStore = () => setForm(f => ({ ...f, stores: [...f.stores, emptyStore()] }));
  const removeStore = (id: string) => setForm(f => ({ ...f, stores: f.stores.filter(s => s.id !== id) }));
  const updateStore = (id: string, field: keyof StoreInput, value: string) =>
    setForm(f => ({ ...f, stores: f.stores.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  const toggleProduct = (storeId: string, productId: string) =>
    setForm(f => ({
      ...f,
      stores: f.stores.map(s => {
        if (s.id !== storeId) return s;
        const has = s.selectedProductIds.includes(productId);
        return {
          ...s,
          selectedProductIds: has
            ? s.selectedProductIds.filter(id => id !== productId)
            : [...s.selectedProductIds, productId],
        };
      }),
    }));

  const validProducts = form.products.filter(p => p.name.trim() && p.category.trim());

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Kembali
        </Button>
        <div>
          <h2 className="text-xl font-bold">Buat Project Baru</h2>
          <p className="text-xs text-muted-foreground">Ikuti langkah-langkah berikut untuk membuat project survey.</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${step === s.num ? 'bg-primary text-primary-foreground' :
                step > s.num ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {step > s.num
                ? <CheckCircle2Icon className="w-4 h-4" />
                : s.icon}
              <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 ${step > s.num ? 'bg-primary' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ======================== STEP 1: INFO PROJECT ======================== */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <InfoIcon className="w-4 h-4 text-primary" /> Info Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Nama Project <span className="text-destructive">*</span></Label>
              <Input placeholder="cth: Survey Harga Minyak Goreng Q3 2026"
                value={form.name} onChange={e => setField('name', e.target.value)} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Deskripsi / Tujuan Survey</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Jelaskan tujuan survey ini..."
                value={form.description}
                onChange={e => setField('description', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Deadline <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.deadline} onChange={e => setField('deadline', e.target.value)} />
              {errors.deadline && <p className="text-xs text-destructive">{errors.deadline}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Catatan untuk Surveyor</Label>
              <textarea
                className="w-full min-h-[70px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Instruksi khusus untuk field worker..."
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ======================== STEP 2: PRODUK ======================== */}
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PackageIcon className="w-4 h-4 text-primary" /> Daftar Produk
              </CardTitle>
              <Button size="sm" variant="outline" onClick={addProduct}>
                <PlusIcon className="w-4 h-4 mr-1" /> Tambah Produk
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.products && <p className="text-xs text-destructive">{errors.products}</p>}
              {form.products.map((prod, idx) => (
                <div key={prod.id} className="border border-border rounded-lg p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Produk {idx + 1}
                    </span>
                    {form.products.length > 1 && (
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeProduct(prod.id)}>
                        <Trash2Icon className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Nama Produk <span className="text-destructive">*</span></Label>
                      <Input placeholder="cth: Minyak Sania 1L" value={prod.name}
                        onChange={e => updateProduct(prod.id, 'name', e.target.value)} />
                      {errors[`pname_${idx}`] && <p className="text-xs text-destructive">{errors[`pname_${idx}`]}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Kategori <span className="text-destructive">*</span></Label>
                      <Select value={prod.category} onValueChange={v => updateProduct(prod.id, 'category', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors[`pcat_${idx}`] && <p className="text-xs text-destructive">{errors[`pcat_${idx}`]}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Instruksi Foto / Catatan (opsional)</Label>
                    <Input placeholder="cth: Foto harus terlihat label harga dan barcode"
                      value={prod.notes} onChange={e => updateProduct(prod.id, 'notes', e.target.value)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="bg-muted/40 border border-border rounded-lg p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{form.products.filter(p => p.name && p.category).length} produk valid</span> terdaftar.
            Produk ini akan menjadi referensi untuk semua toko di langkah berikutnya.
          </div>
        </div>
      )}

      {/* ======================== STEP 3: TOKO ======================== */}
      {step === 3 && (
        <div className="space-y-4">
          {validProducts.length === 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-lg p-3 text-xs font-medium">
              Belum ada produk valid. Kembali ke Step 2 dan lengkapi daftar produk terlebih dahulu.
            </div>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <StoreIcon className="w-4 h-4 text-primary" /> Daftar Toko
              </CardTitle>
              <Button size="sm" variant="outline" onClick={addStore}>
                <PlusIcon className="w-4 h-4 mr-1" /> Tambah Toko
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.stores && <p className="text-xs text-destructive">{errors.stores}</p>}
              {form.stores.map((store, idx) => (
                <div key={store.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Toko {idx + 1}
                    </span>
                    {form.stores.length > 1 && (
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeStore(store.id)}>
                        <Trash2Icon className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Nama Toko <span className="text-destructive">*</span></Label>
                      <Input placeholder="cth: Indomaret Kemang" value={store.name}
                        onChange={e => updateStore(store.id, 'name', e.target.value)} />
                      {errors[`sname_${idx}`] && <p className="text-xs text-destructive">{errors[`sname_${idx}`]}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Kota / Area <span className="text-destructive">*</span></Label>
                      <Input placeholder="cth: Jakarta Selatan" value={store.city}
                        onChange={e => updateStore(store.id, 'city', e.target.value)} />
                      {errors[`scity_${idx}`] && <p className="text-xs text-destructive">{errors[`scity_${idx}`]}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Alamat</Label>
                    <Input placeholder="cth: Jl. Kemang Raya No.10" value={store.address}
                      onChange={e => updateStore(store.id, 'address', e.target.value)} />
                  </div>

                  {/* Product Checklist */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      Produk di toko ini <span className="text-destructive">*</span>
                    </Label>
                    {errors[`sprod_${idx}`] && <p className="text-xs text-destructive">{errors[`sprod_${idx}`]}</p>}
                    {validProducts.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">Belum ada produk valid.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {validProducts.map(prod => {
                          const checked = store.selectedProductIds.includes(prod.id);
                          return (
                            <button key={prod.id} type="button"
                              onClick={() => toggleProduct(store.id, prod.id)}
                              className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-colors
                                ${checked
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                              <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border
                                ${checked ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                                {checked && <CheckCircle2Icon className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">{prod.name}</p>
                                <p className="text-[10px] text-muted-foreground">{prod.category}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {store.selectedProductIds.length} produk dipilih → {store.selectedProductIds.length} task
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Catatan khusus toko (opsional)</Label>
                    <Input placeholder="cth: Masuk lewat pintu samping" value={store.notes}
                      onChange={e => updateStore(store.id, 'notes', e.target.value)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preview total task */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-primary">Preview Total Task</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {form.stores.length} toko × rata-rata {form.stores.length > 0
                  ? (totalTasks / form.stores.length).toFixed(1) : 0} produk/toko
              </p>
            </div>
            <div className="text-3xl font-extrabold text-primary">{totalTasks} Task</div>
          </div>
        </div>
      )}

      {/* ======================== STEP 4: REVIEW ======================== */}
      {step === 4 && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardListIcon className="w-4 h-4 text-primary" /> Ringkasan Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Info */}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Nama Project', value: form.name },
                  { label: 'Deadline',     value: form.deadline },
                  { label: 'Total Toko',   value: `${form.stores.length} toko` },
                  { label: 'Total Produk', value: `${validProducts.length} produk` },
                ].map(item => (
                  <div key={item.label} className="bg-muted/40 rounded-lg p-3 border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</p>
                    <p className="text-sm font-bold mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {form.description && (
                <div className="bg-muted/40 rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Deskripsi</p>
                  <p className="text-sm">{form.description}</p>
                </div>
              )}

              {/* Total task highlight */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary">Total Task yang Akan Dibuat</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Setiap kombinasi toko × produk = 1 task</p>
                </div>
                <div className="text-4xl font-extrabold text-primary">{totalTasks}</div>
              </div>

              {/* Preview tabel per toko */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preview Task per Toko</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground">Toko</th>
                        <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground">Kota</th>
                        <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground">Produk Dipilih</th>
                        <th className="text-right py-2.5 px-4 font-semibold text-muted-foreground">Task</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {form.stores.map(store => {
                        const selectedProds = validProducts.filter(p => store.selectedProductIds.includes(p.id));
                        return (
                          <tr key={store.id} className="hover:bg-muted/20">
                            <td className="py-2.5 px-4 font-semibold">{store.name || '—'}</td>
                            <td className="py-2.5 px-4 text-muted-foreground">{store.city || '—'}</td>
                            <td className="py-2.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {selectedProds.map(p => (
                                  <Badge key={p.id} variant="secondary" className="text-[9px] px-1.5">{p.name}</Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-right font-bold text-primary">{selectedProds.length}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/40 border-t border-border">
                        <td colSpan={3} className="py-2.5 px-4 font-bold text-xs">Total</td>
                        <td className="py-2.5 px-4 text-right font-extrabold text-primary text-sm">{totalTasks}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={step === 1 ? onBack : goPrev}>
          <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
          {step === 1 ? 'Batal' : 'Sebelumnya'}
        </Button>

        <div className="flex gap-2">
          {step === 4 ? (
            <>
              <Button variant="outline" onClick={() => onSubmit(form, true)}>
                <SaveIcon className="w-4 h-4 mr-1.5" /> Simpan Draft
              </Button>
              <Button onClick={() => onSubmit(form, false)}>
                <SendIcon className="w-4 h-4 mr-1.5" /> Submit ke Admin
              </Button>
            </>
          ) : (
            <Button onClick={goNext}>
              Selanjutnya <ArrowRightIcon className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};