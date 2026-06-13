import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { KeyRoundIcon, MailIcon, BarChart2Icon, UserSquare2Icon } from 'lucide-react';

const credentials: Record<string, { role: UserRole; label: string; desc: string }> = {
  'admin@client.com': { role: 'client_admin', label: 'Client Admin', desc: 'Buat & kelola project' },
  'viewer@client.com': { role: 'client_viewer', label: 'Client Viewer', desc: 'Pantau progress saja' },
};

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email dan password wajib diisi'); return; }
    const cred = credentials[email.toLowerCase().trim()];
    if (cred && password === `${cred.role}123`) {
      login(email, cred.role);
    } else {
      setError('Kredensial salah. Gunakan login cepat di bawah.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-muted border border-border mb-4">
            <BarChart2Icon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Client Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">Portal manajemen survey harga pasar</p>
        </div>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-center text-xl">Masuk</CardTitle>
            <CardDescription className="text-center">Akses portal client Anda</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-destructive/15 border border-destructive/30 text-destructive rounded-lg text-center font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-semibold">
                  <MailIcon className="w-4 h-4 text-muted-foreground" /> Email
                </Label>
                <Input id="email" type="email" placeholder="nama@perusahaan.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1.5 text-sm font-semibold">
                  <KeyRoundIcon className="w-4 h-4 text-muted-foreground" /> Password
                </Label>
                <Input id="password" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Masuk</Button>
            </form>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-border" />
              <span className="mx-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Demo</span>
              <div className="flex-grow border-t border-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(credentials).map(([emailKey, info]) => (
                <Button key={emailKey} variant="outline" type="button"
                  onClick={() => login(emailKey, info.role)}
                  className="h-auto flex flex-col items-start p-3 text-left font-normal">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold">{info.label}</span>
                    <UserSquare2Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">{info.desc}</span>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 justify-center border-t border-border py-3">
            <span className="text-xs text-muted-foreground">Belum punya akun? Hubungi tim kami.</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};