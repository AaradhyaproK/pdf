'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, Sparkles, Key } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('aaradhya1774@gmail.com');
  const [password, setPassword] = useState('Aaradhya@1774');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in email and password.');
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
      toast.error(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('aaradhya1774@gmail.com');
    setPassword('Aaradhya@1774');
    toast.info('Admin credentials filled!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 text-indigo-600 font-black text-xl tracking-tight">
            <img src="/1.png" alt="Aurea Logo" className="w-9 h-9 object-contain" />
            <span>Aurea Admin</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Console Login</h1>
          <p className="text-xs text-slate-500 font-medium">Manage Google Adsense linking, ads.txt, live visitor counter & analytics.</p>
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
                placeholder="aaradhya1774@gmail.com"
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
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:border-indigo-600 min-h-[48px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>{isLoading ? 'Authenticating with Firebase...' : 'Sign In to Aurea Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-3">
            <button
              onClick={handleDemoFill}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span>Fill Admin Credentials</span>
            </button>
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Firebase Auth (faceid-login-xraxh) Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
