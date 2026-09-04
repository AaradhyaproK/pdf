'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your admin email and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Real Firebase Auth Sign In
      await signInWithEmailAndPassword(auth, email, password);

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'omnitool_admin_session',
          JSON.stringify({ authenticated: true, email, loginTime: new Date().toISOString() })
        );
      }

      toast.success('Authenticated as Administrator!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err?.message || 'Invalid admin credentials. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 text-indigo-600 font-black text-xl tracking-tight">
            <img src="/filezenith-logo.png" alt="FileZenith Logo" className="w-9 h-9 object-contain" />
            <span>FileZenith Admin</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Console Login</h1>
          <p className="text-xs text-slate-500 font-medium">Manage Google AdSense linking, ads.txt, live visitor counter & analytics.</p>
        </div>

        <div className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter administrator email..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:border-indigo-600 min-h-[48px]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:border-indigo-600 min-h-[48px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating with Firebase...' : 'Sign In to FileZenith Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
            <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Secure Firebase Authentication Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
