"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Building,
} from "lucide-react";

import { registerUser } from "@/app/actions/auth";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Lemah", color: "bg-error" };
      case 2:
        return { score: 2, label: "Cukup", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Kuat", color: "bg-emerald-500" };
      case 4:
        return { score: 4, label: "Sangat Kuat", color: "bg-primary" };
      default:
        return { score: 1, label: "Lemah", color: "bg-error" };
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMsg("Anda harus menyetujui Syarat & Ketentuan untuk melanjutkan.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password minimal harus 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const res = await registerUser({
      fullName,
      email,
      password,
    });

    if (res.success) {
      window.location.href = "/";
    } else {
      setIsLoading(false);
      setErrorMsg(res.message || "Gagal mendaftarkan akun.");
    }
  };

  return (
    <div className="w-full max-w-[1280px] bg-surface-container-lowest dark:bg-zinc-900 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-outline-variant/40 dark:border-zinc-800 flex overflow-hidden">
      {/* Left Side: Registration Form */}
      <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-primary dark:text-emerald-400">
            FinTrack
          </span>
        </div>

        {/* Form Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
            Mulai Perjalanan Finansial Anda
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Buat akun untuk mulai melacak pengeluaran dan cicilan Anda secara cerdas.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lengkap */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-on-surface"
              htmlFor="fullName"
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <User className="w-4 h-4" />
              </div>
              <input
                id="fullName"
                type="text"
                required
                placeholder="Masukkan nama lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface bg-surface-container-lowest dark:bg-zinc-800 placeholder-on-surface-variant/50 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-on-surface"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface bg-surface-container-lowest dark:bg-zinc-800 placeholder-on-surface-variant/50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-on-surface"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface bg-surface-container-lowest dark:bg-zinc-800 placeholder-on-surface-variant/50 transition-all"
              />
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1 mt-1">
                <div className="flex gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className="flex-1 bg-outline-variant/30 dark:bg-zinc-700 rounded-full overflow-hidden"
                    >
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= step
                            ? passwordStrength.color
                            : "w-0"
                        }`}
                        style={{
                          width: passwordStrength.score >= step ? "100%" : "0%",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-on-surface-variant">
                  Kekuatan: {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-on-surface"
              htmlFor="confirmPassword"
            >
              Konfirmasi Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Ulangi password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/60 dark:border-zinc-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface bg-surface-container-lowest dark:bg-zinc-800 placeholder-on-surface-variant/50 transition-all"
              />
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-xs text-on-surface-variant cursor-pointer leading-relaxed"
            >
              Saya setuju dengan{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Syarat & Ketentuan FinTrack menjaga kerahasiaan penuh data keuangan Anda.");
                }}
                className="text-primary dark:text-emerald-400 font-semibold hover:underline"
              >
                Syarat & Ketentuan
              </a>{" "}
              dan{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Kebijakan Privasi FinTrack menjamin data Anda dienkripsi aman.");
                }}
                className="text-primary dark:text-emerald-400 font-semibold hover:underline"
              >
                Kebijakan Privasi
              </a>
              .
            </label>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-xs text-error font-medium bg-error-container/60 p-2.5 rounded-lg border border-error/20">
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-primary-container active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 shadow-md shadow-primary/20 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mendaftarkan akun...</span>
              </>
            ) : (
              <span>Daftar Sekarang</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-on-surface-variant pt-4 border-t border-outline-variant/30">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary dark:text-emerald-400 font-semibold hover:underline transition-colors"
          >
            Masuk di sini
          </Link>
        </div>
      </div>

      {/* Right Side: Visual / Branding Display (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-surface-container-high dark:bg-zinc-800/80 relative overflow-hidden flex-col justify-center items-center p-12">
        {/* Subtle Decorative Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#163826 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 w-full max-w-sm space-y-6">
          {/* Abstract Floating Bento Card 1 */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-outline-variant/30 dark:border-zinc-700 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex justify-between items-center mb-4">
              <div className="w-11 h-11 rounded-xl bg-secondary-container dark:bg-emerald-950 flex items-center justify-center text-secondary dark:text-emerald-300">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">
                Total Saldo
              </span>
            </div>
            <div className="text-3xl font-extrabold text-on-surface tracking-tight">
              Rp 45.000.000
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Target Minimal Tercapai</span>
            </div>
          </div>

          {/* Abstract Floating Bento Card 2 */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-outline-variant/30 dark:border-zinc-700 transform translate-x-6 rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-error-container/60 dark:bg-rose-950 flex items-center justify-center text-error dark:text-rose-400">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">
                  Cicilan Apartemen
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  Jatuh tempo dlm 3 hari
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-surface-variant dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary dark:bg-emerald-500 h-full rounded-full"
                  style={{ width: "75%" }}
                />
              </div>
              <div className="text-right text-[11px] font-semibold text-on-surface-variant">
                75% Terbayar
              </div>
            </div>
          </div>

          {/* Executive Quote */}
          <div className="pt-8 text-center text-on-surface-variant">
            <p className="italic text-xs leading-relaxed text-on-surface-variant/90">
              &ldquo;Kendali penuh atas keuangan Anda, dalam genggaman eksekutif.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
