import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login — FinTrack",
  description: "Masuk ke akun FinTrack Anda untuk mengelola keuangan dan memantau beban cicilan.",
};

export default function LoginPage() {
  return (
    <div className="bg-surface-container-low dark:bg-zinc-950 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 antialiased">
      <LoginForm />
    </div>
  );
}
