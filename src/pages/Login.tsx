import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { KeyRoundIcon, MailIcon, ShieldCheckIcon, UserSquare2Icon } from 'lucide-react';

const credentials: Record<string, { role: UserRole; label: string; desc: string }> = {
  'superadmin@company.com': { role: 'superadmin', label: 'Superadmin', desc: 'Akses Penuh Sistem & User' },
  'admin@company.com': { role: 'admin', label: 'Admin', desc: 'Distribusi Task & Project' },
  'supervisor@company.com': { role: 'supervisor', label: 'Supervisor', desc: 'Review & Approve Survey' },
  'finance@company.com': { role: 'finance', label: 'Finance', desc: 'Pembayaran Field Worker' },
};

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    const cred = credentials[email.toLowerCase().trim()];
    if (cred && password === `${cred.role}123`) {
      login(email, cred.role);
    } else {
      setError('Kredensial salah. Gunakan jalan pintas di bawah untuk masuk cepat.');
    }
  };

  const handleQuickLogin = (emailKey: string, role: UserRole) => {
    login(emailKey, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-muted border border-border shadow-sm mb-4">
            <ShieldCheckIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Internal Backoffice
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Perusahaan Pengelolaan Data Lapangan
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 pb-6 border-b border-border">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Masuk ke akun internal Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-destructive/15 border border-destructive/30 text-destructive rounded-lg text-center font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-1.5">
                  <MailIcon className="w-4 h-4 text-muted-foreground" /> Email Kantor
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-input text-foreground bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-1.5">
                  <KeyRoundIcon className="w-4 h-4 text-muted-foreground" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-input text-foreground bg-background"
                />
              </div>
              <Button type="submit" className="w-full">
                Masuk
              </Button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Masuk Cepat (Demo Preset)
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Quick Login Grid */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(credentials).map(([emailKey, info]) => (
                <Button
                  key={emailKey}
                  variant="outline"
                  type="button"
                  onClick={() => handleQuickLogin(emailKey, info.role)}
                  className="h-auto flex flex-col items-start justify-between p-3 text-left border border-border bg-card hover:bg-muted font-normal"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-foreground">
                      {info.label}
                    </span>
                    <UserSquare2Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {info.desc}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 py-4 flex justify-center border-t border-border">
            <span className="text-xs text-muted-foreground">
              Hanya untuk kalangan internal perusahaan.
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
