import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="flex min-h-svh">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
        <div className="relative flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="size-5" />
          </div>
          <span className="text-lg font-semibold">Capsule Media OS</span>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-3xl font-semibold leading-snug">
            The operating system for modern media teams.
          </h1>
          <p className="mt-4 text-white/80">
            Plan campaigns, manage content, and track performance — all in one intelligent workspace
            built for initiatives, non-profits, universities, and companies.
          </p>
        </div>
        <p className="relative text-sm text-white/60">© 2026 Capsule Media OS. All rights reserved.</p>
      </div>
      <div className="flex w-full flex-1 items-center justify-center bg-white p-6 sm:p-10 lg:w-1/2 dark:bg-slate-950">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
