"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

import { loginUser } from "@/app/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await loginUser({
      email,
      password,
    });

    if (res.success) {
      window.location.href = "/";
    } else {
      setIsLoading(false);
      setError(res.message || "Gagal masuk ke akun Anda.");
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.08)] p-8 relative overflow-hidden border border-outline-variant/40 dark:border-zinc-800">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
          <Wallet className="w-5 h-5" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-primary dark:text-emerald-400">
          FinTrack
        </span>
      </div>

      {/* Form Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
          Selamat Datang Kembali
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Kelola kesehatan finansial dan pantau beban cicilan Anda dengan bijak.
        </p>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-outline-variant/60 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-surface-bright dark:bg-zinc-800 text-on-surface text-sm transition-all placeholder:text-outline/70 focus:outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-on-surface"
              htmlFor="password"
            >
              Password
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Fitur reset password dapat dihubungkan ke auth provider.");
              }}
              className="text-xs text-primary dark:text-emerald-400 hover:text-primary-container font-semibold transition-colors"
            >
              Lupa Password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-11 py-2.5 border border-outline-variant/60 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-surface-bright dark:bg-zinc-800 text-on-surface text-sm transition-all focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <p className="text-xs text-error font-medium bg-error-container/60 p-2.5 rounded-lg border border-error/20">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary/20 font-bold text-sm text-white bg-primary hover:bg-primary-container active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Memproses...
            </>
          ) : (
            <>
              Masuk
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/40 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-surface-container-lowest dark:bg-zinc-900 text-on-surface-variant uppercase tracking-wider font-semibold">
            atau masuk dengan
          </span>
        </div>
      </div>

      {/* Social OAuth Providers */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            document.cookie = "fintrack-session=true; path=/; max-age=86400";
            window.location.href = "/";
          }}
          className="w-full py-2.5 px-3 rounded-xl border border-outline-variant/60 dark:border-zinc-700 hover:bg-surface-container-low dark:hover:bg-zinc-800 font-semibold text-xs text-on-surface flex items-center justify-center gap-2 transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={() => {
            document.cookie = "fintrack-session=true; path=/; max-age=86400";
            window.location.href = "/";
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold text-xs hover:opacity-90 flex items-center justify-center gap-2 transition-opacity shadow-2xs"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center border-t border-outline-variant/40 dark:border-zinc-800 pt-5">
        <p className="text-xs text-on-surface-variant">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary dark:text-emerald-400 hover:underline transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
