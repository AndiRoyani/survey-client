// src/pages/Settings.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  BuildingIcon, UserIcon, KeyRoundIcon, UsersIcon,
  PlusIcon, Trash2Icon, CheckCircle2Icon, ShieldIcon,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'client_admin' | 'client_viewer';
  joinedAt: string;
}

const mockMembers: TeamMember[] = [
  { id: 'm1', name: 'Budi Hartono',   email: 'budi@ptmaju.com',   role: 'client_admin',  joinedAt: '2026-01-10' },
  { id: 'm2', name: 'Sari Dewi',      email: 'sari@ptmaju.com',   role: 'client_viewer', joinedAt: '2026-02-15' },
  { id: 'm3', name: 'Reza Firmansyah',email: 'reza@ptmaju.com',   role: 'client_viewer', joinedAt: '2026-03-20' },
];

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [toast, setToast]         = useState<string | null>(null);
  const [members, setMembers]     = useState<TeamMember[]>(mockMembers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'client_viewer' as 'client_admin' | 'client_viewer' });

  // Profile form state
  const [profile, setProfile] = useState({
    companyName: user?.company ?? '',
    contactName: user?.name ?? '',
    contactEmail: user?.email ?? '',
    phone: '021-5550-1234',
  });

  // Password form state
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdError, setPwdError]   = useState('');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = () => {
    if (!profile.companyName.trim() || !profile.contactName.trim()) return;
    triggerToast('Profil perusahaan berhasil disimpan!');
  };

  const handleChangePassword = () => {
    setPwdError('');
    if (!passwords.current) { setPwdError('Password saat ini wajib diisi'); return; }
    if (passwords.newPwd.length < 6) { setPwdError('Password baru minimal 6 karakter'); return; }
    if (passwords.newPwd !== passwords.confirm) { setPwdError('Konfirmasi password tidak cocok'); return; }
    setPasswords({ current: '', newPwd: '', confirm: '' });
    triggerToast('Password berhasil diubah!');
  };

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    setMembers(prev => [...prev, {
      id: `m${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      joinedAt: new Date().toISOString().slice(0, 10),
    }]);
    setNewMember({ name: '', email: '', role: 'client_viewer' });
    setShowAddForm(false);
    triggerToast(`${newMember.name} berhasil ditambahkan sebagai anggota tim!`);
  };

  const handleRemoveMember = (id: string, name: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    triggerToast(`${name} telah dihapus dari tim.`);
  };

  const isAdmin = user?.role === 'client_admin';

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-card border border-border rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2Icon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Kelola profil perusahaan dan anggota tim Anda.</p>
      </div>

      {/* Role info */}
      <div className="flex items-center gap-2 p-3 bg-muted/40 border border-border rounded-lg">
        <ShieldIcon className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground">
          Anda login sebagai <strong className="text-foreground">{user?.name}</strong> dengan role{' '}
          <Badge variant="outline" className="text-[11px] ml-1">
            {isAdmin ? 'Client Admin' : 'Client Viewer'}
          </Badge>
        </span>
      </div>

      {/* ---- PROFIL PERUSAHAAN ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BuildingIcon className="w-4 h-4 text-primary" /> Profil Perusahaan
          </CardTitle>
          <CardDescription className="text-xs">
            {isAdmin ? 'Edit informasi perusahaan Anda.' : 'Informasi perusahaan (hanya bisa diedit oleh Admin).'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nama Perusahaan</Label>
              <Input value={profile.companyName} disabled={!isAdmin}
                onChange={e => setProfile(p => ({ ...p, companyName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">No. Telepon</Label>
              <Input value={profile.phone} disabled={!isAdmin}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nama Kontak PIC</Label>
              <Input value={profile.contactName} disabled={!isAdmin}
                onChange={e => setProfile(p => ({ ...p, contactName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Kontak</Label>
              <Input value={profile.contactEmail} disabled={!isAdmin}
                onChange={e => setProfile(p => ({ ...p, contactEmail: e.target.value }))} />
            </div>
          </div>
          {isAdmin && (
            <Button size="sm" onClick={handleSaveProfile}>Simpan Perubahan</Button>
          )}
        </CardContent>
      </Card>

      {/* ---- GANTI PASSWORD ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRoundIcon className="w-4 h-4 text-primary" /> Ganti Password
          </CardTitle>
          <CardDescription className="text-xs">Pastikan password baru minimal 6 karakter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pwdError && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {pwdError}
            </p>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Password Saat Ini</Label>
            <Input type="password" placeholder="••••••••" value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Password Baru</Label>
              <Input type="password" placeholder="••••••••" value={passwords.newPwd}
                onChange={e => setPasswords(p => ({ ...p, newPwd: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Konfirmasi Password Baru</Label>
              <Input type="password" placeholder="••••••••" value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
            </div>
          </div>
          <Button size="sm" onClick={handleChangePassword}>Ubah Password</Button>
        </CardContent>
      </Card>

      {/* ---- KELOLA TIM (Admin only) ---- */}
      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-primary" /> Kelola Anggota Tim
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Tambah atau hapus viewer yang bisa memantau project.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddForm(f => !f)}>
              <PlusIcon className="w-4 h-4 mr-1" /> Tambah
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Add form */}
            {showAddForm && (
              <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Anggota Baru</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Nama</Label>
                    <Input placeholder="Nama lengkap" value={newMember.name}
                      onChange={e => setNewMember(m => ({ ...m, name: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Email</Label>
                    <Input placeholder="email@perusahaan.com" value={newMember.email}
                      onChange={e => setNewMember(m => ({ ...m, email: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Role</Label>
                  <div className="flex gap-2">
                    {(['client_admin', 'client_viewer'] as const).map(r => (
                      <button key={r} type="button"
                        onClick={() => setNewMember(m => ({ ...m, role: r }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
                          ${newMember.role === r
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                        {r === 'client_admin' ? 'Admin' : 'Viewer'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddMember}>Tambahkan</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>Batal</Button>
                </div>
              </div>
            )}

            {/* Member list */}
            <div className="space-y-2">
              {members.map(member => (
                <div key={member.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={member.role === 'client_admin' ? 'default' : 'secondary'} className="text-[10px]">
                      {member.role === 'client_admin' ? 'Admin' : 'Viewer'}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">{member.joinedAt}</span>
                    {member.email !== user?.email && (
                      <Button variant="ghost" size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveMember(member.id, member.name)}>
                        <Trash2Icon className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Viewer: info bahwa hanya admin yang bisa kelola tim */}
      {!isAdmin && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <UsersIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-muted-foreground">Kelola Tim</p>
            <p className="text-xs text-muted-foreground mt-1">
              Hanya Client Admin yang dapat menambah atau menghapus anggota tim.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};