import { getUserSettings, getUserCategories } from "@/app/actions/settings";
import { getDashboardData } from "@/lib/dashboard-data";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengaturan — FinTrack",
  description: "Konfigurasi target saldo minimal, estimasi pemasukan bulanan, dan manajemen kategori pengeluaran.",
};

export default async function SettingsPage() {
  const [settings, categories, dashboardData] = await Promise.all([
    getUserSettings(),
    getUserCategories(),
    getDashboardData(),
  ]);

  return (
    <div className="bg-surface dark:bg-zinc-950 text-on-surface min-h-screen antialiased flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        userName={dashboardData.userName}
        userEmail={dashboardData.userEmail}
        userImage={dashboardData.userImage}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-24 lg:pb-12">
        {/* Sticky Top Header */}
        <Header
          title="Settings"
          userName={dashboardData.userName}
          userImage={dashboardData.userImage}
          isDbrWarning={dashboardData.isDbrWarning}
        />

        {/* Content Canvas */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <SettingsClient
            initialSettings={settings}
            initialCategories={categories}
          />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
