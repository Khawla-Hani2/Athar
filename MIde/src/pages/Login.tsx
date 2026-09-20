import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { users } from '@/data';

export default function Login() {
  const [email, setEmail] = useState('amina@capsulemedia.io');
  const [password, setPassword] = useState('password');
  const login = useAuthStore((s) => s.login);
  const loginAsRole = useAuthStore((s) => s.loginAsRole);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // error already captured in the store
    }
  };

  const quickLogin = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      loginAsRole(user);
      navigate('/dashboard');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Sparkles className="size-5" />
        </div>
        <span className="text-lg font-semibold text-slate-900 dark:text-white">Capsule Media OS</span>
      </div>

      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Sign in to your media workspace to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          icon={<Mail className="size-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@capsulemedia.io"
          required
        />
        <Input
          label="Password"
          type="password"
          icon={<Lock className="size-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="mt-2 w-full justify-center" isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-center text-xs uppercase tracking-wide text-slate-400">
          Quick demo login by role
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {users.slice(0, 6).map((user) => (
            <button
              key={user.id}
              onClick={() => quickLogin(user.id)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-500"
            >
              {user.role}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
