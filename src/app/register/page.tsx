import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Daftar Akun — FinTrack",
  description: "Mulai perjalanan finansial Anda dengan membuat akun FinTrack untuk melacak saldo, transaksi, dan cicilan.",
};

export default function RegisterPage() {
  return (
    <div className="bg-background dark:bg-zinc-950 text-on-surface min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 antialiased">
      <RegisterForm />
    </div>
  );
}
